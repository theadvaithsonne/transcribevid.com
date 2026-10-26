import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 em texto',
  h1: 'Transcrever um vídeo MP4 em texto',
  lead: 'MP4 é o formato de câmeras de celular, gravadores de tela e exportações de reuniões. Envie o seu e receba uma transcrição com marcas de tempo, grátis e sem login.',
  dropKind: 'video',
  dropNoun: 'o arquivo MP4',

  whyTitle: 'Por que arquivos MP4 são fáceis de transcrever',
  why: [
    'Um MP4 é um contêiner: guarda a imagem e o som juntos. O TranscribeVid lê o som e ignora a imagem, então não há nada para converter antes e nenhuma etapa separada de MP4 para MP3.',
    'Serve para gravações que já vêm em MP4, como vídeos de celular, reuniões do Zoom ou do Teams salvas, capturas de tela, webinars e gravações de aulas. O resultado é um texto com horário em cada linha, pronto para pesquisar ou virar legendas.',
  ],

  howTitle: 'Como converter um MP4 em texto',
  howToDescription:
    'Envie o MP4, escolha o idioma falado e a qualidade, aguarde a transcrição e baixe-a.',
  steps: [
    {
      title: 'Encontre o MP4',
      text: 'Localize o arquivo .mp4 no celular ou no computador. Você não precisa comprimir nem cortar, a menos que ele passe do limite.',
      browser: {
        text: 'Localize o arquivo .mp4 no celular ou no computador. Você não precisa comprimir nem cortar antes.',
      },
    },
    {
      title: 'Envie-o',
      text: 'Solte o MP4 na caixa no topo desta página ou clique em Escolher um arquivo. Na tela de envio, vários arquivos MP4 podem entrar na fila de uma vez.',
      browser: {
        title: 'Adicione-o',
        text: 'Solte o MP4 na caixa no topo desta página ou clique em Escolher um arquivo. Na tela de envio você pode adicionar vários arquivos MP4; eles são transcritos um após o outro.',
      },
    },
    {
      title: 'Escolha o idioma e a qualidade',
      text: 'Escolha o idioma falado. Padrão é o recomendado. Alta precisão e Precisão máxima são mais lentas e cometem menos erros, e Mais rápido é veloz com fala clara.',
    },
    {
      title: 'Baixe o resultado',
      text: 'Pegue o TXT para ler, o SRT ou o VTT para usar como legendas com o mesmo MP4, ou um PDF para imprimir.',
    },
  ],

  formatsTitle: 'MP4 e outros formatos de vídeo',
  formatsIntro:
    'MP4 é o caso mais comum, mas o mesmo envio aceita estes tipos de vídeo e também os formatos de áudio usuais.',
  uploadTitle: 'Arquivos de vídeo que você pode enviar',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'as palavras faladas em texto simples' },
    { name: 'SRT', use: 'um arquivo de legendas para o mesmo MP4' },
    { name: 'VTT', use: 'legendas para uma página da web' },
    { name: 'PDF', use: 'uma transcrição para imprimir ou compartilhar' },
    { name: 'Markdown', use: 'notas com horários' },
    { name: 'JSON', use: 'dados para suas próprias ferramentas' },
  ],

  tipsTitle: 'Dicas para transcrever arquivos MP4',
  tips: [
    {
      title: 'Confira se há som.',
      text: 'Uma gravação de tela feita sem áudio não tem fala para transcrever e dá um resultado vazio.',
    },
    {
      title: 'Cuidado com o vento e a sala.',
      text: 'Vídeos de celular sofrem com vento, distância e eco. Segure o celular mais perto ou use um microfone externo na próxima vez.',
    },
    {
      title: 'Reduza arquivos grandes exportando só o áudio.',
      text: 'Se um MP4 passar do limite, exporte só o áudio (M4A ou MP3) no seu editor. Fica muito menor e funciona do mesmo jeito.',
      browser: {
        text: 'Um MP4 muito longo exige muita memória no celular. Exporte só o áudio (M4A ou MP3) no seu editor: fica muito menor e funciona do mesmo jeito.',
      },
    },
    {
      title: 'Deixe o SRT ao lado do vídeo.',
      text: 'Muitos players carregam um arquivo .srt automaticamente quando ele tem o mesmo nome do vídeo.',
    },
    {
      title: 'Confira nomes e números.',
      text: 'As transcrições automáticas erram isso com mais frequência. Pesquisar e substituir corrige as repetições de uma vez.',
    },
  ],

  faqs: [
    {
      question: 'Preciso converter MP4 em MP3 antes?',
      answer: 'Não. Envie o MP4 do jeito que está. O som é lido do arquivo para você.',
    },
    {
      question: 'Por que meu MP4 foi recusado?',
      answer:
        'Arquivos acima do limite de tamanho ou de duração são recusados antes do processamento. {limits} Corte o vídeo em partes ou exporte só o áudio e envie de novo.',
      browser: {
        question: 'Por que meu MP4 não funcionou?',
        answer:
          'O navegador não conseguiu ler o som dele: o arquivo pode estar danificado, não ter trilha de som ou usar um formato de áudio raro. Exporte o áudio como M4A ou MP3 no seu editor e adicione esse arquivo no lugar. Não há limite de tamanho nem de duração, mas vídeos muito longos precisam de memória livre suficiente.',
      },
    },
    {
      question: 'Posso adicionar legendas ao meu MP4 com isso?',
      answer:
        'Você recebe um arquivo de legendas (SRT ou VTT) sincronizado com a fala. O TranscribeVid não edita nem recodifica o seu MP4, então gravar as legendas na imagem exige um editor de vídeo.',
    },
    {
      question: 'Posso colar um link em vez de enviar?',
      answer:
        'Não. O TranscribeVid funciona com arquivos que você envia ou grava, não com links da web. Se o vídeo é seu, envie o arquivo original.',
    },
    {
      question: 'Funciona com Zoom, Teams e vídeos de celular?',
      answer:
        'Sim, qualquer MP4 com fala funciona. Nomes de quem fala não são adicionados em reuniões, mas as linhas têm marca de tempo, então você pode acrescentar os nomes ao editar.',
    },
  ],
};
