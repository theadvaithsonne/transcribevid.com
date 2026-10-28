import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Como transcrever um vídeo em texto: cinco formas e qual combina com o seu vídeo',
  lead: 'Dá para obter as palavras de um vídeo em texto de cinco formas: a transcrição que o YouTube já tem, a digitação por voz, as legendas de um editor de vídeo, um serviço online ou uma ferramenta que roda no seu próprio dispositivo. Elas diferem no custo, em oferecer ou não o horário em cada linha e no que pedem de você antes. Este guia explica o que cada uma faz e quando escolher cada uma.',
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Transcrever um vídeo em texto, grátis e sem conta',
  blocks: [
    {
      title: 'A resposta curta',
      bullets: [
        {
          title: 'O vídeo está no YouTube e tem legendas:',
          text: 'abra a transcrição dele na página do vídeo. Não custa nada e leva um minuto, mas só existe quando o vídeo tem legendas, e o texto precisa de uma leitura atenta.',
        },
        {
          title: 'Você tem o arquivo de vídeo e quer texto com horários:',
          text: 'use uma ferramenta que aceite um arquivo e entregue TXT e arquivos de legendas. As duas últimas formas abaixo fazem isso.',
        },
        {
          title: 'Você só precisa de algumas citações:',
          text: 'reproduza o vídeo e digite, ou use a digitação por voz. Para qualquer coisa maior que alguns minutos, é mais lento do que deixar um programa fazer o arquivo todo.',
        },
        {
          title: 'Você quer legendas para o mesmo vídeo:',
          text: 'escolha uma forma que exporte SRT ou VTT, para que uma só execução entregue a transcrição e as legendas.',
        },
      ],
    },
    {
      title: 'O que uma boa transcrição exige do seu vídeo',
      paragraphs: [
        'Todas as formas abaixo trabalham a partir da faixa de áudio, então a qualidade do som decide a qualidade do texto muito mais do que a imagem. Fala perto do microfone, uma voz de cada vez e sem música por baixo sai bem. Uma sala com eco, pessoas falando ao mesmo tempo ou um fundo barulhento saem com erros em qualquer método.',
        'Antes de começar, descubra três coisas: o idioma falado no vídeo, se você precisa de um horário em cada linha e a duração do vídeo. A segunda diz quais formatos você precisa conseguir baixar; a terceira diz quais limites gratuitos vão te barrar.',
      ],
    },
    {
      title: 'Forma 1: use a transcrição que o YouTube já tem',
      paragraphs: [
        'Muitos vídeos do YouTube trazem legendas, escritas pelo dono ou geradas automaticamente. Na página de um vídeo, abra a descrição: onde há legendas, aparece ali uma opção para mostrar a transcrição, que lista o texto com horários e que você pode copiar. Se o vídeo é seu, o YouTube Studio tem uma seção de Legendas onde você pode revisar e baixar as legendas. O YouTube muda essas telas de tempos em tempos, então os nomes podem ser um pouco diferentes.',
      ],
      after: [
        'Esta é a forma mais rápida para um vídeo que já está no YouTube. Os limites são que só funciona com o link de um vídeo que tenha legendas, o texto automático pode errar bastante em nomes e termos técnicos, e não ajuda com um arquivo que está no seu computador ou celular.',
      ],
    },
    {
      title: 'Forma 2: reproduza o vídeo e deixe a digitação por voz ouvir',
      paragraphs: [
        'A digitação por voz em um editor de texto, como a opção Digitação por voz no menu Ferramentas do Google Docs, escreve o que o microfone dela ouve. Você reproduz o vídeo pelos alto-falantes e ela digita.',
        'Não custa nada, mas ela ouve a sala inteira, não só o vídeo. Não dá horários, funciona em tempo real, então um vídeo de uma hora leva uma hora, e tudo o que o microfone não captar se perde. Serve para uma ou duas citações e é uma escolha ruim para uma aula ou uma entrevista.',
      ],
    },
    {
      title: 'Forma 3: ative as legendas automáticas em um editor de vídeo',
      paragraphs: [
        'Alguns editores de vídeo conseguem transcrever a fala de um clipe que você coloca neles. O guia do próprio Microsoft Clipchamp, por exemplo, diz para abrir a aba Legendas, ativar as legendas automáticas e depois baixar as legendas como um arquivo SRT; o vídeo precisa ter fala no áudio para isso funcionar.',
        'Isso é útil quando você já vai editar o vídeo de qualquer jeito, porque as legendas caem na linha do tempo. Para uma transcrição simples, dá mais trabalho do que o necessário: você precisa carregar o vídeo no editor, e o texto sai como um arquivo de legendas que você ainda precisa transformar em documento.',
      ],
    },
    {
      title: 'Forma 4: use um serviço online de transcrição',
      paragraphs: [
        'Dezenas de sites transcrevem um arquivo que você enviar. A maioria é gratuita só até certo ponto: alguns minutos, alguns arquivos ou uma prévia que pede pagamento antes de você baixar. O que importa são as diferenças: se é preciso ter uma conta, quantos minutos você recebe, qual o tamanho máximo do arquivo e se o resultado pode ser exportado.',
        'Os serviços são a escolha certa quando você precisa do que as ferramentas simples não fazem: nomes para cada falante, um robô que entra na reunião ou um link para um vídeo que você não tem como arquivo. Nosso guia com os limites gratuitos de treze deles, cada um citado da própria página, está indicado abaixo.',
      ],
    },
    {
      title: 'Forma 5: transcreva o arquivo com o TranscribeVid',
      paragraphs: [
        'O TranscribeVid aceita o próprio arquivo de vídeo, sem conta e sem contagem diária. Ele executa o Whisper, um modelo de fala aberto, e devolve o texto com o horário em cada linha.',
        'Ele não aceita links, não identifica quem está falando e não entra em reuniões. Para essas tarefas, use um serviço da Forma 4.',
      ],
      browser: {
        paragraphs: [
          'O TranscribeVid aceita o próprio arquivo de vídeo, sem conta, sem contagem diária e sem limite de tamanho. Ele executa o Whisper, um modelo de fala aberto, no seu navegador, então o vídeo fica no seu dispositivo, e o texto volta com o horário em cada linha.',
          'Ele não aceita links, não identifica quem está falando e não entra em reuniões. Para essas tarefas, use um serviço da Forma 4. Como o trabalho é feito pelo seu próprio dispositivo, um vídeo longo é mais lento em um celular antigo do que em um notebook recente.',
        ],
      },
      steps: [
        { title: 'Adicione o vídeo', text: 'Solte o arquivo na caixa da página da ferramenta ou clique em Escolher um arquivo. MP4, MOV, MKV, WEBM e a maioria dos outros arquivos de vídeo funcionam, e os de áudio também.' },
        { title: 'Escolha o idioma e a qualidade', text: 'Indique o idioma falado, se você souber. Padrão serve para a maioria dos vídeos; escolha Alta precisão ou Precisão máxima para sotaques, ruído ou híndi.' },
        { title: 'Aguarde o texto', text: 'As linhas aparecem uma a uma, com uma barra de progresso e o tempo restante.' },
        { title: 'Edite e baixe', text: 'Corrija qualquer linha no editor e depois baixe TXT, SRT, VTT, PDF, Markdown ou JSON. Baixe o que quiser guardar antes de sair.' },
      ],
    },
    {
      title: 'Qual forma para qual vídeo',
      table: {
        caption: 'As cinco formas lado a lado, como descritas neste guia',
        head: ['Forma', 'Custo', 'Horário em cada linha', 'Funciona com', 'Melhor para'],
        rows: [
          ['Transcrição do YouTube', 'Grátis', 'Sim', 'Um vídeo do YouTube que tenha legendas', 'Uma cópia rápida de um vídeo que já está online'],
          ['Digitação por voz', 'Grátis', 'Não', 'Qualquer coisa que você possa reproduzir em voz alta', 'Algumas citações'],
          ['Legendas do editor', 'Depende do editor', 'Sim, como legendas', 'Um clipe carregado no editor', 'Um vídeo que você já vai editar'],
          ['Serviço online', 'Grátis até um limite, depois pago', 'Geralmente', 'Arquivos e, às vezes, links', 'Nomes de falantes, reuniões, links'],
          ['TranscribeVid', 'Grátis', 'Sim', 'Um arquivo de vídeo ou áudio', 'Um arquivo, com TXT e legendas de volta'],
        ],
      },
    },
    {
      title: 'Corrija o texto antes de usá-lo',
      paragraphs: [
        'Seja qual for a forma escolhida, leia o resultado uma vez com o vídeo tocando. A conversão de fala em texto acerta as palavras comuns e tropeça no que mais importa para você: nomes, termos do produto, números e tudo o que é dito rápido.',
      ],
      bullets: [
        { title: 'Nomes e termos.', text: 'Pesquise no texto cada nome que você sabe que está no vídeo e corrija todos os lugares onde ele aparece.' },
        { title: 'Números e datas.', text: 'Confira cada um com o vídeo; um dígito errado passa fácil.' },
        { title: 'Onde muda o falante.', text: 'Acrescente uma quebra de linha e um nome, porque as transcrições simples não marcam quem está falando.' },
        { title: 'Legendas.', text: 'Se for usar um arquivo SRT ou VTT, mantenha cada linha curta o bastante para ser lida no tempo em que fica na tela.' },
      ],
      after: [
        'Para uma lista mais longa de hábitos que reduzem erros antes de começar, veja o guia sobre como obter uma transcrição mais precisa.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Posso transcrever um vídeo em texto sem instalar nada?',
      answer: 'Sim. A transcrição do YouTube, um serviço online e o TranscribeVid funcionam em um navegador. Só um editor de vídeo ou um programa de computador exige instalação.',
    },
    {
      question: 'Qual a forma mais rápida de transcrever um vídeo de uma hora?',
      answer: 'Se ele está no YouTube com legendas, a transcrição de lá é imediata. Para um arquivo, um programa é muito mais rápido do que digitar ou usar a digitação por voz, que levam pelo menos o tempo de duração do vídeo. Quanto um programa demora depende da ferramenta, do nível de qualidade e, quando roda no seu dispositivo, da velocidade dele.',
    },
    {
      question: 'Preciso extrair o áudio do vídeo antes?',
      answer: 'Não. As ferramentas que aceitam arquivos de vídeo leem a faixa de áudio sozinhas, então você pode adicionar um MP4 ou MOV como está. Extrair o áudio antes só ajuda quando uma ferramenta recusa o formato do vídeo.',
    },
    {
      question: 'Como obtenho o texto com o horário em cada linha?',
      answer: 'Use uma forma que exporte legendas ou uma transcrição com marcas de tempo: a transcrição do YouTube lista horários, e uma ferramenta que baixa SRT ou VTT dá a cada linha um horário de início e de fim. A digitação por voz não dá nenhum.',
    },
  ],
  links: [
    {
      label: 'Ferramentas grátis de vídeo em texto comparadas',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Os limites gratuitos de treze ferramentas online, cada um citado da própria página.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'Hábitos e ajustes que reduzem erros em qualquer vídeo.',
    },
    {
      label: 'Crie legendas para o seu vídeo',
      path: '/srt-subtitle-generator',
      note: 'Transforme o mesmo vídeo em um arquivo SRT para players e editores.',
    },
    {
      label: 'Transcrever um vídeo sem enviá-lo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Como o trabalho fica no seu dispositivo e como conferir você mesmo.',
    },
  ],
};
