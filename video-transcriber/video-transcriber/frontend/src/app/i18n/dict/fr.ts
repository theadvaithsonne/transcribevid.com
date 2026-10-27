/** French dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
export const PAGES: readonly string[] = [
  '/',
  '/how-it-works',
  '/faq',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/tools',
  '/guides',
];

const dict: Record<string, string> = {
  '.': '.',
  '"{name}" is {size}; the limit is {limit}.': '« {name} » fait {size} ; la limite est de {limit}.',
  '"{name}" is empty.': '« {name} » est vide.',
  '"{name}" is ready. Press Transcribe to start.':
    '« {name} » est prêt. Appuyez sur Transcrire pour commencer.',
  '“{title}” was deleted.': 'La transcription « {title} » a été supprimée.',
  '(optional)': '(facultatif)',
  '{base} Word timing: {timing}.': '{base} Horodatage par mot : {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) est exploité par **{name}**, {address} (« nous »). Nous décidons comment et pourquoi vos données sont traitées, comme décrit ici.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) est géré par **{name}**, {address}. Pour en savoir plus, consultez la page [À propos](/about).',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} est un service grand public qui ne s’adresse pas aux enfants de moins de 13 ans (ou de moins de 16 ans dans l’UE, le cas échéant).',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} est conçu et géré par **{name}**, {role} basé à {city}. Je l’ai créé pour offrir la meilleure expérience de transcription possible : fluide dès le premier clic, sans compte à créer, avec une interface épurée qui ne gêne pas.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} s’adresse à un public général et ne cible pas les enfants de moins de 13 ans.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand} est gratuit parce qu’il affiche des publicités, diffusées par Google AdSense. Les publicités n’apparaissent que sur les pages d’information (accueil, Comment ça marche, FAQ et pages des outils). Aucune publicité n’est affichée pendant la transcription d’un fichier ni à côté de votre transcription, ni jamais sur les pages de confidentialité, de conditions ou de journaux.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} est gratuit. La [Politique de confidentialité](/privacy) explique ce qu’il advient de vos fichiers.',
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} est financé par les publicités affichées sur ses pages d’information (Google AdSense). Comme c’est votre propre appareil qui effectue la transcription, chaque fichier ne coûte rien en serveur, et c’est ce qui rend le service gratuit et illimité. La [Politique de confidentialité](/privacy) explique ce que les publicités utilisent et comment choisir vos réglages.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} transforme la parole d’un fichier vidéo ou audio en texte horodaté, en trois étapes simples.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} transforme la parole des vidéos, des fichiers audio et des enregistrements vocaux en texte précis et horodaté. C’est gratuit, il n’y a aucune limite au nombre de fichiers que vous transcrivez, et vous n’avez pas besoin de compte : choisissez un fichier ci-dessus, appuyez sur Transcrire et lisez le résultat.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} transforme les fichiers vidéo et audio en texte, directement dans votre navigateur : la reconnaissance s’exécute sur votre appareil et vos fichiers ne nous sont pas envoyés. Le service est gratuit et ne demande aucun compte. Il est financé par des publicités sur les pages d’information (Google AdSense ; voir la [Politique de confidentialité](/privacy)). Nous pouvons modifier, limiter ou arrêter des fonctionnalités à tout moment.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} transforme gratuitement la vidéo et l’audio en texte précis et horodaté. Il n’y a ni inscription, ni connexion, ni filigrane : ouvrez la page, choisissez un fichier et lisez votre transcription.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand} transforme la vidéo et l’audio en texte, directement dans votre navigateur. Cette page explique, en termes simples, ce que cela implique pour vos données. En bref : votre fichier ne quitte jamais votre appareil. Vos transcriptions sont conservées uniquement dans ce navigateur, il n’y a aucun compte, et le site ne dépose aucun cookie de sa part. Les publicités n’apparaissent que sur les pages d’information, et sont diffusées par Google, qui utilise des cookies.',
  '{done} of {total}': '{done} sur {total}',
  '{duration} (estimate)': '{duration} (estimation)',
  '{gb} GB of memory recommended': '{gb} Go de mémoire recommandés',
  '{h} h': '{h} h',
  '{h} h {m} min': '{h} h {m} min',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)':
    '{label} (la première utilisation télécharge {size} Mo)',
  "{label}, as reported by visitors' browsers": '{label}, d’après les navigateurs des visiteurs',
  '{label}: common questions': '{label} : questions fréquentes',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. Cherchez-le dans vos téléchargements.',
  '{language} → English': '{language} → anglais',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {done} fichier(s) sur {total} étaient déjà en file d’attente ; les {left} autres sont toujours dans la liste, appuyez sur Transcrire pour réessayer.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {done} fichier(s) sur {total} étaient déjà en file d’attente ; {left} autre fichier est toujours dans la liste, appuyez sur Transcrire pour réessayer.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} est plus lent que le temps réel sur cet appareil : {wait} pour {audio} d’audio (estimation). Tiny ou Base se terminent plus vite.',
  '{n} files were skipped: not video or audio.':
    '{n} fichiers ont été ignorés : ce ne sont ni des vidéos ni des fichiers audio.',
  '{n} h ago': 'il y a {n} h',
  '{n} min': '{n} min',
  '{n} min ago': 'il y a {n} min',
  '{n} min left': '{n} min restantes',
  '{n} min read': '{n} min de lecture',
  '{n} minute': '{n} minute',
  '{n} minutes': '{n} minutes',
  '{n} of {total}': '{n} sur {total}',
  '{n} of those files are already in the list.': '{n} de ces fichiers figurent déjà dans la liste.',
  '{n} video transcribed': '{n} vidéo transcrite',
  '{n} videos transcribed': '{n} vidéos transcrites',
  '{n} words': '{n} mots',
  '{n}% done': '{n} % terminé',
  '{n}% model confidence': '{n} % de confiance du modèle',
  '{n}s left': '{n} s restantes',
  '{name} home': 'Accueil {name}',
  '{size} download': 'Téléchargement de {size}',
  '{title}: {blurb}': '{title} : {blurb}',
  '{title}: {blurb} {note}.': '{title} : {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} Indisponible sur cet appareil : {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**Un journal technique dans cet onglet.** La page Journaux affiche le journal technique propre à cet onglet. Il reste dans votre navigateur et n’est jamais envoyé nulle part.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**Ajoutez un indice de vocabulaire** : les noms, marques et termes techniques présents dans l’audio, orthographiés comme vous le souhaitez.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**Ajoutez un indice de vocabulaire** : noms, marques et termes techniques, orthographiés comme vous le souhaitez.',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**Publicités.** Les publicités n’apparaissent que sur les pages d’information, et sont diffusées par Google, qui utilise des cookies. Aucune publicité n’est affichée pendant la transcription d’un fichier ni à côté de votre transcription.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**Vérifiez les lignes signalées** et corrigez-les dans l’éditeur de transcription.',
  '**Choose the spoken language** instead of auto-detect.':
    '**Choisissez la langue parlée** plutôt que la détection automatique.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**Choisissez votre fichier.** Déposez un fichier vidéo ou audio ci-dessus, sélectionnez-en un sur votre appareil ou enregistrez votre voix avec le microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG et la plupart des autres formats courants fonctionnent.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**Améliorer l’audio** — filtre les grondements et le souffle, égalise les voix faibles',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**Limites de fichier.** Aucune de notre part. Votre fichier est traité sur votre appareil : les fichiers très volumineux ou longs prennent donc plus de temps et demandent assez de mémoire libre ; la page vous avertit sur un appareil plus lent.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**Types de fichiers.** Vidéo : MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS et MTS. Audio : MP3, WAV, M4A, AAC, FLAC, OGG et OPUS. Vous pouvez aussi enregistrer directement depuis votre microphone.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Cookies de Google.** Google dépose ses propres cookies lorsque les publicités se chargent, uniquement sur les pages qui affichent des publicités (voir la section 6).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**Cours et podcasts** transformés en texte lisible pour étudier ou pour rédiger des notes d’épisode.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**Limites.** Aucune limite de taille ou de durée n’est annoncée par le serveur pour le moment. Les fichiers très volumineux prennent simplement plus de temps.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**Limites.** Nous n’imposons aucune limite de taille ou de durée : votre fichier est traité sur votre appareil, donc les fichiers très volumineux ou longs prennent simplement plus de temps et demandent assez de mémoire libre. Sur un appareil plus lent, la page vous prévient avant de commencer et estime la durée.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**Médias que vous ajoutez.** Les fichiers vidéo ou audio que vous choisissez ou enregistrez. Ils sont traités dans votre navigateur, sur votre appareil (avec WebGPU ou WebAssembly). Votre fichier n’est jamais envoyé à nos serveurs, ni à Google, ni à personne d’autre.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**Notes de réunion et d’entretien** que vous pouvez rechercher, citer et partager.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**Des erreurs peuvent se produire.** Aucune reconnaissance vocale n’est parfaite. Vérifiez toujours une transcription avant de vous y fier pour quoi que ce soit d’important.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**Aucun cookie de notre part.** Le site lui-même ne dépose aucun cookie.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Rien n’est conservé pour plus tard.** Les fichiers et les transcriptions n’existent que pendant votre session. Exportez ce dont vous avez besoin avant de partir. Les détails figurent dans la [Politique de confidentialité](/privacy).',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Rien n’est conservé pour plus tard.** Les transcriptions et le fichier restent uniquement dans ce navigateur et sont supprimés automatiquement après {idle} d’inactivité, ou lorsque vous appuyez sur **Supprimer mes données maintenant**. Exportez ce dont vous avez besoin avant de partir. Les détails figurent dans la [Politique de confidentialité](/privacy).',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**Rien n’est conservé pour plus tard.** Les transcriptions n’existent que pendant cette session : exportez donc ce dont vous avez besoin. La [Politique de confidentialité](/privacy) décrit le site web hébergé.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**Un total cumulé.** Lorsqu’une transcription se termine, votre navigateur envoie un « +1 » anonyme à notre compteur (un Cloudflare Worker). Il ne contient ni fichier, ni transcription, ni identifiant. Cloudflare voit votre adresse IP en transit et l’utilise brièvement pour limiter les abus (une limite de débit) ; nous ne conservons que le total. Le nombre affiché dans l’en-tête de la page est communiqué par les navigateurs des visiteurs et n’est pas vérifié.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '**Choisissez Haute précision ou Précision maximale** pour un audio difficile.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**Choisissez la qualité et la langue.** Un modèle plus rapide donne un brouillon rapide ; un modèle plus précis convient mieux aux entretiens, aux cours et aux sous-titres. La langue parlée peut être détectée pour vous, et plus de 50 langues sont prises en charge.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '**Retranscrivez** une transcription terminée avec une autre qualité ou une autre langue ; votre transcription actuelle est conservée.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '**Retranscrivez** avec une autre qualité ou une autre langue ; votre transcription actuelle est conservée.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**Lisez, corrigez et téléchargez.** La transcription apparaît avec des horodatages, et les mots dont le modèle n’était pas sûr sont signalés pour que vous puissiez les vérifier. Téléchargez-la en texte brut, en sous-titres SRT ou VTT, en Markdown ou en JSON.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**Requêtes qui servent le site.** Cloudflare (Cloudflare Pages) diffuse ce site web. En tant que fournisseur d’hébergement et de réseau, il traite votre adresse IP et les données de requête habituelles (comme l’heure, la page demandée et votre navigateur) pour diffuser et protéger le site.',
  '**Skip silence & music** — prevents made-up text':
    '**Ignorer les silences et la musique** — évite le texte inventé',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**Les modèles de reconnaissance restent dans le cache de votre navigateur** (Cache Storage), si bien que la transcription suivante démarre plus vite, jusqu’à ce que vous les supprimiez (**Supprimer mes données maintenant** peut aussi les supprimer) ou que votre navigateur vide son stockage. Ce sont des fichiers de programme, pas vos données.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**Vitesse.** Elle dépend de la qualité choisie, de la durée du fichier et de l’affluence du service.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**Vitesse.** Elle dépend de votre appareil, de la qualité choisie et de la durée du fichier. La première utilisation d’un niveau de qualité télécharge son modèle une seule fois : votre navigateur récupère les fichiers du modèle chez Hugging Face et les fichiers de programme du moteur chez jsDelivr, puis les garde en cache. Gardez l’onglet ouvert pendant le traitement.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**Partez d’un bon audio** : moins de bruit de fond, un microphone proche et une seule personne qui parle à la fois. Laissez « Améliorer l’audio » activé.',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**Partez d’un bon audio** : peu de bruit de fond, un microphone proche, une personne à la fois. Laissez « Améliorer l’audio » activé.',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**Stockage dans votre navigateur.** Votre navigateur conserve vos transcriptions et vos fichiers (IndexedDB) ainsi que les modèles de reconnaissance (Cache Storage) comme décrit ci-dessus, mémorise votre choix de thème clair ou sombre, et son stockage de session garde quelques réglages de confort pour l’onglet en cours (comme votre dernier choix de qualité). Rien de tout cela ne nous est envoyé.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**Sous-titres** pour vos propres vidéos, reels et cours en ligne, à partir d’un fichier SRT ou VTT.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**Texte produit sur votre appareil.** La transcription, ses horodatages et vos modifications, le titre que vous choisissez et les réglages que vous sélectionnez (qualité, langue, indice de vocabulaire). Ils sont produits et conservés dans ce navigateur ; nous ne les recevons jamais.',
  '**Use previous text as context** — can repeat on long files':
    '**Utiliser le texte précédent comme contexte** — peut provoquer des répétitions sur les longs fichiers',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**Mémos vocaux** mis par écrit, pour ne pas avoir à les réécouter.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**Pourquoi les résultats peuvent-ils différer d’une exécution, d’un réglage de qualité ou d’un autre outil à l’autre ?** La reconnaissance vocale est probabiliste : elle choisit les mots les plus probables, et dans les passages bruyants ou ambigus plusieurs réponses sont proches. Un autre réglage de qualité ou de langue, un autre indice de vocabulaire ou un autre nettoyage de l’audio peut modifier le texte, tout comme un autre outil reposant sur un système différent. Les noms ou étiquettes des locuteurs ne sont pas ajoutés.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**Horodatage par mot** — de meilleurs sous-titres et des repères de confiance',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**Vos fichiers et transcriptions restent dans ce navigateur.** Les transcriptions, les modifications et le fichier source sont conservés uniquement dans le stockage de ce navigateur (IndexedDB). Ils sont supprimés automatiquement à la fin de votre session, c’est-à-dire après {idle} d’inactivité, ou immédiatement lorsque vous appuyez sur **Supprimer mes données maintenant** dans le menu Transcriptions.',
  '1 file was skipped: not video or audio.':
    '1 fichier a été ignoré : ce n’est ni une vidéo ni un fichier audio.',
  '1 minute': '1 minute',
  '1 word': '1 mot',
  '1. Agreement': '1. Accord',
  '1. Who runs this website': '1. Qui exploite ce site web',
  '10. Children': '10. Enfants',
  '10. Termination': '10. Résiliation',
  '11. Children': '11. Enfants',
  '11. Your rights and choices': '11. Vos droits et vos choix',
  '12. Changes': '12. Modifications',
  '12. Open-source components': '12. Composants open source',
  '13. Changes to this policy': '13. Modifications de cette politique',
  '13. Governing law': '13. Droit applicable',
  '14. Contact': '14. Contact',
  '2. The service': '2. Le service',
  '2. What is processed, and where': '2. Ce qui est traité, et où',
  '3 simple steps': '3 étapes simples',
  '3. Why it is processed': '3. Pourquoi les données sont traitées',
  '3. Your content': '3. Votre contenu',
  '4. Acceptable use': '4. Utilisation acceptable',
  '4. How long it is kept': '4. Durée de conservation',
  '5. Downloads your browser makes': '5. Téléchargements effectués par votre navigateur',
  '5. Limits: your device does the work': '5. Limites : c’est votre appareil qui travaille',
  '6. Accuracy: no warranty': '6. Exactitude : aucune garantie',
  '6. Advertising': '6. Publicité',
  '7. Availability': '7. Disponibilité',
  '7. Cookies and browser storage': '7. Cookies et stockage du navigateur',
  '8. Sharing': '8. Partage',
  '8. Third-party downloads and ads': '8. Téléchargements et publicités de tiers',
  '9. Liability': '9. Responsabilité',
  '9. Security': '9. Sécurité',
  'A name cannot be empty, so the old name was kept.':
    'Un nom ne peut pas être vide ; l’ancien nom a donc été conservé.',
  'A new transcript has started. The old one is kept in your list.':
    'Une nouvelle transcription a démarré. L’ancienne reste dans votre liste.',
  'a period': 'une période',
  About: 'À propos',
  'About {brand}': 'À propos de {brand}',
  'about {h} h': 'environ {h} h',
  'about {h} h {m} min': 'environ {h} h {m} min',
  'about {n} min': 'environ {n} min',
  'Accurate text': 'Un texte précis',
  'Add another file': 'Ajouter un autre fichier',
  'Add your file': 'Ajoutez votre fichier',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'Les publicités n’apparaissent que sur les pages d’information, et sont diffusées par Google, qui utilise des cookies. Aucune publicité n’est affichée pendant la transcription d’un fichier ni à côté de votre transcription, et ce site web ne dépose aucun cookie de sa part. Les détails figurent dans la [Politique de confidentialité](/privacy).',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'Aucune fonctionnalité n’a besoin des publicités : que vous les bloquiez ou les refusiez, tout fonctionne de la même façon.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'Les publicités maintiennent TranscribeVid gratuit. Tout fonctionne sans elles.',
  Advertisement: 'Publicité',
  'All free tools': 'Tous les outils gratuits',
  'All free video and audio to text tools':
    'Tous les outils gratuits de conversion de vidéo et d’audio en texte',
  'All tools': 'Tous les outils',
  'All your data was deleted': 'Toutes vos données ont été supprimées',
  'Allow the microphone in your browser, or choose a file instead.':
    'Autorisez le microphone dans votre navigateur, ou choisissez plutôt un fichier.',
  'Already added': 'Déjà ajouté',
  'Already finished': 'Déjà terminé',
  'Also delete the downloaded speech models?':
    'Supprimer aussi les modèles de reconnaissance téléchargés ?',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'Un envoi est en cours. Attendez qu’il soit terminé avant d’ajouter d’autres fichiers.',
  'Apply style only': 'Appliquer le style seulement',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    '« Appliquer le style seulement » réutilise la reconnaissance enregistrée sans retraiter l’audio. Les lignes modifiées sont conservées.',
  'Audio works too.': 'L’audio fonctionne aussi.',
  'Automatic (IndicXlit when installed)': 'Automatique (IndicXlit si installé)',
  Back: 'Retour',
  'Basic phonetic spelling': 'Orthographe phonétique simple',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'Comme nous ne gérons aucun compte et ne détenons aucune donnée qui vous identifie, nous ne pouvons généralement relier aucune donnée à une personne. Lorsque la loi vous donne des droits sur vos données personnelles, tels que l’accès, la rectification, l’effacement, la limitation, l’opposition et la portabilité, ou le droit d’introduire une réclamation auprès de votre autorité de protection des données, vous pouvez les exercer en nous contactant :',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'Comme vos transcriptions n’existent que dans ce navigateur, exportez ce dont vous avez besoin avant de partir. Les données supprimées ne peuvent pas être récupérées.',
  'Best accuracy': 'Précision maximale',
  'Best accuracy, slowest': 'Précision maximale, le plus lent',
  Breadcrumb: 'Fil d’Ariane',
  'By file type': 'Par type de fichier',
  'By language': 'Par langue',
  'By use': 'Par usage',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'En utilisant {brand} ({domain}), vous acceptez ces conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser le service. Le service est exploité par **{name}**, {address}.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'contourner ou tenter de contourner les limites de débit ou la sécurité du site web ou de son compteur, ou perturber son fonctionnement ou son utilisation par d’autres visiteurs ;',
  'Can I edit the transcript?': 'Puis-je modifier la transcription ?',
  "Can't reach the server.": 'Impossible de joindre le serveur.',
  Cancel: 'Annuler',
  'Cancel "{title}"?': 'Annuler « {title} » ?',
  'Cancel {title}': 'Annuler {title}',
  'Cancellation requested': 'Annulation demandée',
  Cancelled: 'Annulé',
  'Cancelling…': 'Annulation…',
  'Cannot reach the server': 'Impossible de joindre le serveur',
  'Cannot reach the server.': 'Impossible de joindre le serveur.',
  'Cannot reach the server. Check your connection and try again.':
    'Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'Impossible de joindre le serveur. Assurez-vous qu’il est en marche (npm run dev) et réessayez.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'Modifiez ou supprimez une ligne, ou utilisez la recherche et le remplacement. Vos modifications figurent dans chaque téléchargement.',
  'Changed in {n} lines.': 'Modifié dans {n} lignes.',
  'Check Hinglish spelling': 'Vérifiez l’orthographe du hinglish',
  'Choose "Save as PDF" in the print dialog.':
    'Choisissez « Enregistrer au format PDF » dans la boîte de dialogue d’impression.',
  'Choose a file': 'Choisir un fichier',
  'Choose a file first': 'Choisissez d’abord un fichier',
  'Choose a format': 'Choisissez un format',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'Choisissez entre des modèles plus rapides et plus précis, selon votre appareil et le temps dont vous disposez.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'Choisissez Le plus rapide, Standard, Haute précision ou Précision maximale : « Le plus rapide » est le plus rapide, « Précision maximale » fait le moins d’erreurs.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'Choisissez la langue parlée ou laissez la détection automatique. Vous pouvez aussi traduire la parole en anglais.',
  'Chosen files': 'Fichiers choisis',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'Une voix claire près du microphone donne le meilleur résultat. Sous Plus d’options, **Améliorer l’audio** et **Ignorer les silences et la musique** sont activés par défaut : ils filtrent les grondements et le souffle et empêchent le modèle d’inventer du texte pendant la musique ou les longues pauses ; laissez-les donc activés pour les enregistrements bruyants. Pour les sous-titres, laissez aussi **Horodatage par mot** activé, afin que chaque ligne commence et se termine exactement avec les mots.',
  Close: 'Fermer',
  'Close menu': 'Fermer le menu',
  'Close: {title}': 'Fermer : {title}',
  'Common questions': 'Questions fréquentes',
  Contact: 'Contact',
  'Converting…': 'Conversion…',
  Copied: 'Copié',
  'Copy text': 'Copier le texte',
  'Copying…': 'Copie…',
  'Could not cancel the transcript.': 'Impossible d’annuler la transcription.',
  'Could not change transcript style.': 'Impossible de changer le style de la transcription.',
  'Could not copy': 'Impossible de copier',
  'Could not delete the transcript.': 'Impossible de supprimer la transcription.',
  'Could not delete your data.': 'Impossible de supprimer vos données.',
  'Could not load the text to copy.': 'Impossible de charger le texte à copier.',
  'Could not prepare the file. Please try again.':
    'Impossible de préparer le fichier. Veuillez réessayer.',
  'Could not rename the transcript.': 'Impossible de renommer la transcription.',
  'Could not save the change.': 'Impossible d’enregistrer la modification.',
  'Could not start': 'Impossible de démarrer',
  'Could not start.': 'Impossible de démarrer.',
  Dark: 'Sombre',
  Delete: 'Supprimer',
  'Delete "{title}" and its transcript?': 'Supprimer « {title} » et sa transcription ?',
  'Delete "{title}"? This cannot be undone.':
    'Supprimer « {title} » ? Cette action est irréversible.',
  'Delete {title}': 'Supprimer {title}',
  'Delete all your transcripts and the files kept in this browser now?':
    'Supprimer maintenant toutes vos transcriptions et tous les fichiers conservés dans ce navigateur ?',
  'Delete all your transcripts and uploaded files now?':
    'Supprimer maintenant toutes vos transcriptions et tous les fichiers envoyés ?',
  'Delete line': 'Supprimer la ligne',
  'Delete my data now': 'Supprimer mes données maintenant',
  'Delete this line from the transcript?': 'Supprimer cette ligne de la transcription ?',
  'Delete transcript': 'Supprimer la transcription',
  Deleted: 'Supprimé',
  'Detect automatically': 'Détecter automatiquement',
  'Dismiss message': 'Fermer le message',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 ne comprend que la parole en anglais. Choisissez un autre modèle pour traduire.',
  Done: 'Terminé',
  'Download failed': 'Échec du téléchargement',
  'Download started': 'Téléchargement démarré',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'Téléchargez le résultat en texte brut, en sous-titres SRT ou VTT, en Markdown ou en JSON.',
  'Download the transcript as': 'Télécharger la transcription au format',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'Téléchargement du modèle de reconnaissance (première fois seulement) : {loaded} sur {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'Déposez un fichier vidéo ou audio sur la [page d’accueil](/), ou enregistrez depuis votre microphone.',
  'Drop to add your file': 'Déposez pour ajouter votre fichier',
  'Drop your {noun} here, or choose a file': 'Déposez votre {noun} ici ou choisissez un fichier',
  'Each line with its time, like [00:12]': 'Chaque ligne avec son heure, comme [00:12]',
  Edit: 'Modifier',
  'Edit it right here': 'Modifiez-la ici même',
  'Edit this line': 'Modifier cette ligne',
  'Edited by you': 'Modifiée par vous',
  'English only, very fast and accurate': 'Anglais uniquement, très rapide et précis',
  'English translation is selected in More options.':
    'La traduction en anglais est sélectionnée dans Plus d’options.',
  'Enter saves · Esc cancels': 'Entrée enregistre · Échap annule',
  'Every line has a time. Play the media from any line to hear what was said.':
    'Chaque ligne a une heure. Lisez le média à partir de n’importe quelle ligne pour entendre ce qui a été dit.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'Chaque page fait le même travail : elle transforme la parole d’un fichier vidéo ou audio en texte avec un horodatage sur chaque ligne, dans plus de 50 langues, sans inscription. Choisissez celle qui correspond au fichier que vous avez ou à ce que vous voulez produire.',
  'Experimental: compare on your audio; chunk timestamps':
    'Expérimental : comparez sur votre audio ; horodatages par segment',
  'Experimental: larger model; chunk timestamps':
    'Expérimental : modèle plus grand ; horodatages par segment',
  Export: 'Exporter',
  Failed: 'Échec',
  FAQ: 'FAQ',
  Fast: 'Rapide',
  'Fast, clean audio': 'Rapide, audio net',
  Fastest: 'Le plus rapide',
  'Fastest, rough drafts only': 'Le plus rapide, brouillons seulement',
  'Fewer mistakes. Takes longer.': 'Moins d’erreurs. Prend plus de temps.',
  'Fewest mistakes. Takes the longest.': 'Le moins d’erreurs. Prend le plus de temps.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'Le fichier « {name} » fait {size} ; la limite est de {limit} - définissez VT_MAX_UPLOAD_MB pour la relever',
  'File "{name}" is {size}; the limit is {limit}.':
    'Le fichier « {name} » fait {size} ; la limite est de {limit}.',
  'file {n} of {total}': 'fichier {n} sur {total}',
  'File added': 'Fichier ajouté',
  'File limits.': 'Limites de fichier.',
  'File not added': 'Fichier non ajouté',
  'File skipped': 'Fichier ignoré',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'Les fichiers et les transcriptions n’existent que pendant votre session. Exportez ce dont vous avez besoin avant de partir. La seule chose que nous conservons est un total cumulé anonyme du nombre de fichiers transcrits sur le site (un seul nombre, affiché dans l’en-tête de la page) ; il n’est lié ni à vous, ni à vos fichiers, ni à votre session. Les détails figurent dans la [Politique de confidentialité](/privacy).',
  'Find it automatically': 'Le trouver automatiquement',
  'first time only, also downloads the {size} MB word-timing model':
    'première fois seulement, télécharge aussi le modèle d’horodatage par mot de {size} Mo',
  'First time only: downloads {size} (needs internet)':
    'Première fois seulement : télécharge {size} (connexion internet requise)',
  'Follow playback': 'Suivre la lecture',
  'Following playback': 'Suivi de la lecture',
  Footer: 'Pied de page',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'Pour une parole avec accent ou en plusieurs langues, essayez un réglage de qualité supérieur. Le score de confiance n’est pas un pourcentage d’exactitude.',
  'For developers: words, times, confidence': 'Pour les développeurs : mots, heures, confiance',
  'For notes apps': 'Pour les applications de notes',
  'For video players and editors': 'Pour les lecteurs vidéo et les logiciels de montage',
  'For YouTube and web video': 'Pour YouTube et la vidéo web',
  Free: 'Gratuit',
  'Free tools': 'Outils gratuits',
  'Free tools:': 'Outils gratuits :',
  'Free video and audio to text': 'Vidéo et audio en texte, gratuit',
  'Free video and audio to text, right in your browser':
    'Vidéo et audio en texte gratuitement, directement dans votre navigateur',
  'Free, unlimited, and no login needed': 'Gratuit, illimité et sans connexion',
  'Free, unlimited, no login': 'Gratuit, illimité, sans connexion',
  'Frequently asked questions': 'Questions fréquentes',
  'Get in touch': 'Nous contacter',
  'Getting the speech engine ready…': 'Préparation du moteur de reconnaissance…',
  'Give it a new name': 'Donnez-lui un nouveau nom',
  'Go to the home page': 'Aller à la page d’accueil',
  'Go to Video to text': 'Aller à Vidéo en texte',
  'Good balance (default)': 'Bon équilibre (par défaut)',
  'Good to know': 'Bon à savoir',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'L’outil de consentement de Google n’a pas pu être chargé, probablement parce qu’un bloqueur de publicités ou le réseau l’a arrêté. Sans lui, aucune publicité ni aucun cookie publicitaire n’est chargé.',
  Guides: 'Guides',
  'Guides: transcripts and subtitles': 'Guides : transcriptions et sous-titres',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'Une question, un bug à signaler ou une fonctionnalité à suggérer ? Écrivez à {email}. Chaque message est lu par la personne qui crée {brand}, et vous obtiendrez généralement une réponse sous quelques jours ouvrés.',
  'Helps spell uncommon words correctly.': 'Aide à bien orthographier les mots peu courants.',
  'High accuracy': 'Haute précision',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'Haute précision (Large v3 Turbo) n’a pas été entraîné à traduire et peut vous renvoyer la langue d’origine. Pour traduire, choisissez Standard ou Précision maximale.',
  'High accuracy, slower': 'Haute précision, plus lent',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'Une valeur plus élevée est un peu plus précise et plus lente. 5 est une bonne valeur par défaut.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'Hindi en lettres latines, avec les mots anglais conservés. Les autres langues gardent leur écriture d’origine. Vérifiez les mots et les noms peu familiers.',
  'Hinglish (Roman Hindi)': 'Hinglish (hindi romanisé)',
  'Hinglish conversion': 'Conversion en hinglish',
  History: 'Historique',
  Home: 'Accueil',
  'How {brand} works': 'Comment fonctionne {brand}',
  'How accurate is it?': 'Quelle est sa précision ?',
  'How do I get better accuracy?': 'Comment obtenir une meilleure précision ?',
  'How it stays free': 'Comment il reste gratuit',
  'How it works': 'Comment ça marche',
  'How long does it take?': 'Combien de temps cela prend-il ?',
  'How to transcribe a video to text': 'Comment transcrire une vidéo en texte',
  'How to turn a video or audio file into text with {brand}':
    'Comment transformer un fichier vidéo ou audio en texte avec {brand}',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'S’il y a bien de la parole, essayez Plus › Retranscrire avec la bonne langue.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'Si le service est occupé ou si trop de transcriptions sont déjà en cours, il vous demande d’attendre et explique pourquoi.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'Si nous modifions cette politique, la nouvelle version apparaît sur cette page avec une nouvelle date de « Dernière mise à jour ».',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'Dans l’EEE, au Royaume-Uni et en Suisse, ainsi que dans certains États américains, le message de consentement certifié de Google vous demande votre choix lorsque les publicités se chargent.',
  'IndicXlit (trained model)': 'IndicXlit (modèle entraîné)',
  'Is it really free and unlimited? Do I need to log in?':
    'Est-ce vraiment gratuit et illimité ? Dois-je me connecter ?',
  'Is my data private?': 'Mes données sont-elles privées ?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'Cela dépend de la qualité choisie, de la durée du fichier et de l’affluence du service. « Le plus rapide » est rapide ; « Précision maximale » prend le plus de temps mais fait le moins d’erreurs. La progression et le temps restant s’affichent en direct, et un fichier qui attend son tour affiche « En file d’attente ».',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'Cela dépend de votre appareil, de la qualité choisie et de la durée du fichier. Avec une puce graphique performante (WebGPU), c’est le plus rapide ; sinon le traitement s’effectue sur le processeur (WebAssembly), plus lent. « Le plus rapide » est rapide ; « Précision maximale » prend le plus de temps mais fait le moins d’erreurs. La progression et le temps restant s’affichent en direct.',
  'It is now called “{title}”.': 'Elle s’appelle désormais « {title} ».',
  'It may have been deleted.': 'Elle a peut-être été supprimée.',
  'It was stopped before any text was found.':
    'Elle a été arrêtée avant qu’aucun texte ne soit trouvé.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'Ses données ont été supprimées, y compris cette transcription. Les transcriptions ne sont conservées que pendant la session qui les a créées.',
  'Job not found': 'Tâche introuvable',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'à l’instant',
  'Just the words, in paragraphs': 'Seulement les mots, en paragraphes',
  'Keep reading': 'Pour aller plus loin',
  'Keep this page open until the upload is done.':
    'Gardez cette page ouverte jusqu’à la fin de l’envoi.',
  'Kept only for this session, then deleted automatically.':
    'Conservées uniquement pour cette session, puis supprimées automatiquement.',
  Language: 'Langue',
  'Larger or longer files are refused before they are processed, so split them first.':
    'Les fichiers plus volumineux ou plus longs sont refusés avant d’être traités : découpez-les d’abord.',
  'Last updated: {date}': 'Dernière mise à jour : {date}',
  'Licence text': 'Texte de la licence',
  Light: 'Clair',
  'Limits.': 'Limites.',
  'Line deleted': 'Ligne supprimée',
  'Live: the text appears here as it is recognised':
    'En direct : le texte apparaît ici au fur et à mesure de la reconnaissance',
  'Loading model… (first use downloads it)':
    'Chargement du modèle… (la première utilisation le télécharge)',
  'Loading…': 'Chargement…',
  'Long (56 letters)': 'Longue (56 caractères)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'Des réponses plus détaillées : formats, sous-titres, précision et confidentialité.',
  Main: 'Principal',
  'Make a new transcript of the same file. This one is kept.':
    'Créez une nouvelle transcription du même fichier. Celle-ci est conservée.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'Créez un fichier de sous-titres (SRT ou VTT) à partir de votre vidéo.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'Menu',
  Model: 'Modèle',
  More: 'Plus',
  'More answers: [Frequently asked questions](/faq)':
    'Plus de réponses : [Questions fréquentes](/faq)',
  'More free tools': 'Plus d’outils gratuits',
  'More options': 'Plus d’options',
  'More than 50 languages': 'Plus de 50 langues',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'Plus de 50 langues, dont l’anglais, l’espagnol, le français, l’allemand, le portugais, l’italien, le néerlandais, le russe, l’arabe, l’hindi, le chinois, le japonais et le coréen. Laissez la langue sur détection automatique ou choisissez-la vous-même. Vous pouvez aussi traduire la parole en anglais.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'La plupart des sites de transcription vous demandent de créer un compte, limitent les minutes gratuites, ajoutent des filigranes ou poussent à l’abonnement avant que vous ne voyiez la moindre ligne de texte. {brand} fait l’inverse. Tout ce qu’il propose est accessible à tous, et la page ne demande rien d’autre que votre fichier.',
  'Name not changed': 'Nom non modifié',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'Noms, marques et termes techniques présents dans l’audio, p. ex. Kubernetes, Dr Okafor',
  'Near-best accuracy, much faster than Large':
    'Précision quasi maximale, bien plus rapide que Large',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'nécessite la prise en charge des shaders 16 bits (shader-f16) dans le pilote graphique',
  'needs 4 GB': 'nécessite 4 Go',
  'needs 8 GB': 'nécessite 8 Go',
  'needs a graphics-capable browser (Chrome, Edge)':
    'nécessite un navigateur capable d’accélération graphique (Chrome, Edge)',
  'needs WebGPU': 'nécessite WebGPU',
  'Next match': 'Résultat suivant',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'Aucun compte et aucun suivi. Vos fichiers ne sont conservés que pendant votre session et sont supprimés automatiquement.',
  'no estimate for this model here': 'aucune estimation pour ce modèle ici',
  'No login': 'Sans connexion',
  'No matches': 'Aucun résultat',
  'No microphone': 'Aucun microphone',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'Sans inscription, sans paiement, sans limite quotidienne. Ajoutez simplement votre fichier.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'Aucune limite de taille ou de durée n’est annoncée par le serveur pour le moment. Les fichiers très volumineux prennent simplement plus de temps.',
  'No speech was found in this file.': 'Aucune parole n’a été trouvée dans ce fichier.',
  'No speech was transcribed.': 'Aucune parole n’a été transcrite.',
  'No speech was transcribed. Check the recording and the selected language.':
    'Aucune parole n’a été transcrite. Vérifiez l’enregistrement et la langue sélectionnée.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'Pas de WebGPU ici : les modèles s’exécutent sur un seul thread du processeur, donc les tailles plus grandes sont plus lentes que le temps réel.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'Aucun fichier d’une autre personne ne passe avant le vôtre. Si vous ajoutez plusieurs fichiers, ils sont transcrits l’un après l’autre dans votre onglet : gardez donc l’onglet ouvert jusqu’à la fin.',
  'None of those are video or audio files.':
    'Aucun de ces fichiers n’est une vidéo ni un fichier audio.',
  Normal: 'Normal',
  'not available for this size': 'indisponible pour cette taille',
  'not available in this browser': 'indisponible dans ce navigateur',
  'not available with Qwen (times are per chunk)':
    'indisponible avec Qwen (les horodatages sont par segment)',
  'Not cancelled': 'Non annulée',
  'Not deleted': 'Non supprimée',
  'Not renamed': 'Non renommée',
  'Not saved': 'Non enregistré',
  Note: 'Remarque',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'Rien ici pour l’instant. Les transcriptions que vous créez apparaissent ici pendant cette session.',
  'Nothing is saved. Export what you need.':
    'Rien n’est conservé. Exportez ce dont vous avez besoin.',
  'Nothing is uploaded until you press Transcribe.':
    'Rien n’est envoyé tant que vous n’appuyez pas sur Transcrire.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'Rien à souscrire, rien à payer. Ajoutez simplement votre fichier.',
  'Nothing was recorded.': 'Rien n’a été enregistré.',
  Off: 'Désactivé',
  On: 'Activé',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'Sur une parole claire dans une langue prise en charge, elle est généralement très précise, mais aucune reconnaissance vocale n’est parfaite. La précision dépend de la qualité de l’audio, des accents, du bruit de fond, des locuteurs qui se chevauchent, de la musique, ainsi que des noms rares ou du jargon. Chaque ligne a un score de confiance, et les lignes à faible confiance sont signalées pour que vous puissiez les vérifier en premier. Vérifiez toujours une transcription avant de vous y fier pour quoi que ce soit d’important.',
  'Open menu': 'Ouvrir le menu',
  'Opening your transcript…': 'Ouverture de votre transcription…',
  'or drop it anywhere on this page.': 'ou déposez-le n’importe où sur cette page.',
  'Original script': 'Écriture d’origine',
  Output: 'Sortie',
  'Page {page} of {pages}': 'Page {page} sur {pages}',
  'Page not found': 'Page introuvable',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'Des pages pour le fichier que vous avez déjà : WAV, M4A, WebM et MOV.',
  'PDF document (.pdf)': 'Document PDF (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'Le PDF est créé par votre navigateur : choisissez « Enregistrer au format PDF » dans la boîte de dialogue d’impression.',
  'Pick quality': 'Choisir la qualité',
  'Plain text (.txt)': 'Texte brut (.txt)',
  'Play from here': 'Lire à partir d’ici',
  'Playback speed': 'Vitesse de lecture',
  'Please add one file at a time here. You can add more files on the next page.':
    'Veuillez ajouter un seul fichier à la fois ici. Vous pourrez en ajouter d’autres sur la page suivante.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'Merci de ne pas nous envoyer d’enregistrements privés. {brand} transcrit vos fichiers sur votre propre appareil et nous ne les recevons jamais : nous n’en avons donc pas besoin pour vous aider.',
  'Please note': 'À noter',
  Preparing: 'Préparation',
  'Preparing audio…': 'Préparation de l’audio…',
  'Preparing the audio…': 'Préparation de l’audio…',
  'Preparing…': 'Préparation…',
  'Press a question to read its answer.': 'Appuyez sur une question pour lire sa réponse.',
  'Previous match': 'Résultat précédent',
  'Print to PDF': 'Imprimer en PDF',
  Privacy: 'Confidentialité',
  'Privacy and cookie settings': 'Paramètres de confidentialité et de cookies',
  'Privacy policy': 'Politique de confidentialité',
  'Privacy requests': 'Demandes relatives à la vie privée',
  Private: 'Privé',
  Progress: 'Progression',
  Quality: 'Qualité',
  'Questions about these terms:': 'Questions sur ces conditions :',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'Les questions, les rapports de bug et les idées sont toujours les bienvenus. Écrivez à {email}, ou consultez la page [Contact](/contact) pour savoir quoi inclure.',
  Queued: 'En file d’attente',
  'Quick results. Good for clear speech.': 'Résultats rapides. Idéal pour une parole claire.',
  Quickest: 'Le plus vite',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen utilise des horodatages approximatifs par segment. L’horodatage par mot et la confiance ne sont pas disponibles.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen utilise des horodatages par segment et ne fournit pas la confiance par mot. Comparez un court échantillon avant de le choisir.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (expérimental)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR nécessite un navigateur de bureau avec WebGPU (Chrome ou Edge) et la prise en charge des shaders 16 bits (shader-f16) dans le pilote graphique.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR nécessite un navigateur de bureau avec WebGPU (Chrome ou Edge) et 8 Go de mémoire.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR nécessite un navigateur de bureau avec WebGPU (Chrome ou Edge).',
  'Re-transcribe': 'Retranscrire',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'Lisez la transcription avec ses horodatages, repérez les mots dont le modèle n’était pas sûr et corrigez-les sur place.',
  'Read, edit, download': 'Lire, modifier, télécharger',
  Ready: 'Prêt',
  'Ready to print or share': 'Prêt à imprimer ou à partager',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'Prêt à essayer ? [Voir tous les outils gratuits](/tools) ou [transcrire un fichier maintenant](/).',
  'Recognition engine': 'Moteur de reconnaissance',
  Recommended: 'Recommandé',
  'Record from microphone': 'Enregistrer depuis le microphone',
  'Record straight from your microphone and turn it into text.':
    'Enregistrez directement depuis votre microphone et transformez-le en texte.',
  'Record with your microphone': 'Enregistrer avec le microphone',
  'Recording {stamp}': 'Enregistrement {stamp}',
  'Recording is not supported by this browser.':
    'Ce navigateur ne prend pas en charge l’enregistrement.',
  'Related reading': 'Lectures associées',
  Remove: 'Retirer',
  'Remove {name}': 'Retirer {name}',
  'Removes it for good': 'La supprime définitivement',
  Rename: 'Renommer',
  Renamed: 'Renommée',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    'Remplacer « {query} » par « {replacement} » dans {n} lignes ?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    'Remplacer « {query} » par « {replacement} » dans 1 ligne ?',
  'Replace in {n} lines': 'Remplacer dans {n} lignes',
  'Replace in 1 line': 'Remplacer dans 1 ligne',
  'Replace with': 'Remplacer par',
  'Replace with…': 'Remplacer par…',
  'Replace…': 'Remplacer…',
  Replaced: 'Remplacé',
  'Reporting a problem': 'Signaler un problème',
  'Retrying…': 'Nouvelle tentative…',
  'Review language and quality': 'Vérifier la langue et la qualité',
  'Review this transcript': 'Vérifier cette transcription',
  Save: 'Enregistrer',
  Saved: 'Enregistré',
  'Saving…': 'Enregistrement…',
  'Search depth: {n}': 'Profondeur de recherche : {n}',
  'Search the text': 'Rechercher dans le texte',
  'Search the transcript': 'Rechercher dans la transcription',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'Consultez aussi les [Conditions d’utilisation](/terms), [Comment ça marche](/how-it-works) et la [FAQ](/faq).',
  'Server busy': 'Serveur occupé',
  'Session only — nothing is saved.': 'Session uniquement — rien n’est conservé.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'Session uniquement — rien n’est conservé. Fermer l’application efface toutes les transcriptions. Exportez ce dont vous avez besoin.',
  'Session time left: about {n} min': 'Temps de session restant : environ {n} min',
  'Short (32 letters)': 'Courte (32 caractères)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'Des réponses courtes et pratiques pour transformer la parole en texte et en sous-titres : quel format de sous-titres choisir, comment ajouter des sous-titres à une vidéo, comment obtenir une transcription plus précise et comment la transcription peut s’exécuter dans votre propre navigateur sans envoyer votre fichier.',
  'Show all {count} languages': 'Afficher les {count} langues',
  'Six ways to download': 'Six façons de télécharger',
  'Skip to main content': 'Aller au contenu principal',
  Slower: 'Plus lent',
  'slower than real time on the measured laptop':
    'plus lent que le temps réel sur l’ordinateur portable mesuré',
  Slowest: 'Le plus lent',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'Certaines fonctionnalités téléchargent des composants open source dans votre navigateur lorsque vous les utilisez. Ils s’exécutent sur votre appareil comme le reste du moteur. Leurs licences nous demandent d’afficher ces mentions :',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'Certains passages demandent une écoute de vérification à cause d’un texte répété ou d’une limite de parole incertaine.',
  'Something went wrong': 'Une erreur s’est produite',
  'Something went wrong in this browser. Please try again.':
    'Une erreur s’est produite dans ce navigateur. Veuillez réessayer.',
  'Something went wrong while reading this file.':
    'Une erreur s’est produite pendant la lecture de ce fichier.',
  'Source code': 'Code source',
  Speed: 'Vitesse',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'Les vitesses sur téléphones et tablettes sont estimées, non mesurées ; Tiny et Base sont les tailles sûres.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT et VTT pour les sous-titres, TXT et Markdown pour la lecture, JSON pour les programmes, ou un PDF à imprimer.',
  Standard: 'Standard',
  'Standard (42 letters)': 'Standard (42 caractères)',
  Start: 'Démarrer',
  'Start a new transcription': 'Démarrer une nouvelle transcription',
  'Start again': 'Recommencer',
  'Started again': 'Redémarré',
  'Starting…': 'Démarrage…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'Une autre question ? Lisez les [questions fréquentes](/faq), voyez [comment ça marche](/how-it-works) ou [contactez-nous](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    'Toujours bloqué ? [Lisez Comment ça marche](/how-it-works)',
  'Stop recording · {time}': 'Arrêter l’enregistrement · {time}',
  'Stop this transcription? The text found so far is kept.':
    'Arrêter cette transcription ? Le texte trouvé jusqu’ici est conservé.',
  'Stopping the transcription worker. The text found so far is kept.':
    'Arrêt du processus de transcription. Le texte trouvé jusqu’ici est conservé.',
  'Stored on this device only, never uploaded.':
    'Stocké uniquement sur cet appareil, jamais envoyé.',
  'Style unchanged': 'Style inchangé',
  'Style updated': 'Style mis à jour',
  'Style updated using the saved recognition. Edited lines are kept.':
    'Style mis à jour à partir de la reconnaissance enregistrée. Les lignes modifiées sont conservées.',
  'Subtitle files': 'Fichiers de sous-titres',
  'Subtitle line length': 'Longueur des lignes de sous-titres',
  'Subtitles (.srt)': 'Sous-titres (.srt)',
  'Switch to dark theme': 'Passer au thème sombre',
  'Switch to light theme': 'Passer au thème clair',
  Terms: 'Conditions',
  'Terms of use': 'Conditions d’utilisation',
  'Text with times (.txt)': 'Texte avec horodatages (.txt)',
  'That file is already in the list.': 'Ce fichier figure déjà dans la liste.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'Ce n’est ni une vidéo ni un fichier audio. Choisissez un MP4, un MOV, un MP3 ou un autre fichier vidéo ou audio.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'Ce n’est ni une vidéo ni un fichier audio. Veuillez choisir un fichier vidéo ou audio.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'Ce n’est pas un fichier audio. Choisissez un MP3, un WAV, un M4A ou un autre fichier audio.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    'La [Politique de confidentialité](/privacy) explique ce qui est traité et pourquoi. Pour poser une question sur vos données ou exercer vos droits, écrivez à la même adresse.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'Le modèle {label} ne peut pas s’exécuter sur cet appareil : {reason}. Choisissez-en un autre.',
  'the exact error message, or a screenshot of it.':
    'le message d’erreur exact, ou une capture d’écran de celui-ci.',
  'The file is larger than the server accepts.':
    'Le fichier est plus volumineux que ce que le serveur accepte.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'La première fois que vous utilisez un niveau de qualité, votre navigateur télécharge son modèle de reconnaissance une seule fois et le conserve pour la suite : les fichiers suivants démarrent donc plus vite.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'La première fois que vous utilisez un niveau de qualité, votre navigateur télécharge le modèle de reconnaissance chez Hugging Face et les fichiers de programme du moteur chez jsDelivr, et les conserve pour la suite ; rien de votre fichier n’est envoyé avec eux. Lorsqu’une transcription se termine, votre navigateur ajoute un au compteur anonyme de l’en-tête de la page, et rien d’autre.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'Le pilote graphique ne gère pas les shaders 16 bits : les téléchargements sont plus volumineux et l’utilisation de la mémoire est plus élevée.',
  'The line was removed.': 'La ligne a été supprimée.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'Les outils principaux : transformez n’importe quel fichier vidéo ou audio en transcription horodatée.',
  'The page you are looking for does not exist or has moved.':
    'La page que vous cherchez n’existe pas ou a été déplacée.',
  'The recording failed. Please try again.': 'L’enregistrement a échoué. Veuillez réessayer.',
  'The server does not have enough free disk space for this file.':
    'Le serveur n’a pas assez d’espace disque libre pour ce fichier.',
  'The server is busy': 'Le serveur est occupé',
  'The server is busy right now.': 'Le serveur est occupé en ce moment.',
  'The service is busy right now. Please wait a moment and try again.':
    'Le service est occupé en ce moment. Veuillez patienter un instant et réessayer.',
  'The service is full right now. Please try again in a little while.':
    'Le service est saturé en ce moment. Veuillez réessayer dans un moment.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'La reconnaissance vocale s’exécute dans votre propre navigateur, avec des modèles de reconnaissance ouverts tels qu’OpenAI Whisper. Votre navigateur télécharge le modèle une fois et le conserve, puis fait tout le travail sur votre appareil. Votre vidéo ou votre audio ne nous est jamais envoyé, ce qui explique aussi qu’il n’y ait ni limite de taille de fichier ni file d’attente de fichiers d’autres personnes. La page [Comment ça marche](/how-it-works) explique chaque étape.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'La langue parlée n’a pas pu être identifiée avec certitude. Choisissez la langue que vous entendez et réessayez.',
  'The text found before it was stopped is shown below.':
    'Le texte trouvé avant l’arrêt est affiché ci-dessous.',
  'The text found so far is kept.': 'Le texte trouvé jusqu’ici est conservé.',
  'The text is ready to paste.': 'Le texte est prêt à être collé.',
  'The transcript finished before it could be cancelled.':
    'La transcription s’est terminée avant de pouvoir être annulée.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'La transcription s’exécute sur votre propre appareil avec des modèles de reconnaissance ouverts tels qu’OpenAI Whisper. Votre navigateur télécharge un modèle une fois et le conserve : le fichier suivant démarre donc plus vite, et votre vidéo ou votre audio n’est jamais envoyé nulle part.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'le type et la durée du fichier, par exemple « MP4, 25 minutes » ;',
  'There is no size or length limit set here.':
    'Aucune limite de taille ou de durée n’est définie ici.',
  'These details make a problem much quicker to find and fix:':
    'Ces précisions permettent de trouver et de corriger un problème bien plus vite :',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'Ces conditions sont régies par le droit indien. Les tribunaux de Bengaluru, Karnataka, Inde, ont compétence exclusive pour tout litige qui en découle. Cela ne vous retire aucune protection dont vous bénéficiez en vertu des lois impératives de protection des consommateurs du pays où vous vivez.',
  'They are downloaded again the next time you transcribe.':
    'Ils sont téléchargés de nouveau la prochaine fois que vous transcrivez.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Des fournisseurs tiers, dont Google, utilisent des cookies pour diffuser des publicités en fonction de vos visites précédentes sur ce site web ou sur d’autres sites web. L’utilisation de cookies publicitaires par Google lui permet, ainsi qu’à ses partenaires, de vous diffuser des publicités en fonction de votre visite sur ce site et/ou sur d’autres sites Internet.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'Cette zone accepte les fichiers audio tels que MP3, WAV ou M4A, mais celui-ci est une vidéo.',
  'This browser cannot record. Please choose a file instead.':
    'Ce navigateur ne peut pas enregistrer. Veuillez plutôt choisir un fichier.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'Ce navigateur n’indique pas la mémoire ; {gb} Go supposés. Choisissez un modèle plus petit si la page devient lente.',
  'This cannot be undone. Export anything you want to keep first.':
    'Cette action est irréversible. Exportez d’abord tout ce que vous voulez garder.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    'Cette copie de {brand} s’exécute sur votre propre ordinateur. Vos fichiers sont traités sur cette machine et rien n’en sort. Rien n’est conservé de façon permanente : les transcriptions n’existent que pendant cette session, exportez donc ce dont vous avez besoin. La [Politique de confidentialité](/privacy) décrit le site web hébergé.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'Cette copie s’exécute sur votre propre ordinateur. Vos fichiers sont traités sur cette machine et rien n’en sort.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Cet appareil dispose de peu de mémoire pour un fichier aussi long. Il est traité par petits morceaux, ce qui est plus lent ; un extrait plus court ou un modèle plus petit est plus sûr.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'Ce fichier nécessite un convertisseur de 9 Mo qui s’exécute dans votre navigateur. Le charger ?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'Ceci est une traduction fournie à titre indicatif. En cas de différence avec la version anglaise, la version anglaise prévaut.',
  'This local copy does not count transcriptions':
    'Cette copie locale ne compte pas les transcriptions',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'Cette transcription a une faible confiance du modèle. Écoutez l’enregistrement et vérifiez la langue parlée avant d’utiliser le texte.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'Cela prendra {wait} sur cet appareil (estimation). Gardez l’onglet ouvert jusqu’à la fin.',
  Timestamps: 'Horodatages',
  'Tips for the best results': 'Conseils pour de meilleurs résultats',
  'Tips for the best transcript': 'Conseils pour la meilleure transcription',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'Pour modifier vos choix en matière de publicités, utilisez [Paramètres des annonces Google](https://adssettings.google.com) ou les paramètres de cookies de votre navigateur.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'Pour modifier vos choix en matière de publicités, utilisez **Paramètres de confidentialité et de cookies** en bas d’une page qui affiche des publicités, [Paramètres des annonces Google](https://adssettings.google.com) ou les paramètres de cookies de votre navigateur.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'Pour vous fournir la transcription demandée sur votre propre appareil, diffuser le site web de manière sécurisée et maintenir le service gratuit grâce à la publicité. Lorsque la législation sur la protection des données, comme le RGPD, s’applique, nos bases juridiques sont la fourniture du service que vous avez demandé (art. 6, par. 1, point b), notre intérêt légitime pour la sécurité, la prévention des abus et le total cumulé anonyme (art. 6, par. 1, point f) et, pour les cookies publicitaires lorsque la loi l’exige, votre consentement (art. 6, par. 1, point a), que le message de consentement de Google demande.',
  'To keep it fast for everyone, each file has a size and length limit.':
    'Pour que le service reste rapide pour tout le monde, chaque fichier a une limite de taille et de durée.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'Dans la mesure permise par la loi, nous ne sommes pas responsables des pertes indirectes ou consécutives, de la perte de données, de bénéfices ou d’activité, ni de toute perte résultant de votre utilisation du service, de l’impossibilité de l’utiliser ou d’erreurs dans une transcription. Rien dans ces conditions ne limite une responsabilité qui ne peut pas être limitée par la loi.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'Pour transcrire sur votre appareil, votre navigateur télécharge les fichiers du modèle de reconnaissance chez Hugging Face (huggingface.co) et les fichiers de programme du moteur chez jsDelivr (cdn.jsdelivr.net), et les conserve dans son cache (Cache Storage) pour la suite, jusqu’à ce que vous les supprimiez. Ces fournisseurs reçoivent les données de requête habituelles (votre adresse IP, votre navigateur et le fichier demandé), jamais vos médias ni votre transcription.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'Pour fonctionner sur votre appareil, votre navigateur télécharge des modèles de reconnaissance chez Hugging Face et des fichiers de programme chez jsDelivr ; ils sont fournis sous leurs propres licences et conditions. Les publicités sont fournies par Google AdSense ; une publicité mène vers un site web tiers que nous ne contrôlons pas et dont nous ne sommes pas responsables.',
  Transcribe: 'Transcrire',
  'Transcribe (same language)': 'Transcrire (même langue)',
  'Transcribe {n} files': 'Transcrire {n} fichiers',
  'Transcribe a file': 'Transcrire un fichier',
  'Transcribe or translate speech in the language you need.':
    'Transcrivez ou traduisez la parole dans la langue dont vous avez besoin.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'Transcrivez des vidéos, des fichiers audio et des enregistrements vocaux dans plus de 50 langues, ou laissez la langue être détectée pour vous.',
  'Transcribing {n}%': 'Transcription {n} %',
  'Transcribing takes {time} on this device.': 'La transcription prend {time} sur cet appareil.',
  'Transcribing…': 'Transcription…',
  '{blurb} Not sure? Keep this one.': '{blurb} Un doute ? Gardez celui-ci.',
  '{reason} Retrying in {n} s…': '{reason} Nouvelle tentative dans {n} s…',
  'Alternatives': 'Alternatives aux autres services',
  'Checking the downloaded file…': 'Vérification du fichier téléchargé…',
  'Connection lost.': 'Connexion perdue.',
  'Continued after the page reloaded.': 'Reprise après le rechargement de la page.',
  'Continuing the download ({size} already saved)': 'Reprise du téléchargement ({size} déjà enregistrés)',
  'Downloaded: ready to start': 'Téléchargé : prêt à démarrer',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': 'Chaque langue dans son écriture : l’anglais en lettres latines, l’hindi en devanagari. Choisissez Hinglish pour écrire l’hindi en lettres latines.',
  'First time only: downloads {size}, now downloading in the background': 'Première fois seulement : télécharge {size}, en cours de téléchargement en arrière-plan',
  'Getting the model ready: {loaded} of {total}': 'Préparation du modèle : {loaded} sur {total}',
  'Good for most videos.': 'Convient à la plupart des vidéos.',
  'Honest, dated comparisons with other transcription services.': 'Comparatifs honnêtes et datés avec d’autres services de transcription.',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': 'Gardez cette page ouverte jusqu’à la fin. Si elle se recharge ou se ferme, l’opération reprend là où elle s’était arrêtée lorsque vous rouvrez le site.',
  'Length {time}': 'Durée {time}',
  'Opens in Word and Google Docs': 'S’ouvre dans Word et Google Docs',
  'Reconnecting…': 'Reconnexion…',
  'The download server is busy (HTTP {status}).': 'Le serveur de téléchargement est occupé (HTTP {status}).',
  'The download stalled.': 'Le téléchargement s’est bloqué.',
  'Time so far {time}': 'Temps écoulé {time}',
  'Translated to English': 'Traduit en anglais',
  'Waiting for the internet connection…': 'En attente de la connexion internet…',
  'Word document (.docx)': 'Document Word (.docx)',
  'Transcribed in {time}': 'Transcrit en {time}',
  Transcript: 'Transcription',
  'Transcript name': 'Nom de la transcription',
  'Transcript not found': 'Transcription introuvable',
  'Transcript ready': 'Transcription prête',
  'Transcript style': 'Style de la transcription',
  'Transcription failed': 'La transcription a échoué',
  'Transcription has started. The text appears below as it is recognised.':
    'La transcription a démarré. Le texte apparaît ci-dessous au fur et à mesure de la reconnaissance.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'La transcription a démarré. Vos autres fichiers se trouvent sous Transcriptions, en haut de la page.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'La transcription s’exécute sur votre appareil et utilise son processeur, sa puce graphique, sa mémoire et sa batterie. Nous n’imposons aucune limite de taille ou de durée de fichier, mais la vitesse d’exécution et la taille de fichier que votre navigateur peut gérer dépendent de votre appareil : un long fichier sur un téléphone ou un ordinateur plus lent peut prendre beaucoup de temps ou manquer de mémoire. Vos transcriptions et vos fichiers sont conservés dans ce navigateur et supprimés automatiquement après {idle} d’inactivité. Voir la [Politique de confidentialité](/privacy).',
  'Transcription settings': 'Paramètres de transcription',
  Transcripts: 'Transcriptions',
  'Transcripts {n}': 'Transcriptions {n}',
  'Transcripts are only kept for the browser session that created them.':
    'Les transcriptions ne sont conservées que pendant la session du navigateur qui les a créées.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'Les transcriptions sont produites automatiquement et contiendront des erreurs, surtout avec un audio bruyant, des accents marqués, des locuteurs qui se chevauchent, de la musique, des noms ou des termes techniques. Vérifiez toujours une transcription avant de vous y fier, en particulier pour un usage juridique, médical, financier ou publié. Le service est fourni « tel quel » et « selon disponibilité », sans aucune garantie, expresse ou implicite, y compris quant à l’exactitude, à l’exhaustivité ou à l’adéquation à un usage particulier.',
  'Translate to English': 'Traduire en anglais',
  'Try again': 'Réessayer',
  'Try another quality or language': 'Essayer une autre qualité ou une autre langue',
  'try to spread malware or anything meant to damage the service.':
    'tenter de diffuser des logiciels malveillants ou tout ce qui vise à endommager le service.',
  'Trying again in a moment…': 'Nouvelle tentative dans un instant…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'Nouvelle tentative. Cette page se charge d’elle-même dès que le serveur est de retour.',
  'under a minute': 'moins d’une minute',
  'Underline unsure words': 'Souligner les mots incertains',
  Unlimited: 'Illimité',
  'Unsure: worth listening to again': 'Incertain : à réécouter',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'Les rafales d’envois exceptionnellement fortes peuvent se voir demander d’attendre un peu.',
  'Up to {minutes} per file.': 'Jusqu’à {minutes} par fichier.',
  'Up to {size} and {minutes} minutes per file.':
    'Jusqu’à {size} et {minutes} minutes par fichier.',
  'Up to {size} and {minutes} per file.': 'Jusqu’à {size} et {minutes} par fichier.',
  'Up to {size} per file.': 'Jusqu’à {size} par fichier.',
  'Updated {date}': 'Mis à jour le {date}',
  'Upload complete': 'Envoi terminé',
  'Upload failed': 'Échec de l’envoi',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'Échec de l’envoi (erreur serveur {status}). Consultez le terminal qui exécute le serveur pour plus de détails.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'Échec de l’envoi (erreur serveur {status}). Veuillez réessayer dans un instant.',
  Uploading: 'Envoi',
  'Uploading…': 'Envoi en cours…',
  'use a computer for this size': 'utilisez un ordinateur pour cette taille',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'utiliser des scripts, des robots ou d’autres moyens automatisés contre le site web ou son compteur, ou envoyer de faux comptages, sans notre autorisation écrite ;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'utiliser le service pour un contenu illégal ou qui porte atteinte aux droits d’autrui ;',
  'use the service to harass, harm or deceive others;':
    'utiliser le service pour harceler, nuire à autrui ou le tromper ;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'Généralement très précis sur une parole claire. Les lignes dont il n’est pas sûr sont signalées, pour que vous puissiez les vérifier en premier.',
  'Video and audio to text': 'Vidéo et audio en texte',
  'Video or audio, several at once is fine.':
    'Vidéo ou audio, plusieurs à la fois, aucun problème.',
  'Video to text, accurately.': 'De la vidéo au texte, avec précision.',
  'Video to text: transcribe a video or audio file':
    'Vidéo en texte : transcrivez un fichier vidéo ou audio',
  'video transcribed': 'vidéo transcrite',
  'videos transcribed': 'vidéos transcrites',
  'Vocabulary hint': 'Indice de vocabulaire',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'Notes vocales, réunions, cours, podcasts et entretiens.',
  'Waiting for microphone permission…': 'En attente de l’autorisation du microphone…',
  'Waiting for the first words…': 'En attente des premiers mots…',
  'Waiting in line…': 'En file d’attente…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'Regardez le texte apparaître en direct, corrigez les erreurs, puis téléchargez-le en SRT, VTT, TXT, Markdown, JSON ou PDF.',
  'We do not ask for your name, e-mail address or any other account details.':
    'Nous ne demandons ni votre nom, ni votre adresse e-mail, ni aucune autre information de compte.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'Nous ne promettons pas que le service sera toujours disponible, ininterrompu ou sans erreur. Le site web, ou les téléchargements dont il a besoin (les modèles de reconnaissance de Hugging Face et les fichiers de programme de jsDelivr), peuvent être indisponibles pour maintenance ou pour des raisons indépendantes de notre volonté, et certains navigateurs ou appareils ne peuvent pas exécuter tous les modèles. Comme vos transcriptions ne sont conservées que dans ce navigateur et supprimées après une période d’inactivité, exportez toujours ce dont vous avez besoin.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'Nous ne vendons pas vos données. Nous ne détenons aucun de vos fichiers ni aucune de vos transcriptions, nous n’en avons donc aucune à partager : la reconnaissance s’exécute sur votre appareil, et non sur un service externe de transcription ou d’IA. Google (publicité), Cloudflare (hébergement et compteur), Hugging Face et jsDelivr (téléchargements) ne reçoivent que ce qui est décrit ci-dessus. Nous pouvons divulguer des informations si la loi l’exige.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'Nous ne conservons rien de vous de notre côté : hormis le total cumulé unique, rien concernant votre utilisation n’est stocké par nous.',
  'We may block access if these rules are broken.':
    'Nous pouvons bloquer l’accès si ces règles ne sont pas respectées.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'Nous pouvons mettre à jour ces conditions. La nouvelle version apparaît sur cette page avec une nouvelle date de « Dernière mise à jour » et s’applique à partir de ce moment.',
  'We never send your file, your transcript or any personal information to Google.':
    'Nous n’envoyons jamais votre fichier, votre transcription ou une quelconque information personnelle à Google.',
  'Web subtitles (.vtt)': 'Sous-titres web (.vtt)',
  'What people use it for': 'À quoi cela sert',
  'What you can do with it': 'Ce que vous pouvez en faire',
  'What you get': 'Ce que vous obtenez',
  'what you were doing, and what happened instead of what you expected;':
    'ce que vous faisiez, et ce qui s’est passé au lieu de ce que vous attendiez ;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'L’endroit où vos fichiers sont traités dépend de la façon dont {brand} est exploité, et le serveur n’a pas répondu à l’instant. Voir la [Politique de confidentialité](/privacy).',
  'Where your files are processed depends on how {brand} is run.':
    'L’endroit où vos fichiers sont traités dépend de la façon dont {brand} est exploité.',
  'Which files can I use, and what are the limits?':
    'Quels fichiers puis-je utiliser, et quelles sont les limites ?',
  'Which languages are supported?': 'Quelles langues sont prises en charge ?',
  'Who builds it': 'Qui le conçoit',
  'Who runs this website': 'Qui exploite ce site web',
  'Why it exists': 'Pourquoi il existe',
  'Working…': 'Traitement en cours…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'Oui. C’est gratuit, et il n’y a ni compte ni connexion, jamais. Il n’y a ni quota quotidien ou mensuel, ni accès payant ; les publicités maintiennent le site gratuit.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'Oui. C’est gratuit, et il n’y a ni compte ni connexion, jamais. Il n’y a ni quota quotidien ou mensuel, ni accès payant.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'Oui. C’est gratuit, sans inscription ni connexion. Cette copie s’exécute sur votre propre ordinateur : il n’y a donc ni quota ni accès payant ; la vitesse dépend de votre ordinateur.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'Oui. Utilisez le crayon à côté d’une ligne pour modifier son texte ou supprimer la ligne, ou utilisez la recherche et le remplacement sur toute la transcription. Vos modifications sont incluses dans chaque export.',
  'You agree not to:': 'Vous vous engagez à ne pas :',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'Vous gardez le contrôle : supprimez à tout moment vos transcriptions, vos fichiers et, si vous le souhaitez, les modèles de reconnaissance téléchargés avec **Supprimer mes données maintenant**. Cela supprime uniquement les données de ce navigateur ; cela ne peut pas supprimer les cookies de Google.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'Vous pouvez le modifier à tout moment avec **Paramètres de confidentialité et de cookies** en bas de toute page qui affiche des publicités (par exemple la page d’accueil).',
  'You can now read, fix and download it.':
    'Vous pouvez maintenant la lire, la corriger et la télécharger.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'Vous pouvez cesser d’utiliser le service à tout moment et supprimer les données de ce navigateur avec **Supprimer mes données maintenant**. Nous pouvons suspendre ou mettre fin à votre accès à tout moment, notamment si vous ne respectez pas ces conditions.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'Vous conservez tous les droits sur les fichiers que vous ajoutez et sur les transcriptions qui en sont issues. Ils sont traités sur votre appareil et nous ne les recevons jamais. Vous êtes responsable de ce que vous transcrivez : n’utilisez que des contenus qui vous appartiennent ou que vous avez le droit de traiter, y compris toute autorisation nécessaire de la part des personnes qui y parlent.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'Vous pouvez refuser la publicité personnalisée en consultant [Paramètres des annonces Google](https://adssettings.google.com), ou refuser l’utilisation de cookies par certains fournisseurs tiers pour la publicité personnalisée sur [www.aboutads.info](https://www.aboutads.info). Découvrez [comment Google utilise les informations provenant des sites qui utilisent ses services](https://policies.google.com/technologies/partner-sites).',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'votre navigateur et sa version, ainsi que votre appareil (ordinateur ou téléphone, et son système d’exploitation) ;',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'Votre navigateur a bloqué la copie ici. Utilisez Exporter pour enregistrer le texte à la place.',
  'Your change is saved.': 'Votre modification est enregistrée.',
  'Your change is still in its box: press Save to try again.':
    'Votre modification est toujours dans sa zone : appuyez sur Enregistrer pour réessayer.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'Votre fichier est envoyé au serveur via une connexion chiffrée, transcrit avec des modèles de reconnaissance ouverts tels qu’OpenAI Whisper, puis supprimé automatiquement. La page [Comment ça marche](/how-it-works) explique chaque étape.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'Votre fichier est transcrit dans votre navigateur, sur votre propre appareil : nous n’imposons donc aucune limite de taille ou de durée. Les fichiers très volumineux ou longs fonctionnent aussi : ils prennent plus de temps et demandent assez de mémoire libre, et la page vous avertit lorsque votre appareil risque d’être lent.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'Votre fichier est transcrit avec des modèles de reconnaissance ouverts tels qu’OpenAI Whisper, puis supprimé automatiquement.',
  'Your file never leaves your device.': 'Votre fichier ne quitte jamais votre appareil.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'Votre fichier ne quitte jamais votre appareil. [Confidentialité](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'Votre fichier ne quitte jamais votre appareil. Il est transcrit dans votre navigateur, sur cet appareil, et n’est jamais envoyé ni à nous ni à personne d’autre. Les transcriptions, vos modifications et le fichier sont conservés uniquement dans le stockage de ce navigateur et supprimés automatiquement après {idle} d’inactivité, ou immédiatement lorsque vous appuyez sur **Supprimer mes données maintenant** dans le menu Transcriptions. Il n’y a aucun compte. Exportez ce dont vous avez besoin avant de partir.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'Votre fichier ne quitte jamais votre appareil. Il est transcrit directement dans votre navigateur, sans compte, et vos transcriptions restent dans ce navigateur.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'Votre fichier reste sur cet appareil. Gardez cet onglet ouvert pendant la transcription.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Vos fichiers et transcriptions ne sont conservés que pendant cette session et sont supprimés automatiquement après {idle} d’inactivité, ou lorsque vous appuyez sur « Supprimer mes données maintenant ». Aucun compte, aucun suivi, un seul cookie de session essentiel. Exportez ce dont vous avez besoin avant de partir.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Vos fichiers et transcriptions ne sont conservés que pendant cette session et sont supprimés automatiquement à sa fin, ou lorsque vous appuyez sur « Supprimer mes données maintenant ». Aucun compte, aucun suivi, un seul cookie de session essentiel. Exportez ce dont vous avez besoin avant de partir.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'Vos fichiers sont supprimés automatiquement. [Confidentialité](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'Vos fichiers sont traités dans votre navigateur et restent sur votre appareil. Le site web, les téléchargements et le compteur utilisent des connexions chiffrées (HTTPS). Toute personne pouvant utiliser ce profil de navigateur peut voir les transcriptions qui y sont stockées jusqu’à leur suppression : appuyez donc sur **Supprimer mes données maintenant** sur un ordinateur partagé.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Vos fichiers sont envoyés à notre serveur pour y être traités. Ils ne sont conservés que pendant votre session et sont supprimés automatiquement à sa fin, après {idle} d’inactivité, ou immédiatement lorsque vous appuyez sur **Supprimer mes données maintenant** dans le menu Transcriptions. Il n’y a ni compte ni suivi, et le seul cookie est un cookie de session essentiel (aucun cookie d’analyse ou de publicité).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Vos fichiers sont envoyés à notre serveur pour y être traités. Ils ne sont conservés que pendant votre session et sont supprimés automatiquement à sa fin, ou immédiatement lorsque vous appuyez sur **Supprimer mes données maintenant** dans le menu Transcriptions. Il n’y a ni compte ni suivi, et le seul cookie est un cookie de session essentiel (aucun cookie d’analyse ou de publicité).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'Vos fichiers ne quittent jamais cet appareil. Les transcriptions sont conservées uniquement dans ce navigateur et supprimées automatiquement après {idle} d’inactivité, ou lorsque vous appuyez sur « Supprimer mes données maintenant ». Exportez ce dont vous avez besoin avant de partir.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'Vos fichiers ne quittent jamais cet appareil. Les transcriptions sont conservées uniquement dans ce navigateur et supprimées automatiquement à la fin de la session, ou lorsque vous appuyez sur « Supprimer mes données maintenant ». Exportez ce dont vous avez besoin avant de partir.',
  'Your session ends in {mins} min. Export what you need.':
    'Votre session se termine dans {mins} min. Exportez ce dont vous avez besoin.',
  'Your session has ended': 'Votre session est terminée',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'Votre session est terminée et ses données ont été supprimées. Vous pouvez démarrer une nouvelle transcription.',
  'Your transcript is ready below.': 'Votre transcription est prête ci-dessous.',
  'Your transcripts': 'Vos transcriptions',
  'Your transcripts and files were removed from the server.':
    'Vos transcriptions et vos fichiers ont été supprimés du serveur.',
  'Your transcripts and files were removed from this device.':
    'Vos transcriptions et vos fichiers ont été supprimés de cet appareil.',
  'title:/': 'Vidéo et audio en texte, gratuit',
  'description:/':
    'Transcrivez gratuitement une vidéo ou un audio en texte. Sans connexion ni limite quotidienne, plus de 50 langues. Export SRT, VTT, TXT ou PDF.',
  'title:/how-it-works': 'Comment ça marche',
  'description:/how-it-works':
    'Comment TranscribeVid transforme la vidéo et l’audio en texte horodaté en trois étapes : ce que vous obtenez et nos conseils pour de meilleurs résultats.',
  'title:/faq': 'Questions fréquentes',
  'description:/faq':
    'Réponses aux questions courantes sur TranscribeVid : précision, langues, fichiers pris en charge et limites, vitesse, confidentialité et modification du texte.',
  'title:/about': 'À propos de TranscribeVid',
  'description:/about':
    'Qui conçoit TranscribeVid et pourquoi : un outil gratuit de vidéo et d’audio en texte, sans inscription ni connexion, financé par la publicité.',
  'title:/contact': 'Contact',
  'description:/contact':
    'Comment joindre TranscribeVid : e-mail pour vos questions, bugs, idées de fonctionnalités et demandes liées à la vie privée, et qui exploite le site web.',
  'title:/privacy': 'Politique de confidentialité',
  'description:/privacy':
    'Ce que TranscribeVid traite quand vous transcrivez un fichier, où et pourquoi, la durée de conservation, les cookies, la publicité et vos droits.',
  'title:/terms': 'Conditions d’utilisation',
  'description:/terms':
    'Les règles d’utilisation de TranscribeVid : service gratuit, votre contenu, usage acceptable, aucune garantie d’exactitude et responsabilité.',
  'title:/tools': 'Tous les outils gratuits',
  'description:/tools':
    'Tous les outils gratuits de vidéo et d’audio en texte : par type de fichier, par usage, sous-titres et langues. Sans connexion, plus de 50 langues.',
  'title:/guides': 'Guides',
  'description:/guides':
    'Guides pratiques sur les transcriptions et les sous-titres : SRT ou VTT, ajouter des sous-titres à une vidéo, transcription précise et confidentialité.',
  'title:/video-to-text': 'Convertir une vidéo en texte, gratuit',
  'description:/video-to-text':
    'Convertissez une vidéo en texte gratuitement : transcription précise et horodatée en plus de 50 langues, sans connexion. Export SRT, VTT, TXT ou PDF.',
  'label:/video-to-text': 'Vidéo en texte',
  'title:/audio-to-text': 'Audio en texte gratuit et illimité',
  'description:/audio-to-text':
    'Transformez podcasts, entretiens et cours en texte. Audio en texte gratuit avec horodatages, plus de 50 langues, sans connexion. Export TXT, SRT, VTT ou PDF.',
  'label:/audio-to-text': 'Audio en texte',
  'title:/mp4-to-text': 'MP4 en texte : transcrire une vidéo MP4',
  'description:/mp4-to-text':
    'Convertissez une vidéo MP4 en texte horodaté. Gratuit, sans connexion ni limite, plus de 50 langues. Export TXT, SRT, VTT, Markdown, JSON ou PDF.',
  'label:/mp4-to-text': 'MP4 en texte',
  'title:/mp3-to-text': 'MP3 en texte : transcription gratuite',
  'description:/mp3-to-text':
    'Transcrivez un MP3 en texte en ligne, gratuitement. Sans connexion, plus de 50 langues, horodatage à chaque ligne. Export TXT, SRT, VTT ou PDF.',
  'label:/mp3-to-text': 'MP3 en texte',
  'title:/srt-subtitle-generator': 'Générateur de sous-titres SRT gratuit',
  'description:/srt-subtitle-generator':
    'Générez gratuitement un fichier de sous-titres SRT à partir d’une vidéo ou d’un audio. Calé sur la parole, plus de 50 langues, sans connexion.',
  'label:/srt-subtitle-generator': 'Générateur de sous-titres SRT',
  'title:/voice-recording-to-text': 'Enregistrement vocal en texte, gratuit',
  'description:/voice-recording-to-text':
    'Enregistrez votre voix dans le navigateur ou ajoutez un mémo vocal : obtenez le texte. Gratuit, sans connexion, plus de 50 langues. Export TXT, PDF, SRT.',
  'label:/voice-recording-to-text': 'Enregistrement vocal en texte',
  'title:/wav-to-text': 'WAV en texte : transcription en ligne',
  'description:/wav-to-text':
    'Convertissez un fichier WAV en texte gratuitement, même de longs enregistrements. Plus de 50 langues, horodatages, sans connexion. Export TXT, SRT, PDF.',
  'label:/wav-to-text': 'WAV en texte',
  'title:/m4a-to-text': 'M4A en texte : mémos vocaux gratuits',
  'description:/m4a-to-text':
    'Transformez un mémo vocal ou un fichier M4A en texte, gratuitement. Compatible avec les mémos vocaux de l’iPhone, sans connexion, plus de 50 langues.',
  'label:/m4a-to-text': 'M4A en texte',
  'title:/webm-to-text': 'WebM en texte : transcription gratuite',
  'description:/webm-to-text':
    'Convertissez une vidéo ou un audio WebM en texte, gratuitement. Idéal pour les enregistrements d’écran et de navigateur, plus de 50 langues, horodatages.',
  'label:/webm-to-text': 'WebM en texte',
  'title:/mov-to-text': 'MOV en texte : vidéos iPhone gratuites',
  'description:/mov-to-text':
    'Transcrivez gratuitement une vidéo MOV de votre iPhone ou de QuickTime. Sans connexion, plus de 50 langues, horodatage à chaque ligne. Export TXT, SRT, VTT.',
  'label:/mov-to-text': 'MOV en texte',
  'title:/whatsapp-voice-message-to-text': 'Message vocal WhatsApp en texte, gratuit',
  'description:/whatsapp-voice-message-to-text':
    'Transformez un message vocal WhatsApp en texte, gratuitement. Enregistrez la note vocale, déposez-la ici, lisez-la en plus de 50 langues. Sans connexion.',
  'label:/whatsapp-voice-message-to-text': 'Message vocal WhatsApp en texte',
  'title:/meeting-recording-to-text': 'Enregistrement Zoom, Teams, Meet en texte',
  'description:/meeting-recording-to-text':
    'Transformez un enregistrement Zoom, Teams ou Google Meet en transcription horodatée et consultable, gratuitement. Sans connexion, plus de 50 langues.',
  'label:/meeting-recording-to-text': 'Enregistrement de réunion en texte',
  'title:/lecture-to-text': 'Cours en texte : transcrire un cours',
  'description:/lecture-to-text':
    'Transformez un cours enregistré en notes consultables pour réviser. Gratuit, sans connexion, plus de 50 langues, horodatages. Export TXT, Markdown, SRT, PDF.',
  'label:/lecture-to-text': 'Cours en texte',
  'title:/podcast-transcript-generator': 'Transcription de podcast gratuite',
  'description:/podcast-transcript-generator':
    'Générez gratuitement la transcription d’un podcast à partir d’un MP3 ou d’un WAV. Horodatages, plus de 50 langues, sans connexion. Export TXT, SRT, VTT, PDF.',
  'label:/podcast-transcript-generator': 'Transcription de podcast',
  'title:/interview-transcription': 'Transcription d’entretiens, privée',
  'description:/interview-transcription':
    'Transcrivez gratuitement des entretiens, sans compte. Texte horodaté dans plus de 50 langues, pensé pour la recherche et le journalisme. Export TXT ou PDF.',
  'label:/interview-transcription': 'Transcription d’entretiens',
  'title:/vtt-subtitle-generator': 'Générateur de sous-titres VTT gratuit',
  'description:/vtt-subtitle-generator':
    'Générez gratuitement un fichier de sous-titres WebVTT (.vtt) à partir d’une vidéo ou d’un audio. Calé sur la parole, plus de 50 langues, sans connexion.',
  'label:/vtt-subtitle-generator': 'Générateur de sous-titres VTT',
  'title:/youtube-subtitle-generator': 'Sous-titres YouTube : fichier SRT gratuit',
  'description:/youtube-subtitle-generator':
    'Créez un fichier de sous-titres SRT pour votre propre vidéo YouTube, gratuitement et sans connexion. Plus de 50 langues. À importer dans YouTube Studio.',
  'label:/youtube-subtitle-generator': 'Générateur de sous-titres YouTube',
  'title:/translate-audio-to-english': 'Traduire un audio en anglais, gratuit',
  'description:/translate-audio-to-english':
    'Transformez la parole d’une autre langue en texte anglais, gratuitement. Ajoutez un fichier, obtenez un texte ou des sous-titres anglais horodatés.',
  'label:/translate-audio-to-english': 'Traduire un audio en anglais',
  'title:/guides/srt-vs-vtt': 'SRT ou VTT : quel format de sous-titres ?',
  'description:/guides/srt-vs-vtt':
    'SRT ou VTT ? Ce qu’est chaque format de sous-titres, leurs différences, où chacun fonctionne et comment obtenir l’un ou l’autre gratuitement.',
  'label:/guides/srt-vs-vtt': 'SRT ou VTT',
  'title:/guides/how-to-add-subtitles-to-a-video': 'Ajouter des sous-titres à une vidéo',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'Créez des sous-titres en quatre étapes : transcrivez, corrigez, exportez en SRT ou VTT, puis ajoutez le fichier à YouTube, VLC ou votre lecteur web.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'Comment ajouter des sous-titres à une vidéo',
  'title:/guides/transcribe-video-without-uploading': 'Transcrire une vidéo sans l’envoyer',
  'description:/guides/transcribe-video-without-uploading':
    'Comment fonctionne la transcription dans le navigateur, ce qui reste sur votre appareil, ce qui est téléchargé une fois, et comment le vérifier vous-même.',
  'label:/guides/transcribe-video-without-uploading': 'Transcrire une vidéo sans l’envoyer',
  'title:/guides/accurate-transcripts': 'Obtenir une transcription plus précise',
  'description:/guides/accurate-transcripts':
    'Des moyens concrets d’améliorer la précision : audio plus net, bonne langue et bon modèle, indice de vocabulaire, et comment vérifier et corriger le résultat.',
  'label:/guides/accurate-transcripts': 'Comment obtenir une transcription plus précise',
  'title:/guides/what-is-whisper': 'Qu’est-ce que Whisper ? Explications',
  'description:/guides/what-is-whisper':
    'Ce qu’est OpenAI Whisper, sur quoi il a été entraîné, sa précision, ses limites, et comment il s’exécute dans votre navigateur sur TranscribeVid.',
  'label:/guides/what-is-whisper': 'Qu’est-ce que Whisper ?',
  'an independent software developer': 'un développeur de logiciels indépendant',
  'Bengaluru, India': 'Bengaluru, Inde',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    'Cette page a été traduite avec l’IA. [Une erreur ? Dites-le-nous.](/contact)',
  'A finished transcript: a media player next to the text in short lines, each with a timestamp.':
    'Une transcription terminée : un lecteur à côté du texte en lignes courtes, chacune avec son horodatage.',
  'A finished transcript. Every line has a timestamp, and Export saves it as SRT, VTT, TXT, PDF and more.':
    'Une transcription terminée. Chaque ligne a son horodatage, et Exporter l’enregistre en SRT, VTT, TXT, PDF et plus.',
  '**Visit statistics.** Cloudflare Web Analytics counts visits to our pages: which page was opened, which site you came from, your country, your browser and device type, and how fast the page loaded. Cloudflare says it sets no cookies, keeps no identifier on your device and does not use the data to follow you from one website to another.':
    '**Statistiques de visite.** Cloudflare Web Analytics compte les visites de nos pages : quelle page a été ouverte, de quel site vous venez, votre pays, votre navigateur et votre type d’appareil, et la rapidité de chargement de la page. Cloudflare indique ne déposer aucun cookie, ne conserver aucun identifiant sur votre appareil et ne pas utiliser les données pour vous suivre d’un site web à l’autre.',
};
export default dict;
