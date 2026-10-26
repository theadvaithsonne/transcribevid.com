import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Gerador de legendas SRT',
  h1: 'Gerar legendas SRT a partir de um arquivo de vídeo ou áudio',
  lead: 'Envie um vídeo e baixe um arquivo .srt pronto para usar, com cada linha sincronizada com a fala. Grátis, sem login, e você pode corrigir o texto antes de exportar.',
  dropKind: 'video',
  dropNoun: 'o vídeo',

  whyTitle: 'O que você recebe em um arquivo SRT',
  why: [
    'Um arquivo SRT é texto simples. Ele lista falas numeradas, cada uma com um horário de início, um horário de fim e as palavras que aparecem na tela. A maioria dos players de vídeo, editores e plataformas de vídeo consegue carregar um, o que o torna o formato de legenda mais seguro para começar.',
    'As legendas ajudam espectadores surdos ou com deficiência auditiva, pessoas que assistem sem som e quem acompanha melhor um segundo idioma por escrito. Elas também tornam a fala do seu vídeo pesquisável e citável.',
  ],

  howTitle: 'Como gerar um arquivo SRT',
  howToDescription:
    'Envie um vídeo, escolha o idioma, confira as linhas e baixe as legendas como arquivo SRT ou VTT.',
  steps: [
    {
      title: 'Envie o vídeo',
      text: 'Solte seu vídeo na caixa no topo desta página ou clique em Escolher um arquivo. Um arquivo de áudio também serve se você só precisa de texto com tempo.',
    },
    {
      title: 'Escolha o idioma',
      text: 'Escolha o idioma falado. O tempo por palavra vem ativado por padrão, o que dá uma sincronia de legendas mais precisa.',
    },
    {
      title: 'Confira as linhas',
      text: 'Abra a transcrição, reproduza a partir de qualquer marca de tempo e corrija as palavras erradas. Apague as linhas que você não quer.',
    },
    {
      title: 'Baixe o SRT ou o VTT',
      text: 'Escolha SRT para a maioria dos players e editores, ou VTT para páginas da web. Os dois incluem suas edições.',
    },
  ],

  formatsTitle: 'Formatos de legenda e arquivos compatíveis',
  formatsIntro:
    'Envie qualquer arquivo de vídeo ou áudio e baixe as legendas como SRT ou VTT. É assim que um arquivo SRT é por dentro:',
  uploadTitle: 'Arquivos que você pode enviar',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'falas numeradas com horários, o suporte mais amplo' },
    { name: 'VTT', use: 'WebVTT para vídeo HTML5 e players da web' },
    { name: 'TXT', use: 'as mesmas palavras sem horários' },
    { name: 'Markdown', use: 'texto com marcas de tempo' },
    { name: 'JSON', use: 'cada linha e horário, para programas' },
    { name: 'PDF', use: 'um roteiro para imprimir' },
  ],
  exampleLabel: 'Um exemplo de arquivo SRT',
  example: `1
00:00:01,000 --> 00:00:04,200
Bem-vindo de volta ao canal.

2
00:00:04,500 --> 00:00:07,800
Hoje vamos ver como as legendas funcionam.`,

  tipsTitle: 'Dicas para legendas melhores',
  tips: [
    {
      title: 'Mantenha as linhas curtas.',
      text: 'Uma referência comum é duas linhas de cerca de 42 caracteres. As linhas acompanham a fala, então as muito longas podem precisar ser divididas em um editor de legendas.',
    },
    {
      title: 'Assista antes de publicar.',
      text: 'Reproduza o vídeo com as legendas ativadas. Legendas automáticas precisam de uma conferência humana, principalmente para nomes, números e jargões.',
    },
    {
      title: 'Use uma dica de vocabulário.',
      text: 'Liste nomes e termos técnicos em Mais opções para que sejam escritos do jeito que você quer.',
    },
    {
      title: 'Escolha o formato certo.',
      text: 'SRT para players, editores e a maioria dos formulários de envio. VTT para a tag de vídeo HTML5 e players da web.',
    },
    {
      title: 'Precisa de legendas em inglês?',
      text: 'Defina Saída como Traduzir para o inglês em Mais opções. A tradução é automática, então leia tudo antes de publicar.',
    },
  ],

  faqs: [
    {
      question: 'O que é um arquivo SRT?',
      answer:
        'SubRip (.srt) é um formato de legenda em texto simples. Cada fala tem um número, um horário de início e de fim e o texto a mostrar. Qualquer editor de texto consegue abri-lo.',
    },
    {
      question: 'Devo escolher SRT ou VTT?',
      answer:
        'Use SRT para players de vídeo, editores e a maioria dos formulários de envio. Use VTT (WebVTT) ao adicionar legendas a uma página da web com o elemento de vídeo HTML5. O TranscribeVid exporta os dois a partir da mesma transcrição.',
    },
    {
      question: 'Ele grava as legendas no meu vídeo?',
      answer:
        'Não. Você recebe um arquivo de legendas separado e o vídeo não é alterado. Gravar as legendas na imagem exige um editor de vídeo.',
    },
    {
      question: 'Qual é a precisão da sincronia?',
      answer:
        'A sincronia acompanha a fala e costuma ser próxima, mas não é perfeita quadro a quadro. Confira a primeira e a última linha e ajuste em um editor de legendas se precisar de sincronia exata.',
    },
    {
      question: 'Posso criar legendas em outro idioma?',
      answer:
        'Você pode transcrever no idioma falado (mais de 50 são compatíveis) ou traduzir a fala para o inglês. Traduzir para outros idiomas não é oferecido.',
    },
  ],
};
