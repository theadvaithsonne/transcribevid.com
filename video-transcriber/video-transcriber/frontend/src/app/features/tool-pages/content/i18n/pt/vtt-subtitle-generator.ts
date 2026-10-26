import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Gerador de legendas VTT',
  h1: 'Gerar um arquivo de legendas WebVTT (.vtt) a partir de um vídeo',
  lead: 'Adicione um arquivo de vídeo ou áudio e baixe um arquivo de legendas WebVTT sincronizado com a fala. Grátis, sem login, e você pode corrigir as linhas antes de exportar. Use com o elemento de vídeo HTML5 ou qualquer player da web.',
  dropKind: 'video',
  dropNoun: 'o vídeo',

  whyTitle: 'O que é o WebVTT e por que a web o usa',
  why: [
    'O WebVTT (.vtt) é o formato de legendas da web. É um arquivo de texto simples que os navegadores entendem nativamente: aponte o elemento track de um vídeo para um arquivo .vtt e as legendas aparecem, sem plugin e sem script.',
    'Ele se parece muito com o SRT, com algumas diferenças que importam. Um arquivo VTT começa com a palavra WEBVTT, usa um ponto em vez de uma vírgula antes dos milissegundos e não precisa de falas numeradas. A maioria dos players da web o lê. Se você não tem certeza de qual formato precisa, o guia sobre SRT e VTT explica a escolha.',
  ],

  sections: [
    {
      title: 'Como usar um arquivo VTT na sua página da web',
      paragraphs: [
        'Salve o arquivo .vtt ao lado do seu vídeo e depois adicione um elemento track dentro do elemento video, por exemplo: <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. Os atributos fazem o seguinte.',
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Use subtitles para as palavras faladas. Use captions quando o arquivo também descreve outros sons, como música ou risos.',
        },
        {
          title: 'srclang.',
          text: 'O idioma do arquivo como um código curto, por exemplo en para inglês ou es para espanhol. Adicione um elemento track para cada idioma que você tiver.',
        },
        {
          title: 'label e default.',
          text: 'label é o nome mostrado no menu de legendas do player. default ativa essa faixa quando a página carrega.',
        },
      ],
    },
    {
      title: 'Por que as legendas não aparecem: as causas usuais',
      paragraphs: [
        'Mantenha o arquivo .vtt no mesmo site da página. Um arquivo em outro domínio precisa dos cabeçalhos de origem cruzada certos vindos do servidor dele, e o elemento video precisa de um atributo crossorigin, ou o navegador o ignora em silêncio. Confira também que a primeira linha do arquivo diz WEBVTT e que as legendas estão ativadas nos controles do player.',
      ],
    },
    {
      title: 'O que este gerador faz e o que não faz',
      paragraphs: [
        'Ele transforma a fala do seu vídeo em texto com tempo. As linhas são cortadas no fim das frases e nas pausas, em linhas de cerca de 42 caracteres com no máximo duas linhas, e o arquivo contém apenas texto com tempo. Ele não traduz para outros idiomas (exceto inglês, por meio de Saída em Mais opções), não acrescenta nomes de quem fala, não cria estilos nem marcadores de capítulo e não grava as legendas na imagem. O próprio WebVTT aceita estilos e capítulos, e você pode acrescentá-los à mão em um editor de texto.',
      ],
    },
  ],

  howTitle: 'Como gerar um arquivo de legendas VTT',
  howToDescription:
    'Adicione um vídeo, escolha o idioma, confira as linhas e baixe as legendas como arquivo WebVTT.',
  steps: [
    {
      title: 'Adicione seu vídeo',
      text: 'Coloque um vídeo na caixa no topo desta página: solte-o ali ou clique em Escolher um arquivo. Um arquivo só de som também funciona, se texto com tempo é tudo o que você precisa. Na página seguinte, Adicionar outro arquivo traz mais.',
    },
    {
      title: 'Escolha o idioma',
      text: 'Na página seguinte, escolha o idioma falado ou deixe Detectar automaticamente ativado. Mantenha Tempo por palavra ativado em Mais opções: o início e o fim de cada linha seguem então as palavras. Depois clique em Transcrever.',
    },
    {
      title: 'Confira as linhas',
      text: 'Leia a transcrição, reproduza a partir de uma marca de tempo para conferi-la e corrija as palavras erradas. Apague as linhas que você não quer nas legendas.',
    },
    {
      title: 'Baixe o VTT',
      text: 'Escolha VTT nas opções de download. Suas edições estão incluídas. O SRT está disponível a partir da mesma transcrição se um player precisar dele.',
    },
  ],

  formatsTitle: 'O formato VTT e os arquivos compatíveis',
  formatsIntro:
    'Adicione qualquer arquivo de vídeo ou áudio e baixe WebVTT. É assim que um arquivo VTT é por dentro:',
  uploadTitle: 'Arquivos que você pode adicionar',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: 'WebVTT para o elemento de vídeo HTML5 e players da web' },
    { name: 'SRT', use: 'falas numeradas, para a maioria dos players e editores' },
    { name: 'TXT', use: 'as mesmas palavras sem horários' },
    { name: 'Markdown', use: 'texto com marcas de tempo' },
    { name: 'JSON', use: 'cada linha e horário, para programas' },
    { name: 'PDF', use: 'um roteiro para imprimir' },
  ],
  exampleLabel: 'Um exemplo de arquivo WebVTT',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Bom dia a todos, e sejam bem-vindos.

00:00:04.000 --> 00:00:07.300
Neste vídeo, vamos configurar o projeto do zero.

00:00:07.700 --> 00:00:10.900
Vamos começar pela estrutura de pastas.`,

  tipsTitle: 'Dicas para arquivos WebVTT',
  tips: [
    {
      title: 'Teste em um navegador de verdade.',
      text: 'Abra a sua página, clique em reproduzir e ative as legendas nos controles do vídeo. Faça isso em mais de um navegador antes de publicar.',
    },
    {
      title: 'Use o código de idioma certo.',
      text: 'Defina srclang com um código válido como en, es ou hi. Um código errado pode fazer o player rotular ou escolher a faixa de forma errada.',
    },
    {
      title: 'Leia as linhas na velocidade do vídeo.',
      text: 'Reproduza o vídeo com o som desligado e as legendas ativadas, e confira se cada linha fica na tela tempo suficiente para ser lida.',
    },
    {
      title: 'Escreva os nomes do jeito que você quer.',
      text: 'Coloque nomes de marcas e termos técnicos na dica de vocabulário em Mais opções antes de começar, para que saiam certos em todas as linhas.',
    },
  ],

  faqs: [
    {
      question: 'Qual a diferença entre um arquivo VTT e um arquivo SRT?',
      answer:
        'Um arquivo VTT começa com a linha WEBVTT, escreve os horários com um ponto (00:00:01.000) onde o SRT usa uma vírgula (00:00:01,000) e não precisa de números de fala. Os navegadores leem VTT no elemento de vídeo, enquanto o SRT precisa de um player ou script que o suporte.',
    },
    {
      question: 'Como adiciono um arquivo VTT a um vídeo HTML?',
      answer:
        'Salve o arquivo .vtt ao lado do vídeo e adicione um elemento track dentro do elemento video, com kind definido como subtitles, src apontando para o arquivo, srclang com o código do idioma e um label para o menu.',
    },
    {
      question: 'Quais players leem arquivos VTT?',
      answer:
        'Todos os principais navegadores leem VTT pelo elemento de vídeo, e a maioria dos players de vídeo da web também. Alguns players e editores de computador preferem SRT. Para esses, baixe o SRT a partir da mesma transcrição.',
    },
    {
      question: 'O arquivo VTT pode incluir capítulos ou estilos?',
      answer:
        'O arquivo que o TranscribeVid gera contém apenas texto com tempo. O próprio WebVTT aceita estilos e capítulos, que você pode acrescentar à mão em um editor de texto.',
    },
    {
      question: 'Por que meu arquivo VTT não aparece no player?',
      answer:
        'As causas comuns são uma primeira linha que não é WEBVTT, um arquivo em outro domínio sem os cabeçalhos de origem cruzada certos, um srclang ou kind errado ou legendas desativadas no player. Abra o arquivo em um editor de texto e confira a primeira linha.',
    },
  ],

  links: [
    {
      label: 'Gerador de legendas SRT',
      path: '/srt-subtitle-generator',
      note: 'A mesma transcrição como arquivo SRT numerado, com um exemplo prático.',
    },
    {
      label: 'SRT ou VTT: qual formato de legenda usar',
      path: '/guides/srt-vs-vtt',
      note: 'Uma comparação lado a lado dos dois formatos e de onde cada um funciona.',
    },
    {
      label: 'Como adicionar legendas a um vídeo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Da transcrição às legendas publicadas, para a web e para outros players.',
    },
    {
      label: 'WebM em texto',
      path: '/webm-to-text',
      note: 'Para gravações de tela e de navegador, o formato que combina melhor com um arquivo VTT.',
    },
  ],
};
