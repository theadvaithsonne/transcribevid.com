# Putting TranscribeVid online at transcribevid.com

A step-by-step guide for the owner. It takes you from "I just bought the domain" to "https://transcribevid.com works",
using one rented Linux server and Docker. Plan on 1-2 hours the first time, most of it waiting for DNS and the first build.

You do not need to be a server expert, but you will type commands into a terminal. Commands in grey boxes are typed
**on the server** (over SSH) unless the text says "on your PC". Replace `SERVER_IP` with your server's address.

Contents: 1 Overview - 2 Rent a server - 3 DNS - 4 Secure the server - 5 Install Docker, get the project - 6 Configure -
7 Launch and verify - 8 Before you announce it (legal and ops checklist) - 9 Updating, rolling back, backups -
10 Capacity, abuse controls, monitoring, "it is slow" - 11 Running without Docker - 12 Limitations

---

## 1. Overview

```
 visitors --HTTPS 443 / HTTP 80--> [ caddy ]  --http, internal only-->  [ app ]
                                    certificates,                        FastAPI + the Angular website
                                    redirects, headers                   + Whisper speech recognition (CPU)
                                    volume: caddy_data                   volumes: models, stats (kept), scratch (wiped)
```

* **caddy** is the web server in front. It fetches and renews the free HTTPS certificate (Let's Encrypt) by itself,
  redirects `www.transcribevid.com` and plain `http://` to `https://transcribevid.com`, adds security headers and
  forwards everything else to the app.
* **app** is the transcriber. Its port 8000 is **not** published to the internet; only caddy can reach it.
* The service has **no database and no user accounts**. Visitors get a session cookie; their uploads and transcripts
  live in the `scratch` volume and are deleted when the visitor has been idle for `VT_SESSION_IDLE_MINUTES`, when
  they press "Delete my data now", and whenever the app stops or restarts.
* The only data worth keeping is the **Whisper model cache** (`models` volume, re-downloadable), the **certificates**
  (`caddy_data` volume) and the **"videos transcribed" counter** (`stats` volume: one small file holding a single integer;
  see section 10.4). The counter holds nothing about any visitor, so it is not personal data and does not change the
  "nothing is stored" promise.

Files in this repository that make this work:

| File | Purpose |
|---|---|
| `Dockerfile`, `.dockerignore` | Builds the image: Angular app (Node build stage) + Python app, non-root, read-only friendly |
| `docker-compose.yml` | The two services, volumes, log rotation, hardening |
| `deploy/Caddyfile` | HTTPS, redirects, security headers, streaming/upload settings, access log without query strings |
| `deploy/.env.example` | Every setting with comments. Copy to `deploy/.env` |
| `deploy/systemd/transcribevid.service`, `deploy/nginx.conf.example` | Alternatives for running without Docker (section 11) |

---

## 2. Rent a server

### What speed to expect (read this first)

Whisper runs on the CPU here (no graphics card). Measured on an 8-core laptop CPU:

| Model | Speed | A 10-minute video takes |
|---|---|---|
| `small` (default) | about 3x realtime | about 3-4 minutes |
| `large-v3-turbo` (more accurate) | about 1.5x realtime | about 7 minutes |
| `base` (fastest of the three) | faster than `small` (not measured) | under 3 minutes |

Cloud virtual CPUs are often slower than a laptop and shared ones get slower still under sustained load, so treat
these numbers as best case and **measure with your own file after deploying** (section 7).

**Only one transcription runs at a time**; everyone else waits in a queue. If five visitors each upload a 10-minute video
with `small`, the fifth waits about 13 minutes and then needs about 3 more. The queue length and the file length are
capped (section 10) so that the wait stays bearable.

### What to rent

| | Try it out | Recommended |
|---|---|---|
| CPU | 4 vCPU | **8 vCPU, dedicated** (not "burstable" / "shared" / "shared-core") |
| RAM | 8 GB | **16 GB** |
| Disk | 40 GB SSD | **80 GB or more SSD / NVMe** |
| OS | Ubuntu 24.04 LTS, 64-bit x86 | same |
| Network | public IPv4 address | same, plus IPv6 if offered |

Why: models take 1-3 GB of RAM while loaded; the Docker image takes about 4-6 GB; models you enable take up to about
7 GB on disk; and every waiting upload takes up to 500 MB of scratch space (queue length x upload limit).
Shared or burstable CPU plans are throttled when the CPU is busy for long, which is exactly what transcription does:
choose a plan described as "dedicated vCPU", "CPU-optimized" or "compute-optimized".

Any provider that sells a plain Ubuntu virtual server with a public IP works: for example Hetzner Cloud, OVHcloud,
DigitalOcean or AWS Lightsail. Compare the current plans yourself; prices and plan names change. Also check:

* **Location.** Pick a region near your visitors. For visitors in the EU, an EU region simplifies your privacy paperwork.
* **Traffic.** Uploads are inbound (usually free); outbound traffic is small (transcripts).
* **A GPU is optional and not covered by this Docker setup.** The CPU-only image is deliberate. A GPU would make
  transcription many times faster, but needs NVIDIA drivers/CUDA libraries and a different base image.

When creating the server:

1. Choose **Ubuntu 24.04 LTS**.
2. Add your **SSH public key** (on your PC: `ssh-keygen -t ed25519`, then paste the content of the `.pub` file into the
   provider's form). Do not rely on password login.
3. If the provider has a **cloud firewall**, allow inbound TCP 22, TCP 80, TCP 443 and UDP 443.
4. Write down the server's **IPv4** (and **IPv6**) address.

---

## 3. Point the domain at the server (DNS)

Log in where the domain's DNS records are managed (normally the registrar where you bought it, unless you moved the name
servers elsewhere). Delete any default or "parking" A/AAAA/CNAME records for `@` and `www`, then add:

| Type | Name (Host) | Value | TTL |
|---|---|---|---|
| A | `@` (the bare domain) | `SERVER_IP` (IPv4) | 300 (5 minutes) |
| A | `www` | `SERVER_IP` (IPv4) | 300 |
| AAAA (optional) | `@` | the server's IPv6 address | 300 |
| AAAA (optional) | `www` | the server's IPv6 address | 300 |

A short TTL (300 seconds) makes mistakes quick to fix; raise it to 3600 once everything works.

**AAAA records: only add them if the server's IPv6 really works** (ports 80/443 open in the provider firewall too). A
broken IPv6 address makes certificate issuance fail, because Let's Encrypt prefers IPv6. Also, with some Docker
versions visitors arriving over IPv6 appear to the app with Docker's internal address instead of their own, which makes
the per-IP upload limit treat all IPv6 visitors as one person. Launch with A records only; add AAAA later and check
that `docker compose logs caddy` shows real visitor addresses (`client_ip`) for IPv6 requests.

If your domain has a **CAA** record, it must allow Let's Encrypt (`0 issue "letsencrypt.org"`); with no CAA records
nothing is needed.

**Verify** from your PC (the answers must be your server's IP; it can take from a few minutes up to an hour):

```
nslookup transcribevid.com
nslookup www.transcribevid.com
nslookup transcribevid.com 1.1.1.1
```

or, on Linux/macOS: `dig +short A transcribevid.com`, `dig +short A www.transcribevid.com`, `dig +short AAAA transcribevid.com`.
**Do not start the stack (section 7) until both names answer correctly.** Failed certificate attempts are rate-limited by
Let's Encrypt.

---

## 4. Secure the server

Connect as root (your provider shows the user name; it is often `root` on Ubuntu images):

```
ssh root@SERVER_IP
```

### 4.1 A normal user instead of root

```
adduser --gecos "" deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Open a **second** terminal on your PC and check that `ssh deploy@SERVER_IP` works and that `sudo whoami` prints `root`.
Only then continue; keep the first session open as a safety net.

### 4.2 SSH: keys only, no root login

As `deploy`:

```
sudo tee /etc/ssh/sshd_config.d/00-hardening.conf >/dev/null <<'EOF'
PermitRootLogin no
PasswordAuthentication no
EOF
sudo sshd -t && sudo systemctl reload ssh
sudo sshd -T | grep -iE '^(permitrootlogin|passwordauthentication)'
```

The file is named `00-...` on purpose: SSH uses the first value it reads, and provider images often ship a
`50-cloud-init.conf` that re-enables passwords. The last command must print `permitrootlogin no` and
`passwordauthentication no`. Test a new login from your PC before closing the old session.

### 4.3 Firewall

```
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
sudo ufw enable
sudo ufw status verbose
```

(`443/udp` is HTTP/3, optional but harmless.) Outgoing traffic stays open: the app must reach Hugging Face to download
models and Let's Encrypt to get certificates. Note that Docker publishes its ports around ufw; this stack only publishes
80 and 443 on purpose (the app's port 8000 is not published), so keep it that way.

### 4.4 Automatic security updates, and optionally fail2ban

```
sudo apt update
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades      # answer "Yes"
sudo apt install -y fail2ban                         # optional: bans IPs that guess SSH passwords
```

Some updates (kernel) need a reboot. Reboot about once a month, at a quiet time: `sudo reboot`. The stack comes back
on its own (`restart: unless-stopped`, and Docker starts at boot).

---

## 5. Install Docker and get the project onto the server

### 5.1 Docker Engine with the Compose plugin

These are Docker's official instructions for Ubuntu as of writing; if the page
<https://docs.docker.com/engine/install/ubuntu/> differs, follow the page.

```
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker deploy
```

Log out and back in (so the group applies), then check: `docker --version` and `docker compose version`.
(Being in the `docker` group is equivalent to being root on that machine; that is why only `deploy`, protected by an
SSH key, is in it.)

### 5.2 The project

```
sudo mkdir -p /opt/transcribevid && sudo chown deploy:deploy /opt/transcribevid
```

Pick one:

* **With git (recommended; makes updates and rollbacks easy).** Put the project in a private repository (GitHub, GitLab, ...) and
  `git clone <repository-url> /opt/transcribevid`. For a private repository use the provider's "deploy key" or an
  access token.
* **Copy from your PC** (Linux/macOS/WSL; on Windows use git or WSL):

  ```
  rsync -av --delete --exclude node_modules --exclude .venv --exclude backend/data --exclude frontend/dist \
        --exclude .git --exclude deploy/.env ./ deploy@SERVER_IP:/opt/transcribevid/
  ```

  (`--exclude deploy/.env` protects the settings file you create in section 6 from being deleted by `--delete`.)

Keep your secrets out of git: on the machine where the repository lives run `echo "deploy/.env" >> .gitignore`. (The
image build never sees `deploy/.env`: `.dockerignore` excludes the whole `deploy` folder.)

---

## 6. Configure

```
cd /opt/transcribevid
cp deploy/.env.example deploy/.env
chmod 600 deploy/.env
sed -i "s/^VT_ADMIN_TOKEN=.*/VT_ADMIN_TOKEN=$(openssl rand -hex 24)/" deploy/.env
nano deploy/.env
```

The `sed` line generates your admin token (a long random password for the operator logs page, `/logs`). Copy it from the
file into your password manager. In `nano` (save with `Ctrl+O`, `Enter`; quit with `Ctrl+X`) set at least:

| Setting | What to put |
|---|---|
| `ACME_EMAIL` | A real mailbox you read. Let's Encrypt writes here if a certificate is about to expire. **Required**, and `example.com` addresses are refused |
| `VT_CONTACT_EMAIL` | The public contact address shown on the Privacy and Terms pages. A mailbox that really receives mail (abuse reports, privacy requests) |
| `VT_CPU_THREADS` | 3 for a 4 vCPU server, 6 for 8 vCPU (the example default) |
| `VT_WARMUP` | `0` if the server has 8 GB RAM or less |

Everything else has sensible defaults for an 8 vCPU / 16 GB server; each setting is explained in the file and in
section 10. The number of transcriptions per visitor is **unlimited** (`VT_MAX_JOBS_PER_SESSION=0`), and the "videos
transcribed" counter in the page header is on by default on the public site (`VT_COUNT_JOBS=auto`). Leave `VT_PUBLIC`, `VT_PUBLIC_URL`, `VT_ALLOWED_HOSTS` and `VT_TRUST_PROXY` as they are. If you use a domain other than
`transcribevid.com`, change it in `deploy/.env` **and** in `deploy/Caddyfile` (two site names and the redirect).

Rules for the file: one `KEY=value` per line, no quotes, no spaces around `=`.

---

## 7. Launch and verify

```
cd /opt/transcribevid

# 1. check the files before starting anything
docker compose config --quiet && echo "compose file OK"
docker compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile

# 2. build and start (the first build downloads about 1-2 GB and takes 5-15 minutes)
docker compose up -d --build

# 3. watch it come up (Ctrl+C stops watching, not the service)
docker compose ps
docker compose logs -f --tail=50
```

* `docker compose ps` should show `app` as `healthy` (after up to a minute) and `caddy` as `running`. `caddy` is started
  only after `app` is healthy.
* In the caddy log, look for `certificate obtained successfully`. It appears within about a minute of the first start.

**Check from your PC:**

```
curl -sS https://transcribevid.com/api/health
curl -sI http://transcribevid.com            # expect: 308 or 301 redirect to https://transcribevid.com/
curl -sI https://www.transcribevid.com       # expect: 301 redirect to https://transcribevid.com/
curl -sS https://transcribevid.com/api/stats  # expect: {"transcribed":0,"counting":true}
curl -s -o /dev/null -w "%{http_code}\n" https://transcribevid.com/api/logs   # expect: 401 (token required)
```

The health answer is JSON starting with `"status":"ok"` and showing `"public":true`. Then open
<https://transcribevid.com> in a browser and transcribe a 30-second clip with the `base` model. The first run of each model
downloads it from Hugging Face, which takes a while (models are 0.15 GB for `base`, about 0.5 GB for `small` and 1.6 GB
for `large-v3-turbo`); progress is shown on the page.

### Pre-download the models (recommended)

So that your first real visitor does not wait for a download, fetch the models you allow now (takes a few minutes):

```
docker compose exec app python -c "
from faster_whisper.utils import download_model
for name in ('base', 'small', 'large-v3-turbo'):
    print('downloading', name, flush=True)
    download_model(name, cache_dir='/data/models')
print('done')
"
```

(Match the list to `VT_ALLOWED_MODELS`.) The models live in the `models` volume and survive updates and restarts. With
`VT_WARMUP=1` the default model (`small`) is also loaded into memory at every start.

Then time a real file: upload a 10-minute video and note how long it takes. That is your real speed; adjust
`VT_MAX_DURATION_MIN` and `VT_ALLOWED_MODELS` accordingly (section 10).

### Certificate does not appear: troubleshooting

Read the caddy log: `docker compose logs caddy | grep -iE "error|obtain|challenge"`. The usual causes:

1. **DNS does not point here yet or points elsewhere.** `nslookup transcribevid.com 1.1.1.1` from your PC must show the server's IP, for
   both `transcribevid.com` and `www.transcribevid.com` (the www name gets its own certificate).
2. **Ports 80/443 not reachable from the internet.** Check `sudo ufw status`, and the provider's cloud firewall. On
   Windows PowerShell: `Test-NetConnection transcribevid.com -Port 80` (and 443) must say `True`.
3. **Something else already uses port 80/443** on the server (a pre-installed web server): `sudo ss -ltnp | grep -E ':(80|443) '` should list only
   docker. Stop the other program (`sudo systemctl disable --now apache2 nginx`).
4. **Broken IPv6.** An AAAA record exists but the server's IPv6 is not open. Delete the AAAA records or fix IPv6.
5. **`ACME_EMAIL` is missing or an `example.com` address.** Caddy refuses to start without it (a message about the `email` option) or Let's Encrypt
   refuses the account.
6. **A CAA record forbids Let's Encrypt** (section 3).
7. **Rate limit.** Too many failed attempts: Let's Encrypt pauses you for up to an hour (certificates: five failures per hostname per hour).
   Caddy retries automatically. To experiment safely, uncomment the `acme_ca` staging line in `deploy/Caddyfile`, then
   `docker compose restart caddy`; staging certificates are untrusted, so test with `curl -k` and not in a browser. Re-comment the line and restart
   again for the real certificate. Caddy keeps both apart.

After a fix: `docker compose restart caddy`. If an edit of `deploy/Caddyfile` seems to have no effect, run
`docker compose up -d --force-recreate caddy` (some editors replace the file, which a single-file mount does not follow).

---

## 8. Before you announce it: legal and operations checklist

Not legal advice. The Privacy and Terms pages in the app are **templates**.

- [ ] **Fill in the operator details.** `/privacy` and `/terms` contain highlighted placeholders, such as
      `[Operator / company name and address]` and `[Governing law and jurisdiction]`. Find them with
      `grep -rn 'class="placeholder"' frontend/src/app/features/legal`, edit, then rebuild: `docker compose up -d --build`. The contact e-mail
      placeholder fills itself from `VT_CONTACT_EMAIL`.
- [ ] **Have both pages reviewed** by someone qualified in the law that applies to you and your visitors (GDPR if you serve
      EU visitors; some countries also require an imprint with the operator's name and address).
- [ ] **`VT_CONTACT_EMAIL` is set** and the mailbox works; send a test mail.
- [ ] **The policy matches reality.** It says logs are kept "for a limited time". State the actual period: Docker keeps about 30 MB of
      logs per container (a few days to weeks depending on traffic), and the app keeps recent log lines in memory until it restarts. Logs
      contain visitors' IP addresses, which are personal data in many jurisdictions. If you want shorter retention, lower `max-size` in
      `docker-compose.yml`, or truncate IPs (see the comment in `deploy/Caddyfile`).
- [ ] **The "videos transcribed" counter and your Privacy page.** The counter stores one integer and a timestamp, nothing about
      visitors (no IP address, session or file name), so it is not personal data, and `GET /api/stats` neither sets a cookie nor creates a
      session. Still, describe it in one sentence on `/privacy` ("we keep a single anonymous total of how many files were transcribed")
      so the page matches what the server does, and have the page reviewed with the rest.
- [ ] **Cookie banner.** The site sets one session cookie that is strictly necessary for the service and uses no analytics, ads or third-party
      content. Such a cookie is generally exempt from consent banners in the EU and many other places, but rules differ by country: verify for
      yours. Adding analytics, ads or embeds later changes this.
- [ ] **Acceptable use and abuse handling.** Decide who reads the contact mailbox and what you do with abuse or takedown requests. Anonymous
      public upload services get misused; the limits in section 10 are your first line of defence.
- [ ] **Admin token** is saved in your password manager. Test: `https://transcribevid.com/logs` asks for it; without it the log API must answer
      401 (or 404 when no token is set).
- [ ] **Test as a stranger:** a phone on mobile data, a private browser window. Upload, watch the progress, download the transcript,
      use "Delete my data now".
- [ ] **Do not submit the domain to the HSTS preload list** (hstspreload.org) yet. The Caddyfile (and the app, and the nginx example) send
      `max-age=31536000; includeSubDomains` without the `preload` token, so nothing is preloaded by accident; preloading is hard to undo
      and affects every subdomain of the domain. Do it only when you are sure.

### Cloudflare (or another CDN) in front?

You can use Cloudflare just as the **DNS provider** (records set to "DNS only", the grey cloud). That is free and changes nothing for this guide.

**Do not turn on the proxy (orange cloud) for this site**, for three reasons (check Cloudflare's current limits yourself):

1. Their free plan limits a single request body to **100 MB**, so every upload above that fails; this service accepts up to 500 MB by default. If you
   proxy anyway, set `VT_MAX_UPLOAD_MB=90`.
2. The app and Caddy would then see Cloudflare's addresses instead of your visitors' addresses, so the per-IP upload limit would treat
   everybody as one person, unless you also configure trusted proxies for Cloudflare's address ranges in Caddy (not covered here).
3. Cloudflare would see all uploaded media in transit: a third-party processor that your Privacy page would have to mention.

---

## 9. Updating, rolling back, backups

> Every restart of the app **ends all visitors' sessions** and deletes their files. Update at a quiet time.

### Update

```
cd /opt/transcribevid
git pull                                                   # or copy the new files over (section 5.2)
docker tag transcribevid-app:latest transcribevid-app:previous   # keep the running version as rollback point
docker compose up -d --build
docker compose ps
docker image prune -f                                      # remove superseded images
```

If only `deploy/.env` changed: `docker compose up -d --force-recreate app caddy`. If only `deploy/Caddyfile` changed:
`docker compose restart caddy` (visitors are not affected beyond a blink).

The build uses the newest compatible versions of the Python libraries at build time (`backend/requirements.txt` is not pinned), so
an update can also update them. Always run a test transcription after updating.

### Roll back

```
docker tag transcribevid-app:previous transcribevid-app:latest
docker compose up -d --no-build
```

(and `git checkout <old version>` if you want the files to match.)

### Logs and status

```
docker compose ps                          # state and health
docker compose logs --tail=100 app         # the app
docker compose logs --tail=100 caddy       # access log (JSON, no query strings) and certificate messages
docker compose logs -f app                 # live
docker stats --no-stream                   # CPU and memory per container
```

The app also has a Logs page at <https://transcribevid.com/logs> (it asks for `VT_ADMIN_TOKEN`).

### Backups

**Nothing about your visitors is stored**, so there is nothing to back up for them. What exists:

* `models` volume: re-downloadable from Hugging Face. No backup needed.
* `caddy_data` volume: certificates and the Let's Encrypt account. If lost, Caddy simply gets new certificates (just keep an eye on the rate limits);
  an optional copy: `docker run --rm -v transcribevid_caddy_data:/d -v "$PWD":/b alpine tar czf /b/caddy_data.tgz -C /d .`
* `stats` volume: the "videos transcribed" counter (one file, a few bytes). It is the one thing here that cannot be re-created, so
  it survives `docker compose up -d --build`, updates and restarts, but **not** `docker compose down -v` or `docker volume rm`.
  Optional copy: `docker run --rm -v transcribevid_stats:/d -v "$PWD":/b alpine cp /d/stats.json /b/stats.json`. If it is ever
  lost, the counter just starts again at 0 (see 10.4 to set it to a number by hand).
* `deploy/.env` (holds your admin token and settings): keep a copy in your password manager.
* The project itself lives in your git repository.

A provider "snapshot" of the whole server before big changes is cheap insurance, but not required.

---

## 10. Capacity, abuse controls, monitoring, "it is slow"

### 10.1 What the limits do and when to tighten them

All in `deploy/.env`; apply with `docker compose up -d --force-recreate app` (this ends all sessions).

| Setting | What it does | Tighten when |
|---|---|---|
| `VT_MAX_UPLOAD_MB` (500) | Biggest file a visitor may upload. A larger file is refused immediately | Disk is small, or uploads over mobile/slow links keep failing: lower it |
| `VT_MAX_DURATION_MIN` (60) | Longest media duration accepted (checked after upload). The main cost control: with `large-v3-turbo` 60 minutes of audio is about 40 minutes of CPU | Queue waits are long: 30 or 20 |
| `VT_ALLOWED_MODELS` | Models visitors can choose | **Quickest fix for slowness:** `base,small` (turbo takes about twice as long as `small`). Visitors cannot pick a model you removed |
| `VT_MAX_QUEUE` (20) | Jobs waiting + running, all visitors together. A full queue answers "busy, try again later" | Typical wait should stay under about 20-30 minutes: (queued audio minutes) / (model speed). With `small` (~3x) 20 jobs of 10 min is about 67 minutes |
| `VT_MAX_JOBS_PER_SESSION` (0 = unlimited) | Jobs one visitor session can hold (finished ones count until the session expires). Unlimited, because the site is advertised as "free, unlimited, no login" | Only if you must: set a number such as 20. The protections that stay on are `VT_MAX_QUEUE`, `VT_RATE_UPLOADS_PER_HOUR`, the size and duration limits and the idle timeout |
| `VT_RATE_UPLOADS_PER_HOUR` (20) | Uploads one IP address may start per hour. With unlimited jobs per session this is the main brake on a single heavy user | Abuse from single addresses. Raise it if schools/offices behind one shared IP complain |
| `VT_MAX_SESSIONS` (200) | Visitors with an open session | Memory bookkeeping only |
| `VT_SESSION_IDLE_MINUTES` (30) | Idle time before a visitor's files are deleted | Shorter means less disk and less retained data, but users lose work sooner |
| `VT_MIN_FREE_GB` (5) | Uploads are refused below this much free disk | Small disk: 10 or more. Worst case need = queue x upload size |
| `VT_CPU_THREADS` (6) | CPU threads used by the recognition | See section 6 |
| `docker-compose.yml`: `cpus`, `mem_limit` | Hard ceilings for the app container (commented examples) | You share the server with other things, or want an out-of-memory kill to hit the app only |

Caddy has a second, coarser cap (`request_body max_size 600MB` in `deploy/Caddyfile`): if you raise `VT_MAX_UPLOAD_MB` above about 550, raise that too.

"Unlimited" means no cap on how many transcripts a visitor may make over time; it is not unlimited capacity. One visitor can still fill the
shared queue (`VT_MAX_QUEUE`), but only by starting at most `VT_RATE_UPLOADS_PER_HOUR` uploads an hour from one address, and each file is
limited in size and minutes. If the queue is regularly full, lower the per-IP limit, the duration limit or the model list before anything else.

### 10.2 Monitoring (15 minutes, worth it)

1. **Uptime check.** Use any external monitor (UptimeRobot, Uptime Kuma on another machine, Better Stack, your provider's checks) on
   `https://transcribevid.com/api/health` every 1-5 minutes, expecting HTTP 200 and the text `"status":"ok"`. Send alerts to your phone/email.
   The same JSON has `queue_pending` (jobs waiting + running), which tells you how busy it is.
2. **Disk space alert.** The disk fills slowly through Docker images and logs, or quickly if the scratch space is exhausted. Set an
   alert at 80% in the provider's panel if it offers one, otherwise check weekly: `df -h /` and `docker system df`. `VT_MIN_FREE_GB`
   makes the app refuse uploads before the disk is full, but it cannot help with other things filling the disk.
3. **Logs.** `docker compose logs` as above; Docker rotation (3 x 10 MB per container) keeps them from growing.
4. **Certificates** renew automatically about 30 days before they expire. `ACME_EMAIL` receives a warning if it ever fails.

### 10.3 "It is slow": what to do first

Work through these in order:

1. **Is it just busy?** `curl -s https://transcribevid.com/api/health` shows `queue_pending`. Waiting in a queue is normal behaviour.
   Check `docker compose logs --tail=50 app` to see what is running.
2. **Is the CPU being stolen or shared?** Run `top` and look at the `st` (steal) value in the CPU line: above about 10% means the provider is
   throttling you, so move to a dedicated-vCPU plan. Also check nothing else is hogging the CPU (`docker stats --no-stream`).
3. **Out of memory?** `free -h`; `docker inspect -f '{{.State.OOMKilled}}' $(docker compose ps -q app)` prints `true` if the app was killed for memory;
   `sudo dmesg | grep -i 'out of memory'`. Fix by dropping `large-v3-turbo` from `VT_ALLOWED_MODELS`, setting `VT_WARMUP=0` or upgrading RAM.
4. **Disk full?** `df -h /`. `docker image prune -f` and `docker builder prune -f` free old build leftovers.
5. **Cut the load:** remove the biggest model from `VT_ALLOWED_MODELS`, lower `VT_MAX_DURATION_MIN` and `VT_MAX_QUEUE`.
6. **Thread count.** More threads are not always faster; try `VT_CPU_THREADS` 4 versus 6 with the same file.
7. **After a restart** the first job of each model loads it from disk (seconds) or downloads it (minutes) if you skipped the pre-download.
8. **Slow uploads** are usually the visitor's own connection, not the server.
9. **Still not enough?** The honest answer is a bigger/faster server, or a GPU setup (not provided here); see limitations.

### 10.4 The "videos transcribed" counter

The page header shows how many videos this website has transcribed. The number lives in one small JSON file and is served by
`GET /api/stats`, for example `{"transcribed":1234,"counting":true}`.

| Setting | Meaning |
|---|---|
| `VT_COUNT_JOBS` (`auto`) | `auto` counts only when `VT_PUBLIC=1`, so a copy running on someone's own computer never counts and always reports `{"transcribed":0,"counting":false}`. `1` forces counting, `0` turns it off (the number is then reported as 0 even if the file holds one) |
| `VT_STATS_FILE` | Where the number is kept. Docker: `/data/stats/stats.json` on the `stats` volume, set by the image, so leave it alone. Without Docker: `stats.json` inside `VT_DATA_DIR` |

What it counts: one per **uploaded file**, at the moment its transcription first finishes successfully. Failed and cancelled jobs, and
"re-transcribe with another model" runs of an already counted file, do not count; neither does anything a visitor does afterwards
(deleting a transcript, "Delete my data now", the session expiring). A re-transcribe of a file that failed the first time counts once,
when it first succeeds.

What is stored: `{"transcribed": 1234, "updated_at": "2026-10-15T12:00:00Z"}` and nothing else. No visitor id, IP address, session id, file name or
file content, so it is not personal data. It is written atomically (temp file, `fsync`, rename), so a crash leaves either the old or the new number.
If the file cannot be written the app logs a WARNING (`vt.stats`) and keeps counting in memory; if it is corrupt the app moves it to
`stats.json.corrupt`, starts again from 0 and keeps running. Every new total is logged at INFO (`transcription counter: N video(s) transcribed`).

Look at it, back it up or change it. The app keeps the number in memory while it runs, so stop it before editing the file:

```
curl -s https://transcribevid.com/api/stats
docker compose exec app cat /data/stats/stats.json
docker compose stop app
echo '{"transcribed": 5000, "updated_at": "2026-01-01T00:00:00Z"}' > stats.json
docker run --rm -v transcribevid_stats:/d -v "$PWD":/b alpine sh -c 'cp /b/stats.json /d/stats.json && chown 10001:10001 /d/stats.json'
docker compose start app
```

(The last four lines are only for setting a starting value by hand, for example after losing the volume.) Run one app instance only: the number is
held in the process, so two instances sharing one file would overwrite each other.

### 10.5 Search engines and caching: what the app already does

Nothing to configure; this is here so you know what to expect (and what to keep when you change the proxy). The list of real pages is
`APP_PAGES` in `backend/app/main.py`; a new public page in the frontend must be added there and to `frontend/public/sitemap.xml`
(`backend/tests/test_spa.py` fails if they disagree), otherwise the page is answered with a real 404 and search engines drop it.

| What | Behaviour |
|---|---|
| Real pages | `/`, `/how-it-works`, `/faq`, `/privacy`, `/terms`, `/logs`, `/jobs/<id>` and the six keyword pages (`/video-to-text`, `/audio-to-text`, `/mp4-to-text`, `/mp3-to-text`, `/srt-subtitle-generator`, `/voice-recording-to-text`) answer 200; every other URL answers a true 404 that shows the app's "page not found" view |
| One URL per page | `/faq/` -> 301 `/faq` (query string kept), `/index.html` -> 301 `/`, the old `/about` -> 301 `/how-it-works`. Never for `/api/` |
| HEAD | Pages, `robots.txt`, `sitemap.xml`, static files and `/api/health` answer HEAD like GET without a body |
| `X-Robots-Tag: noindex, nofollow` | On every `/api/` response (errors too) and on `/logs` and `/jobs/<id>` |
| `Cache-Control` | Hashed JS/CSS: 1 year, immutable. Icons, `og-image.png`, manifest, favicons: 1 day. `robots.txt`, `sitemap.xml`: 1 hour. Pages and `index.html`: `no-cache`. `/api/`: `no-store` (`/api/stats`: 30 s) |
| `ETag` / `304` | Every page and file has an `ETag` and `Last-Modified`; a browser that revalidates an unchanged copy gets `304 Not Modified` with no body (pages are `no-cache`, so this makes repeat visits cheap) |
| Compression | gzip for pages, JS, CSS, JSON, SVG, XML, the manifest and the text exports when the browser accepts it (`VT_COMPRESS=1`, the default). The build's files are compressed once and kept in memory; `/api/` answers never are. Never compressed: the live event streams (`text/event-stream`), media, PDFs, images, partial (`206`) answers. A compressed answer carries a weak `ETag` (`W/"..."`) and `Vary: Accept-Encoding` |
| Search engine verification | `VT_GOOGLE_SITE_VERIFICATION` / `VT_BING_SITE_VERIFICATION` (codes only, comma-separated) are written as `<meta name="google-site-verification">` / `<meta name="msvalidate.01">` right after `<head>` of every page. A file put into `frontend/public` before the build (Google's `google<code>.html`, Bing's `BingSiteAuth.xml`) is served exactly as it is |
| IndexNow | With `VT_INDEXNOW_KEY` set, `/<key>.txt` answers the key; `node scripts/indexnow.mjs --key <key>` then submits the sitemap's pages to Bing/Yandex |
| Prerendered builds | Served in this order: the exact file, `<page>/index.html` (a prerendered page), then `index.csr.html` (the client-only shell) for pages that have no file and for `/jobs/<id>`, and `index.csr.html` also supplies the 404 page; without `index.csr.html`, `index.html` does all of that |
| Security headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (microphone for the site only), HSTS (1 year, `includeSubDomains`, no `preload`) on https. There is deliberately **no** `Content-Security-Policy`: the Angular app uses inline styles, and a wrong policy would break the site |

Proxy side: `deploy/Caddyfile` compresses html, css, js, json, `application/manifest+json`, xml (the sitemap), svg, plain text and vtt, and
nothing else (so the progress event stream and downloads stay uncompressed); `deploy/nginx.conf.example` has the same list in `gzip_types`
and now sends the same HSTS value as Caddy. Both leave the app's `Cache-Control` and `X-Robots-Tag` alone, and both pass an answer the app
already compressed through unchanged (they only compress what arrives uncompressed). Check after a deploy:
`curl -sI https://transcribevid.com/faq/` (301), `curl -sI https://transcribevid.com/api/health | grep -i x-robots-tag`,
`curl -sI -H 'Accept-Encoding: gzip' https://transcribevid.com/sitemap.xml | grep -i content-encoding`.

---

## 11. Running without Docker (systemd + Caddy or nginx)

Same app, installed directly on Ubuntu 24.04. Use it only if you cannot use Docker; steps 2-4 (server, DNS, hardening) are identical.
Everything below is typed on the server.

```
sudo apt install -y python3-venv fonts-noto-core fonts-noto-cjk fonts-dejavu-core
```

(fonts for PDF export; skip `fonts-noto-cjk` to save space and lose Chinese/Japanese/Korean in PDFs.)

**1. Code.** Put the repository in `/opt/transcribevid` (section 5.2). The Angular app must be built once. The simplest way is on your own PC: run
`npm run build` in the repository, then copy the folder `frontend/dist/frontend/browser` to
`/opt/transcribevid/frontend/dist/frontend/browser` on the server (`scp -r`). (Ubuntu's own Node.js is too old to build it; use Docker or your PC.)

**2. Python environment and user.**

```
sudo python3 -m venv /opt/transcribevid/backend/.venv
sudo /opt/transcribevid/backend/.venv/bin/pip install -r /opt/transcribevid/backend/requirements.txt
sudo useradd --system --no-create-home --shell /usr/sbin/nologin transcribevid
```

**3. Settings.** systemd reads the same file format as Docker. Copy the example, then append the paths that the Docker image would have set:

```
sudo install -d -m 755 /etc/transcribevid
sudo install -m 640 -o root -g transcribevid /opt/transcribevid/deploy/.env.example /etc/transcribevid/transcribevid.env
sudo tee -a /etc/transcribevid/transcribevid.env >/dev/null <<'EOF'
VT_HOST=127.0.0.1
VT_PORT=8000
VT_DATA_DIR=/var/lib/transcribevid
VT_MODEL_DIR=/var/lib/transcribevid/models
VT_STATIC_DIR=/opt/transcribevid/frontend/dist/frontend/browser
EOF
sudo sed -i "s/^VT_ADMIN_TOKEN=.*/VT_ADMIN_TOKEN=$(openssl rand -hex 24)/" /etc/transcribevid/transcribevid.env
sudo nano /etc/transcribevid/transcribevid.env        # VT_CONTACT_EMAIL, VT_CPU_THREADS, ...
```

`VT_HOST=127.0.0.1` keeps the app reachable only from the same machine (the web server in front).

The "videos transcribed" counter (section 10.4) is then `/var/lib/transcribevid/stats.json` (`VT_DATA_DIR`), which the unit's `StateDirectory`
keeps across restarts and updates. Do not delete that folder if you want to keep the number.

**4. Service.**

```
sudo cp /opt/transcribevid/deploy/systemd/transcribevid.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now transcribevid
curl -s http://127.0.0.1:8000/api/health
journalctl -u transcribevid -f
```

**5a. HTTPS with Caddy (recommended).** Install Caddy from its official package repository
(<https://caddyserver.com/docs/install#debian-ubuntu-raspbian>), then:

```
sudo cp /opt/transcribevid/deploy/Caddyfile /etc/caddy/Caddyfile
sudo sed -i 's/app:8000/127.0.0.1:8000/' /etc/caddy/Caddyfile
sudo systemctl edit caddy
```

In the editor that opens, add these two lines (with your real address) and save:

```
[Service]
Environment=ACME_EMAIL=you@yourdomain.com
```

```
sudo ACME_EMAIL=you@yourdomain.com caddy validate --config /etc/caddy/Caddyfile
sudo systemctl restart caddy
journalctl -u caddy -f
```

The access log goes to the journal; limit how long it is kept with `MaxRetentionSec=14day` in `/etc/systemd/journald.conf`
(`sudo systemctl restart systemd-journald`).

**5b. HTTPS with nginx instead.** `sudo apt install -y nginx certbot`, then follow the comments at the top of
`deploy/nginx.conf.example` (install it as `/etc/nginx/sites-available/transcribevid`, link it into `sites-enabled`, get the certificate with
certbot, `sudo nginx -t && sudo systemctl reload nginx`). It sets the same proxy, timeout, streaming and header behaviour as the Caddyfile.

**Pre-download models:**

```
sudo -u transcribevid env HF_HOME=/var/lib/transcribevid/hf-home HF_HUB_DISABLE_XET=1 /opt/transcribevid/backend/.venv/bin/python -c "
from faster_whisper.utils import download_model
for name in ('base', 'small', 'large-v3-turbo'):
    print('downloading', name, flush=True)
    download_model(name, cache_dir='/var/lib/transcribevid/models')
"
```

**Update:** `git pull`, copy a newly built `frontend/dist/frontend/browser` if the frontend changed,
`sudo /opt/transcribevid/backend/.venv/bin/pip install -r /opt/transcribevid/backend/requirements.txt`, `sudo systemctl restart transcribevid`.
Resource limits: uncomment `CPUQuota` / `MemoryMax` in the unit file.

---

## 12. Honest limitations

* **One server, one transcription at a time.** Visitor sessions live in the app's memory, so the app cannot be spread over several servers
  without redesign. More traffic means a bigger server, shorter files, or fewer models.
* **Restarts and updates end all sessions.** By design nothing is stored; visitors must download their transcripts before they leave (the
  idle timeout is 30 minutes by default). There is no zero-downtime update. Only the anonymous "videos transcribed" total survives (volume `stats`).
* **CPU speed is the product.** A 1-hour recording with `large-v3-turbo` occupies the server for about 40 minutes. A handful of long files can make
  everybody wait; the duration and queue limits exist for this reason, and they are the knobs you will tune most.
* **Anonymous public uploads attract abuse** (spam, illegal content, people trying to use your CPU for free). The built-in limits, session isolation
  and automatic deletion help; they do not replace checking your contact mailbox and logs. There are no accounts to ban; blocking an address is done in
  the firewall (`sudo ufw deny from <ip>`).
* **No GPU support in this Docker image** and no high availability: if the server is down, the site is down.
* **First use of a model downloads it from Hugging Face.** If Hugging Face is unreachable, a model that was never downloaded cannot be used. The
  pre-download in section 7 avoids this.
* **Python libraries are not pinned.** A rebuild may pick up newer versions; test after each update.
* **The IPv6 caveat** in section 3 (per-IP limits and Docker).
* **Nothing here replaces a legal review**, and the capacity figures are estimates from one laptop: measure on your server.
