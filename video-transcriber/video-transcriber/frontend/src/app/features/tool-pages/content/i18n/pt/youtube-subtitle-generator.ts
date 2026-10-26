import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Gerador de legendas para YouTube',
  h1: 'Crie legendas para o seu próprio vídeo do YouTube',
  lead: 'Adicione o arquivo de vídeo que você fez para o YouTube, receba um arquivo SRT sincronizado com a fala e envie-o no YouTube Studio. Grátis, sem login, e você confere cada linha antes de publicar.',
  dropKind: 'video',
  dropNoun: 'o vídeo',

  whyTitle: 'Por que enviar o seu próprio arquivo de legendas',
  why: [
    'O YouTube gera legendas automáticas para muitos vídeos, mas elas nem sempre estão certas, e não aparecem até o YouTube terminar de processar o vídeo. Um arquivo de legendas seu permite conferir e corrigir cada linha, com os seus nomes, produtos e termos escritos do jeito que você os escreve.',
    'Esta página é para vídeos que você mesmo fez. Ela funciona a partir do arquivo de vídeo no seu computador, não de um link do YouTube: colar um link não é compatível. Se o vídeo é seu, você já tem o original da sua câmera ou do seu editor. O TranscribeVid é uma ferramenta independente e não tem ligação com o YouTube: ele nunca entra no seu canal, então você mesmo adiciona o arquivo pronto lá.',
  ],

  sections: [
    {
      title: 'Adicionar o arquivo SRT no YouTube Studio',
      paragraphs: [
        'Os nomes dos menus do YouTube Studio mudam de tempos em tempos, então use estes passos como um guia e siga os rótulos que você vê na tela.',
      ],
      bullets: [
        {
          title: 'Abra Legendas.',
          text: 'Entre no seu canal, abra o YouTube Studio e escolha Legendas no menu à esquerda.',
        },
        {
          title: 'Escolha o vídeo.',
          text: 'Escolha o vídeo que você quer legendar. Se o YouTube pedir o idioma do vídeo, defina-o primeiro.',
        },
        {
          title: 'Adicione o idioma.',
          text: 'Escolha Adicionar idioma, selecione o idioma do arquivo e depois escolha Adicionar em Legendas.',
        },
        {
          title: 'Envie o arquivo.',
          text: 'Escolha Enviar arquivo, depois Com sincronização, e selecione o arquivo .srt que você baixou. Confira as linhas na prévia e depois publique.',
        },
      ],
    },
    {
      title: 'Legendas em inglês a partir de outro idioma',
      paragraphs: [
        'Se o vídeo é falado em outro idioma, defina Saída como Traduzir para o inglês em Mais opções antes de começar. Você recebe texto em inglês sincronizado com a fala, que pode enviar como uma faixa de legendas em inglês. A tradução é feita por máquina, então leia o inglês antes de ele ir ao ar.',
        'O TranscribeVid não traduz para idiomas além do inglês. Para cada outro idioma de que você tenha um arquivo, adicione uma faixa separada no YouTube Studio.',
      ],
    },
    {
      title: 'Por que vale o esforço ter legendas',
      paragraphs: [
        'As pessoas assistem em lugares onde não podem aumentar o som, e muitas acompanham melhor um segundo idioma por escrito do que de ouvido. As legendas também ajudam espectadores surdos ou com deficiência auditiva e transformam as suas palavras faladas em texto que pode ser pesquisado e citado.',
      ],
    },
  ],

  howTitle: 'Como criar legendas para um vídeo do YouTube',
  howToDescription:
    'Adicione o arquivo de vídeo, escolha o idioma falado, confira as linhas, baixe um arquivo SRT e envie-o no YouTube Studio.',
  steps: [
    {
      title: 'Adicione o arquivo do seu vídeo',
      text: 'Escolha o arquivo de vídeo que você enviou ao YouTube, não um link para ele: solte-o na caixa no topo desta página ou clique em Escolher um arquivo. Para um segundo vídeo, use Adicionar outro arquivo na página seguinte.',
    },
    {
      title: 'Escolha o idioma',
      text: 'Na página seguinte, escolha o idioma falado ou deixe Detectar automaticamente ativado. Mantenha Tempo por palavra ativado em Mais opções, para que cada linha comece e termine com as palavras. Depois clique em Transcrever.',
    },
    {
      title: 'Confira as linhas',
      text: 'Abra a transcrição, reproduza a partir de qualquer marca de tempo e corrija palavras, nomes e números errados. Apague as linhas que você não quer mostrar.',
    },
    {
      title: 'Baixe o SRT e envie-o',
      text: 'Baixe o arquivo SRT e depois adicione-o ao vídeo no YouTube Studio como descrito acima.',
    },
  ],

  formatsTitle: 'Arquivos de vídeo e arquivos de legendas',
  formatsIntro:
    'Adicione o arquivo de vídeo que você fez para o YouTube, em qualquer um destes tipos, e baixe as legendas no formato de que precisa.',
  uploadTitle: 'Arquivos de vídeo que você pode adicionar',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'o arquivo de legendas que o YouTube Studio pede' },
    { name: 'VTT', use: 'WebVTT, para players da web' },
    { name: 'TXT', use: 'uma transcrição para a sua descrição ou um post de blog' },
    { name: 'Markdown', use: 'texto com marcas de tempo' },
    { name: 'JSON', use: 'cada linha e horário, para programas' },
    { name: 'PDF', use: 'um roteiro para imprimir' },
  ],

  tipsTitle: 'Dicas para legendas do YouTube',
  tips: [
    {
      title: 'Use o corte final.',
      text: 'Faça o arquivo a partir do vídeo exato que você envia, não de um rascunho anterior. Toda edição que move a fala também move a sincronia.',
    },
    {
      title: 'Mantenha o tempo por palavra ativado.',
      text: 'Ele vem ativado por padrão e dá uma sincronia de legendas mais precisa do que cronometrar frases inteiras.',
    },
    {
      title: 'Corrija os nomes antes de publicar.',
      text: 'O texto automático erra com mais frequência nomes de canais, produtos e números. Uma dica de vocabulário ajuda, e uma leitura completa pega o resto.',
    },
    {
      title: 'Leia com o som desligado.',
      text: 'Assista ao vídeo sem som e com as legendas ativadas. Você verá na hora quais linhas somem rápido demais para serem lidas.',
    },
  ],

  faqs: [
    {
      question: 'Posso criar legendas para um vídeo do YouTube que não enviei?',
      answer:
        'Não. Esta ferramenta funciona só com arquivos, não com links, e é feita para vídeos que você fez ou que tem direito de usar. Para os seus próprios vídeos, use o arquivo original da sua câmera ou do seu editor.',
    },
    {
      question: 'Qual arquivo o YouTube Studio quer, SRT ou VTT?',
      answer:
        'SRT é a escolha mais segura: é um formato muito usado que o YouTube Studio lê. Envie-o com marcação de tempo, para que as linhas acompanhem a fala.',
    },
    {
      question: 'Preciso fazer login para criar o arquivo de legendas?',
      answer:
        'Não. Você não precisa de conta aqui. Só precisa do seu canal do YouTube para enviar o arquivo no YouTube Studio.',
    },
    {
      question: 'Como consigo legendas em inglês para um vídeo em espanhol ou híndi?',
      answer:
        'Defina Saída como Traduzir para o inglês em Mais opções antes de começar. A transcrição sai em inglês, com horários. A tradução é automática e pode conter erros, então leia antes de publicá-la como uma faixa em inglês.',
    },
    {
      question: 'Por que minhas legendas estão fora de sincronia no YouTube?',
      answer:
        'Na maioria das vezes o arquivo foi feito a partir de uma versão diferente do vídeo, por exemplo antes de o começo ser cortado. Faça o arquivo de novo a partir do vídeo exato que você enviou. A sincronia é próxima, mas não perfeita quadro a quadro, então uma conferência final no YouTube Studio ajuda.',
    },
  ],

  links: [
    {
      label: 'Gerador de legendas SRT',
      path: '/srt-subtitle-generator',
      note: 'Como é um arquivo SRT por dentro e como corrigir linhas antes de exportar.',
    },
    {
      label: 'Como adicionar legendas a um vídeo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Outros lugares para usar o arquivo: players de mídia, editores e a sua própria página da web.',
    },
    {
      label: 'Traduzir fala para inglês',
      path: '/translate-audio-to-english',
      note: 'Texto em inglês a partir de fala em outro idioma, e o que conferir depois.',
    },
    {
      label: 'SRT ou VTT: qual formato de legenda usar',
      path: '/guides/srt-vs-vtt',
      note: 'Como os dois formatos de legenda comuns diferem.',
    },
  ],
};
