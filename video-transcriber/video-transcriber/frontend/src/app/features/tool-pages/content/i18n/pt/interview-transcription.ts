import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Transcrição de entrevistas',
  h1: 'Transcrição de entrevistas sem precisar de conta',
  lead: 'Transforme uma entrevista gravada em texto com marcas de tempo que você pode pesquisar, citar e conferir com a gravação. Feito para pesquisa, jornalismo e conversas de contratação: grátis, sem login, em mais de 50 idiomas.',
  dropKind: 'video',
  dropNoun: 'a gravação da entrevista',

  whyTitle: 'Por que transcrever uma entrevista',
  why: [
    'Uma entrevista vale mais quando dá para pesquisá-la. Uma transcrição permite achar onde um participante mencionou um tema, citá-lo exatamente, conferir uma citação com a gravação e comparar respostas entre várias entrevistas. Pesquisadores, jornalistas, historiadores orais e quem conduz entrevistas de pesquisa com usuários ou de contratação trabalham assim.',
    'Entrevistas muitas vezes têm detalhes privados ou sensíveis. Aqui a gravação é enviada por uma conexão criptografada e apagada automaticamente depois. Obtenha o consentimento de todos antes de gravar, siga as regras da sua organização ou do comitê de ética e trate a transcrição com o mesmo cuidado que a gravação.',
  ],
  browserWhy: [
    'Uma entrevista vale mais quando dá para pesquisá-la. Uma transcrição permite achar onde um participante mencionou um tema, citá-lo exatamente, conferir uma citação com a gravação e comparar respostas entre várias entrevistas. Pesquisadores, jornalistas, historiadores orais e quem conduz entrevistas de pesquisa com usuários ou de contratação trabalham assim.',
    'Entrevistas muitas vezes contêm detalhes privados ou sensíveis, então para onde o arquivo vai importa. O navegador transcreve a gravação no seu próprio dispositivo e nada é enviado. Obtenha o consentimento de todos antes de gravar, siga as regras da sua organização ou do comitê de ética e trate a transcrição com o mesmo cuidado que a gravação: o texto baixado é um arquivo no seu dispositivo como qualquer outro.',
  ],

  sections: [
    {
      title: 'O que a transcrição dá e o que não dá',
      paragraphs: ['Conheça os limites antes de construir algo sobre uma transcrição.'],
      bullets: [
        {
          title: 'Sem rótulos de quem fala.',
          text: 'Cada linha tem uma marca de tempo, mas a transcrição não diz quem está falando. Acrescente Entrevistador e Participante à mão ao editar, conferindo com a gravação.',
        },
        {
          title: 'Uma leitura limpa, não estritamente literal.',
          text: 'Sistemas de reconhecimento costumam deixar de fora gaguejos e algumas palavras de preenchimento como "ãh". Se o seu estudo precisa de um registro estritamente literal, reproduza a gravação junto com o texto e acrescente o que falta.',
        },
        {
          title: 'Só depois da entrevista.',
          text: 'Funciona em uma gravação salva. Não entra em uma chamada nem transcreve ao vivo.',
        },
      ],
    },
    {
      title: 'Conferir uma transcrição antes de citá-la',
      paragraphs: [
        'Antes de publicar uma citação ou mencionar um participante, reproduza a linha a partir da marca de tempo e ouça. As linhas de que o sistema não teve certeza ficam marcadas, então comece por elas. Confira nomes, números e datas, e qualquer palavra que mudaria o sentido se estivesse errada, como pode e não pode. Para achar todos os lugares em que um nome ou termo aparece, digite-o na caixa Pesquisar no texto acima da transcrição pronta: ela conta as linhas que combinam e as setas passam de uma para outra.',
        'Mantenha a gravação como registro principal e trate a transcrição como uma cópia de trabalho. Se você descrever o seu método em um relatório ou artigo, diga que a transcrição foi feita com reconhecimento de fala e depois conferida à mão.',
      ],
    },
    {
      title: 'Consentimento, armazenamento e anonimato',
      paragraphs: [
        'Diga aos participantes como a gravação e a transcrição serão guardadas e quem as verá. Se você prometeu anonimato, remova nomes e detalhes que possam identificar alguém antes de compartilhar trechos. Esta página não pode fazer isso por você, e não dá aconselhamento jurídico.',
      ],
    },
  ],

  howTitle: 'Como transcrever uma entrevista',
  howToDescription:
    'Adicione a gravação da entrevista, escolha o idioma, adicione nomes, aguarde a transcrição e depois confira-a e baixe-a.',
  steps: [
    {
      title: 'Adicione a gravação da entrevista',
      text: 'Clique em Escolher um arquivo ou arraste a entrevista para a caixa acima. Áudio ou vídeo funcionam. Adicione uma entrevista aqui e depois use Adicionar outro arquivo na página seguinte para o restante do seu conjunto.',
    },
    {
      title: 'Escolha o idioma e a qualidade',
      text: 'Na página seguinte, selecione o idioma da entrevista ou mantenha Detectar automaticamente. Padrão serve para uma conversa tranquila entre duas pessoas. Eco, uma linha telefônica ou um sotaque forte pedem Alta precisão onde o seu dispositivo consegue executá-la; um dispositivo que não consegue mostra a opção acinzentada com um motivo. É mais lenta e exige um download inicial maior.',
    },
    {
      title: 'Adicione nomes e termos e comece',
      text: 'Em Mais opções, liste os nomes dos participantes, as organizações deles e quaisquer termos especializados na dica de vocabulário, para que sejam escritos do jeito que você quer. Depois clique em Transcrever.',
    },
    {
      title: 'Confira, rotule e exporte',
      text: 'Reproduza as linhas a partir das marcas de tempo, corrija os erros e acrescente rótulos de quem fala à mão. Depois baixe TXT ou PDF para os seus arquivos, ou Markdown ou JSON se precisar de linhas com tempo.',
    },
  ],

  formatsTitle: 'Arquivos de gravação de entrevista e downloads',
  formatsIntro:
    'Entrevistas vêm de celulares, gravadores e chamadas de vídeo. Qualquer um destes pode ser adicionado, e a trilha de som é tudo o que é lido.',
  uploadTitle: 'Arquivos de gravação que você pode adicionar',
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'texto simples para ler, citar e codificar' },
    { name: 'PDF', use: 'uma cópia para imprimir ou arquivar' },
    { name: 'Markdown', use: 'texto com tempo para um app de notas ou software de codificação' },
    { name: 'JSON', use: 'linhas com tempo para software de análise' },
  ],

  tipsTitle: 'Dicas para gravações de entrevistas',
  tips: [
    {
      title: 'Ponha o microfone perto.',
      text: 'Coloque-o perto do participante e use um fone com microfone ou um microfone de lapela em chamadas de telefone e de vídeo. Um microfone do outro lado da sala ou um espaço com eco costuma custar mais precisão do que qualquer configuração consegue recuperar.',
    },
    {
      title: 'Diga a data e os nomes no começo.',
      text: 'Diga quem participa e quando, no começo da gravação. Isso facilita rotular o arquivo e arquivar a transcrição depois.',
    },
    {
      title: 'Guarde a gravação original.',
      text: 'Nunca apague o áudio depois de ter o texto. A gravação é o que resolve uma dúvida sobre uma citação.',
    },
    {
      title: 'Fique dentro dos limites.',
      text: 'Qualquer coisa acima dos limites mostrados nesta página é recusada, então corte uma entrevista muito longa em uma pausa natural antes.',
      browser: {
        title: 'Entrevistas longas demoram mais.',
        text: 'Não há limite de duração, embora uma gravação longa precise de tempo e de memória livre no seu dispositivo, e um navegador sem WebCodecs possa ter dificuldade com um arquivo muito longo. Corte em uma pausa natural se preferir começar pela primeira parte.',
      },
    },
    {
      title: 'Limpe os seus dados em um computador compartilhado.',
      text: 'Quando tiver salvo o que precisa, clique em Apagar meus dados agora, para que a transcrição não fique na sessão.',
    },
  ],

  faqs: [
    {
      question: 'Posso transcrever aqui uma entrevista confidencial?',
      answer:
        'Sua gravação é enviada por uma conexão criptografada e apagada pelo servidor quando a sessão termina, ou antes, se você clicar em Apagar meus dados agora. Antes de contar com isso, confira o que a sua organização ou o comitê de ética exige. Isto não é aconselhamento jurídico.',
      browser: {
        answer:
          'Nenhum envio acontece: a gravação fica no seu dispositivo enquanto o navegador a transcreve, e o navegador a apaga depois de um período de inatividade ou quando você clica em Apagar meus dados agora. Uma transcrição baixada é um arquivo comum, então confira as regras da sua organização ou do comitê de ética. Isto não é aconselhamento jurídico.',
      },
    },
    {
      question: 'A transcrição da entrevista inclui "hum" e "ãh"?',
      answer:
        'Muitas vezes não. A transcrição é uma leitura limpa, e não um registro estritamente literal, e alguns gaguejos e palavras de preenchimento ficam de fora. Se você precisa de todos, reproduza a gravação junto com o texto e acrescente-os.',
    },
    {
      question: 'A transcrição consegue distinguir o entrevistador do participante?',
      answer:
        'Não. A transcrição não marca quem está falando. Digite Entrevistador e Participante no texto ao editar, usando a gravação para conferir cada fala.',
    },
    {
      question: 'Qual a duração máxima de uma entrevista que posso transcrever?',
      answer: '{limits} Uma entrevista mais longa pode precisar ser dividida.',
      browser: {
        answer:
          'A duração da entrevista não é limitada. O seu próprio dispositivo faz o trabalho, então uma entrevista longa demora mais e precisa de memória livre, e a página avisa se o seu dispositivo parecer lento demais.',
      },
    },
    {
      question: 'Posso usar essas transcrições na minha pesquisa ou no meu artigo?',
      answer:
        'Sim. Confira-as com a gravação antes de citar alguém, diga no seu método que foi usado reconhecimento de fala e siga as regras da sua instituição ou publicação.',
    },
  ],

  links: [
    {
      label: 'Gravação de reunião em texto',
      path: '/meeting-recording-to-text',
      note: 'Para chamadas gravadas, com notas sobre como transformar uma transcrição em ata.',
    },
    {
      label: 'Vídeo em texto',
      path: '/video-to-text',
      note: 'A página geral para qualquer vídeo gravado.',
    },
    {
      label: 'Transcrever um vídeo sem enviá-lo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'O que acontece com uma gravação no navegador e como ver isso por conta própria.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'Escolhas de áudio e de configuração que reduzem erros.',
    },
  ],
};
