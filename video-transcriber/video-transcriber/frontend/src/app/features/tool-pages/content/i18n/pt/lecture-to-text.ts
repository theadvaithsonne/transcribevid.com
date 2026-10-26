import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Aula em texto',
  h1: 'Aula em texto: transforme uma gravação em uma transcrição pesquisável',
  lead: 'Grave a aula, solte o arquivo aqui e leia-a como texto com marcas de tempo: algo que você pode pesquisar atrás de um tema de prova, copiar para as suas anotações e conferir com a gravação. Sem conta, sem taxa e em mais de 50 idiomas.',
  dropKind: 'video',
  dropNoun: 'a gravação da aula',

  whyTitle: 'Por que transcrever uma aula',
  why: [
    'Uma aula é fácil de assistir e difícil de estudar. Você não consegue pesquisar uma gravação atrás da definição de que precisa, e reproduzir uma hora para achá-la leva tanto tempo quanto a aula levou. Uma transcrição dá as palavras em ordem, com o horário ao lado de cada linha, para você pular para a parte de que precisa.',
    'Ela também ajuda quem acha mais fácil ler do que ouvir, quem estuda em um segundo idioma, quem perdeu uma aula ou quem quer o texto de uma palestra que deu. Peça permissão ao professor antes de gravar e siga as regras da sua instituição sobre gravações.',
  ],

  sections: [
    {
      title: 'Da transcrição às notas de estudo',
      paragraphs: [
        'Uma transcrição é matéria-prima, não notas prontas. Estas são quatro formas como estudantes a usam.',
      ],
      bullets: [
        {
          title: 'Pesquise antes de revisar.',
          text: 'Quando a transcrição estiver pronta, digite um termo na caixa Pesquisar no texto acima dela. A caixa conta as linhas que combinam e as setas passam de uma para outra, então você pode reproduzir cada uma a partir da marca de tempo e ouvir a explicação de novo. Se uma palavra técnica saiu escrita errada em todo lugar, Substituir… corrige todas as linhas de uma vez.',
        },
        {
          title: 'Monte o seu próprio roteiro.',
          text: 'Leia o texto uma vez, acrescente os seus títulos e reduza-o ao que você precisa. Pôr uma ideia nas suas próprias palavras costuma ser uma forma melhor de aprendê-la do que copiá-la.',
        },
        {
          title: 'Confira nomes, números e fórmulas.',
          text: 'O reconhecimento de fala escreve o que ouve. Equações, símbolos e termos incomuns muitas vezes precisam de correção, então confira-os com os slides e com a gravação.',
        },
        {
          title: 'Liste o que você não entendeu.',
          text: 'Copie as marcas de tempo das partes em que você se perdeu para uma lista e leve-a para a próxima monitoria ou horário de atendimento.',
        },
      ],
    },
    {
      title: 'Vocabulário técnico e outros idiomas',
      paragraphs: [
        'As palavras de uma disciplina são as mais difíceis para qualquer sistema de reconhecimento de fala. Antes de começar, abra Mais opções e liste os termos, os nomes de teorias e de autores e as abreviações na dica de vocabulário. A transcrição passa a escrevê-los do jeito que você os escreveu com mais frequência.',
        'Se você estuda em um idioma que não é o seu primeiro, uma transcrição dá a você um texto para ler no seu ritmo e para consultar palavras. Escolha o idioma da aula ou mantenha Detectar automaticamente. Uma aula em outro idioma também pode virar texto em inglês: em Mais opções, defina Saída como Traduzir para o inglês. A tradução é menos confiável do que transcrever no idioma original e pode perder termos técnicos, então confira com a gravação.',
      ],
    },
  ],

  howTitle: 'Como converter uma aula em texto',
  howToDescription:
    'Adicione a gravação da aula, defina o idioma e os termos técnicos, aguarde a transcrição e baixe-a como notas.',
  steps: [
    {
      title: 'Adicione a gravação da aula',
      text: 'Arraste o arquivo para a caixa acima ou clique em Escolher um arquivo. Um arquivo de um gravador de voz de celular, um vídeo de aula salvo ou uma gravação de tela de uma aula on-line funcionam, e só o som é usado. A caixa aceita um arquivo por vez e o leva para a tela de envio na página seguinte, onde Adicionar outro arquivo traz as outras sessões de um curso.',
    },
    {
      title: 'Defina o idioma e a qualidade',
      text: 'Na página seguinte, escolha o idioma da aula. Padrão serve para uma gravação clara. Para um auditório com eco ou um professor que fala rápido, Alta precisão ajuda se o seu dispositivo conseguir executá-la (a opção fica acinzentada, com um motivo, quando não consegue). Espere um trabalho mais lento e um download inicial maior.',
    },
    {
      title: 'Adicione os termos técnicos e comece',
      text: 'Em Mais opções, digite os termos-chave, nomes e abreviações na dica de vocabulário, por exemplo ciclo de Krebs, bayesiano, Dr. Okafor. Depois clique em Transcrever.',
    },
    {
      title: 'Leia, corrija e baixe',
      text: 'Reproduza as linhas a partir das marcas de tempo para conferi-las e corrija os erros. Depois baixe TXT ou Markdown para o seu app de notas, ou PDF para imprimir.',
    },
  ],

  formatsTitle: 'Arquivos de gravação de aula e downloads',
  formatsIntro:
    'Gravações de celular, vídeos salvos e gravações de tela de aulas podem ser adicionados; só a trilha de som é lida.',
  uploadTitle: 'Arquivos de gravação que você pode adicionar',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'texto simples para um app de notas' },
    { name: 'Markdown', use: 'texto com horários, fácil de reestruturar' },
    { name: 'PDF', use: 'uma cópia de estudo para imprimir' },
    { name: 'SRT', use: 'legendas, se a aula é um vídeo que você compartilha' },
  ],

  tipsTitle: 'Dicas para gravações de aula',
  tips: [
    {
      title: 'Peça permissão antes.',
      text: 'Alguns professores e instituições não permitem gravação. Pergunte e siga as regras que receber.',
    },
    {
      title: 'Grave perto de quem fala.',
      text: 'Um gravador na frente da sala costuma ser melhor do que um melhor ainda no fundo, porque distância e eco muitas vezes custam mais precisão do que qualquer configuração consegue recuperar.',
    },
    {
      title: 'Divida sessões muito longas.',
      text: 'Se uma sessão for maior ou mais longa do que os limites desta página, corte-a em partes no intervalo antes de adicioná-la.',
      browser: {
        title: 'Sessões longas demoram mais.',
        text: 'Nenhum limite de duração é definido, mas uma aula longa deixa o seu dispositivo ocupado por um tempo e precisa de memória livre, e um navegador que não usa WebCodecs pode ter dificuldade com um arquivo muito longo. Cortá-la no intervalo dá a você a primeira metade para ler mais cedo.',
      },
    },
    {
      title: 'Deixe os slides abertos enquanto revisa.',
      text: 'Os títulos dos slides dão um roteiro pronto para comparar com as marcas de tempo.',
    },
    {
      title: 'Baixe antes de sair.',
      text: 'As transcrições existem só durante a sua sessão. Salve o TXT ou o Markdown antes de fechar a página.',
    },
  ],

  faqs: [
    {
      question: 'É permitido gravar uma aula e transcrevê-la?',
      answer:
        'Isso depende do seu professor e da sua instituição, então pergunte antes de gravar e siga as regras deles. Use uma transcrição para o seu próprio estudo, a menos que você tenha permissão para compartilhá-la. Isto não é aconselhamento jurídico.',
    },
    {
      question: 'Posso transformar a transcrição de uma aula em notas automaticamente?',
      answer:
        'Não. O TranscribeVid dá as palavras, com uma marca de tempo em cada linha, mas não resume nem acrescenta títulos. Você monta as notas a partir do texto, o que também é uma boa forma de aprender a matéria.',
    },
    {
      question: 'Funciona para aulas com equações ou termos técnicos?',
      answer:
        'Ele escreve as palavras que ouve, então os termos falados costumam sair bem quando você os adiciona à dica de vocabulário. Símbolos e equações não são escritos como fórmulas, então confira-os com os seus slides.',
    },
    {
      question: 'Qual a duração máxima de uma aula que posso transcrever?',
      answer: '{limits} Uma aula mais longa precisa ser dividida em partes antes.',
      browser: {
        answer:
          'Não há limite para a duração da aula. Como o seu próprio dispositivo faz o trabalho, uma aula longa custa principalmente paciência e memória livre, e a página avisa quando o seu dispositivo parece lento demais para isso.',
      },
    },
    {
      question: 'Posso transcrever uma aula on-line que gravei na tela?',
      answer:
        'Sim. Uma gravação de tela salva como MP4, MOV ou WebM funciona. Só o som é lido, então o texto dos slides não é incluído. Adicione os termos dos slides à dica de vocabulário.',
    },
  ],

  links: [
    {
      label: 'Vídeo em texto',
      path: '/video-to-text',
      note: 'A página geral para qualquer vídeo gravado, com todos os tipos de arquivo.',
    },
    {
      label: 'MP3 em texto',
      path: '/mp3-to-text',
      note: 'Para gravações de aula salvas como MP3 em um celular ou gravador.',
    },
    {
      label: 'Traduzir fala para texto em inglês',
      path: '/translate-audio-to-english',
      note: 'Texto em inglês a partir de uma aula em outro idioma.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'As escolhas de áudio, idioma e qualidade que reduzem erros em uma gravação difícil.',
    },
  ],
};
