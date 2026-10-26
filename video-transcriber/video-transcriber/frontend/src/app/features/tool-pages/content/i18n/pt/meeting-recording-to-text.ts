import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Gravação de reunião em texto',
  h1: 'Gravação de reunião em texto: Zoom, Teams e Google Meet',
  lead: 'Salve a gravação depois da sua chamada, solte-a aqui e receba uma transcrição com marcas de tempo que você pode pesquisar, citar e transformar em ata. Não custa nada, não exige conta e cobre mais de 50 idiomas.',
  dropKind: 'video',
  dropNoun: 'a gravação da reunião',

  whyTitle: 'Por que transcrever a gravação de uma reunião',
  why: [
    'Pouca gente reassiste a uma reunião de uma hora, mas muita gente precisa de uma coisa dela: quem concordou com o quê e até quando. Uma transcrição permite pesquisar um prazo ou um nome, achar o minuto em que foi dito e citá-lo exatamente. É um começo mais rápido para atas e listas de ações do que reproduzir a chamada de novo.',
    'Esta página trabalha com uma gravação que já existe. Ela não entra em uma chamada ao vivo e não adiciona nomes de quem fala, então substitui o replay, não quem faz as anotações. Reuniões costumam ter detalhes confidenciais, então saiba para onde vai uma gravação: aqui ela é enviada por uma conexão criptografada e removida automaticamente depois.',
  ],
  browserWhy: [
    'Pouca gente reassiste a uma reunião de uma hora, mas muita gente precisa de uma coisa dela: quem concordou com o quê e até quando. Uma transcrição permite pesquisar um prazo ou um nome, achar o minuto em que foi dito e citá-lo exatamente. É um começo mais rápido para atas e listas de ações do que reproduzir a chamada de novo.',
    'Esta página trabalha com uma gravação que já existe. Ela não entra em uma chamada ao vivo e não adiciona nomes de quem fala, então substitui o replay, não quem faz as anotações. Reuniões costumam conter detalhes confidenciais: o navegador transcreve a gravação no seu próprio dispositivo e nada é enviado, e nada é guardado quando a sua sessão termina.',
  ],

  sections: [
    {
      title: 'Onde encontrar a gravação da sua reunião',
      paragraphs: [
        'Cada ferramenta de reunião salva as gravações em um lugar próprio, e nomes de menus, pastas e o que o seu plano permite mudam entre versões, então use isto como um guia. Se você consegue exportar só o áudio, um arquivo M4A ou MP3 é menor e é lido igualmente bem. Zoom, Microsoft Teams e Google Meet são nomes de seus respectivos donos, e este site não tem ligação com eles.',
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'Uma gravação local é salva no seu computador quando a reunião termina, normalmente como um vídeo MP4 e um arquivo de áudio M4A. Uma gravação na nuvem é baixada na página de gravações da sua conta do Zoom.',
        },
        {
          title: 'Microsoft Teams.',
          text: 'Depois da reunião, a gravação fica guardada no OneDrive ou no SharePoint, dependendo do tipo de reunião, e um link aparece no chat da reunião. Abra-o lá e baixe o MP4 se a sua conta permitir downloads.',
        },
        {
          title: 'Google Meet.',
          text: 'As gravações são salvas no Google Drive, normalmente em uma pasta Meet Recordings, e o organizador recebe um link. Baixe o MP4 do Drive.',
        },
      ],
    },
    {
      title: 'Da transcrição à ata',
      paragraphs: [
        'Uma transcrição bruta ainda não é uma ata, mas torna a escrita dela rápida. Quando a transcrição estiver pronta, digite uma palavra como prazo, concordar ou ação na caixa Pesquisar no texto acima dela, ou o nome de alguém envolvido. A caixa mostra quantas linhas combinam, e as setas para cima e para baixo vão de uma para a próxima. Leia em volta de cada resultado, reproduza a linha a partir da marca de tempo se estiver confusa e copie as linhas para as suas notas com seus horários, para que qualquer pessoa possa conferir a gravação.',
        'Se um nome saiu escrito de duas formas, pesquise a grafia errada, abra Substituir…, digite a certa e aplique em todas as linhas de uma vez. Baixe o Markdown para colar em um app de notas ou o PDF para enviar a todos. As linhas têm horário, mas não rótulo de quem fala, então digite os nomes enquanto edita, usando a gravação para conferir quem falou.',
      ],
    },
    {
      title: 'Permissão, regras e cuidado',
      paragraphs: [
        'Avise todos antes de gravar uma reunião e peça a permissão deles, e siga as regras da sua organização sobre gravações e transcrições. Uma transcrição de uma reunião confidencial é tão sensível quanto a gravação, então guarde-a e compartilhe-a com o mesmo cuidado. Esta página não dá aconselhamento jurídico.',
      ],
    },
  ],

  howTitle: 'Como converter a gravação de uma reunião em texto',
  howToDescription:
    'Adicione a gravação da reunião, escolha o idioma, aguarde a transcrição e baixe-a como texto ou legendas.',
  steps: [
    {
      title: 'Adicione a gravação',
      text: 'Clique em Escolher um arquivo ou arraste a gravação para a caixa acima. Um vídeo MP4 ou um arquivo de áudio M4A funcionam, e só o som é usado. A caixa aceita uma gravação por vez e a passa para a tela de envio na página seguinte, onde Adicionar outro arquivo traz o restante de um dia de chamadas.',
    },
    {
      title: 'Escolha o idioma e a qualidade',
      text: 'Na página seguinte, escolha o idioma que as pessoas falaram ou mantenha Detectar automaticamente. Padrão serve para a maioria das chamadas. Onde o seu dispositivo as oferecer, Alta precisão e Precisão máxima servem para quem fala rápido ou para áudio ruim; caso contrário, aparecem acinzentadas com o motivo. As duas são mais lentas e exigem um download inicial maior. Se as pessoas trocam de idioma, escolha o principal e confira as linhas marcadas como incertas. Depois clique em Transcrever.',
    },
    {
      title: 'Aguarde a transcrição',
      text: 'As linhas aparecem conforme a gravação é processada, com uma barra de progresso e uma estimativa do tempo restante. Uma reunião longa demora mais.',
      browser: {
        text: 'As linhas aparecem conforme a gravação é processada, com uma barra de progresso e uma estimativa do tempo restante. O seu próprio dispositivo faz o trabalho, então uma reunião longa demora mais: mantenha esta página aberta até terminar.',
      },
    },
    {
      title: 'Pesquise, edite e exporte',
      text: 'Digite nomes e palavras de decisão em Pesquisar no texto para pular entre as linhas, reproduza uma linha a partir da marca de tempo para conferi-la e corrija os erros. Depois baixe TXT, Markdown ou PDF. Acrescente os nomes de quem fala à mão ao editar.',
    },
  ],

  formatsTitle: 'Arquivos de gravação de reunião e downloads',
  formatsIntro:
    'Gravações do Zoom, do Teams e do Meet costumam ser MP4 ou M4A. Outros arquivos de vídeo e de áudio funcionam também, e só a trilha de som é lida.',
  uploadTitle: 'Arquivos de gravação que você pode adicionar',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'a reunião inteira em texto simples' },
    { name: 'Markdown', use: 'notas com tempo para colar em um app de notas' },
    { name: 'PDF', use: 'uma cópia para imprimir ou enviar a todos' },
    { name: 'SRT', use: 'linhas com tempo para legendar a gravação' },
  ],

  tipsTitle: 'Dicas para transcrições de reuniões',
  tips: [
    {
      title: 'Use o arquivo só de áudio quando houver um.',
      text: 'Ele guarda a mesma fala em um arquivo bem menor, então é mais rápido de adicionar e de processar.',
    },
    {
      title: 'Coloque nomes e termos na dica de vocabulário.',
      text: 'Em Mais opções, liste as pessoas, os nomes de produtos e as siglas usados na reunião. Assim nomes e siglas saem como você espera.',
    },
    {
      title: 'Espere que falas sobrepostas causem erros.',
      text: 'Quando duas pessoas falam ao mesmo tempo, o sistema de reconhecimento não consegue separá-las. As linhas de que ele não tem certeza ficam marcadas, então revise essas primeiro.',
    },
    {
      title: 'Fique dentro dos limites.',
      text: 'Gravações acima dos limites de tamanho ou de duração mostrados nesta página não podem ser processadas, então corte uma chamada muito longa em partes antes.',
      browser: {
        title: 'Chamadas longas demoram mais.',
        text: 'O site não define limite de duração, mas a gravação de um workshop de um dia inteiro precisa de tempo e de memória livre no seu dispositivo. Para ler a primeira hora mais cedo, corte o arquivo em partes em um editor de vídeo.',
      },
    },
    {
      title: 'Compartilhe a transcrição com cuidado.',
      text: 'Envie só para quem estava na reunião ou precisa dela e apague quando não precisar mais.',
    },
  ],

  faqs: [
    {
      question:
        'O TranscribeVid pode entrar na minha chamada do Zoom ou do Teams e transcrever ao vivo?',
      answer:
        'Não. Ele trabalha com uma gravação que você salva depois da reunião. Não entra em uma chamada e não é legenda ao vivo. Para legendas ao vivo, use o recurso da sua ferramenta de reunião.',
    },
    {
      question: 'Uma transcrição de reunião mostra quem disse o quê?',
      answer:
        'Não. As linhas têm horário, mas nenhum nome. Acrescente os nomes você mesmo ao editar e confira cada um com a gravação.',
    },
    {
      question: 'É seguro transcrever aqui a gravação de uma reunião confidencial?',
      answer:
        'O servidor recebe a gravação por uma conexão criptografada e a apaga quando a sua sessão termina, ou antes, se você clicar em Apagar meus dados agora. Confira antes o que a sua organização permite. Isto não é aconselhamento jurídico.',
      browser: {
        answer:
          'A gravação não é enviada: o navegador a transcreve no seu próprio dispositivo e a apaga depois de um período de inatividade ou quando você clica em Apagar meus dados agora. Uma transcrição que você baixa é um arquivo comum no seu dispositivo, então cuide dela como cuidaria da gravação e confira o que a sua organização permite. Isto não é aconselhamento jurídico.',
      },
    },
    {
      question: 'Qual a duração máxima da gravação de reunião que posso transcrever?',
      answer: '{limits} Arquivos mais longos não podem ser processados, então divida-os antes.',
      browser: {
        answer:
          'Nenhum limite é definido para a gravação em si, porque o trabalho acontece no seu próprio dispositivo. O que limita é tempo e memória livre: uma chamada de várias horas é possível, a página avisa se o seu dispositivo parecer lento demais para isso, e um navegador sem suporte a WebCodecs pode não dar conta de um arquivo muito longo.',
      },
    },
    {
      question: 'E se as pessoas trocarem de idioma durante a reunião?',
      answer:
        'Escolha o idioma mais falado. O reconhecimento acompanha melhor o idioma principal, então palavras em outro idioma podem ser escritas errado. As linhas de que ele não tem certeza ficam marcadas: confira essas com a gravação.',
    },
  ],

  links: [
    {
      label: 'MP4 em texto',
      path: '/mp4-to-text',
      note: 'Configurações para uma reunião salva como vídeo MP4.',
    },
    {
      label: 'M4A em texto',
      path: '/m4a-to-text',
      note: 'Para o arquivo só de áudio, que é menor do que o vídeo.',
    },
    {
      label: 'Transcrição de entrevistas',
      path: '/interview-transcription',
      note: 'Para uma conversa gravada entre duas pessoas, com notas sobre consentimento e conferência de citações.',
    },
    {
      label: 'Transcrever um vídeo sem enviá-lo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Onde a sua gravação fica e como confirmar isso no navegador.',
    },
  ],
};
