import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV em texto',
  h1: 'Transcrever um vídeo MOV em texto',
  lead: 'MOV é o que iPhones, Macs e muitas câmeras gravam. Adicione seu MOV e receba uma transcrição com marcas de tempo, grátis e sem login. Só o som é lido, então o tamanho e o codec da imagem não importam.',
  dropKind: 'video',
  dropNoun: 'o arquivo MOV',

  whyTitle: 'Por que arquivos MOV não precisam de conversão',
  why: [
    'MOV é o formato QuickTime da Apple. Como um MP4, ele guarda imagem e som juntos, e a maioria dos arquivos MOV traz som AAC, que é lido diretamente. O TranscribeVid lê esse som e ignora a imagem, então não há necessidade de uma etapa separada de MOV para MP4.',
    'Arquivos MOV costumam ser grandes, porque celulares e câmeras gravam em alta qualidade. Você não precisa reduzir nem converter o seu. O caminho mais rápido do rolo da câmera até uma transcrição é adicionar o arquivo como está.',
  ],

  sections: [
    {
      title: 'De onde vêm os arquivos MOV',
      bullets: [
        {
          title: 'Vídeos de iPhone e iPad.',
          text: 'Vídeos gravados com o app Câmera são salvos como arquivos .MOV, seja o formato de imagem H.264 ou HEVC.',
        },
        {
          title: 'Gravações de tela do Mac.',
          text: 'A barra de ferramentas de captura (Shift-Command-5) e o QuickTime Player salvam gravações de tela como .mov. Escolha um microfone antes de gravar, ou o arquivo não terá fala.',
        },
        {
          title: 'Câmeras e programas de edição.',
          text: 'Muitas câmeras mirrorless gravam MOV, e editores de vídeo como Final Cut Pro e Adobe Premiere Pro podem exportá-lo.',
        },
      ],
    },
    {
      title: 'Como tirar um vídeo do iPhone',
      paragraphs: [
        'O jeito mais simples é abrir esta página no próprio iPhone e clicar em Escolher um arquivo. Você pode escolher um vídeo da biblioteca de Fotos ou de Arquivos. Se o celular perguntar qual formato usar ao escolher, qualquer resposta serve, porque só o som é lido.',
        'Para transcrever em um computador, envie o vídeo por AirDrop, salve em Arquivos ou no iCloud Drive, ou copie com um cabo. Os nomes dos menus mudam entre versões do iOS e do macOS, então use isto como um guia.',
      ],
    },
    {
      title: 'Vídeos com mais de uma faixa de áudio',
      paragraphs: [
        'Algumas câmeras e editores gravam várias faixas de áudio em um mesmo MOV, por exemplo o microfone da câmera e um microfone de lapela. O TranscribeVid usa a primeira faixa de áudio que consegue ler. Se a fala que você quer está em outra faixa, exporte antes uma cópia com essa faixa ou misture as faixas no seu editor.',
      ],
    },
  ],

  howTitle: 'Como converter um MOV em texto',
  howToDescription:
    'Adicione o vídeo MOV, escolha o idioma falado e a qualidade, aguarde a transcrição e baixe-a.',
  steps: [
    {
      title: 'Adicione o MOV',
      text: 'Clique em Escolher um arquivo no topo desta página ou solte o .mov na caixa. Um iPhone oferece Fotos e Arquivos. Um vídeo por vez cabe nesta caixa; Adicionar outro arquivo, na página seguinte, enfileira mais.',
    },
    {
      title: 'Defina o idioma e a qualidade',
      text: 'Na página seguinte, escolha o idioma falado. Padrão é o recomendado. Para vento, trânsito ou uma pessoa distante, Alta precisão e Precisão máxima demoram mais e cometem menos erros. Depois clique em Transcrever.',
      browser: {
        text: 'Na página seguinte, escolha o idioma falado. Padrão é o recomendado. Para vento, trânsito ou uma pessoa distante, experimente Alta precisão ou Precisão máxima se o seu dispositivo as oferecer: demoram mais e cometem menos erros, cada uma exige um download inicial maior, e um dispositivo que não consegue executar uma delas a mostra acinzentada, com o motivo. Depois clique em Transcrever.',
      },
    },
    {
      title: 'Leia e corrija',
      text: 'O texto chega linha por linha, com um horário em cada uma. Reproduza a partir de qualquer linha, corrija o que estiver errado e apague as linhas que você não quer.',
    },
    {
      title: 'Baixe a transcrição',
      text: 'Pegue o TXT ou um PDF para ler, ou SRT ou VTT para usar como legendas em um editor de vídeo ou na web. Seu MOV nunca é alterado.',
    },
  ],

  formatsTitle: 'MOV e outros formatos de vídeo',
  formatsIntro: 'A mesma caixa aceita MOV e estes outros tipos, além dos formatos de áudio usuais.',
  uploadTitle: 'Arquivos de vídeo que você pode adicionar',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'as palavras faladas em texto simples' },
    { name: 'SRT', use: 'legendas para editores e players' },
    { name: 'VTT', use: 'legendas para uma página da web' },
    { name: 'PDF', use: 'uma transcrição para imprimir ou compartilhar' },
    { name: 'Markdown', use: 'notas com horários' },
    { name: 'JSON', use: 'dados para as suas próprias ferramentas' },
  ],

  tipsTitle: 'Dicas para transcrever vídeos MOV',
  tips: [
    {
      title: 'Mantenha Melhorar o áudio ativado.',
      text: 'Vídeos de celular captam vento, ruído de manuseio e eco da sala. A opção Melhorar o áudio em Mais opções tira o ruído grave e o chiado e realça vozes baixas.',
    },
    {
      title: 'Confira qual faixa tem a voz.',
      text: 'Se uma câmera gravou dois microfones como faixas separadas, reproduza o vídeo e confirme que a primeira faixa é a que tem a fala.',
    },
    {
      title: 'Corte gravações longas em pausas naturais.',
      text: 'Arquivos acima do limite de tamanho ou de duração são recusados. Corte o vídeo em partes ou exporte só o áudio e depois adicione.',
      browser: {
        title: 'Gravações longas precisam de memória.',
        text: 'O site não define limite de tamanho nem de duração, mas um vídeo longo precisa de tempo e de memória livre, principalmente no celular, e um navegador mais antigo pode recusar um arquivo muito longo. Para uma gravação muito longa, exporte só o áudio no seu editor ou corte o vídeo em partes.',
      },
    },
    {
      title: 'Grave com som de propósito.',
      text: 'Uma gravação de tela do Mac feita sem microfone não tem fala, e a transcrição sai vazia.',
    },
  ],

  faqs: [
    {
      question: 'Posso transcrever um vídeo do iPhone sem converter MOV em MP4?',
      answer:
        'Sim. Adicione o MOV como está. O TranscribeVid lê a trilha de som e ignora a imagem, então não é preciso converter.',
    },
    {
      question: 'Um vídeo 4K ou HEVC do meu iPhone funciona?',
      answer:
        'Sim. Só o som é usado, então o tamanho da imagem e o formato do vídeo não importam. O que conta é a trilha de som, e as gravações do iPhone e do Mac usam som AAC, que é lido diretamente.',
    },
    {
      question: 'Como levo um vídeo do iPhone para o computador para transcrever?',
      answer:
        'Envie por AirDrop para um Mac, salve em Arquivos ou no iCloud Drive, ou copie com um cabo. Ou dispense o computador: abra esta página no iPhone e escolha o vídeo em Fotos.',
    },
    {
      question: 'Por que minha gravação de tela do Mac não tem texto?',
      answer:
        'Uma gravação de tela só leva som se um microfone foi escolhido antes de gravar. Na barra de ferramentas do Shift-Command-5, abra Opções, escolha um microfone e grave de novo. Os nomes dos menus podem variar entre versões do macOS.',
    },
    {
      question: 'O que acontece se meu MOV tem duas faixas de áudio?',
      answer:
        'O TranscribeVid usa a primeira faixa de áudio que consegue ler. Se a fala está em outra faixa, exporte antes uma cópia com essa faixa ou misture as faixas no seu editor.',
    },
  ],

  links: [
    {
      label: 'MP4 em texto',
      path: '/mp4-to-text',
      note: 'O mesmo serviço para arquivos MP4, o outro formato comum de vídeo de celular.',
    },
    {
      label: 'Vídeo em texto',
      path: '/video-to-text',
      note: 'A página principal para qualquer arquivo de vídeo, com dicas para aulas, entrevistas e vídeos curtos.',
    },
    {
      label: 'Gerador de legendas SRT',
      path: '/srt-subtitle-generator',
      note: 'Crie legendas para o seu MOV e veja como é um arquivo SRT por dentro.',
    },
    {
      label: 'Como adicionar legendas a um vídeo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'O que fazer com o arquivo de legendas depois de baixá-lo.',
    },
  ],
};
