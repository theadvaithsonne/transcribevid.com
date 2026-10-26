import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Áudio do WhatsApp em texto',
  h1: 'Converter um áudio do WhatsApp em texto',
  lead: 'Áudios longos são fáceis de enviar e difíceis de reler. Salve a mensagem como arquivo, solte-a aqui e leia-a como texto com marcas de tempo, em híndi, inglês, espanhol e muitos outros idiomas. Grátis, sem login.',
  dropKind: 'audio',
  dropNoun: 'o áudio do WhatsApp',

  whyTitle: 'Por que transformar um áudio em texto',
  why: [
    'Um áudio é rápido de gravar e lento de usar. Você não consegue pesquisá-lo, copiar uma frase dele nem folheá-lo em uma reunião. Como texto, a mesma mensagem leva segundos para ser lida por cima, e você pode colar um endereço, uma citação ou uma lista de instruções direto em uma conversa, uma nota ou um documento.',
    'Use esta página para mensagens que você enviou ou recebeu e que pode usar livremente. Áudios são pessoais, então ajuda saber para onde o arquivo vai: aqui ele viaja até o servidor por uma conexão criptografada e é removido automaticamente depois. Não é preciso ter conta.',
  ],
  browserWhy: [
    'Um áudio é rápido de gravar e lento de usar. Você não consegue pesquisá-lo, copiar uma frase dele nem folheá-lo em uma reunião. Como texto, a mesma mensagem leva segundos para ser lida por cima, e você pode colar um endereço, uma citação ou uma lista de instruções direto em uma conversa, uma nota ou um documento.',
    'Use esta página para mensagens que você enviou ou recebeu e que pode usar livremente. Áudios são pessoais, então o arquivo fica com você: o navegador o transcreve no seu próprio dispositivo e nada é enviado. Na primeira vez que usa o site, o navegador baixa o modelo de fala uma vez e o guarda. São dezenas de megabytes para Mais rápido, algumas centenas para Padrão e mais para as opções maiores, então use Wi-Fi em vez de dados móveis no celular. Não é preciso ter conta.',
  ],

  sections: [
    {
      title: 'Como salvar um áudio do WhatsApp como arquivo',
      paragraphs: [
        'O WhatsApp guarda os áudios dentro do app, então salve a mensagem como arquivo primeiro. Os menus variam entre modelos de celular e versões do app, então use estes passos como um guia e procure as opções Compartilhar, Encaminhar ou Salvar. O WhatsApp pertence à própria empresa, e este site não tem ligação com ela.',
        'O WhatsApp também pode mostrar uma transcrição dentro da conversa em alguns celulares, nos idiomas e nas versões que a oferecem. Esta página serve para quando você quer o texto como um arquivo que pode editar e exportar, com marcas de tempo, ou quando a sua versão ou o seu idioma não é coberto.',
      ],
      bullets: [
        {
          title: 'No Android.',
          text: 'Mantenha o áudio pressionado, abra o menu e procure Compartilhar, ou Encaminhar e depois Compartilhar. Escolha Salvar no dispositivo, Arquivos ou um app de armazenamento em nuvem, ou envie para você mesmo por e-mail. Muitos celulares Android também guardam os áudios recebidos em uma pasta WhatsApp Voice Notes que um gerenciador de arquivos consegue abrir.',
        },
        {
          title: 'No iPhone.',
          text: 'Mantenha o áudio pressionado, escolha Encaminhar, toque no ícone de compartilhar e escolha Salvar em Arquivos. Você também pode enviá-lo ao computador por AirDrop ou por e-mail.',
        },
        {
          title: 'No computador.',
          text: 'No WhatsApp Web ou no app para computador, o menu da mensagem pode oferecer uma opção de Baixar. Se não oferecer, salve o arquivo no celular e passe-o para o computador.',
        },
      ],
    },
    {
      title: 'Híndi, Hinglish e mensagens em mais de um idioma',
      paragraphs: [
        'Os áudios muitas vezes misturam idiomas na mesma frase. Defina o idioma como o que é mais falado ou mantenha Detectar automaticamente. O reconhecimento acompanha melhor o idioma principal, então confira as linhas marcadas como incertas onde entra um segundo idioma.',
        'Para o híndi, o Estilo da transcrição decide como o texto é escrito. Hinglish (híndi romanizado) escreve o híndi em letras romanas e mantém as palavras em inglês como estão. Escrita original mantém o devanágari. Urdu, bengali, árabe, espanhol, português e os demais idiomas compatíveis mantêm a própria escrita. Uma mensagem em outro idioma também pode sair como texto em inglês: em Mais opções, mude Saída para Traduzir para o inglês e confira o resultado com a gravação, porque a tradução é menos confiável do que transcrever no idioma original.',
      ],
    },
  ],

  howTitle: 'Como converter um áudio do WhatsApp em texto',
  howToDescription:
    'Salve o áudio como arquivo, adicione-o à página, escolha o idioma, aguarde a transcrição e copie ou baixe o texto.',
  steps: [
    {
      title: 'Adicione o arquivo do áudio',
      text: 'Solte o arquivo salvo na caixa acima ou clique em Escolher um arquivo. Um áudio do WhatsApp costuma ser um arquivo .opus, e isso funciona como está. A caixa aceita um arquivo por vez: ela entrega a mensagem à tela de envio na página seguinte, onde Adicionar outro arquivo permite incluir mais mensagens.',
    },
    {
      title: 'Escolha o idioma',
      text: 'Na página seguinte, escolha o idioma que é mais falado ou mantenha Detectar automaticamente. Para o híndi, o Estilo da transcrição escolhe entre letras romanas (Hinglish) e devanágari. Depois clique em Transcrever.',
    },
    {
      title: 'Aguarde o texto',
      text: 'As linhas aparecem com suas marcas de tempo enquanto a mensagem é processada, e uma mensagem curta termina antes de uma longa. Padrão serve para a maioria das mensagens. Para quem fala rápido ou uma gravação com ruído, Alta precisão pode ajudar onde o seu dispositivo consegue executá-la. Em um dispositivo que não consegue, a opção fica acinzentada com um motivo, e exige um download inicial maior.',
    },
    {
      title: 'Confira, copie ou baixe',
      text: 'Corrija nomes e palavras pouco claras e depois copie o texto ou baixe o TXT. Baixe SRT ou VTT só se a mensagem acompanha um vídeo.',
    },
  ],

  formatsTitle: 'Arquivos de áudio e downloads',
  formatsIntro:
    'Áudios do WhatsApp costumam ser arquivos .opus. Outros arquivos de áudio funcionam do mesmo jeito, e arquivos de vídeo também são aceitos, com só o som usado.',
  uploadTitle: 'Arquivos de áudio que você pode adicionar',
  accepts: ['OPUS', 'OGG', 'M4A', 'MP3', 'AAC', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'a mensagem em texto simples para copiar' },
    { name: 'Markdown', use: 'notas com um horário em cada linha' },
    { name: 'PDF', use: 'uma cópia da mensagem para imprimir' },
    { name: 'SRT', use: 'linhas com tempo para um vídeo que carrega a mensagem' },
  ],

  tipsTitle: 'Dicas para áudios',
  tips: [
    {
      title: 'Salve o arquivo, não regrave.',
      text: 'Tocar uma mensagem no alto-falante enquanto outro aparelho grava adiciona eco e ruído da sala. O arquivo salvo é a cópia limpa.',
    },
    {
      title: 'Informe o idioma principal.',
      text: 'Escolher o idioma é mais confiável do que a detecção automática em uma mensagem curta, principalmente quando quem fala alterna entre dois idiomas.',
    },
    {
      title: 'Adicione nomes à dica de vocabulário.',
      text: 'Em Mais opções, digite os nomes de pessoas, lugares e lojas mencionados. Assim é mais provável que sejam escritos do jeito que você espera.',
    },
    {
      title: 'Confira os números antes de agir.',
      text: 'Um telefone, um endereço, um horário ou um valor podem ser ouvidos errado. Reproduza essa linha a partir da marca de tempo e ouça de novo antes de confiar nela.',
    },
    {
      title: 'Trate com cuidado as mensagens dos outros.',
      text: 'Só transcreva mensagens que você enviou ou recebeu e que pode usar livremente, e pense antes de compartilhar o texto de uma mensagem que alguém enviou a você em particular.',
    },
  ],

  faqs: [
    {
      question: 'Posso converter um áudio do WhatsApp em texto sem o app?',
      answer:
        'Sim. Salve o áudio como arquivo, adicione-o a esta página e leia o texto. Você não precisa de uma conta neste site, e não há cadastro nem login.',
    },
    {
      question: 'Que tipo de arquivo é um áudio do WhatsApp?',
      answer:
        'Costuma ser um arquivo .opus. Esta página o lê diretamente, então você não precisa convertê-lo para MP3 antes. Áudios salvos como OGG, M4A, MP3 ou AAC também funcionam.',
    },
    {
      question: 'Funciona para híndi ou para uma mistura de híndi e inglês?',
      answer:
        'Sim. O híndi é um dos idiomas compatíveis. Por padrão o texto é escrito em letras romanas (Hinglish); escolha Escrita original em Estilo da transcrição para o devanágari. Uma mensagem que mistura idiomas acompanha melhor o principal, então confira as linhas marcadas como incertas.',
    },
    {
      question: 'Qual a duração máxima de um áudio do WhatsApp que posso transcrever?',
      answer:
        '{limits} Áudios normalmente são curtos, então isso raramente importa. Não há cota diária nem mensal.',
      browser: {
        answer:
          'O site não define limite de tamanho nem de duração, e áudios normalmente são curtos, então terminam rápido. Uma gravação muito longa precisa de tempo e de memória livre no seu dispositivo, e alguns navegadores podem não dar conta de um arquivo extremamente longo.',
      },
    },
    {
      question: 'Isto guarda uma cópia do meu áudio do WhatsApp?',
      answer:
        'Só durante a sua sessão. O servidor apaga o arquivo quando a sessão termina ou quando você clica em Apagar meus dados agora.',
      browser: {
        answer:
          'Só neste navegador: o áudio nunca sai do seu dispositivo. O navegador o apaga depois de um período de inatividade, e você pode apagá-lo antes com Apagar meus dados agora.',
      },
    },
  ],

  links: [
    {
      label: 'Áudio em híndi para texto (página em inglês)',
      path: '/hindi-audio-to-text',
      note: 'Configurações e dicas para fala em híndi, em devanágari ou em letras romanas.',
    },
    {
      label: 'Transcritor de Hinglish (página em inglês)',
      path: '/hinglish-transcription',
      note: 'Como o híndi é escrito em letras romanas e quando usar isso.',
    },
    {
      label: 'Traduzir fala para texto em inglês',
      path: '/translate-audio-to-english',
      note: 'Obtenha texto em inglês de um áudio em outro idioma.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'O que mudar quando um áudio sai com erros.',
    },
  ],
};
