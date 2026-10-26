import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV em texto',
  h1: 'Converter um arquivo WAV em texto, grátis e com marcas de tempo',
  lead: 'WAV é o formato de gravadores portáteis, gravadores de chamadas e sessões de estúdio. Adicione o seu e leia as palavras como texto com marcas de tempo, grátis, sem login e sem precisar comprimir o arquivo antes.',
  dropKind: 'audio',
  dropNoun: 'o arquivo WAV',

  whyTitle: 'Por que um arquivo WAV é bom para transcrever',
  why: [
    'Um arquivo WAV geralmente guarda o som sem compressão, então nada foi descartado quando ele foi salvo. Isso o torna uma boa fonte para o reconhecimento de fala: sem artefatos de compressão, e cada consoante ainda está no arquivo. Você não precisa transformá-lo em MP3 antes. O TranscribeVid lê o WAV como ele é.',
    'O preço dessa qualidade é o tamanho. Estéreo com qualidade de CD ocupa cerca de 10 MB por minuto, então uma hora de áudio passa de meio gigabyte. Esta página foi feita para esses arquivos grandes: ela pula silêncios e a maior parte dos sons que não são fala (a opção Pular silêncios e música, ativada por padrão) e entrega texto com marca de tempo em cada linha.',
  ],

  sections: [
    {
      title: 'De onde vêm as gravações WAV',
      paragraphs: [
        'WAV é o padrão do mundo do áudio, então o arquivo que você tem em mãos provavelmente veio de um destes.',
      ],
      bullets: [
        {
          title: 'Gravadores portáteis.',
          text: 'Gravadores portáteis usados em entrevistas, aulas e anotações de campo costumam salvar em WAV, porque ele guarda todos os detalhes do som.',
        },
        {
          title: 'Gravadores de chamadas e de reuniões.',
          text: 'Ferramentas de gravação de chamadas e sistemas de conferência costumam exportar WAV. Se cada lado de uma chamada está em um canal próprio, os dois são misturados em uma única transcrição.',
        },
        {
          title: 'Editores de áudio.',
          text: 'Programas como Audacity e Adobe Audition exportam WAV quando você salva ou exporta um projeto, o que o torna o arquivo natural para passar adiante e transcrever.',
        },
        {
          title: 'Aparelhos de ditado.',
          text: 'Alguns gravadores de ditado digitais gravam arquivos WAV que você pode copiar direto do aparelho.',
        },
      ],
    },
    {
      title: 'Taxa de amostragem, profundidade de bits e canais',
      paragraphs: [
        'Você não precisa preparar um WAV antes de adicioná-lo. As configurações usuais são todas lidas: 8, 16 ou 24 bits, ou ponto flutuante de 32 bits, mono ou estéreo, a 44,1 ou 48 kHz. O som é misturado em mono e convertido para o modelo de fala automaticamente.',
        'Uma taxa de amostragem maior não deixa a transcrição mais precisa, porque a fala fica na parte mais baixa do espectro sonoro. O lugar onde você põe o microfone importa muito mais do que os números do arquivo.',
        'Melhorar o áudio, em Mais opções, filtra ruídos graves e chiados e equilibra quem fala baixo. Vem ativado por padrão, e se justifica em uma gravação feita perto de um ventilador, de uma rua ou de um ar-condicionado.',
      ],
    },
  ],

  howTitle: 'Como converter um arquivo WAV em texto',
  howToDescription:
    'Adicione o arquivo WAV, escolha o idioma falado e a qualidade, aguarde a transcrição e baixe-a como texto ou legendas.',
  steps: [
    {
      title: 'Solte o WAV',
      text: 'Adicione o arquivo .wav na caixa no topo desta página: solte-o ali ou clique em Escolher um arquivo. Se ele ainda estiver em um gravador, copie-o antes para o computador. A caixa aceita um arquivo; na página seguinte, Adicionar outro arquivo enfileira mais WAVs, e cada um recebe a própria transcrição.',
    },
    {
      title: 'Escolha o idioma e a qualidade',
      text: 'Na página seguinte, escolha o idioma falado ou deixe Detectar automaticamente para uma gravação em um só idioma. Padrão serve para a maior parte das falas. Para uma gravação baixa ou difícil, Alta precisão e Precisão máxima demoram mais e cometem menos erros. Depois clique em Transcrever.',
      browser: {
        text: 'Na página seguinte, escolha o idioma falado ou deixe Detectar automaticamente para uma gravação em um só idioma. Padrão serve para a maior parte das falas. Para uma gravação baixa ou difícil, experimente Alta precisão ou Precisão máxima se o seu dispositivo as oferecer: demoram mais, exigem um download inicial maior e ficam acinzentadas, com o motivo, em um dispositivo que não consegue executá-las. Depois clique em Transcrever.',
      },
    },
    {
      title: 'Veja o texto aparecer',
      text: 'A transcrição vai sendo preenchida linha por linha, cada linha com seu horário. Reproduza a partir de qualquer linha para conferi-la com a gravação.',
    },
    {
      title: 'Edite e baixe',
      text: 'Corrija as palavras erradas e baixe o TXT para ler, SRT ou VTT para legendas, ou PDF para imprimir. Nada é guardado depois da sua sessão, então salve o que precisar.',
    },
  ],

  formatsTitle: 'WAV e outros formatos de áudio',
  formatsIntro: 'WAV é o formato sem perdas, e esta caixa aceita também estes tipos de áudio.',
  uploadTitle: 'Arquivos de áudio que você pode adicionar',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'as palavras em texto simples' },
    { name: 'SRT', use: 'linhas de legenda com tempo' },
    { name: 'VTT', use: 'linhas com tempo para players da web' },
    { name: 'PDF', use: 'uma cópia para imprimir' },
    { name: 'Markdown', use: 'notas com horários' },
    { name: 'JSON', use: 'dados para as suas próprias ferramentas' },
  ],

  tipsTitle: 'Dicas para transcrever gravações WAV',
  tips: [
    {
      title: 'Adicione exatamente como está.',
      text: 'Não há nada a ganhar convertendo um WAV antes, e um MP3 de taxa de bits baixa pode perder detalhes. Adicione o arquivo como saiu do gravador.',
    },
    {
      title: 'Ouça os dois canais.',
      text: 'O estéreo é misturado em mono. Se um microfone estiver muito mais baixo ou mais ruidoso do que o outro, a mistura herda isso, então confira os dois canais no seu player antes de um trabalho longo.',
    },
    {
      title: 'Corte silêncios longos.',
      text: 'Gravações de campo muitas vezes começam e terminam com minutos de nada. Cortá-los em um editor deixa o arquivo menor, e a transcrição começa onde a conversa começa.',
    },
    {
      title: 'Divida uma sessão muito longa.',
      text: 'Gravações acima do limite de tamanho ou de duração são recusadas, então divida uma sessão longa em uma pausa natural e transcreva as partes.',
      browser: {
        title: 'Várias horas levam várias horas.',
        text: 'O site não define limite de tamanho nem de duração, mas uma gravação de várias horas precisa de muito tempo e de memória livre, e um navegador mais antigo pode recusar um arquivo muito longo. No celular, divida-o em uma pausa natural e transcreva as partes.',
      },
    },
    {
      title: 'Soletre as palavras difíceis.',
      text: 'Liste nomes, lugares e termos técnicos na dica de vocabulário em Mais opções, escritos do jeito que você quer vê-los.',
    },
  ],

  faqs: [
    {
      question: 'Posso transcrever um WAV gravado em uma chamada de celular?',
      answer:
        'Sim, se a chamada estiver salva como arquivo WAV e as duas pessoas puderem ser ouvidas. Os dois canais são misturados em uma só transcrição e os nomes de quem fala não são adicionados, então digite os nomes no texto ao editar. Avise as pessoas de que você está gravando e confira as regras do lugar onde você mora antes de gravar chamadas.',
    },
    {
      question: 'O WAV é mais preciso do que o MP3 para transcrição?',
      answer:
        'Pode ajudar um pouco, porque nada foi removido do som. Mas um MP3 limpo costuma ser transcrito bem e um WAV ruidoso não. O microfone, a sala e a distância de quem fala importam mais do que o formato do arquivo.',
    },
    {
      question: 'Por que meu arquivo WAV é tão grande, e isso importa?',
      answer:
        'O WAV geralmente guarda o som sem compressão: cerca de 10 MB por minuto em estéreo com qualidade de CD. Arquivos grandes demoram mais para ler. {limits} Se um arquivo passar do limite, corte-o ou exporte uma cópia comprimida (M4A ou MP3) e use essa.',
      browser: {
        answer:
          'O WAV geralmente guarda o som sem compressão: cerca de 10 MB por minuto em estéreo com qualidade de CD. Arquivos grandes demoram um pouco mais para ler, mas o formato não é o problema: em testes, um arquivo de cerca de 2,5 GB foi lido sem dificuldade em um navegador atual. O site não define limite de tamanho nem de duração porque o seu próprio dispositivo faz o trabalho, então uma gravação muito longa precisa de tempo e de memória livre, e um navegador mais antigo pode recusar um arquivo muito longo. No celular, divida-o antes.',
      },
    },
    {
      question: 'Ele lida com arquivos WAV de 24 bits e 48 kHz?',
      answer:
        'Sim. As configurações usuais de WAV, como 16 ou 24 bits a 44,1 ou 48 kHz, são lidas sem nenhuma preparação, e o som é convertido para o modelo de fala automaticamente.',
    },
    {
      question: 'Posso transcrever vários arquivos WAV de uma vez?',
      answer:
        'Sim, na página seguinte. A caixa desta página aceita um arquivo; lá, Adicionar outro arquivo enfileira o restante. Cada arquivo recebe a própria transcrição, então um dia inteiro de gravações pode rodar um após o outro.',
    },
  ],

  links: [
    {
      label: 'MP3 em texto',
      path: '/mp3-to-text',
      note: 'A mesma transcrição gratuita para o formato comprimido em que a maioria das gravações de voz acaba.',
    },
    {
      label: 'Transcrição de entrevistas',
      path: '/interview-transcription',
      note: 'Dicas para transformar gravações de entrevistas em uma transcrição limpa e citável.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'O que mudar na gravação, no idioma e nas configurações quando o primeiro resultado não é bom o bastante.',
    },
    {
      label: 'Gravação de reunião em texto',
      path: '/meeting-recording-to-text',
      note: 'Para chamadas de conferência salvas como gravação.',
    },
  ],
};
