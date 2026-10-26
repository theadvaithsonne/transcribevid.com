import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A em texto',
  h1: 'Transcrever uma nota de voz M4A em texto',
  lead: 'M4A é o que o Gravador de Voz do iPhone e do Mac, muitos gravadores Android e apps da Apple salvam. Adicione o arquivo e receba uma transcrição com marcas de tempo, grátis, sem login e sem conversão para MP3.',
  dropKind: 'audio',
  dropNoun: 'o arquivo M4A',

  whyTitle: 'Por que arquivos M4A são bem transcritos',
  why: [
    'Um M4A é um arquivo MPEG-4 só de áudio. Costuma conter som AAC, que é comprimido mas mais do que bom o bastante para fala, então os arquivos M4A são pequenos e se transcrevem bem. O TranscribeVid os lê diretamente. Não há nada para converter antes.',
    'Notas de voz são feitas em movimento, então muitas vezes ficam baixas, com eco ou gravadas com o celular no bolso. As opções de qualidade e de limpeza desta página existem justamente para esse tipo de gravação.',
  ],

  sections: [
    {
      title: 'Como tirar uma nota de voz do celular',
      paragraphs: [
        'Os nomes dos menus mudam entre versões do iOS, do macOS e do Android, então use isto como um guia. Se você está no próprio celular, clique em Escolher um arquivo e escolha a gravação em Arquivos ou na pasta de gravações. Não precisa de computador.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'No Gravador de Voz, abra a gravação, toque no botão Mais (três pontos) e escolha Compartilhar. Salve em Arquivos ou envie para você mesmo por AirDrop ou e-mail e depois adicione aqui.',
        },
        {
          title: 'Mac.',
          text: 'Arraste uma gravação da janela do Gravador de Voz para a Mesa. Ela chega como um arquivo .m4a, pronto para adicionar.',
        },
        {
          title: 'Android.',
          text: 'Muitos apps de gravador salvam arquivos M4A em uma pasta Gravações ou Gravador de Voz. O nome da pasta depende do app, e o seletor de arquivos consegue abri-la.',
        },
      ],
    },
    {
      title: 'Notas de voz sem perdas e comprimidas',
      paragraphs: [
        'O Gravador de Voz do iPhone pode salvar gravações como Comprimida ou Sem Perdas. Os arquivos sem perdas são bem maiores, também terminam em .m4a e costumam usar o codec Apple Lossless. A fala não precisa disso: uma nota Comprimida dá a mesma transcrição com uma fração do tamanho.',
      ],
      browser: {
        paragraphs: [
          'O Gravador de Voz do iPhone pode salvar gravações como Comprimida ou Sem Perdas. Os arquivos sem perdas são bem maiores, também terminam em .m4a e costumam usar o codec Apple Lossless, que nem todo navegador consegue ler sozinho. Se o seu não conseguir, a página pode oferecer o carregamento de um pequeno conversor (cerca de 9 MB) que roda no seu dispositivo. A fala não precisa de Sem Perdas: uma nota Comprimida dá a mesma transcrição com uma fração do tamanho.',
        ],
      },
    },
  ],

  howTitle: 'Como transformar um M4A em texto',
  howToDescription:
    'Adicione o arquivo M4A, escolha o idioma falado, aguarde a transcrição e baixe-a como texto.',
  steps: [
    {
      title: 'Adicione o M4A',
      text: 'Solte a nota .m4a na caixa no topo desta página ou clique em Escolher um arquivo e, no celular, escolha-a em Arquivos ou na pasta de gravações. Só uma nota entra nesta caixa; na página seguinte, Adicionar outro arquivo traz as demais.',
    },
    {
      title: 'Escolha o idioma',
      text: 'Na página seguinte, selecione o idioma falado. Uma nota curta dá pouco material para Detectar automaticamente, então informar o idioma é mais confiável. A qualidade Padrão serve para a maioria das notas. Depois clique em Transcrever.',
    },
    {
      title: 'Aguarde a transcrição',
      text: 'As linhas aparecem uma a uma com uma barra de progresso e uma estimativa do tempo restante. Reproduza a partir de qualquer linha para ouvir o que foi dito.',
    },
    {
      title: 'Corrija e salve',
      text: 'Corrija qualquer palavra errada e baixe TXT, Markdown ou PDF para anotações, ou SRT ou VTT se a nota acompanha um vídeo. Uma transcrição vive só durante a sua sessão, então baixe-a antes de fechar a página.',
    },
  ],

  formatsTitle: 'M4A e outros formatos de áudio',
  formatsIntro:
    'Gravadores de celular e de computador salvam em formatos diferentes. Esta caixa aceita todos estes.',
  uploadTitle: 'Arquivos de áudio que você pode adicionar',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'suas palavras em texto simples' },
    { name: 'Markdown', use: 'notas com horários' },
    { name: 'PDF', use: 'uma cópia da nota para imprimir' },
    { name: 'SRT', use: 'linhas com tempo para um vídeo que acompanha a nota' },
    { name: 'VTT', use: 'linhas com tempo para players da web' },
    { name: 'JSON', use: 'linhas estruturadas para programas' },
  ],

  tipsTitle: 'Dicas para transcrever notas de voz',
  tips: [
    {
      title: 'Segure o celular perto.',
      text: 'Uma nota gravada com o celular no bolso ou do outro lado da mesa é difícil para qualquer sistema de reconhecimento. Segure o celular a um palmo da boca e fale por cima dele, não direto nele.',
    },
    {
      title: 'Corte antes de compartilhar.',
      text: 'A maioria dos apps de nota de voz deixa cortar o começo e o fim de uma gravação. Remover uma pausa longa em qualquer ponta economiza tempo de espera.',
    },
    {
      title: 'Informe o idioma.',
      text: 'Para uma nota de dez ou vinte segundos, escolher o idioma falado é melhor do que a detecção automática, principalmente com fala com sotaque ou uma mistura de idiomas.',
    },
    {
      title: 'Dê a ele os nomes difíceis.',
      text: 'Adicione nomes incomuns à dica de vocabulário em Mais opções e é muito mais provável que saiam certos.',
    },
  ],

  faqs: [
    {
      question: 'Posso transcrever uma nota do Gravador de Voz do iPhone sem convertê-la?',
      answer:
        'Sim. As notas de voz são arquivos M4A e o TranscribeVid lê M4A diretamente. Compartilhe a nota em Arquivos ou no seu computador e adicione-a aqui. Não a converta para MP3 antes.',
    },
    {
      question: 'Um arquivo M4A é o mesmo que um MP4?',
      answer:
        'São parentes próximos. Os dois usam o contêiner MPEG-4; um M4A guarda só áudio, enquanto um MP4 costuma levar vídeo também. O TranscribeVid lê o som de qualquer um dos dois.',
    },
    {
      question: 'Por que minha transcrição de M4A está vazia ou muito curta?',
      answer:
        'A nota pode estar muda, muito baixa ou ter quase só ruído de fundo. Ouça-a primeiro. Se estiver fraca, mantenha Melhorar o áudio ativado em Mais opções e confira se o arquivo não foi cortado quando você o compartilhou.',
    },
    {
      question: 'Posso transcrever uma reunião longa gravada no celular?',
      answer:
        'Sim. Os arquivos M4A são pequenos, então uma gravação longa é fácil de adicionar. {limits} Não há cota diária nem mensal.',
      browser: {
        answer:
          'Sim. Os arquivos M4A são pequenos, então uma gravação longa é fácil de adicionar. O site não define limite de tamanho nem de duração porque o seu próprio dispositivo faz o trabalho, então uma nota muito longa simplesmente demora mais, e em um dispositivo mais lento a página avisa antes de você começar. Um navegador mais antigo pode recusar um arquivo muito longo.',
      },
    },
    {
      question: 'Posso transcrever uma nota de voz em híndi ou em espanhol?',
      answer:
        'Sim. Escolha o idioma falado na lista de mais de 50 ou deixe Detectar automaticamente ativado para uma nota em um só idioma. Para o híndi, o Estilo da transcrição (ao lado de Idioma) permite escolher letras romanas (Hinglish) ou a escrita devanágari original.',
    },
  ],

  links: [
    {
      label: 'Gravação de voz em texto',
      path: '/voice-recording-to-text',
      note: 'Grave com o microfone na própria página em vez de enviar um arquivo.',
    },
    {
      label: 'MP3 em texto',
      path: '/mp3-to-text',
      note: 'A mesma transcrição gratuita para arquivos MP3, o outro formato de voz comum.',
    },
    {
      label: 'Aula em texto',
      path: '/lecture-to-text',
      note: 'Transforme uma aula gravada em notas que você pode pesquisar e estudar.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'Mudanças simples na gravação e nas configurações que fazem a maior diferença.',
    },
  ],
};
