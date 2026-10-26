import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Gerador de transcrição de podcast',
  h1: 'Gere a transcrição de um podcast a partir do seu arquivo de áudio',
  lead: 'Solte um episódio e receba uma transcrição completa, com marcas de tempo, para publicar ao lado dele, pesquisar, citar ou transformar em notas do episódio. Grátis, sem cadastro e disponível em mais de 50 idiomas.',
  dropKind: 'audio',
  dropNoun: 'o episódio do podcast',

  whyTitle: 'Por que dar uma transcrição a um episódio',
  why: [
    'Uma transcrição torna um episódio mais fácil de encontrar, citar e acompanhar. Os ouvintes podem passar os olhos por ela, ler junto com o som desligado ou em um lugar barulhento e pesquisar nela o nome de um convidado. Ouvintes surdos ou com deficiência auditiva, e pessoas que ouvem em um segundo idioma, também podem usá-la. Os mecanismos de busca também leem texto com muito mais facilidade do que áudio.',
    'Esta página faz o primeiro rascunho: o episódio inteiro em texto, com o horário em cada linha. Planeje editá-lo. O reconhecimento de fala não conhece os nomes dos seus convidados nem o jargão do seu programa, e não identifica quem fala. Use em episódios que você produziu ou que tem autorização para usar.',
  ],

  sections: [
    {
      title: 'Da transcrição à página do episódio',
      paragraphs: ['Uma transcrição pode alimentar várias coisas que você já publica.'],
      bullets: [
        {
          title: 'Notas do episódio.',
          text: 'Leia a transcrição uma vez, escolha os temas e escreva um resumo curto com a marca de tempo de cada um. Baixe o Markdown para colar em um app de notas ou em um editor de blog.',
        },
        {
          title: 'Uma transcrição sob o player.',
          text: 'Baixe o TXT, arrume os parágrafos e acrescente à mão nomes como Apresentador e Convidado. A transcrição não tem rótulos de quem fala por conta própria.',
        },
        {
          title: 'Legendas para uma versão em vídeo.',
          text: 'Se você também publica o episódio como vídeo, baixe SRT ou VTT e envie como legendas.',
        },
        {
          title: 'Citações e trechos.',
          text: 'Encontre a linha, leia a marca de tempo e corte o trecho do seu áudio nesse horário.',
        },
      ],
    },
    {
      title: 'Acertando nomes, jargões e anúncios lidos',
      paragraphs: [
        'Nomes de convidados, nomes de marcas e termos do programa são o que um sistema de reconhecimento mais erra. Antes de começar, liste-os na dica de vocabulário em Mais opções: o apresentador, os convidados, o nome do programa, produtos e qualquer termo que você usa muito. Quando a transcrição estiver pronta, digite um nome escrito errado na caixa Pesquisar no texto acima dela, abra Substituir…, informe a grafia certa e aplique em todas as linhas que combinam de uma vez. As linhas de que o sistema não teve certeza ficam marcadas, então revise essas primeiro.',
        'Deixe a opção Pular silêncios e música ativada em Mais opções, para que vinhetas e pausas longas não virem palavras inventadas. Efeitos sonoros e trilhas sob um anúncio lido ainda podem acrescentar texto solto, então apague tudo o que não foi dito.',
      ],
    },
  ],

  howTitle: 'Como gerar a transcrição de um podcast',
  howToDescription:
    'Adicione o episódio, liste os nomes e termos, aguarde a transcrição e baixe-a para a página do episódio.',
  steps: [
    {
      title: 'Adicione o episódio',
      text: 'Solte o episódio na caixa acima ou clique em Escolher um arquivo. MP3 é o formato usual de podcast, mas WAV, M4A, FLAC e outros funcionam. Um episódio por vez entra nesta caixa; na página seguinte, Adicionar outro arquivo permite incluir mais episódios.',
    },
    {
      title: 'Liste os nomes e termos',
      text: 'Na página seguinte, abra Mais opções e coloque o apresentador, os convidados, o nome do programa e qualquer jargão na dica de vocabulário. Escolha o idioma falado ou mantenha Detectar automaticamente.',
    },
    {
      title: 'Comece e aguarde a transcrição',
      text: 'Clique em Transcrever. O texto aparece linha por linha com uma barra de progresso. Padrão serve para a maioria dos episódios. Falas sobrepostas ou áudio ruim são onde Alta precisão ou Precisão máxima valem o tempo. Elas são mais lentas, exigem um download inicial maior e aparecem acinzentadas, com um motivo, em um dispositivo que não consegue executá-las.',
    },
    {
      title: 'Edite e exporte',
      text: 'Corrija nomes e pontuação e acrescente à mão os nomes de quem fala. Depois baixe TXT ou Markdown para a página do episódio, ou SRT ou VTT para uma versão em vídeo.',
    },
  ],

  formatsTitle: 'Arquivos de podcast e downloads',
  formatsIntro:
    'MP3 é o formato usual de podcast. Outros arquivos de áudio são lidos do mesmo jeito, e arquivos de vídeo também são aceitos.',
  uploadTitle: 'Arquivos de áudio que você pode adicionar',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'a transcrição para publicar sob o player' },
    { name: 'Markdown', use: 'notas do episódio com marcas de tempo' },
    { name: 'SRT', use: 'legendas para uma versão em vídeo' },
    { name: 'VTT', use: 'uma faixa de transcrição para players da web' },
    { name: 'PDF', use: 'uma transcrição para compartilhar ou imprimir' },
  ],

  tipsTitle: 'Dicas para transcrições de podcast',
  tips: [
    {
      title: 'Transcreva a mixagem final.',
      text: 'O episódio masterizado, com abertura e anúncios lidos, é o que os ouvintes escutam. As marcas de tempo então batem com o arquivo que você publica.',
    },
    {
      title: 'Use o seu WAV original quando tiver.',
      text: 'Um MP3 é uma cópia comprimida, e cada rodada extra de compressão perde detalhes. Áudio mais limpo dá menos erros.',
    },
    {
      title: 'Corte episódios muito longos em partes.',
      text: 'Um arquivo maior ou mais longo do que os limites mostrados nesta página não pode ser processado, então divida um episódio longo em qualquer editor de áudio antes.',
      browser: {
        title: 'Episódios longos demoram mais.',
        text: 'O site não define limite para a duração do episódio, mas um programa de conversa longo precisa de tempo e de memória livre no seu dispositivo. Dividi-lo em uma pausa natural, em qualquer editor de áudio, dá a você a primeira parte mais cedo.',
      },
    },
    {
      title: 'Leia acompanhando uma vez.',
      text: 'Ler a transcrição enquanto o episódio toca em velocidade normal é a forma mais rápida de pegar os erros que importam.',
    },
    {
      title: 'Diga que é automática.',
      text: 'Se você publicar uma transcrição sem uma edição completa, diga isso, para que os leitores saibam que pequenos erros são possíveis.',
    },
  ],

  faqs: [
    {
      question: 'Posso publicar uma transcrição automática de podcast na página do meu episódio?',
      answer:
        'Sim, para um episódio que você produziu. Leia-a antes, corrija os nomes, acrescente à mão os nomes de quem fala e avise os leitores de que ela foi feita automaticamente. Se um convidado pediu que algo fosse deixado de fora, remova isso do texto também.',
    },
    {
      question: 'A transcrição do podcast tem os nomes de quem fala?',
      answer:
        'Não. Digite "Apresentador" e "Convidado" no texto ao editar; a transcrição em si traz só horários.',
    },
    {
      question: 'Consigo as notas do episódio a partir da transcrição de um podcast?',
      answer:
        'Você recebe a matéria-prima, não um resumo. A transcrição não escreve as notas do episódio por você, mas as marcas de tempo tornam rápido listar os temas e o minuto em que cada um começa.',
    },
    {
      question: 'Qual a duração de um episódio de podcast que posso transcrever de uma vez?',
      answer:
        '{limits} Um episódio longo pode precisar ser dividido. Não há cota diária nem mensal.',
      browser: {
        answer:
          'A duração do episódio não é limitada pelo site. Um episódio longo demora mais e precisa de memória livre no seu próprio dispositivo; a página avisa se ele for mais lento.',
      },
    },
    {
      question: 'Posso transcrever um podcast a partir do feed RSS ou de um link?',
      answer:
        'Não. O TranscribeVid funciona com arquivos que você adiciona, não com links da web nem feeds. Use o arquivo do episódio que você produziu ou exportou e adicione-o na caixa no topo desta página.',
    },
  ],

  links: [
    {
      label: 'MP3 em texto',
      path: '/mp3-to-text',
      note: 'Configurações e dicas para o tipo de arquivo de podcast mais comum.',
    },
    {
      label: 'Gerador de legendas SRT',
      path: '/srt-subtitle-generator',
      note: 'Legendas para uma versão em vídeo do episódio.',
    },
    {
      label: 'SRT ou VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Qual arquivo de legendas o seu player ou hospedagem espera.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'Menos erros no mesmo episódio.',
    },
  ],
};
