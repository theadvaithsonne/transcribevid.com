import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 em texto',
  h1: 'Converter MP3 em texto online',
  lead: 'De episódios de podcast a gravações de aulas e mensagens de voz, o MP3 é o formato de áudio de que quase todos nós temos pilhas. Envie um MP3 e receba uma transcrição com marcas de tempo, grátis e sem login.',
  dropKind: 'audio',
  dropNoun: 'o arquivo MP3',

  whyTitle: 'O que uma transcrição de MP3 oferece',
  why: [
    'O MP3 comprime o áudio em um arquivo pequeno, e é por isso que podcasts, gravadores de voz e aulas baixadas o usam. Isso ajuda aqui também: um MP3 é enviado rápido mesmo em uma conexão lenta, e um MP3 de uma hora a 128 kbps tem só cerca de 58 MB.',
    'Uma transcrição permite procurar uma frase em um episódio longo, citar um entrevistado com exatidão, escrever as notas do episódio sem ouvir tudo de novo ou manter um registro escrito de uma palestra ou mensagem de voz.',
  ],
  browserWhy: [
    'O MP3 comprime o áudio em um arquivo pequeno, e é por isso que podcasts, gravadores de voz e aulas baixadas o usam. Isso ajuda aqui também: o navegador lê um MP3 rapidamente, e um MP3 de uma hora a 128 kbps tem só cerca de 58 MB.',
    'Uma transcrição permite procurar uma frase em um episódio longo, citar um entrevistado com exatidão, escrever as notas do episódio sem ouvir tudo de novo ou manter um registro escrito de uma palestra ou mensagem de voz.',
  ],

  howTitle: 'Como converter um MP3 em texto',
  howToDescription:
    'Envie o MP3, escolha o idioma falado, aguarde a transcrição e baixe-a como texto ou legendas.',
  steps: [
    {
      title: 'Escolha seu MP3',
      text: 'Solte o .mp3 na caixa no topo desta página ou clique em Escolher um arquivo. Na tela de envio você pode adicionar mais de um, e cada um vira uma transcrição própria.',
    },
    {
      title: 'Escolha o idioma',
      text: 'Selecione o idioma falado ou mantenha a detecção automática. Para obter texto em inglês a partir de outro idioma, abra Mais opções e defina Saída como Traduzir para o inglês.',
    },
    {
      title: 'Aguarde a transcrição',
      text: 'O texto aparece enquanto o arquivo é processado, com uma barra de progresso. Mais rápido é veloz; Precisão máxima demora mais e comete menos erros.',
    },
    {
      title: 'Corrija e baixe',
      text: 'Corrija qualquer linha e baixe o TXT para ler, ou SRT e VTT se o áudio acompanha um vídeo ou um player da web.',
    },
  ],

  formatsTitle: 'MP3 e outros formatos de áudio',
  formatsIntro:
    'MP3 é o envio de áudio mais comum. Estes outros formatos de áudio funcionam do mesmo jeito, e arquivos de vídeo também são aceitos.',
  uploadTitle: 'Arquivos de áudio que você pode enviar',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'o episódio ou a palestra em texto simples' },
    { name: 'Markdown', use: 'notas do episódio com marcas de tempo' },
    { name: 'SRT', use: 'legendas para uma versão em vídeo' },
    { name: 'VTT', use: 'uma faixa de transcrição para players da web' },
    { name: 'PDF', use: 'uma transcrição para imprimir ou enviar' },
    { name: 'JSON', use: 'linhas estruturadas para programas' },
  ],

  tipsTitle: 'Dicas para transcrever arquivos MP3',
  tips: [
    {
      title: 'Envie a melhor cópia.',
      text: 'O MP3 tem perda de qualidade, e cada novo salvamento perde um pouco mais de detalhe. Se você ainda tem o WAV ou a gravação original, envie esse.',
    },
    {
      title: 'Evite taxas de bits muito baixas.',
      text: 'A fala resiste bem à compressão, mas taxas de bits muito baixas borram as consoantes e reduzem a precisão.',
    },
    {
      title: 'Divida episódios longos.',
      text: 'Um arquivo acima do limite de duração é recusado. Corte um episódio de duas horas em partes em qualquer editor de áudio antes.',
      browser: {
        text: 'Não há limite de duração, mas um episódio de duas horas leva um tempo em um dispositivo mais lento. Corte-o em partes em qualquer editor de áudio para ler a primeira parte mais cedo.',
      },
    },
    {
      title: 'Lide com vinhetas e música.',
      text: 'Mantenha Pular silêncios e música ativado em Mais opções, para que vinhetas e pausas longas não gerem palavras inventadas.',
    },
    {
      title: 'Escreva os nomes dos convidados.',
      text: 'Coloque o apresentador, os convidados, o nome do programa e as marcas na dica de vocabulário uma vez, e é muito mais provável que saiam certos.',
    },
  ],

  faqs: [
    {
      question: 'Qual pode ser a duração de um MP3?',
      answer:
        '{limits} Um MP3 de 60 minutos a 128 kbps tem cerca de 58 MB, então o limite de duração importa mais do que o de tamanho. Não há cota diária nem mensal.',
      browser: {
        answer:
          'Não definimos limite de tamanho nem de duração, porque o MP3 é transcrito no navegador, no seu próprio dispositivo. Um MP3 de 60 minutos a 128 kbps tem cerca de 58 MB; arquivos mais longos apenas demoram mais, e a página avisa se o dispositivo for mais lento. Não há cota diária nem mensal.',
      },
    },
    {
      question: 'A compressão do MP3 prejudica a precisão?',
      answer:
        'Não muito em qualidade normal, porque a fala é o caso fácil para o MP3. Ruído, eco e vozes sobrepostas prejudicam muito mais do que o formato, então prefira um original limpo quando tiver um.',
    },
    {
      question: 'Posso transcrever vários arquivos MP3 de uma vez?',
      answer:
        'Sim. Adicione-os juntos e cada um vira uma transcrição própria na sua sessão, que você pode abrir e baixar separadamente.',
    },
    {
      question: 'Posso traduzir um MP3 para o inglês?',
      answer:
        'Sim. Em Mais opções, defina Saída como Traduzir para o inglês. A tradução é automática, então leia o texto em inglês antes de usá-lo. Outros idiomas de destino não são oferecidos.',
    },
    {
      question: 'Meu MP3 fica guardado?',
      answer:
        'Só durante a sua sessão. Ele é apagado automaticamente quando a sessão termina ou quando você clica em Apagar meus dados agora. Não é preciso ter conta.',
      browser: {
        answer:
          'Só neste navegador: seu MP3 nunca sai do seu dispositivo. Ele é apagado automaticamente depois de um período de inatividade ou quando você clica em Apagar meus dados agora. Não é preciso ter conta.',
      },
    },
  ],
};
