import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM em texto',
  h1: 'Transcrever uma gravação WebM em texto',
  lead: 'WebM é o formato que navegadores e gravadores de tela salvam. Adicione seu vídeo ou áudio WebM e receba uma transcrição com marcas de tempo, grátis, sem login e sem conversão antes.',
  dropKind: 'video',
  dropNoun: 'o arquivo WebM',

  whyTitle: 'O que há dentro de um arquivo WebM',
  why: [
    'O WebM é um contêiner pensado para a web. Costuma conter vídeo VP8, VP9 ou AV1 com som Opus ou Vorbis. O TranscribeVid lê só o som, então não importa qual codec de vídeo está dentro, e um WebM que contém só áudio funciona igualmente bem.',
    'O Opus, o formato de som que a maioria dos arquivos WebM usa, foi projetado para voz, o que faz dessas gravações uma boa fonte para uma transcrição. O resultado é um texto com horário em cada linha, pronto para pesquisar, citar ou transformar em legendas.',
  ],

  sections: [
    {
      title: 'De onde vêm os arquivos WebM',
      paragraphs: [
        'A maioria dos arquivos WebM é criada pelo próprio navegador, e é por isso que eles aparecem sempre que alguém grava algo on-line.',
      ],
      bullets: [
        {
          title: 'Gravadores de tela e de navegador.',
          text: 'Muitas extensões de gravação de tela e gravadores da web salvam WebM, porque é o formato que um navegador consegue gravar diretamente.',
        },
        {
          title: 'Gravadores de voz on-line.',
          text: 'Um site que grava o seu microfone costuma entregar um arquivo de áudio .webm. Ele pode parecer um arquivo de vídeo, mas contém só som.',
        },
        {
          title: 'Apps da web que você cria ou testa.',
          text: 'Páginas que gravam com o recurso MediaRecorder do navegador costumam produzir WebM no Chrome. O Firefox faz o mesmo para vídeo, mas suas gravações só de som costumam ser Ogg, que esta página também lê.',
        },
      ],
    },
    {
      title: 'Uma peculiaridade dos arquivos WebM gravados',
      paragraphs: [
        'Um WebM gravado ao vivo no navegador muitas vezes não tem a duração total escrita no arquivo. Alguns players então mostram uma duração desconhecida ou não deixam avançar, o que pode parecer um arquivo danificado. O som em si está intacto, e a transcrição é feita a partir dele normalmente.',
        'Se uma gravação de fato falhar, a causa costuma ser mais simples: o microfone estava desligado, então não há fala nenhuma nela. Reproduza o arquivo com o volume alto antes de procurar outro motivo.',
      ],
    },
  ],

  howTitle: 'Como converter um WebM em texto',
  howToDescription:
    'Adicione o arquivo WebM, escolha o idioma falado, confira as linhas e baixe a transcrição como texto ou legendas WebVTT.',
  steps: [
    {
      title: 'Adicione o WebM',
      text: 'Solte o .webm na caixa no topo desta página ou clique em Escolher um arquivo. Um WebM que contém só som entra do mesmo jeito. Para várias gravações, adicione a primeira aqui e as outras com Adicionar outro arquivo na página seguinte.',
    },
    {
      title: 'Escolha o idioma',
      text: 'Na página seguinte, escolha o idioma falado ou mantenha Detectar automaticamente para uma gravação em um só idioma. A qualidade Padrão serve para fala clara de um bom microfone. Depois clique em Transcrever.',
    },
    {
      title: 'Confira as linhas',
      text: 'Veja o texto chegar linha por linha. Abra a transcrição, reproduza a partir de qualquer marca de tempo e corrija as palavras erradas.',
    },
    {
      title: 'Baixe o resultado',
      text: 'Pegue o TXT para ler ou pesquisar. Um WebM pertence à web, então o VTT é o arquivo de legendas natural para ele. SRT e PDF também estão disponíveis.',
    },
  ],

  formatsTitle: 'WebM e outros formatos de vídeo',
  formatsIntro: 'WebM é um de muitos tipos de vídeo e áudio que esta caixa aceita.',
  uploadTitle: 'Arquivos que você pode adicionar',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'as palavras faladas em texto simples' },
    { name: 'VTT', use: 'legendas para o mesmo WebM em uma página da web' },
    { name: 'SRT', use: 'legendas para players e editores' },
    { name: 'Markdown', use: 'notas com horários' },
    { name: 'JSON', use: 'cada linha e horário, para programas' },
    { name: 'PDF', use: 'uma transcrição para imprimir ou compartilhar' },
  ],

  tipsTitle: 'Dicas para transcrever gravações WebM',
  tips: [
    {
      title: 'Ligue o microfone antes de gravar.',
      text: 'Gravadores de tela muitas vezes capturam só a imagem, a menos que você marque a opção de microfone ou de áudio do sistema. Sem som, não há nada para transcrever.',
    },
    {
      title: 'Espere uma única faixa de voz.',
      text: 'Se você gravou a aba de uma reunião junto com o seu próprio microfone, todos acabam na mesma faixa. Não há rótulos de quem fala, então acrescente os nomes ao editar.',
    },
    {
      title: 'Use VTT para a web.',
      text: 'O elemento de vídeo de um navegador lê legendas VTT por meio do elemento track. Ele não lê SRT, então escolha VTT para um WebM na sua própria página.',
    },
    {
      title: 'Corte gravações muito longas.',
      text: 'Arquivos acima do limite de tamanho ou de duração são recusados, então corte um WebM longo em partes antes.',
      browser: {
        title: 'Gravações longas demoram mais.',
        text: 'O site não define limite de tamanho nem de duração. Uma captura de tela longa ainda precisa de tempo e de memória livre, e um navegador mais antigo pode recusar um arquivo muito longo, então no celular corte-o em partes antes.',
      },
    },
    {
      title: 'Liste nomes e comandos.',
      text: 'Em uma demonstração de software, coloque nomes de produtos, comandos e siglas na dica de vocabulário para que sejam escritos do jeito que você os escreve.',
    },
  ],

  faqs: [
    {
      question: 'Por que não consigo reproduzir meu WebM no celular, e ainda posso transcrevê-lo?',
      answer:
        'Alguns celulares e players mais antigos não conseguem abrir WebM. Isso não importa aqui: o TranscribeVid só precisa do som, então você ainda pode adicionar o arquivo e receber uma transcrição.',
    },
    {
      question: 'Posso transcrever um WebM só de áudio?',
      answer:
        'Sim. Alguns gravadores salvam arquivos só de som com a extensão .webm. Eles são lidos como qualquer outro arquivo de áudio.',
    },
    {
      question: 'Importa se meu WebM usa VP8, VP9 ou AV1?',
      answer:
        'Não. A imagem é ignorada. O que importa é que o arquivo tenha uma trilha de som em um formato comum, como o Opus.',
    },
    {
      question: 'Como uso as legendas com um WebM na minha própria página da web?',
      answer:
        'Baixe o arquivo VTT, salve-o ao lado do vídeo e aponte um elemento track dentro do elemento de vídeo para ele. A página do gerador de legendas VTT mostra como o arquivo é e a marcação exata.',
    },
    {
      question: 'Por que minha gravação de tela deu uma transcrição vazia?',
      answer:
        'Muito provavelmente ela não contém fala: o microfone estava desligado ou só sons do sistema foram gravados. Se você ouve pessoas falando mas não obtém texto, mantenha Melhorar o áudio ativado em Mais opções e tente uma qualidade mais alta.',
    },
  ],

  links: [
    {
      label: 'Gerador de legendas VTT',
      path: '/vtt-subtitle-generator',
      note: 'O que um arquivo WebVTT contém e como anexá-lo a um vídeo na sua própria página.',
    },
    {
      label: 'Como adicionar legendas a um vídeo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Todo o caminho da gravação às legendas publicadas, passo a passo.',
    },
    {
      label: 'Gravação de reunião em texto',
      path: '/meeting-recording-to-text',
      note: 'Para chamadas e webinars gravados, incluindo como tirar a gravação da ferramenta de reunião.',
    },
    {
      label: 'MP4 em texto',
      path: '/mp4-to-text',
      note: 'O mesmo serviço para MP4, o formato de vídeo mais comum.',
    },
  ],
};
