import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Vídeo em texto',
  h1: 'Converter vídeo em texto, grátis e com marcas de tempo',
  lead: 'Envie um vídeo gravado e veja a fala virar texto, linha por linha, cada uma com seu horário. Aulas, entrevistas, reuniões, vídeos de celular e gravações de tela funcionam, em mais de 50 idiomas.',
  dropKind: 'video',
  dropNoun: 'o vídeo',

  whyTitle: 'Por que transformar um vídeo em texto',
  why: [
    'É difícil buscar dentro de um vídeo. Você não consegue folheá-lo, citá-lo nem copiar uma frase dele. Uma transcrição transforma a fala em texto que você pode pesquisar, citar, traduzir e ler em uma fração do tempo, e cada linha mantém sua marca de tempo para você voltar ao momento exato.',
    'As pessoas usam para aulas e webinars gravados, entrevistas, reuniões de equipe salvas, demonstrações de produto, vlogs e vídeos curtos de redes sociais. O texto também é um bom ponto de partida para legendas, notas de episódio, artigos de blog e atas de reunião.',
  ],

  howTitle: 'Como converter um vídeo em texto',
  howToDescription:
    'Envie um arquivo de vídeo, escolha o idioma falado, aguarde a transcrição e baixe-a como texto ou legendas.',
  steps: [
    {
      title: 'Escolha seu vídeo',
      text: 'Solte o vídeo na caixa no topo desta página ou clique em Escolher um arquivo. Ele abre na tela de envio, onde você pode adicionar mais vídeos.',
    },
    {
      title: 'Defina o idioma e a qualidade',
      text: 'Escolha o idioma falado para obter a melhor precisão ou deixe a detecção automática ativada. Padrão serve para a maioria dos vídeos. Mais rápido é veloz com fala clara. Para áudio com ruído ou difícil, escolha Alta precisão ou Precisão máxima; Precisão máxima demora mais e comete menos erros.',
    },
    {
      title: 'Veja a transcrição acontecer',
      text: 'O texto aparece ao vivo, linha por linha, com uma barra de progresso e uma estimativa do tempo restante.',
    },
    {
      title: 'Edite e baixe',
      text: 'Corrija qualquer linha no editor e baixe TXT, SRT, VTT, Markdown, JSON ou PDF. Nada é guardado depois da sua sessão, então baixe antes de sair.',
    },
  ],

  formatsTitle: 'Arquivos de vídeo compatíveis e downloads',
  formatsIntro:
    'O TranscribeVid lê a trilha de som, então a imagem pode ter qualquer qualidade. Arquivos só de áudio também funcionam.',
  uploadTitle: 'Arquivos de vídeo que você pode enviar',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'texto simples para ler ou colar' },
    { name: 'SRT', use: 'legendas para players e editores' },
    { name: 'VTT', use: 'legendas para vídeo na web' },
    { name: 'Markdown', use: 'texto com títulos e horários' },
    { name: 'JSON', use: 'linhas com tempo para programas' },
    { name: 'PDF', use: 'uma cópia para imprimir' },
  ],

  tipsTitle: 'Dicas para transcrições de vídeo melhores',
  tips: [
    {
      title: 'Ouça o primeiro minuto antes.',
      text: 'Se você tem dificuldade para entender a fala nos alto-falantes do notebook, o software também terá. Resolva problemas de volume antes de enviar.',
    },
    {
      title: 'Informe o idioma.',
      text: 'Escolher o idioma falado é mais confiável do que a detecção automática, principalmente em trechos curtos ou com sotaque.',
    },
    {
      title: 'Adicione uma dica de vocabulário.',
      text: 'Em Mais opções, liste nomes, marcas e jargões do jeito que você quer que sejam escritos.',
    },
    {
      title: 'Respeite o limite.',
      text: 'Vídeos mais longos ou maiores que o limite acima são recusados, então corte gravações longas em partes antes.',
      browser: {
        title: 'Vídeos longos demoram mais.',
        text: 'Não há limite de tamanho, mas um vídeo longo demora mais no seu dispositivo e usa mais memória. No celular, corte gravações muito longas em partes.',
      },
    },
    {
      title: 'Confira as linhas marcadas.',
      text: 'As linhas de que o sistema de reconhecimento não tem certeza ficam marcadas. Revise essas primeiro, porque nenhuma transcrição é perfeita.',
    },
  ],

  faqs: [
    {
      question: 'Converter vídeo em texto é mesmo grátis?',
      answer:
        'Sim. É grátis, não precisa de conta nem de login e não há cota diária ou mensal. {limits} Se muita gente estiver usando o serviço, seu arquivo pode esperar um pouco em uma fila.',
      browser: {
        answer:
          'Sim. É grátis, não precisa de conta nem de login e não há cota diária ou mensal; os anúncios mantêm o serviço gratuito. Seu vídeo é transcrito no navegador, no seu próprio dispositivo, então não há limite de tamanho e ninguém está na sua frente: a velocidade depende do seu dispositivo.',
      },
    },
    {
      question: 'Posso transcrever um vídeo sem fala?',
      answer:
        'Só a fala vira texto. Um vídeo mudo, ou só com música, dá um resultado vazio ou muito curto. O texto que aparece na tela não é lido.',
    },
    {
      question: 'Posso colar um link do YouTube?',
      answer:
        'Não. O TranscribeVid funciona com arquivos que você envia ou grava, não com links da web. Se o vídeo é seu, envie o arquivo original.',
    },
    {
      question: 'Ele diz quem está falando?',
      answer:
        'Não. Nomes ou rótulos de quem fala não são adicionados. Cada linha tem uma marca de tempo, e você pode digitar os nomes no texto enquanto edita.',
    },
    {
      question: 'Qual é a precisão de vídeo em texto?',
      answer:
        'Em fala clara em um idioma compatível, costuma ser muito precisa, mas nenhum reconhecimento de fala é perfeito. Ruído, sotaques, música e vozes sobrepostas reduzem a precisão, então confira trechos importantes com o vídeo.',
    },
  ],
};
