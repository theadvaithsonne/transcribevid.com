import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Traduzir fala para o inglês',
  h1: 'Traduzir fala para texto e legendas em inglês',
  lead: 'Adicione um arquivo de vídeo ou áudio em outro idioma e receba texto em inglês com marcas de tempo, ou um arquivo de legendas em inglês. Grátis, sem login.',
  dropKind: 'video',
  dropNoun: 'o vídeo ou áudio',

  whyTitle: 'O que faz traduzir a fala para o inglês',
  why: [
    'A maior parte do reconhecimento de fala escreve o que foi dito no idioma em que foi dito. Traduzir para o inglês é outro trabalho. A pessoa fala em híndi, espanhol, alemão ou outro idioma compatível, e o texto sai em inglês, com uma marca de tempo em cada linha. Isso ajuda quando você precisa da ideia geral de uma aula, uma entrevista, uma notícia ou um vídeo de família que não consegue acompanhar, ou de legendas em inglês para um vídeo em outro idioma.',
    'O inglês é o único idioma para o qual ele traduz. Não há tradução para o francês, o híndi ou qualquer outro idioma, e o texto escrito não é traduzido: só a fala da gravação. Esta página abre a tela de envio com Saída definida como Traduzir para o inglês e o idioma falado em Detectar automaticamente.',
  ],

  sections: [
    {
      title: 'Quão confiável é o inglês, e o que conferir',
      paragraphs: [
        'Traduzir é mais difícil do que transcrever. O inglês é produzido direto do som, sem texto escrito no idioma original no meio. Muitas vezes é bom o bastante para acompanhar o sentido, mas pode encurtar ou reformular frases, perder expressões idiomáticas e piadas e errar nomes, números e palavras técnicas.',
        'Trate o resultado como um rascunho para entender, não como uma tradução oficial. Para contratos, material jurídico, médico ou outro material importante, procure um tradutor humano e use uma transcrição no idioma original como ponto de partida.',
        'Um bom hábito é fazer primeiro uma transcrição comum no idioma original e depois a versão em inglês. Onde as duas parecerem discordar, esse ponto merece uma escuta mais atenta. Uma transcrição pronta é mantida quando você usa Transcrever de novo, então as duas podem sair do mesmo arquivo.',
      ],
    },
    {
      title: 'Quais idiomas e quais escolhas de qualidade traduzem bem',
      bullets: [
        {
          title: 'Qualquer idioma da lista.',
          text: 'Mais de 50 idiomas falados, do africâner ao galês, podem ser traduzidos para o inglês. A qualidade varia muito e é mais fraca para idiomas com pouca fala gravada para aprender. Se a fala já está em inglês, você não precisa desta página: use as páginas de vídeo em texto ou de áudio em texto.',
        },
        {
          title: 'Informe o idioma ou deixe-o ser detectado.',
          text: 'Deixe Idioma em Detectar automaticamente quando não tiver certeza do que está sendo falado. Se você sabe, escolhê-lo é mais confiável, principalmente em trechos curtos ou com sotaque.',
        },
        {
          title: 'Evite Alta precisão para tradução.',
          text: 'Alta precisão executa o modelo Large v3 Turbo. A OpenAI, que criou o Whisper, diz que o Turbo não é treinado para tradução e devolve o idioma original mesmo quando a tradução é pedida. O Distil Large v3, na lista Modelo em Mais opções, serve só para inglês. Para uma tradução, comece com Padrão e escolha Precisão máxima (Large v3) para fala difícil. O Medium, também nessa lista de Modelo, é outra escolha segura.',
          browser: {
            text: 'Alta precisão executa o modelo Large v3 Turbo. A OpenAI, que criou o Whisper, diz que o Turbo não é treinado para tradução e devolve o idioma original mesmo quando a tradução é pedida. O Distil Large v3, na lista Modelo em Mais opções, serve só para inglês. Para uma tradução, comece com Padrão e escolha Precisão máxima (Large v3) para fala difícil, se o seu dispositivo a oferecer. O Medium, também nessa lista de Modelo, é outra escolha segura.',
          },
        },
        {
          title: 'Só o Whisper.',
          text: 'Traduzir exige o mecanismo de reconhecimento Whisper. A opção experimental Qwen3 ASR não consegue traduzir: Traduzir para o inglês fica indisponível enquanto ela está selecionada, e escolhê-la volta Saída para Transcrever.',
        },
        {
          title: 'Sem estilo da transcrição.',
          text: 'A opção Estilo da transcrição (Hinglish ou Escrita original) não se aplica a uma tradução, e fica acinzentada enquanto Traduzir para o inglês está selecionado.',
        },
      ],
    },
    {
      title: 'O que as pessoas fazem com legendas e texto em inglês',
      bullets: [
        {
          title: 'Legendas para o seu próprio vídeo.',
          text: 'Baixe SRT ou VTT. As linhas em inglês são sincronizadas com a fala original, então podem ser adicionadas ao mesmo vídeo em um player ou em um editor.',
        },
        {
          title: 'Entender uma gravação.',
          text: 'Leia sobre o que é uma entrevista, aula ou reportagem antes de decidir se ela precisa de uma tradução de verdade.',
        },
        {
          title: 'Pesquisa e jornalismo.',
          text: 'Um rascunho em inglês ajuda a decidir quais trechos mandar traduzir com cuidado e quais citar no idioma original.',
        },
      ],
    },
  ],

  howTitle: 'Como traduzir fala para o inglês',
  howToDescription:
    'Adicione um arquivo de vídeo ou áudio em outro idioma, confira se Traduzir para o inglês está selecionado, aguarde o texto em inglês e baixe-o.',
  steps: [
    {
      title: 'Adicione sua gravação',
      text: 'Solte a gravação na caixa no topo desta página ou clique em Escolher um arquivo. Você cai na tela de envio com Mais opções aberto, Saída definida como Traduzir para o inglês e Idioma em Detectar automaticamente. Escolha o idioma falado se souber qual é.',
    },
    {
      title: 'Escolha a qualidade e clique em Transcrever',
      text: 'Padrão é um bom começo. Para fala com sotaque, ruidosa ou técnica, escolha Precisão máxima, que demora mais e costuma cometer menos erros. Não escolha Alta precisão para uma tradução: ela usa um modelo que não foi treinado para traduzir. Depois clique em Transcrever.',
      browser: {
        text: 'Padrão é um bom começo. Para fala com sotaque, ruidosa ou técnica, escolha Precisão máxima se o seu dispositivo a oferecer (uma opção que ele não consegue executar fica acinzentada, com o motivo); é um download inicial grande, demora mais e costuma cometer menos erros. Não escolha Alta precisão para uma tradução: ela usa um modelo que não foi treinado para traduzir. Depois clique em Transcrever.',
      },
    },
    {
      title: 'Aguarde o texto em inglês',
      text: 'As linhas em inglês aparecem com seus horários. O Estilo da transcrição fica acinzentado porque só se aplica a transcrições, não a traduções.',
    },
    {
      title: 'Confira e baixe',
      text: 'Leia as linhas marcadas como incertas, compare nomes e números com o áudio e depois baixe TXT, SRT ou VTT, ou um arquivo PDF, Markdown ou JSON.',
    },
  ],

  formatsTitle: 'Arquivos que entram, texto em inglês que sai',
  formatsIntro:
    'Vídeo e áudio em muitos formatos funcionam, qualquer que seja o idioma falado. Os arquivos que você baixa contêm o texto em inglês.',
  uploadTitle: 'Arquivos que você pode adicionar',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'texto em inglês para ler' },
    { name: 'SRT', use: 'legendas em inglês sincronizadas com a fala' },
    { name: 'VTT', use: 'legendas em inglês para um player da web' },
    { name: 'PDF', use: 'uma cópia para imprimir' },
    { name: 'Markdown', use: 'texto com títulos e horários' },
    { name: 'JSON', use: 'linhas e horários para as suas próprias ferramentas' },
  ],

  tipsTitle: 'Dicas para traduções melhores',
  tips: [
    {
      title: 'Informe o idioma falado quando souber.',
      text: 'A detecção automática serve para fala clara, mas um palpite errado em um trecho curto dá uma tradução ruim.',
    },
    {
      title: 'Mantenha os trechos em um só idioma.',
      text: 'Uma gravação que fica alternando entre idiomas pode confundir a tradução. Divida-a ou faça antes uma transcrição comum para ver o que foi ouvido.',
    },
    {
      title: 'Confira números, nomes e datas.',
      text: 'São os detalhes que mais importam e os que mais erram em um rascunho traduzido.',
    },
    {
      title: 'Teste o primeiro minuto.',
      text: 'Leia o primeiro minuto do inglês com o áudio antes de confiar no arquivo todo.',
    },
    {
      title: 'Mantenha o original ao lado do inglês.',
      text: 'Se você publicar uma citação, mantenha a transcrição no idioma original ao lado da versão em inglês.',
    },
  ],

  faqs: [
    {
      question: 'Ele consegue traduzir fala para outros idiomas além do inglês?',
      answer:
        'Não. O inglês é o único idioma para o qual ele traduz. Para ler a fala no próprio idioma, faça uma transcrição comum.',
    },
    {
      question: 'Por que uma transcrição traduzida é menos exata do que uma comum?',
      answer:
        'Traduzir é uma tarefa mais difícil do que escrever as palavras. A fala precisa ser entendida e reescrita em um só passo, então frases podem ser encurtadas, expressões idiomáticas e piadas perdidas e nomes mal ouvidos. Confira qualquer coisa importante com o áudio ou com uma transcrição no idioma original.',
    },
    {
      question: 'Por que minha tradução saiu no idioma original?',
      answer:
        'A causa provável é a escolha de qualidade. Alta precisão executa o modelo Large v3 Turbo, que não foi treinado para traduzir e tende a escrever o idioma original. Comece de novo com Padrão ou Precisão máxima e confira se Saída está definida como Traduzir para o inglês.',
    },
    {
      question: 'Posso obter legendas em inglês para um vídeo em outro idioma?',
      answer:
        'Sim. Depois da tradução, baixe SRT ou VTT. As linhas em inglês levam a sincronia da fala original. Leia-as antes de publicar e lembre-se de que a tradução é um rascunho.',
    },
    {
      question: 'Por que não consigo escolher Traduzir para o inglês?',
      answer:
        'Ela não está disponível para o mecanismo experimental Qwen3 ASR. Volte o Mecanismo de reconhecimento para Whisper em Mais opções e a opção retorna.',
    },
  ],

  links: [
    {
      label: 'Áudio em híndi para texto (página em inglês)',
      path: '/hindi-audio-to-text',
      note: 'Leia a fala em híndi no próprio idioma antes de traduzi-la.',
    },
    {
      label: 'Áudio em espanhol para texto (página em inglês)',
      path: '/spanish-audio-to-text',
      note: 'Faça uma transcrição em espanhol com acentos, sem traduzi-la.',
    },
    {
      label: 'Gerador de legendas para YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Crie um SRT para o seu próprio vídeo e envie-o no YouTube Studio.',
    },
    {
      label: 'Como adicionar legendas a um vídeo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'O que fazer com o arquivo SRT ou VTT depois de tê-lo.',
    },
  ],
};
