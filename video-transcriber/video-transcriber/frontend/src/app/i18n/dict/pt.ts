/** Portuguese (Brazilian) dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '"{name}" is {size}; the limit is {limit}.': '“{name}” tem {size}; o limite é {limit}.',
  '"{name}" is empty.': '“{name}” está vazio.',
  '"{name}" is ready. Press Transcribe to start.':
    '“{name}” está pronto. Clique em Transcrever para começar.',
  '“{title}” was deleted.': '“{title}” foi apagado.',
  '(optional)': '(opcional)',
  '{base} Word timing: {timing}.': '{base} Tempo por palavra: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) é operado por **{name}**, {address} (“nós”). Nós decidimos como e por que seus dados são processados, conforme descrito aqui.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) é administrado por **{name}**, {address}. Saiba mais na página [Sobre](/about).',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} é um serviço para o público em geral e não é direcionado a crianças menores de 13 anos (ou menores de 16 anos na UE, quando aplicável).',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} foi criado e é mantido por **{name}**, {role}, com base em {city}. Eu o criei para oferecer às pessoas a melhor experiência de transcrição possível: fluida desde o primeiro clique, sem precisar criar uma conta e com uma interface limpa que não atrapalha.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} é voltado ao público em geral e não é direcionado a crianças menores de 13 anos.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages) and beside a finished transcript. No ad is shown while a file is being transcribed, and never on the privacy, terms or logs pages.':
    '{brand} é gratuito porque exibe anúncios, veiculados pelo Google AdSense. Os anúncios aparecem apenas nas páginas informativas (início, Como funciona, Perguntas frequentes e as páginas das ferramentas) e ao lado de uma transcrição concluída. Nenhum anúncio é exibido enquanto um arquivo está sendo transcrito, e nunca nas páginas de privacidade, termos ou registros.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    'O uso de {brand} é gratuito. A [Política de privacidade](/privacy) explica o que acontece com seus arquivos.',
  '{brand} is funded by ads shown on its information pages and beside finished transcripts (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} é financiado por anúncios exibidos nas páginas informativas e ao lado das transcrições concluídas (Google AdSense). Como o seu próprio dispositivo faz a transcrição, não há custo de servidor por arquivo, e é isso que mantém o serviço gratuito e ilimitado. A [Política de privacidade](/privacy) explica o que os anúncios usam e como escolher suas configurações.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} transforma a fala de um arquivo de vídeo ou áudio em texto com marcas de tempo, em três passos simples.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} transforma a fala de vídeos, arquivos de áudio e gravações de voz em texto preciso, com marcas de tempo. É gratuito, não há limite de arquivos que você pode transcrever e você não precisa de conta: escolha um arquivo acima, clique em Transcrever e leia o resultado.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages and beside finished transcripts (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} transforma arquivos de vídeo e áudio em texto direto no seu navegador: o reconhecimento é executado no seu dispositivo e seus arquivos não são enviados para nós. O uso é gratuito e não exige conta. O serviço é financiado por anúncios nas páginas informativas e ao lado das transcrições concluídas (Google AdSense; veja a [Política de privacidade](/privacy)). Podemos alterar, limitar ou encerrar recursos a qualquer momento.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} transforma vídeo e áudio em texto preciso, com marcas de tempo, de graça. Sem cadastro, sem login e sem marca d’água: abra a página, escolha um arquivo e leia sua transcrição.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies.':
    '{brand} transforma vídeo e áudio em texto direto no seu navegador. Esta página explica, em palavras simples, o que isso significa para os seus dados. Em resumo: seu arquivo nunca sai do seu dispositivo. Suas transcrições ficam guardadas apenas neste navegador, não há conta e o site não define cookies próprios. Os anúncios aparecem apenas nas páginas informativas e ao lado das transcrições concluídas, e são veiculados pelo Google, que usa cookies.',
  '{done} of {total}': '{done} de {total}',
  '{duration} (estimate)': '{duration} (estimativa)',
  '{gb} GB of memory recommended': '{gb} GB de memória recomendados',
  '{h} h': '{h} h',
  '{h} h {m} min': '{h} h {m} min',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (o primeiro uso baixa {size} MB)',
  "{label}, as reported by visitors' browsers":
    '{label}, conforme informado pelos navegadores dos visitantes',
  '{label}: common questions': '{label}: perguntas frequentes',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. Procure o arquivo na pasta de downloads.',
  '{language} → English': '{language} → inglês',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {done} de {total} arquivo(s) já estavam na fila; os outros {left} continuam na lista. Clique em Transcrever para tentar de novo.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {done} de {total} arquivo(s) já estavam na fila; {left} continua na lista. Clique em Transcrever para tentar de novo.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} roda mais devagar que o tempo real neste dispositivo: {wait} para {audio} de áudio (estimativa). Os modelos Tiny ou Base terminam antes.',
  '{n} files were skipped: not video or audio.':
    '{n} arquivos foram ignorados: não são vídeo nem áudio.',
  '{n} h ago': 'há {n} h',
  '{n} min': '{n} min',
  '{n} min ago': 'há {n} min',
  '{n} min left': 'faltam {n} min',
  '{n} min read': '{n} min de leitura',
  '{n} minute': '{n} minuto',
  '{n} minutes': '{n} minutos',
  '{n} of {total}': '{n} de {total}',
  '{n} of those files are already in the list.': '{n} desses arquivos já estão na lista.',
  '{n} video transcribed': '{n} vídeo transcrito',
  '{n} videos transcribed': '{n} vídeos transcritos',
  '{n} words': '{n} palavras',
  '{n}% done': '{n}% concluído',
  '{n}% model confidence': '{n}% de confiança do modelo',
  '{n}s left': 'faltam {n} s',
  '{name} home': 'Página inicial de {name}',
  '{size} download': 'download de {size}',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} Indisponível neste dispositivo: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**Um registro técnico nesta aba.** A página Registros mostra o registro técnico desta própria aba. Ele fica no seu navegador e nunca é enviado a lugar nenhum.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**Adicione uma dica de vocabulário**: nomes, marcas e jargões que aparecem no áudio, escritos do jeito que você quer.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**Adicione uma dica de vocabulário**: nomes, marcas e jargões, escritos do jeito que você quer.',
  '**Ads.** Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed.':
    '**Anúncios.** Os anúncios aparecem apenas nas páginas informativas e ao lado das transcrições concluídas, e são veiculados pelo Google, que usa cookies. Nenhum anúncio é exibido enquanto um arquivo está sendo transcrito.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**Confira as linhas marcadas** e corrija-as no editor da transcrição.',
  '**Choose the spoken language** instead of auto-detect.':
    '**Escolha o idioma falado** em vez da detecção automática.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**Escolha seu arquivo.** Solte um arquivo de vídeo ou áudio acima, escolha um no seu dispositivo ou grave sua voz com o microfone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG e a maioria dos outros formatos comuns funcionam.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**Melhorar o áudio** — filtra ruídos graves e chiados e equilibra vozes baixas',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**Limites de arquivo.** Não definimos nenhum. Seu arquivo é processado no seu dispositivo, então arquivos muito grandes ou longos demoram mais e precisam de memória livre suficiente; a página avisa você em um dispositivo mais lento.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**Tipos de arquivo.** Vídeo: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS e MTS. Áudio: MP3, WAV, M4A, AAC, FLAC, OGG e OPUS. Você também pode gravar direto do microfone.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Cookies do Google.** O Google define seus próprios cookies quando os anúncios carregam, apenas nas páginas que exibem anúncios (veja a seção 6).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**Aulas e podcasts** transformados em texto legível, para estudar ou para as notas do episódio.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**Limites.** No momento, o servidor não anuncia nenhum limite de tamanho ou duração. Arquivos muito grandes simplesmente demoram mais.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**Limites.** Não definimos limite de tamanho ou duração: seu arquivo é processado no seu dispositivo, então arquivos muito grandes ou longos simplesmente demoram mais e precisam de memória livre suficiente. Em um dispositivo mais lento, a página avisa antes de você começar e estima o tempo.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**Mídia que você adiciona.** Os arquivos de vídeo ou áudio que você escolhe ou grava. Eles são processados no seu navegador, no seu dispositivo (com WebGPU ou WebAssembly). Seu arquivo nunca é enviado aos nossos servidores e nunca é enviado ao Google nem a mais ninguém.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**Anotações de reuniões e entrevistas** que você pode pesquisar, citar e compartilhar.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**Erros acontecem.** Nenhum reconhecimento de fala é perfeito. Sempre verifique uma transcrição antes de confiar nela para algo importante.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**Nenhum cookie próprio.** O próprio site não define cookies.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Nada é guardado para depois.** Arquivos e transcrições existem apenas durante a sua sessão. Exporte o que precisar antes de sair. Os detalhes estão na [Política de privacidade](/privacy).',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Nada é guardado para depois.** As transcrições e o arquivo ficam apenas neste navegador e são apagados automaticamente após {idle} de inatividade, ou quando você clica em **Apagar meus dados agora**. Exporte o que precisar antes de sair. Os detalhes estão na [Política de privacidade](/privacy).',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**Nada é guardado para depois.** As transcrições existem apenas durante esta sessão, então exporte o que precisar. A [Política de privacidade](/privacy) descreve o site hospedado.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**Um total acumulado.** Quando uma transcrição termina, seu navegador envia um “+1” anônimo ao nosso contador (um Cloudflare Worker). Ele não leva arquivo, transcrição nem identificador. A Cloudflare vê seu endereço IP em trânsito e o usa por pouco tempo para limitar abusos (um limite de requisições); armazenamos apenas o total. O número exibido no cabeçalho da página é informado pelos navegadores dos visitantes e não é verificado.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '**Escolha Alta precisão ou Precisão máxima** para áudios difíceis.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**Escolha a qualidade e o idioma.** Um modelo mais rápido entrega um rascunho rápido; um mais preciso é melhor para entrevistas, aulas e legendas. O idioma falado pode ser detectado automaticamente, e há suporte a mais de 50 idiomas.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '**Transcrever de novo** uma transcrição concluída com outra qualidade ou idioma; sua transcrição atual é mantida.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '**Transcrever de novo** com outra qualidade ou idioma; sua transcrição atual é mantida.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**Leia, corrija e baixe.** A transcrição aparece com marcas de tempo, e as palavras de que o modelo não teve certeza ficam marcadas para você conferir. Baixe como texto simples, legendas SRT ou VTT, Markdown ou JSON.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**Requisições que entregam o site.** A Cloudflare (Cloudflare Pages) entrega este site. Como nossa provedora de hospedagem e rede, ela processa seu endereço IP e os dados usuais da requisição (como o horário, a página solicitada e seu navegador) para entregar e proteger o site.',
  '**Skip silence & music** — prevents made-up text':
    '**Pular silêncios e música** — evita texto inventado',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**Os modelos de fala ficam no cache do seu navegador** (Cache Storage), então a próxima transcrição começa mais rápido, até você apagá-los (**Apagar meus dados agora** também pode apagá-los) ou o navegador limpar o armazenamento. São arquivos de programa, não seus dados.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**Velocidade.** Depende da qualidade que você escolher, da duração do arquivo e de quão ocupado o serviço está.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**Velocidade.** Depende do seu dispositivo, da qualidade que você escolher e da duração do arquivo. O primeiro uso de um nível de qualidade baixa o modelo uma única vez: seu navegador busca os arquivos do modelo no Hugging Face e os arquivos de programa do mecanismo no jsDelivr, e depois os mantém em cache. Mantenha a aba aberta enquanto ele trabalha.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**Comece com um bom áudio**: menos ruído de fundo, um microfone próximo e uma pessoa falando de cada vez. Deixe “Melhorar o áudio” ativado.',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**Comece com um bom áudio**: pouco ruído de fundo, um microfone próximo, uma pessoa de cada vez. Deixe “Melhorar o áudio” ativado.',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**Armazenamento no seu navegador.** Seu navegador guarda suas transcrições e arquivos (IndexedDB) e os modelos de fala (Cache Storage), como descrito acima, lembra sua escolha de tema claro ou escuro, e o armazenamento da sessão guarda algumas configurações de conveniência para a aba atual (como a última qualidade escolhida). Nada disso é enviado a nós.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**Legendas** para seus próprios vídeos, reels e cursos on-line, a partir de um arquivo SRT ou VTT.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**Texto gerado no seu dispositivo.** A transcrição, suas marcas de tempo e suas edições, o título que você escolhe e as configurações que você define (qualidade, idioma, dica de vocabulário). Tudo isso é gerado e guardado neste navegador; nunca o recebemos.',
  '**Use previous text as context** — can repeat on long files':
    '**Usar o texto anterior como contexto** — pode repetir em arquivos longos',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**Notas de voz** escritas, para você não precisar ouvi-las de novo.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**Por que os resultados podem variar entre execuções, níveis de qualidade ou outras ferramentas?** O reconhecimento de fala é probabilístico: ele escolhe as palavras mais prováveis e, em trechos com ruído ou ambíguos, várias respostas ficam próximas. Outro nível de qualidade, outra configuração de idioma, uma dica de vocabulário ou uma limpeza de áudio diferente podem mudar o texto, e o mesmo vale para outra ferramenta que use um sistema diferente. Nomes ou rótulos de quem fala não são adicionados.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**Tempo por palavra** — legendas melhores e marcas de confiança',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**Seus arquivos e transcrições ficam neste navegador.** As transcrições, as edições e o arquivo de origem são guardados apenas no armazenamento deste navegador (IndexedDB). Eles são apagados automaticamente quando a sessão termina, o que acontece após {idle} de inatividade, ou na hora em que você clica em **Apagar meus dados agora** no menu Transcrições.',
  '1 file was skipped: not video or audio.': '1 arquivo foi ignorado: não é vídeo nem áudio.',
  '1 minute': '1 minuto',
  '1 word': '1 palavra',
  '1. Agreement': '1. Aceitação',
  '1. Who runs this website': '1. Quem administra este site',
  '10. Children': '10. Crianças',
  '10. Termination': '10. Encerramento',
  '11. Children': '11. Crianças',
  '11. Your rights and choices': '11. Seus direitos e escolhas',
  '12. Changes': '12. Alterações',
  '12. Open-source components': '12. Componentes de código aberto',
  '13. Changes to this policy': '13. Alterações nesta política',
  '13. Governing law': '13. Lei aplicável',
  '14. Contact': '14. Contato',
  '2. The service': '2. O serviço',
  '2. What is processed, and where': '2. O que é processado e onde',
  '3 simple steps': '3 passos simples',
  '3. Why it is processed': '3. Por que é processado',
  '3. Your content': '3. Seu conteúdo',
  '4. Acceptable use': '4. Uso aceitável',
  '4. How long it is kept': '4. Por quanto tempo é mantido',
  '5. Downloads your browser makes': '5. Downloads feitos pelo seu navegador',
  '5. Limits: your device does the work': '5. Limites: seu dispositivo faz o trabalho',
  '6. Accuracy: no warranty': '6. Precisão: sem garantia',
  '6. Advertising': '6. Publicidade',
  '7. Availability': '7. Disponibilidade',
  '7. Cookies and browser storage': '7. Cookies e armazenamento do navegador',
  '8. Sharing': '8. Compartilhamento',
  '8. Third-party downloads and ads': '8. Downloads e anúncios de terceiros',
  '9. Liability': '9. Responsabilidade',
  '9. Security': '9. Segurança',
  'A name cannot be empty, so the old name was kept.':
    'O nome não pode ficar vazio, então o nome anterior foi mantido.',
  'A new transcript has started. The old one is kept in your list.':
    'Uma nova transcrição foi iniciada. A anterior continua na sua lista.',
  'a period': 'um período',
  About: 'Sobre',
  'About {brand}': 'Sobre o {brand}',
  'about {h} h': 'cerca de {h} h',
  'about {h} h {m} min': 'cerca de {h} h {m} min',
  'about {n} min': 'cerca de {n} min',
  'Accurate text': 'Texto preciso',
  'Add another file': 'Adicionar outro arquivo',
  'Add your file': 'Adicione seu arquivo',
  'Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'Os anúncios aparecem apenas nas páginas informativas e ao lado das transcrições concluídas, e são veiculados pelo Google, que usa cookies. Nenhum anúncio é exibido enquanto um arquivo está sendo transcrito, e este site não define cookies próprios. Os detalhes estão na [Política de privacidade](/privacy).',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'Nenhum recurso depende dos anúncios: com os anúncios bloqueados ou recusados, tudo funciona do mesmo jeito.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'Os anúncios mantêm o TranscribeVid gratuito. Tudo funciona sem eles.',
  Advertisement: 'Publicidade',
  'All free tools': 'Todas as ferramentas gratuitas',
  'All free video and audio to text tools':
    'Todas as ferramentas gratuitas de vídeo e áudio para texto',
  'All tools': 'Todas as ferramentas',
  'All your data was deleted': 'Todos os seus dados foram apagados',
  'Allow the microphone in your browser, or choose a file instead.':
    'Permita o microfone no navegador ou escolha um arquivo.',
  'Already added': 'Já adicionado',
  'Already finished': 'Já concluído',
  'Also delete the downloaded speech models?': 'Apagar também os modelos de fala baixados?',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'Um envio está em andamento. Espere terminar antes de adicionar mais arquivos.',
  'Apply style only': 'Aplicar só o estilo',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'Aplicar só o estilo usa o reconhecimento salvo, sem processar o áudio de novo. As linhas editadas são mantidas.',
  'Audio works too.': 'Áudio também funciona.',
  'Automatic (IndicXlit when installed)': 'Automático (IndicXlit, quando instalado)',
  Back: 'Voltar',
  'Basic phonetic spelling': 'Grafia fonética básica',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'Como não mantemos contas nem dados que identifiquem você, em geral não conseguimos associar nenhum dado a uma pessoa. Quando a lei dá a você direitos sobre seus dados pessoais, como acesso, correção, exclusão, restrição, oposição e portabilidade, ou o direito de reclamar à sua autoridade de proteção de dados, você pode exercê-los entrando em contato conosco:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'Como suas transcrições existem apenas neste navegador, exporte o que precisar antes de sair. Dados apagados não podem ser recuperados.',
  'Best accuracy': 'Precisão máxima',
  'Best accuracy, slowest': 'Precisão máxima, mais lento',
  Breadcrumb: 'Caminho de navegação',
  'By file type': 'Por tipo de arquivo',
  'By language': 'Por idioma',
  'By use': 'Por uso',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'Ao usar o {brand} ({domain}), você concorda com estes termos. Se não concordar, não use o serviço. O serviço é operado por **{name}**, {address}.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'contornar ou tentar contornar os limites de requisições ou a segurança do site ou do seu contador, nem interferir no funcionamento dele ou no uso por outros visitantes;',
  'Can I edit the transcript?': 'Posso editar a transcrição?',
  "Can't reach the server.": 'Não foi possível acessar o servidor.',
  Cancel: 'Cancelar',
  'Cancel "{title}"?': 'Cancelar “{title}”?',
  'Cancel {title}': 'Cancelar {title}',
  'Cancellation requested': 'Cancelamento solicitado',
  Cancelled: 'Cancelado',
  'Cancelling…': 'Cancelando…',
  'Cannot reach the server': 'Não foi possível acessar o servidor',
  'Cannot reach the server.': 'Não foi possível acessar o servidor.',
  'Cannot reach the server. Check your connection and try again.':
    'Não foi possível acessar o servidor. Verifique sua conexão e tente de novo.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'Não foi possível acessar o servidor. Confirme que ele está em execução (npm run dev) e tente de novo.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'Altere ou apague uma linha, ou pesquise e substitua. Suas edições vão em todos os downloads.',
  'Changed in {n} lines.': 'Alterado em {n} linhas.',
  'Check Hinglish spelling': 'Confira a grafia do Hinglish',
  'Choose "Save as PDF" in the print dialog.': 'Escolha “Salvar como PDF” na janela de impressão.',
  'Choose a file': 'Escolher um arquivo',
  'Choose a file first': 'Escolha um arquivo primeiro',
  'Choose a format': 'Escolha um formato',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'Escolha entre modelos mais rápidos e mais precisos, conforme o seu dispositivo e o tempo que você tem.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'Escolha Mais rápido, Padrão, Alta precisão ou Precisão máxima: Mais rápido é o mais veloz, Precisão máxima comete menos erros.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'Escolha o idioma falado ou deixe na detecção automática. Você também pode traduzir a fala para o inglês.',
  'Chosen files': 'Arquivos escolhidos',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'Uma fala clara e perto do microfone dá o melhor resultado. Em Mais opções, **Melhorar o áudio** e **Pular silêncios e música** vêm ativados por padrão: eles filtram ruídos graves e chiados e impedem que o modelo invente texto durante músicas ou pausas longas, então mantenha-os ativados em gravações com ruído. Para legendas, deixe **Tempo por palavra** ativado também, para que cada linha comece e termine exatamente junto com as palavras.',
  Close: 'Fechar',
  'Close menu': 'Fechar menu',
  'Close: {title}': 'Fechar: {title}',
  'Common questions': 'Perguntas frequentes',
  Contact: 'Contato',
  'Converting…': 'Convertendo…',
  Copied: 'Copiado',
  'Copy text': 'Copiar texto',
  'Copying…': 'Copiando…',
  'Could not cancel the transcript.': 'Não foi possível cancelar a transcrição.',
  'Could not change transcript style.': 'Não foi possível alterar o estilo da transcrição.',
  'Could not copy': 'Não foi possível copiar',
  'Could not delete the transcript.': 'Não foi possível apagar a transcrição.',
  'Could not delete your data.': 'Não foi possível apagar seus dados.',
  'Could not load the text to copy.': 'Não foi possível carregar o texto para copiar.',
  'Could not prepare the file. Please try again.':
    'Não foi possível preparar o arquivo. Tente de novo.',
  'Could not rename the transcript.': 'Não foi possível renomear a transcrição.',
  'Could not save the change.': 'Não foi possível salvar a alteração.',
  'Could not start': 'Não foi possível iniciar',
  'Could not start.': 'Não foi possível iniciar.',
  Dark: 'Escuro',
  Delete: 'Apagar',
  'Delete "{title}" and its transcript?': 'Apagar “{title}” e sua transcrição?',
  'Delete "{title}"? This cannot be undone.': 'Apagar “{title}”? Esta ação não pode ser desfeita.',
  'Delete {title}': 'Apagar {title}',
  'Delete all your transcripts and the files kept in this browser now?':
    'Apagar agora todas as suas transcrições e os arquivos guardados neste navegador?',
  'Delete all your transcripts and uploaded files now?':
    'Apagar agora todas as suas transcrições e os arquivos enviados?',
  'Delete line': 'Apagar linha',
  'Delete my data now': 'Apagar meus dados agora',
  'Delete this line from the transcript?': 'Apagar esta linha da transcrição?',
  'Delete transcript': 'Apagar transcrição',
  Deleted: 'Apagado',
  'Detect automatically': 'Detectar automaticamente',
  'Dismiss message': 'Dispensar mensagem',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'O Distil Large v3 entende apenas fala em inglês. Escolha outro modelo para traduzir.',
  Done: 'Concluído',
  'Download failed': 'Falha no download',
  'Download started': 'Download iniciado',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'Baixe o resultado como texto simples, legendas SRT ou VTT, Markdown ou JSON.',
  'Download the transcript as': 'Baixar a transcrição como',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'Baixando o modelo de fala (apenas na primeira vez): {loaded} de {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'Solte um arquivo de vídeo ou áudio na [página inicial](/) ou grave do microfone.',
  'Drop to add your file': 'Solte para adicionar seu arquivo',
  'Drop your {noun} here, or choose a file': 'Solte {noun} aqui ou escolha um arquivo',
  'Each line with its time, like [00:12]': 'Cada linha com seu horário, como [00:12]',
  Edit: 'Editar',
  'Edit it right here': 'Edite aqui mesmo',
  'Edit this line': 'Editar esta linha',
  'Edited by you': 'Editado por você',
  'English only, very fast and accurate': 'Somente inglês, muito rápido e preciso',
  'English translation is selected in More options.':
    'A tradução para o inglês está selecionada em Mais opções.',
  'Enter saves · Esc cancels': 'Enter salva · Esc cancela',
  'Every line has a time. Play the media from any line to hear what was said.':
    'Cada linha tem um horário. Reproduza a mídia a partir de qualquer linha para ouvir o que foi dito.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'Todas as páginas fazem o mesmo trabalho: transformam a fala de um arquivo de vídeo ou áudio em texto com marcas de tempo em cada linha, em mais de 50 idiomas, sem cadastro. Escolha a que combina com o arquivo que você tem ou com o que você quer fazer.',
  'Experimental: compare on your audio; chunk timestamps':
    'Experimental: compare no seu áudio; marcas de tempo por trecho',
  'Experimental: larger model; chunk timestamps':
    'Experimental: modelo maior; marcas de tempo por trecho',
  Export: 'Exportar',
  Failed: 'Falhou',
  FAQ: 'FAQ',
  Fast: 'Rápido',
  'Fast, clean audio': 'Rápido, áudio limpo',
  Fastest: 'Mais rápido',
  'Fastest, rough drafts only': 'O mais rápido, só para rascunhos',
  'Fewer mistakes. Takes longer.': 'Menos erros. Demora mais.',
  'Fewest mistakes. Takes the longest.': 'O mínimo de erros. É o que mais demora.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'O arquivo “{name}” tem {size}; o limite é {limit} - defina VT_MAX_UPLOAD_MB para aumentá-lo',
  'File "{name}" is {size}; the limit is {limit}.':
    'O arquivo “{name}” tem {size}; o limite é {limit}.',
  'file {n} of {total}': 'arquivo {n} de {total}',
  'File added': 'Arquivo adicionado',
  'File limits.': 'Limites de arquivo.',
  'File not added': 'Arquivo não adicionado',
  'File skipped': 'Arquivo ignorado',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'Arquivos e transcrições existem apenas durante a sua sessão. Exporte o que precisar antes de sair. A única coisa que guardamos é um total anônimo e acumulado de quantos arquivos foram transcritos no site (um único número, exibido no cabeçalho da página); ele não está ligado a você, aos seus arquivos nem à sua sessão. Os detalhes estão na [Política de privacidade](/privacy).',
  'Find it automatically': 'Encontrar automaticamente',
  'first time only, also downloads the {size} MB word-timing model':
    'apenas na primeira vez, também baixa o modelo de tempo por palavra de {size} MB',
  'First time only: downloads {size} (needs internet)':
    'Apenas na primeira vez: baixa {size} (precisa de internet)',
  'Follow playback': 'Acompanhar a reprodução',
  'Following playback': 'Acompanhando a reprodução',
  Footer: 'Rodapé',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'Para fala com sotaque ou com mistura de idiomas, tente um nível de qualidade mais alto. A pontuação de confiança não é uma porcentagem de precisão.',
  'For developers: words, times, confidence': 'Para desenvolvedores: palavras, tempos, confiança',
  'For notes apps': 'Para aplicativos de notas',
  'For video players and editors': 'Para players de vídeo e editores',
  'For YouTube and web video': 'Para YouTube e vídeo na web',
  Free: 'Grátis',
  'Free tools': 'Ferramentas gratuitas',
  'Free tools:': 'Ferramentas gratuitas:',
  'Free video and audio to text': 'Vídeo e áudio para texto, grátis',
  'Free video and audio to text, right in your browser':
    'Vídeo e áudio para texto, grátis, direto no seu navegador',
  'Free, unlimited, and no login needed': 'Grátis, ilimitado e sem precisar de login',
  'Free, unlimited, no login': 'Grátis, ilimitado, sem login',
  'Frequently asked questions': 'Perguntas frequentes',
  'Get in touch': 'Entre em contato',
  'Getting the speech engine ready…': 'Preparando o mecanismo de fala…',
  'Give it a new name': 'Dê um novo nome',
  'Go to the home page': 'Ir para a página inicial',
  'Go to Video to text': 'Ir para Vídeo para texto',
  'Good balance (default)': 'Bom equilíbrio (padrão)',
  'Good for most videos. Not sure? Keep this one.':
    'Bom para a maioria dos vídeos. Em dúvida? Fique com este.',
  'Good to know': 'Bom saber',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'A ferramenta de consentimento do Google não pôde ser carregada, provavelmente porque um bloqueador de anúncios ou a rede a impediu. Sem ela, nenhum anúncio e nenhum cookie de anúncio é carregado.',
  Guides: 'Guias',
  'Guides: transcripts and subtitles': 'Guias: transcrições e legendas',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'Tem uma dúvida, encontrou um erro ou quer sugerir um recurso? Escreva para {email}. Cada mensagem é lida pela pessoa que cria o {brand}, e você costuma receber uma resposta em poucos dias úteis.',
  'Helps spell uncommon words correctly.': 'Ajuda a escrever corretamente palavras incomuns.',
  'High accuracy': 'Alta precisão',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'Alta precisão (Large v3 Turbo) não foi treinada para traduzir e pode devolver o idioma original. Para traduzir, escolha Padrão ou Precisão máxima.',
  'High accuracy, slower': 'Alta precisão, mais lento',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'Valores maiores são um pouco mais precisos e mais lentos. 5 é um bom padrão.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'Híndi em letras latinas, com as palavras em inglês preservadas. Os outros idiomas mantêm a escrita original. Revise palavras e nomes desconhecidos.',
  'Hinglish (Roman Hindi)': 'Hinglish (híndi romanizado)',
  'Hinglish conversion': 'Conversão para Hinglish',
  History: 'Histórico',
  Home: 'Início',
  'How {brand} works': 'Como o {brand} funciona',
  'How accurate is it?': 'Qual é a precisão?',
  'How do I get better accuracy?': 'Como obter mais precisão?',
  'How it stays free': 'Como continua gratuito',
  'How it works': 'Como funciona',
  'How long does it take?': 'Quanto tempo demora?',
  'How to transcribe a video to text': 'Como transcrever um vídeo para texto',
  'How to turn a video or audio file into text with {brand}':
    'Como transformar um arquivo de vídeo ou áudio em texto com o {brand}',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'Se houver fala, tente Mais › Transcrever de novo com o idioma certo.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'Se o serviço estiver ocupado ou houver muitas transcrições em andamento, ele pede que você espere e explica o motivo.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'Se alterarmos esta política, a nova versão aparece nesta página com uma nova data de “Última atualização”.',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'No Espaço Econômico Europeu, no Reino Unido, na Suíça e em alguns estados dos EUA, a mensagem de consentimento certificada do Google pede a sua escolha quando os anúncios carregam.',
  'IndicXlit (trained model)': 'IndicXlit (modelo treinado)',
  'Is it really free and unlimited? Do I need to log in?':
    'É mesmo gratuito e ilimitado? Preciso fazer login?',
  'Is my data private?': 'Meus dados são privados?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'Depende da qualidade que você escolher, da duração do arquivo e de quão ocupado o serviço está. Mais rápido é veloz; Precisão máxima demora mais, mas comete menos erros. O progresso e o tempo restante aparecem ao vivo, e um arquivo esperando a vez mostra “Na fila de espera”.',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'Depende do seu dispositivo, da qualidade que você escolher e da duração do arquivo. Com um chip gráfico capaz (WebGPU), é o mais rápido; caso contrário, roda no processador (WebAssembly), que é mais lento. Mais rápido é veloz; Precisão máxima demora mais, mas comete menos erros. O progresso e o tempo restante aparecem ao vivo.',
  'It is now called “{title}”.': 'Agora ele se chama “{title}”.',
  'It may have been deleted.': 'Ele pode ter sido apagado.',
  'It was stopped before any text was found.':
    'Foi interrompido antes de encontrar qualquer texto.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'Os dados da sessão foram apagados, inclusive esta transcrição. As transcrições só são guardadas durante a sessão que as criou.',
  'Job not found': 'Transcrição não encontrada',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'agora mesmo',
  'Just the words, in paragraphs': 'Só as palavras, em parágrafos',
  'Keep reading': 'Continue lendo',
  'Keep this page open until the upload is done.':
    'Mantenha esta página aberta até o envio terminar.',
  'Kept only for this session, then deleted automatically.':
    'Guardado apenas durante esta sessão e depois apagado automaticamente.',
  Language: 'Idioma',
  'Larger or longer files are refused before they are processed, so split them first.':
    'Arquivos maiores ou mais longos são recusados antes de serem processados, então divida-os antes.',
  'Last updated: {date}': 'Última atualização: {date}',
  'Licence text': 'Texto da licença',
  Light: 'Claro',
  'Limits.': 'Limites.',
  'Line deleted': 'Linha apagada',
  'Live: the text appears here as it is recognised':
    'Ao vivo: o texto aparece aqui conforme é reconhecido',
  'Loading model… (first use downloads it)': 'Carregando o modelo… (o primeiro uso o baixa)',
  'Loading…': 'Carregando…',
  'Long (56 letters)': 'Longa (56 letras)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'Respostas mais completas: formatos, legendas, precisão e privacidade.',
  Main: 'Principal',
  'Make a new transcript of the same file. This one is kept.':
    'Crie uma nova transcrição do mesmo arquivo. Esta é mantida.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'Crie um arquivo de legendas (SRT ou VTT) a partir do seu vídeo.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'Menu',
  Model: 'Modelo',
  More: 'Mais',
  'More answers: [Frequently asked questions](/faq)':
    'Mais respostas: [Perguntas frequentes](/faq)',
  'More free tools': 'Mais ferramentas gratuitas',
  'More options': 'Mais opções',
  'More than 50 languages': 'Mais de 50 idiomas',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'Mais de 50 idiomas, incluindo inglês, espanhol, francês, alemão, português, italiano, holandês, russo, árabe, híndi, chinês, japonês e coreano. Deixe o idioma na detecção automática ou escolha você mesmo. Você também pode traduzir a fala para o inglês.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'A maioria dos sites de transcrição pede que você crie uma conta, limita os minutos gratuitos, adiciona marcas d’água ou empurra uma assinatura antes de você ver uma única linha de texto. O {brand} faz o oposto. Tudo o que ele oferece está disponível para todos, e a página não pede nada além do seu arquivo.',
  'Name not changed': 'Nome não alterado',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'Nomes, marcas e jargões do áudio, p. ex.: Kubernetes, Dr. Okafor',
  'Near-best accuracy, much faster than Large':
    'Precisão quase máxima, bem mais rápido que o Large',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'precisa de suporte a shader de 16 bits (shader-f16) no driver gráfico',
  'needs 4 GB': 'precisa de 4 GB',
  'needs 8 GB': 'precisa de 8 GB',
  'needs a graphics-capable browser (Chrome, Edge)':
    'precisa de um navegador com suporte gráfico (Chrome, Edge)',
  'needs WebGPU': 'precisa de WebGPU',
  'Next match': 'Próxima correspondência',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'Sem conta e sem rastreamento. Seus arquivos ficam guardados apenas durante a sua sessão e são apagados automaticamente.',
  'no estimate for this model here': 'sem estimativa para este modelo aqui',
  'No login': 'Sem login',
  'No matches': 'Nenhuma correspondência',
  'No microphone': 'Sem microfone',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'Sem cadastro, sem pagamento, sem limite diário. É só adicionar seu arquivo.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'No momento, o servidor não anuncia nenhum limite de tamanho ou duração. Arquivos muito grandes simplesmente demoram mais.',
  'No speech was found in this file.': 'Nenhuma fala foi encontrada neste arquivo.',
  'No speech was transcribed.': 'Nenhuma fala foi transcrita.',
  'No speech was transcribed. Check the recording and the selected language.':
    'Nenhuma fala foi transcrita. Confira a gravação e o idioma selecionado.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'Sem WebGPU aqui: os modelos rodam em uma única thread da CPU, então os tamanhos maiores são mais lentos que o tempo real.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'Nenhum arquivo de outra pessoa está na sua frente. Se você adicionar vários arquivos, eles são transcritos um após o outro na sua aba, então mantenha a aba aberta até terminarem.',
  'None of those are video or audio files.': 'Nenhum desses é um arquivo de vídeo ou áudio.',
  Normal: 'Normal',
  'not available for this size': 'indisponível para este tamanho',
  'not available in this browser': 'indisponível neste navegador',
  'not available with Qwen (times are per chunk)':
    'indisponível com o Qwen (os tempos são por trecho)',
  'Not cancelled': 'Não cancelado',
  'Not deleted': 'Não apagado',
  'Not renamed': 'Não renomeado',
  'Not saved': 'Não salvo',
  Note: 'Observação',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'Nada aqui ainda. As transcrições que você criar aparecem aqui durante esta sessão.',
  'Nothing is saved. Export what you need.': 'Nada é guardado. Exporte o que precisar.',
  'Nothing is uploaded until you press Transcribe.':
    'Nada é enviado até você clicar em Transcrever.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'Nada de cadastro e nada a pagar. É só adicionar seu arquivo.',
  'Nothing was recorded.': 'Nada foi gravado.',
  Off: 'Desativado',
  On: 'Ativado',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'Em fala clara, em um idioma compatível, costuma ser muito preciso, mas nenhum reconhecimento de fala é perfeito. A precisão depende da qualidade do áudio, dos sotaques, do ruído de fundo, de pessoas falando ao mesmo tempo, de música e de nomes raros ou jargões. Cada linha tem uma pontuação de confiança, e as linhas de baixa confiança são marcadas para você conferi-las primeiro. Sempre verifique uma transcrição antes de confiar nela para algo importante.',
  'Open menu': 'Abrir menu',
  'Opening your transcript…': 'Abrindo sua transcrição…',
  'or drop it anywhere on this page.': 'ou solte-o em qualquer lugar desta página.',
  'Original script': 'Escrita original',
  Output: 'Saída',
  'Page {page} of {pages}': 'Página {page} de {pages}',
  'Page not found': 'Página não encontrada',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'Páginas para o arquivo que você já tem: WAV, M4A, WebM e MOV.',
  'PDF document (.pdf)': 'Documento PDF (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'O PDF é gerado pelo seu navegador: escolha “Salvar como PDF” na janela de impressão.',
  'Pick quality': 'Escolha a qualidade',
  'Plain text (.txt)': 'Texto simples (.txt)',
  'Play from here': 'Reproduzir a partir daqui',
  'Playback speed': 'Velocidade de reprodução',
  'Please add one file at a time here. You can add more files on the next page.':
    'Adicione um arquivo por vez aqui. Você poderá adicionar mais arquivos na próxima página.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'Por favor, não envie gravações privadas. O {brand} transcreve seus arquivos no seu próprio dispositivo e nunca os recebemos, então não precisamos deles para ajudar você.',
  'Please note': 'Importante',
  Preparing: 'Preparando',
  'Preparing audio…': 'Preparando o áudio…',
  'Preparing the audio…': 'Preparando o áudio…',
  'Preparing…': 'Preparando…',
  'Press a question to read its answer.': 'Clique em uma pergunta para ler a resposta.',
  'Previous match': 'Correspondência anterior',
  'Print to PDF': 'Imprimir em PDF',
  Privacy: 'Privacidade',
  'Privacy and cookie settings': 'Configurações de privacidade e cookies',
  'Privacy policy': 'Política de privacidade',
  'Privacy requests': 'Solicitações de privacidade',
  Private: 'Privado',
  Progress: 'Progresso',
  Quality: 'Qualidade',
  'Questions about these terms:': 'Dúvidas sobre estes termos:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'Dúvidas, relatos de erros e ideias são sempre bem-vindos. Escreva para {email} ou veja a página [Contato](/contact) para saber o que incluir.',
  Queued: 'Na fila',
  'Quick results. Good for clear speech.': 'Resultados rápidos. Bom para fala clara.',
  Quickest: 'O mais rápido',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'O Qwen usa marcas de tempo aproximadas por trecho. O tempo por palavra e a confiança não estão disponíveis.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'O Qwen usa marcas de tempo por trecho e não informa a confiança por palavra. Compare uma amostra curta antes de escolhê-lo.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (experimental)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'O Qwen3-ASR precisa de um navegador para computador com WebGPU (Chrome ou Edge) e suporte a shader de 16 bits (shader-f16) no driver gráfico.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'O Qwen3-ASR precisa de um navegador para computador com WebGPU (Chrome ou Edge) e 8 GB de memória.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'O Qwen3-ASR precisa de um navegador para computador com WebGPU (Chrome ou Edge).',
  'Re-transcribe': 'Transcrever de novo',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'Leia a transcrição com marcas de tempo, veja de quais palavras o modelo não teve certeza e corrija-as ali mesmo.',
  'Read, edit, download': 'Leia, edite, baixe',
  Ready: 'Pronto',
  'Ready to print or share': 'Pronto para imprimir ou compartilhar',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'Pronto para experimentar? [Veja todas as ferramentas gratuitas](/tools) ou [transcreva um arquivo agora](/).',
  'Recognition engine': 'Mecanismo de reconhecimento',
  Recommended: 'Recomendado',
  'Record from microphone': 'Gravar do microfone',
  'Record straight from your microphone and turn it into text.':
    'Grave direto do microfone e transforme em texto.',
  'Record with your microphone': 'Gravar com o microfone',
  'Recording {stamp}': 'Gravação {stamp}',
  'Recording is not supported by this browser.': 'A gravação não é compatível com este navegador.',
  'Related reading': 'Leitura relacionada',
  Remove: 'Remover',
  'Remove {name}': 'Remover {name}',
  'Removes it for good': 'Remove de vez',
  Rename: 'Renomear',
  Renamed: 'Renomeado',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    'Substituir “{query}” por “{replacement}” em {n} linhas?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    'Substituir “{query}” por “{replacement}” em 1 linha?',
  'Replace in {n} lines': 'Substituir em {n} linhas',
  'Replace in 1 line': 'Substituir em 1 linha',
  'Replace with': 'Substituir por',
  'Replace with…': 'Substituir por…',
  'Replace…': 'Substituir…',
  Replaced: 'Substituído',
  'Reporting a problem': 'Como relatar um problema',
  'Retrying…': 'Tentando de novo…',
  'Review language and quality': 'Revisar idioma e qualidade',
  'Review this transcript': 'Revisar esta transcrição',
  Save: 'Salvar',
  Saved: 'Salvo',
  'Saving…': 'Salvando…',
  'Search depth: {n}': 'Profundidade da busca: {n}',
  'Search the text': 'Pesquisar no texto',
  'Search the transcript': 'Pesquisar na transcrição',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'Veja também os [Termos de uso](/terms), [Como funciona](/how-it-works) e o [FAQ](/faq).',
  'Server busy': 'Servidor ocupado',
  'Session only — nothing is saved.': 'Somente nesta sessão — nada é guardado.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'Somente nesta sessão — nada é guardado. Fechar o app apaga todas as transcrições. Exporte o que precisar.',
  'Session time left: about {n} min': 'Tempo restante da sessão: cerca de {n} min',
  'Short (32 letters)': 'Curta (32 letras)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'Respostas curtas e práticas sobre como transformar fala em texto e legendas: qual formato de legenda escolher, como adicionar legendas a um vídeo, como obter uma transcrição mais precisa e como a transcrição pode rodar no seu próprio navegador, sem enviar seu arquivo.',
  'Show all {count} languages': 'Mostrar todos os {count} idiomas',
  'Six ways to download': 'Seis formas de baixar',
  'Skip to main content': 'Pular para o conteúdo principal',
  Slower: 'Mais lento',
  'slower than real time on the measured laptop': 'mais lento que o tempo real no notebook medido',
  Slowest: 'O mais lento',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'Alguns recursos baixam componentes de código aberto para o seu navegador quando você os usa. Eles rodam no seu dispositivo, como o resto do mecanismo. As licenças deles nos pedem para exibir estes avisos:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'Alguns trechos precisam de uma conferência ouvindo o áudio, por causa de texto repetido ou de um limite de fala incerto.',
  'Something went wrong': 'Algo deu errado',
  'Something went wrong in this browser. Please try again.':
    'Algo deu errado neste navegador. Tente de novo.',
  'Something went wrong while reading this file.': 'Algo deu errado ao ler este arquivo.',
  'Source code': 'Código-fonte',
  Speed: 'Velocidade',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'As velocidades em celulares e tablets são estimadas, não medidas; tiny e base são os tamanhos seguros.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT e VTT para legendas, TXT e Markdown para leitura, JSON para programas ou um PDF para imprimir.',
  Standard: 'Padrão',
  'Standard (42 letters)': 'Padrão (42 letras)',
  Start: 'Iniciar',
  'Start a new transcription': 'Iniciar uma nova transcrição',
  'Start again': 'Começar de novo',
  'Started again': 'Reiniciado',
  'Starting…': 'Iniciando…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'Ainda tem dúvidas? Leia as [perguntas frequentes](/faq), veja [como funciona](/how-it-works) ou [fale conosco](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    'Ainda travado? [Leia Como funciona](/how-it-works)',
  'Stop recording · {time}': 'Parar a gravação · {time}',
  'Stop this transcription? The text found so far is kept.':
    'Parar esta transcrição? O texto encontrado até agora é mantido.',
  'Stopping the transcription worker. The text found so far is kept.':
    'Parando o processo de transcrição. O texto encontrado até agora é mantido.',
  'Stored on this device only, never uploaded.': 'Guardado só neste dispositivo, nunca enviado.',
  'Style unchanged': 'Estilo inalterado',
  'Style updated': 'Estilo atualizado',
  'Style updated using the saved recognition. Edited lines are kept.':
    'Estilo atualizado com o reconhecimento salvo. As linhas editadas são mantidas.',
  'Subtitle files': 'Arquivos de legendas',
  'Subtitle line length': 'Tamanho da linha da legenda',
  'Subtitles (.srt)': 'Legendas (.srt)',
  'Switch to dark theme': 'Mudar para o tema escuro',
  'Switch to light theme': 'Mudar para o tema claro',
  Terms: 'Termos',
  'Terms of use': 'Termos de uso',
  'Text with times (.txt)': 'Texto com horários (.txt)',
  'That file is already in the list.': 'Esse arquivo já está na lista.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'Isso não é um arquivo de vídeo ou áudio. Escolha um MP4, MOV, MP3 ou outro arquivo de vídeo ou áudio.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'Isso não é um arquivo de vídeo ou áudio. Escolha um arquivo de vídeo ou áudio.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'Isso não é um arquivo de áudio. Escolha um MP3, WAV, M4A ou outro arquivo de áudio.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    'A [Política de privacidade](/privacy) explica o que é processado e por quê. Para tirar uma dúvida sobre seus dados ou exercer seus direitos, escreva para o mesmo endereço.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'O modelo {label} não pode rodar neste dispositivo: {reason}. Escolha outro.',
  'the exact error message, or a screenshot of it.':
    'a mensagem de erro exata ou uma captura de tela dela.',
  'The file is larger than the server accepts.': 'O arquivo é maior do que o servidor aceita.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'Na primeira vez que você usa um nível de qualidade, seu navegador baixa o modelo de fala uma única vez e o guarda para a próxima, então os arquivos seguintes começam mais cedo.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'Na primeira vez que você usa um nível de qualidade, seu navegador baixa o modelo de fala do Hugging Face e os arquivos de programa do mecanismo do jsDelivr e os guarda para a próxima vez; nada do seu arquivo é enviado junto. Quando uma transcrição termina, seu navegador soma um ao contador anônimo no cabeçalho da página, e mais nada.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'O driver gráfico não tem shaders de 16 bits: os downloads são maiores e o uso de memória é maior.',
  'The line was removed.': 'A linha foi removida.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'As principais ferramentas: transforme qualquer arquivo de vídeo ou áudio em uma transcrição com marcas de tempo.',
  'The page you are looking for does not exist or has moved.':
    'A página que você procura não existe ou foi movida.',
  'The recording failed. Please try again.': 'A gravação falhou. Tente de novo.',
  'The server does not have enough free disk space for this file.':
    'O servidor não tem espaço livre em disco suficiente para este arquivo.',
  'The server is busy': 'O servidor está ocupado',
  'The server is busy right now.': 'O servidor está ocupado no momento.',
  'The service is busy right now. Please wait a moment and try again.':
    'O serviço está ocupado no momento. Aguarde um instante e tente de novo.',
  'The service is full right now. Please try again in a little while.':
    'O serviço está lotado no momento. Tente de novo daqui a pouco.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'O reconhecimento de fala roda dentro do seu próprio navegador, usando modelos abertos de reconhecimento de fala, como o OpenAI Whisper. Seu navegador baixa o modelo uma vez e o guarda, e depois faz todo o trabalho no seu dispositivo. Seu vídeo ou áudio nunca é enviado para nós, e é por isso também que não há limite de tamanho de arquivo nem fila de arquivos de outras pessoas. A página [Como funciona](/how-it-works) explica cada etapa.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'Não foi possível identificar o idioma falado com segurança. Escolha o idioma que você ouve e tente de novo.',
  'The text found before it was stopped is shown below.':
    'O texto encontrado antes de a transcrição ser interrompida aparece abaixo.',
  'The text found so far is kept.': 'O texto encontrado até agora é mantido.',
  'The text is ready to paste.': 'O texto está pronto para colar.',
  'The transcript finished before it could be cancelled.':
    'A transcrição terminou antes de poder ser cancelada.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'A transcrição roda no seu próprio dispositivo com modelos abertos de reconhecimento de fala, como o OpenAI Whisper. Seu navegador baixa um modelo uma vez e o guarda, então o próximo arquivo começa mais rápido, e seu vídeo ou áudio nunca é enviado para lugar nenhum.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'o tipo e a duração do arquivo, por exemplo “MP4, 25 minutos”;',
  'There is no size or length limit set here.': 'Aqui não há limite de tamanho ou duração.',
  'These details make a problem much quicker to find and fix:':
    'Estes detalhes ajudam a encontrar e corrigir um problema com muito mais rapidez:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'Estes termos são regidos pelas leis da Índia. Os tribunais de Bengaluru, Karnataka, Índia, têm jurisdição exclusiva sobre qualquer disputa decorrente deles. Isso não retira nenhuma proteção que você tenha com base nas leis de defesa do consumidor obrigatórias do país onde você mora.',
  'They are downloaded again the next time you transcribe.':
    'Eles são baixados de novo na próxima vez que você transcrever.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Fornecedores terceiros, incluindo o Google, usam cookies para exibir anúncios com base nas suas visitas anteriores a este site ou a outros sites. O uso de cookies de publicidade pelo Google permite que ele e seus parceiros exibam anúncios para você com base na sua visita a este site e/ou a outros sites na Internet.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'Esta caixa aceita arquivos de áudio, como MP3, WAV ou M4A, mas esse é um vídeo.',
  'This browser cannot record. Please choose a file instead.':
    'Este navegador não consegue gravar. Escolha um arquivo.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'Este navegador não informa a memória; foram considerados {gb} GB. Escolha um modelo menor se a página ficar lenta.',
  'This cannot be undone. Export anything you want to keep first.':
    'Esta ação não pode ser desfeita. Exporte antes tudo o que quiser guardar.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    'Esta cópia do {brand} roda no seu próprio computador. Seus arquivos são processados nesta máquina e nada sai dela. Nada é guardado de forma permanente: as transcrições existem apenas durante esta sessão, então exporte o que precisar. A [Política de privacidade](/privacy) descreve o site hospedado.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'Esta cópia roda no seu próprio computador. Seus arquivos são processados nesta máquina e nada sai dela.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Este dispositivo tem pouca memória para um arquivo tão longo. Ele é processado em pequenos pedaços, o que é mais lento; um trecho mais curto ou um modelo menor é mais seguro.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'Este arquivo precisa de um conversor de 9 MB que roda no seu navegador. Carregá-lo?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'Esta é uma tradução feita por conveniência. Se ela diferir da versão em inglês, vale a versão em inglês.',
  'This local copy does not count transcriptions': 'Esta cópia local não conta transcrições',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'Esta transcrição tem baixa confiança do modelo. Ouça a gravação e confira o idioma falado antes de usar o texto.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'Isso vai levar {wait} neste dispositivo (estimativa). Mantenha a aba aberta até terminar.',
  Timestamps: 'Marcas de tempo',
  'Tips for the best results': 'Dicas para os melhores resultados',
  'Tips for the best transcript': 'Dicas para a melhor transcrição',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'Para alterar suas escolhas de anúncios, use as [Configurações de anúncios do Google](https://adssettings.google.com) ou as configurações de cookies do seu navegador.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'Para alterar suas escolhas de anúncios, use **Configurações de privacidade e cookies** no rodapé de uma página que exibe anúncios, as [Configurações de anúncios do Google](https://adssettings.google.com) ou as configurações de cookies do seu navegador.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'Para entregar a transcrição que você pediu no seu próprio dispositivo, entregar o site com segurança e manter o serviço gratuito por meio de publicidade. Quando a lei de proteção de dados, como o GDPR, se aplica, nossas bases legais são a prestação do serviço que você solicitou (art. 6(1)(b)), nosso interesse legítimo em segurança, prevenção de abusos e no total acumulado anônimo (art. 6(1)(f)) e, para cookies de publicidade, quando a lei exige, o seu consentimento (art. 6(1)(a)), que a mensagem de consentimento do Google solicita.',
  'To keep it fast for everyone, each file has a size and length limit.':
    'Para manter o serviço rápido para todos, cada arquivo tem um limite de tamanho e duração.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'Na medida em que a lei permitir, não somos responsáveis por perdas indiretas ou consequentes, perda de dados, lucros ou negócios, nem por qualquer perda decorrente do uso ou da impossibilidade de usar o serviço ou de erros em uma transcrição. Nada nestes termos limita uma responsabilidade que a lei não permite limitar.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'Para transcrever no seu dispositivo, seu navegador baixa os arquivos do modelo de fala do Hugging Face (huggingface.co) e os arquivos de programa do mecanismo de fala do jsDelivr (cdn.jsdelivr.net) e os guarda no cache (Cache Storage) para a próxima vez, até você apagá-los. Esses provedores recebem os dados usuais da requisição (seu endereço IP, seu navegador e qual arquivo foi solicitado), nunca a sua mídia nem a sua transcrição.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'Para funcionar no seu dispositivo, seu navegador baixa modelos de fala do Hugging Face e arquivos de programa do jsDelivr; eles são fornecidos sob suas próprias licenças e termos. Os anúncios são fornecidos pelo Google AdSense; um anúncio leva a um site de terceiros que não controlamos e pelo qual não somos responsáveis.',
  Transcribe: 'Transcrever',
  'Transcribe (same language)': 'Transcrever (mesmo idioma)',
  'Transcribe {n} files': 'Transcrever {n} arquivos',
  'Transcribe a file': 'Transcrever um arquivo',
  'Transcribe or translate speech in the language you need.':
    'Transcreva ou traduza a fala no idioma de que você precisa.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'Transcreva vídeos, arquivos de áudio e gravações de voz em mais de 50 idiomas, ou deixe o idioma ser detectado automaticamente.',
  'Transcribing {n}%': 'Transcrevendo {n}%',
  'Transcribing takes {time} on this device.': 'A transcrição leva {time} neste dispositivo.',
  'Transcribing…': 'Transcrevendo…',
  'Transcribed in {time}': 'Transcrito em {time}',
  '{n} s': '{n} s',
  '{m} min {s} s': '{m} min {s} s',
  Transcript: 'Transcrição',
  'Transcript name': 'Nome da transcrição',
  'Transcript not found': 'Transcrição não encontrada',
  'Transcript ready': 'Transcrição pronta',
  'Transcript style': 'Estilo da transcrição',
  'Transcription failed': 'A transcrição falhou',
  'Transcription has started. The text appears below as it is recognised.':
    'A transcrição começou. O texto aparece abaixo conforme é reconhecido.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'A transcrição começou. Seus outros arquivos estão em Transcrições, no topo da página.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'A transcrição roda no seu dispositivo e usa o processador, o chip gráfico, a memória e a bateria dele. Não definimos limite de tamanho ou duração de arquivo, mas a velocidade e o tamanho de arquivo que o navegador consegue tratar dependem do seu dispositivo: um arquivo longo em um celular ou computador mais lento pode demorar muito ou ficar sem memória. Suas transcrições e arquivos ficam neste navegador e são apagados automaticamente após {idle} de inatividade. Veja a [Política de privacidade](/privacy).',
  'Transcription settings': 'Configurações da transcrição',
  Transcripts: 'Transcrições',
  'Transcripts {n}': 'Transcrições {n}',
  'Transcripts are only kept for the browser session that created them.':
    'As transcrições só são guardadas durante a sessão do navegador que as criou.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'As transcrições são geradas automaticamente e conterão erros, especialmente com áudio ruidoso, sotaques fortes, pessoas falando ao mesmo tempo, música e nomes ou termos técnicos. Sempre confira uma transcrição antes de confiar nela, principalmente para uso jurídico, médico, financeiro ou publicado. O serviço é fornecido “no estado em que se encontra” e “conforme a disponibilidade”, sem qualquer garantia, expressa ou implícita, inclusive quanto a precisão, integridade ou adequação a uma finalidade específica.',
  'Translate to English': 'Traduzir para o inglês',
  'Try again': 'Tentar de novo',
  'Try another quality or language': 'Tente outra qualidade ou idioma',
  'try to spread malware or anything meant to damage the service.':
    'tentar espalhar malware ou qualquer coisa feita para danificar o serviço.',
  'Trying again in a moment…': 'Tentando de novo em instantes…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'Tentando de novo. Esta página carrega sozinha assim que o servidor voltar.',
  'under a minute': 'menos de um minuto',
  'Underline unsure words': 'Sublinhar palavras incertas',
  Unlimited: 'Ilimitado',
  'Unsure: worth listening to again': 'Incerto: vale ouvir de novo',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'Picos incomumente intensos de envios podem precisar esperar um pouco.',
  'Up to {minutes} per file.': 'Até {minutes} por arquivo.',
  'Up to {size} and {minutes} minutes per file.': 'Até {size} e {minutes} minutos por arquivo.',
  'Up to {size} and {minutes} per file.': 'Até {size} e {minutes} por arquivo.',
  'Up to {size} per file.': 'Até {size} por arquivo.',
  'Updated {date}': 'Atualizado em {date}',
  'Upload complete': 'Envio concluído',
  'Upload failed': 'Falha no envio',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'Falha no envio (erro do servidor {status}). Veja os detalhes no terminal que executa o servidor.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'Falha no envio (erro do servidor {status}). Tente de novo em instantes.',
  Uploading: 'Enviando',
  'Uploading…': 'Enviando…',
  'use a computer for this size': 'use um computador para este tamanho',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'usar scripts, bots ou outros meios automatizados contra o site ou o seu contador, nem enviar contagens inventadas, sem a nossa permissão por escrito;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'usar o serviço com conteúdo ilegal ou que viole direitos de terceiros;',
  'use the service to harass, harm or deceive others;':
    'usar o serviço para assediar, prejudicar ou enganar outras pessoas;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'Costuma ser muito preciso em fala clara. As linhas de que ele não tem certeza são marcadas, para você conferi-las primeiro.',
  'Video and audio to text': 'Vídeo e áudio para texto',
  'Video or audio, several at once is fine.': 'Vídeo ou áudio; pode adicionar vários de uma vez.',
  'Video to text, accurately.': 'Vídeo para texto, com precisão.',
  'Video to text: transcribe a video or audio file':
    'Vídeo para texto: transcreva um arquivo de vídeo ou áudio',
  'video transcribed': 'vídeo transcrito',
  'videos transcribed': 'vídeos transcritos',
  'Vocabulary hint': 'Dica de vocabulário',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'Notas de voz, reuniões, aulas, podcasts e entrevistas.',
  'Waiting for microphone permission…': 'Aguardando a permissão do microfone…',
  'Waiting for the first words…': 'Aguardando as primeiras palavras…',
  'Waiting in line…': 'Aguardando na fila…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'Veja o texto aparecer ao vivo, corrija os erros e baixe como SRT, VTT, TXT, Markdown, JSON ou PDF.',
  'We do not ask for your name, e-mail address or any other account details.':
    'Não pedimos seu nome, seu e-mail nem nenhum outro dado de conta.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'Não prometemos que o serviço estará sempre disponível, ininterrupto ou livre de erros. O site, ou os downloads de que ele precisa (os modelos de fala do Hugging Face e os arquivos de programa do jsDelivr), podem ficar indisponíveis por manutenção ou por motivos fora do nosso controle, e alguns navegadores ou dispositivos não conseguem rodar todos os modelos. Como suas transcrições ficam guardadas apenas neste navegador e são apagadas após um período de inatividade, sempre exporte o que precisar.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'Não vendemos seus dados. Não guardamos nenhum dos seus arquivos ou transcrições, então não temos nada para compartilhar: o reconhecimento roda no seu dispositivo, não em um serviço externo de transcrição ou de IA. O Google (publicidade), a Cloudflare (hospedagem e contador), o Hugging Face e o jsDelivr (os downloads) recebem apenas o que foi descrito acima. Podemos divulgar informações se a lei exigir.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'Não guardamos nada seu do nosso lado: além do único total acumulado, nada sobre o seu uso é armazenado por nós.',
  'We may block access if these rules are broken.':
    'Podemos bloquear o acesso se estas regras forem descumpridas.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'Podemos atualizar estes termos. A nova versão aparece nesta página com uma nova data de “Última atualização” e vale a partir daí.',
  'We never send your file, your transcript or any personal information to Google.':
    'Nunca enviamos seu arquivo, sua transcrição nem qualquer informação pessoal ao Google.',
  'Web subtitles (.vtt)': 'Legendas para web (.vtt)',
  'What people use it for': 'Para que as pessoas usam',
  'What you can do with it': 'O que você pode fazer com ele',
  'What you get': 'O que você recebe',
  'what you were doing, and what happened instead of what you expected;':
    'o que você estava fazendo e o que aconteceu em vez do que você esperava;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'Onde seus arquivos são processados depende de como o {brand} é executado, e o servidor não respondeu agora há pouco. Veja a [Política de privacidade](/privacy).',
  'Where your files are processed depends on how {brand} is run.':
    'Onde seus arquivos são processados depende de como o {brand} é executado.',
  'Which files can I use, and what are the limits?':
    'Quais arquivos posso usar e quais são os limites?',
  'Which languages are supported?': 'Quais idiomas são compatíveis?',
  'Who builds it': 'Quem criou',
  'Who runs this website': 'Quem administra este site',
  'Why it exists': 'Por que existe',
  'Working…': 'Trabalhando…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'Sim. É gratuito e nunca há conta nem login. Não há cota diária ou mensal nem acesso pago; os anúncios mantêm o site gratuito.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'Sim. É gratuito e nunca há conta nem login. Não há cota diária ou mensal nem acesso pago.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'Sim. É gratuito, sem cadastro e sem login. Esta cópia roda no seu próprio computador, então não há cota nem acesso pago; a velocidade depende do seu computador.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'Sim. Use o lápis ao lado de uma linha para alterar o texto dela ou apagar a linha, ou pesquise e substitua em toda a transcrição. Suas edições são incluídas em todas as exportações.',
  'You agree not to:': 'Você concorda em não:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'Você está no controle: apague suas transcrições, arquivos e, se quiser, os modelos de fala baixados a qualquer momento com **Apagar meus dados agora**. Isso apaga apenas os dados deste navegador; não consegue apagar os cookies do Google.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'Você pode mudar isso a qualquer momento em **Configurações de privacidade e cookies**, no rodapé de qualquer página que exiba anúncios (por exemplo, a página inicial).',
  'You can now read, fix and download it.': 'Agora você pode ler, corrigir e baixar.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'Você pode deixar de usar o serviço a qualquer momento e apagar os dados deste navegador com **Apagar meus dados agora**. Podemos suspender ou encerrar o seu acesso a qualquer momento, em especial se você descumprir estes termos.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'Você mantém todos os direitos sobre os arquivos que adiciona e sobre as transcrições feitas a partir deles. Eles são processados no seu dispositivo e nunca os recebemos. Você é responsável pelo que transcreve: use apenas conteúdo que seja seu ou que você tenha o direito de processar, inclusive qualquer permissão necessária das pessoas que falam nele.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'Você pode desativar a publicidade personalizada nas [Configurações de anúncios do Google](https://adssettings.google.com) ou desativar o uso de cookies de alguns fornecedores terceiros para publicidade personalizada em [www.aboutads.info](https://www.aboutads.info). Saiba [como o Google usa informações de sites que usam seus serviços](https://policies.google.com/technologies/partner-sites).',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'seu navegador e a versão dele, e seu dispositivo (computador ou celular, e o sistema operacional);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'Seu navegador bloqueou a cópia aqui. Use Exportar para salvar o texto.',
  'Your change is saved.': 'Sua alteração foi salva.',
  'Your change is still in its box: press Save to try again.':
    'Sua alteração continua na caixa: clique em Salvar para tentar de novo.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'Seu arquivo é enviado ao servidor por uma conexão criptografada, transcrito com modelos abertos de reconhecimento de fala, como o OpenAI Whisper, e apagado automaticamente depois. A página [Como funciona](/how-it-works) explica cada etapa.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'Seu arquivo é transcrito no seu navegador, no seu próprio dispositivo, então não definimos limite de tamanho ou duração. Arquivos muito grandes ou longos também funcionam: demoram mais e precisam de memória livre suficiente, e a página avisa quando o seu dispositivo pode ficar lento.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'Seu arquivo é transcrito com modelos abertos de reconhecimento de fala, como o OpenAI Whisper, e é apagado automaticamente depois.',
  'Your file never leaves your device.': 'Seu arquivo nunca sai do seu dispositivo.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'Seu arquivo nunca sai do seu dispositivo. [Privacidade](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'Seu arquivo nunca sai do seu dispositivo. Ele é transcrito no seu navegador, neste dispositivo, e nunca é enviado para nós nem para ninguém. As transcrições, suas edições e o arquivo ficam guardados apenas no armazenamento deste navegador e são apagados automaticamente após {idle} de inatividade, ou na hora em que você clica em **Apagar meus dados agora** no menu Transcrições. Não há conta. Exporte o que precisar antes de sair.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'Seu arquivo nunca sai do seu dispositivo. Ele é transcrito direto no seu navegador, sem conta, e suas transcrições ficam neste navegador.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'Seu arquivo fica neste dispositivo. Mantenha esta aba aberta enquanto ele é transcrito.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Seus arquivos e transcrições ficam guardados apenas durante esta sessão e são apagados automaticamente após {idle} de inatividade, ou quando você clica em “Apagar meus dados agora”. Sem conta, sem rastreamento, um cookie de sessão essencial. Exporte o que precisar antes de sair.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Seus arquivos e transcrições ficam guardados apenas durante esta sessão e são apagados automaticamente quando ela termina, ou quando você clica em “Apagar meus dados agora”. Sem conta, sem rastreamento, um cookie de sessão essencial. Exporte o que precisar antes de sair.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'Seus arquivos são apagados automaticamente. [Privacidade](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'Seus arquivos são processados no seu navegador e ficam no seu dispositivo. O site, os downloads e o contador usam conexões criptografadas (HTTPS). Quem puder usar este perfil do navegador consegue ver as transcrições guardadas nele até que sejam apagadas, então clique em **Apagar meus dados agora** em um computador compartilhado.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Seus arquivos são enviados ao nosso servidor para serem processados lá. Eles ficam guardados apenas durante a sua sessão e são apagados automaticamente quando ela termina, após {idle} de inatividade, ou na hora em que você clica em **Apagar meus dados agora** no menu Transcrições. Não há conta nem rastreamento, e o único cookie é um cookie de sessão essencial (sem cookies de análise ou de publicidade).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Seus arquivos são enviados ao nosso servidor para serem processados lá. Eles ficam guardados apenas durante a sua sessão e são apagados automaticamente quando ela termina, ou na hora em que você clica em **Apagar meus dados agora** no menu Transcrições. Não há conta nem rastreamento, e o único cookie é um cookie de sessão essencial (sem cookies de análise ou de publicidade).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'Seus arquivos nunca saem deste dispositivo. As transcrições ficam guardadas apenas neste navegador e são apagadas automaticamente após {idle} de inatividade, ou quando você clica em “Apagar meus dados agora”. Exporte o que precisar antes de sair.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'Seus arquivos nunca saem deste dispositivo. As transcrições ficam guardadas apenas neste navegador e são apagadas automaticamente quando a sessão termina, ou quando você clica em “Apagar meus dados agora”. Exporte o que precisar antes de sair.',
  'Your session ends in {mins} min. Export what you need.':
    'Sua sessão termina em {mins} min. Exporte o que precisar.',
  'Your session has ended': 'Sua sessão terminou',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'Sua sessão terminou e os dados dela foram apagados. Você pode iniciar uma nova transcrição.',
  'Your transcript is ready below.': 'Sua transcrição está pronta abaixo.',
  'Your transcripts': 'Suas transcrições',
  'Your transcripts and files were removed from the server.':
    'Suas transcrições e arquivos foram removidos do servidor.',
  'Your transcripts and files were removed from this device.':
    'Suas transcrições e arquivos foram removidos deste dispositivo.',

  // page titles, descriptions and link labels
  'title:/': 'Vídeo e áudio em texto, grátis e sem login',
  'description:/':
    'Transcreva vídeo e áudio em texto de graça, sem login e sem limite diário. Mais de 50 idiomas, marcas de tempo e exportação em SRT, VTT, TXT e PDF.',
  'title:/how-it-works': 'Como funciona',
  'description:/how-it-works':
    'Como o TranscribeVid transforma vídeo e áudio em texto, com marcas de tempo, em três passos simples, o que você recebe e dicas para bons resultados.',
  'title:/faq': 'Perguntas frequentes',
  'description:/faq':
    'Respostas às dúvidas mais comuns sobre o TranscribeVid: precisão, idiomas, arquivos aceitos e limites, velocidade, privacidade e edição da transcrição.',
  'title:/about': 'Sobre o TranscribeVid',
  'description:/about':
    'Quem cria o TranscribeVid e por quê: uma ferramenta grátis de áudio e vídeo em texto, sem cadastro nem login, com interface limpa, financiada por anúncios.',
  'title:/contact': 'Contato',
  'description:/contact':
    'Como falar com o TranscribeVid: e-mail para dúvidas, relatos de erros, ideias de recursos e pedidos de privacidade, e quem administra o site.',
  'title:/privacy': 'Política de privacidade',
  'description:/privacy':
    'O que o TranscribeVid processa ao transcrever um arquivo, onde, por quê e por quanto tempo, cookies, anúncios, armazenamento no navegador e seus direitos.',
  'title:/terms': 'Termos de uso',
  'description:/terms':
    'As regras de uso do TranscribeVid: serviço gratuito, seu conteúdo, uso aceitável, limites de arquivo, sem garantia de precisão e responsabilidade.',
  'title:/tools': 'Todas as ferramentas gratuitas',
  'description:/tools':
    'Todas as ferramentas gratuitas de vídeo e áudio em texto: por tipo de arquivo, uso, legendas e idiomas. Sem login, sem limite diário, mais de 50 idiomas.',
  'title:/guides': 'Guias de transcrição e legendas',
  'description:/guides':
    'Guias práticos sobre transcrição e legendas: SRT ou VTT, como adicionar legendas a um vídeo, como obter uma transcrição precisa e transcrição privada.',
  'title:/video-to-text': 'Vídeo em texto: conversor grátis, sem login',
  'description:/video-to-text':
    'Converta vídeo em texto de graça, com transcrição precisa e marcas de tempo em mais de 50 idiomas. Sem login, sem limite diário. Baixe SRT, VTT, TXT ou PDF.',
  'label:/video-to-text': 'Vídeo em texto',
  'title:/audio-to-text': 'Áudio em texto: conversor grátis e ilimitado',
  'description:/audio-to-text':
    'Transforme podcasts, entrevistas e aulas em texto. Grátis, com marcas de tempo, mais de 50 idiomas e sem login. Baixe TXT, SRT, VTT ou PDF.',
  'label:/audio-to-text': 'Áudio em texto',
  'title:/mp4-to-text': 'MP4 em texto: transcreva vídeos MP4 grátis',
  'description:/mp4-to-text':
    'Converta um vídeo MP4 em texto com marcas de tempo. Grátis, sem login, sem limite diário, mais de 50 idiomas. Baixe TXT, SRT, VTT, Markdown, JSON ou PDF.',
  'label:/mp4-to-text': 'MP4 em texto',
  'title:/mp3-to-text': 'MP3 em texto: transcrição grátis online',
  'description:/mp3-to-text':
    'Transcreva um MP3 em texto on-line e de graça. Sem login, mais de 50 idiomas e marca de tempo em cada linha. Edite o texto e baixe TXT, SRT, VTT ou PDF.',
  'label:/mp3-to-text': 'MP3 em texto',
  'title:/srt-subtitle-generator': 'Gerador de legendas SRT grátis para vídeo',
  'description:/srt-subtitle-generator':
    'Gere legendas SRT a partir de qualquer vídeo ou áudio, de graça. Sincronizadas com a fala, mais de 50 idiomas, sem login. Edite e baixe SRT ou VTT.',
  'label:/srt-subtitle-generator': 'Gerador de legendas SRT',
  'title:/voice-recording-to-text': 'Gravação de voz em texto: transcritor grátis',
  'description:/voice-recording-to-text':
    'Grave sua voz no navegador ou envie uma nota de voz e receba tudo em texto. Grátis, sem login, mais de 50 idiomas. Baixe TXT, PDF, SRT ou Markdown.',
  'label:/voice-recording-to-text': 'Gravação de voz em texto',
  'title:/wav-to-text': 'WAV em texto: transcrição grátis online',
  'description:/wav-to-text':
    'Converta um arquivo WAV em texto de graça. Aceita gravações longas de gravadores e ligações, mais de 50 idiomas, sem login. Baixe TXT, SRT ou PDF.',
  'label:/wav-to-text': 'WAV em texto',
  'title:/m4a-to-text': 'M4A em texto: transcreva notas de voz grátis',
  'description:/m4a-to-text':
    'Transforme uma nota de voz M4A em texto, de graça. Funciona com o Gravador de Voz do iPhone, sem login, mais de 50 idiomas. Baixe TXT, SRT, VTT ou PDF.',
  'label:/m4a-to-text': 'M4A em texto',
  'title:/webm-to-text': 'WebM em texto: transcrição grátis, sem login',
  'description:/webm-to-text':
    'Converta WebM de vídeo ou áudio em texto, de graça. Funciona com gravações de tela e do navegador, mais de 50 idiomas. Baixe TXT, SRT, VTT ou PDF.',
  'label:/webm-to-text': 'WebM em texto',
  'title:/mov-to-text': 'MOV em texto: transcreva vídeos do iPhone',
  'description:/mov-to-text':
    'Transcreva um vídeo MOV do iPhone ou do QuickTime, de graça. Sem login, mais de 50 idiomas e uma marca de tempo em cada linha. Baixe TXT, SRT, VTT ou PDF.',
  'label:/mov-to-text': 'MOV em texto',
  'title:/whatsapp-voice-message-to-text': 'Áudio do WhatsApp em texto, grátis',
  'description:/whatsapp-voice-message-to-text':
    'Transforme um áudio do WhatsApp em texto, de graça. Salve o áudio, solte aqui e leia em mais de 50 idiomas, inclusive híndi. Sem login e sem criar conta.',
  'label:/whatsapp-voice-message-to-text': 'Áudio do WhatsApp em texto',
  'title:/meeting-recording-to-text': 'Gravação do Zoom, Teams e Meet em texto',
  'description:/meeting-recording-to-text':
    'Transforme uma gravação do Zoom, Teams ou Google Meet em transcrição pesquisável, de graça. Sem login, mais de 50 idiomas. Baixe TXT, SRT, VTT ou PDF.',
  'label:/meeting-recording-to-text': 'Gravação de reunião em texto',
  'title:/lecture-to-text': 'Aula em texto: transcritor de aulas grátis',
  'description:/lecture-to-text':
    'Transforme uma aula gravada em texto pesquisável para estudar. Grátis, sem login, mais de 50 idiomas, com marcas de tempo. Baixe TXT, Markdown, SRT ou PDF.',
  'label:/lecture-to-text': 'Aula em texto',
  'title:/podcast-transcript-generator': 'Gerador de transcrição de podcast grátis',
  'description:/podcast-transcript-generator':
    'Gere a transcrição de um podcast a partir de um MP3 ou WAV, de graça. Marcas de tempo, mais de 50 idiomas, sem login. Baixe TXT, Markdown, SRT, VTT ou PDF.',
  'label:/podcast-transcript-generator': 'Gerador de transcrição de podcast',
  'title:/interview-transcription': 'Transcrição de entrevistas: privada e grátis',
  'description:/interview-transcription':
    'Transcreva entrevistas de graça, sem criar conta. Texto com marcas de tempo em mais de 50 idiomas, para pesquisa, jornalismo e seleção. Baixe TXT ou PDF.',
  'label:/interview-transcription': 'Transcrição de entrevistas',
  'title:/vtt-subtitle-generator': 'Gerador de legendas VTT (WebVTT) grátis',
  'description:/vtt-subtitle-generator':
    'Gere legendas WebVTT (.vtt) a partir de qualquer vídeo ou áudio, de graça. Sincronizadas com a fala, mais de 50 idiomas, sem login. Edite e baixe o VTT.',
  'label:/vtt-subtitle-generator': 'Gerador de legendas VTT',
  'title:/youtube-subtitle-generator': 'Legendas para YouTube: arquivo SRT grátis',
  'description:/youtube-subtitle-generator':
    'Crie um arquivo SRT de legendas para o seu vídeo do YouTube, de graça e sem login. Sincronizado com a fala, mais de 50 idiomas. Envie no YouTube Studio.',
  'label:/youtube-subtitle-generator': 'Gerador de legendas para YouTube',
  'title:/translate-audio-to-english': 'Traduza fala para texto em inglês, grátis',
  'description:/translate-audio-to-english':
    'Transforme fala de outro idioma em texto em inglês, de graça. Envie um vídeo ou áudio e receba texto ou legendas em inglês com marcas de tempo. Sem login.',
  'label:/translate-audio-to-english': 'Traduzir fala para o inglês',
  'title:/guides/srt-vs-vtt': 'SRT ou VTT: qual formato de legenda usar',
  'description:/guides/srt-vs-vtt':
    'SRT ou VTT? O que é cada formato de legenda, como se diferenciam, onde cada um funciona e como obter qualquer um a partir do seu vídeo, de graça.',
  'label:/guides/srt-vs-vtt': 'SRT ou VTT',
  'title:/guides/how-to-add-subtitles-to-a-video': 'Como adicionar legendas a um vídeo (grátis)',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'Faça legendas em quatro passos: transcreva, corrija o texto, exporte SRT ou VTT e adicione o arquivo ao YouTube, ao VLC, a um editor ou ao player web.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'Como adicionar legendas a um vídeo',
  'title:/guides/transcribe-video-without-uploading': 'Transcrever um vídeo sem enviá-lo',
  'description:/guides/transcribe-video-without-uploading':
    'Como funciona a transcrição no navegador, o que fica no seu dispositivo, o que é baixado uma vez e como conferir tudo no painel de rede do navegador.',
  'label:/guides/transcribe-video-without-uploading': 'Transcrever um vídeo sem enviá-lo',
  'title:/guides/accurate-transcripts': 'Como obter uma transcrição mais precisa',
  'description:/guides/accurate-transcripts':
    'Formas práticas de melhorar a precisão da fala em texto: áudio limpo, idioma e modelo certos, dica de vocabulário e como conferir e corrigir o resultado.',
  'label:/guides/accurate-transcripts': 'Como obter uma transcrição mais precisa',
  'title:/guides/what-is-whisper': 'O que é o Whisper? Fala em texto explicado',
  'description:/guides/what-is-whisper':
    'O que é o OpenAI Whisper, com o que foi treinado, qual é a precisão e onde ele tem dificuldade, e como ele roda dentro do seu navegador no TranscribeVid.',
  'label:/guides/what-is-whisper': 'O que é o Whisper?',
  'an independent software developer': 'um desenvolvedor de software independente',
  'Bengaluru, India': 'Bengaluru, Índia',
};

export default dict;
