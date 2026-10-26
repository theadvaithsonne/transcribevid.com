import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Áudio em texto',
  h1: 'Transforme áudio em texto sem precisar se cadastrar',
  lead: 'Solte um podcast, uma entrevista, uma aula ou uma nota de voz e receba uma transcrição com marcas de tempo que você pode pesquisar, editar e baixar. Grátis, sem limites e em mais de 50 idiomas.',
  dropKind: 'audio',
  dropNoun: 'o arquivo de áudio',
  record: true,

  whyTitle: 'Quando vale a pena converter áudio em texto',
  why: [
    'O áudio é a mídia mais difícil de percorrer. Você não consegue pesquisá-lo, dar uma olhada nele nem citá-lo sem ouvir de novo. Uma transcrição permite achar o minuto em que algo foi dito, extrair citações exatas e ler uma conversa de uma hora em poucos minutos.',
    'Usos típicos são notas de episódio de podcast, entrevistas para jornalismo ou pesquisa, história oral, notas de voz, rascunhos ditados e gravações de aulas ou palestras. Transcreva apenas gravações que você mesmo fez ou que tem permissão para usar.',
  ],

  howTitle: 'Como converter áudio em texto',
  howToDescription:
    'Adicione um arquivo de áudio ou grave um, escolha o idioma, aguarde a transcrição e baixe-a.',
  steps: [
    {
      title: 'Adicione seu áudio',
      text: 'Solte um arquivo de áudio na caixa no topo desta página ou clique em Escolher um arquivo. Para gravar um novo, clique em Gravar com o microfone, abaixo da caixa.',
    },
    {
      title: 'Escolha o idioma',
      text: 'Selecione o idioma falado ou mantenha a detecção automática. Padrão é um bom começo para fala clara. Mais rápido é veloz; Precisão máxima demora mais e comete menos erros.',
    },
    {
      title: 'Aguarde o texto',
      text: 'As linhas aparecem conforme são reconhecidas. Melhorar o áudio, que vem ativado por padrão, filtra ruídos graves e chiados e equilibra quem fala baixo.',
    },
    {
      title: 'Revise e exporte',
      text: 'Reproduza qualquer linha a partir da marca de tempo, corrija os erros e baixe a transcrição no formato de que precisa.',
    },
  ],

  formatsTitle: 'Arquivos de áudio compatíveis e downloads',
  formatsIntro:
    'Os formatos de áudio mais comuns funcionam. Arquivos de vídeo também são aceitos, e só o som deles é usado.',
  uploadTitle: 'Arquivos de áudio que você pode enviar',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'texto limpo para anotações e rascunhos' },
    { name: 'Markdown', use: 'texto com horários, pronto para um app de notas' },
    { name: 'PDF', use: 'uma transcrição para imprimir' },
    { name: 'SRT', use: 'linhas com tempo para legendas' },
    { name: 'VTT', use: 'linhas com tempo para players da web' },
    { name: 'JSON', use: 'cada linha e horário, para programas' },
  ],

  tipsTitle: 'Dicas para transcrições de áudio precisas',
  tips: [
    {
      title: 'Chegue perto do microfone.',
      text: 'Eco e distância costumam importar mais do que o formato do arquivo. Uma sala silenciosa e um microfone por perto valem mais do que qualquer configuração.',
    },
    {
      title: 'Uma voz de cada vez.',
      text: 'Vozes sobrepostas, música sob a fala e muito ruído de fundo causam a maioria dos erros.',
    },
    {
      title: 'Envie o original.',
      text: 'Salvar de novo uma gravação em um arquivo menor remove detalhes. Use o original ou a cópia de melhor qualidade que você tiver.',
    },
    {
      title: 'Use uma dica de vocabulário.',
      text: 'Nomes, marcas e termos técnicos são o que os sistemas de reconhecimento mais erram. Liste-os em Mais opções.',
    },
    {
      title: 'Peça permissão antes de gravar.',
      text: 'Peça permissão antes de gravar ou transcrever a voz de outras pessoas e confira as regras locais sobre gravação de chamadas.',
    },
  ],

  faqs: [
    {
      question: 'Quais formatos de áudio posso converter em texto?',
      answer:
        'MP3, WAV, M4A, AAC, FLAC, OGG e OPUS. Arquivos de vídeo como MP4 e MKV também funcionam, porque só o som é usado.',
    },
    {
      question: 'Posso gravar áudio direto na página?',
      answer:
        'Sim, em navegadores que permitem o acesso ao microfone. Clique em Gravar do microfone, permita o acesso quando solicitado e depois pare. A gravação é transcrita depois que você para, não enquanto fala.',
    },
    {
      question: 'Funciona para uma entrevista com duas pessoas?',
      answer:
        'Sim, a fala das duas pessoas é transcrita. Nomes ou rótulos de quem fala não são adicionados, mas cada linha tem uma marca de tempo e você pode digitar os nomes no texto ao editar.',
    },
    {
      question: 'Qual pode ser a duração do áudio?',
      answer:
        '{limits} Arquivos mais longos ou maiores são recusados antes de serem processados, então divida-os antes. Não há cota diária nem mensal.',
      browser: {
        answer:
          'Não definimos limite: o áudio é transcrito no navegador, no seu próprio dispositivo, então gravações longas apenas demoram mais e precisam de memória livre suficiente. A página avisa se o dispositivo for mais lento. Não há cota diária nem mensal.',
      },
    },
    {
      question: 'Meu áudio fica guardado?',
      answer:
        'Os arquivos ficam guardados só durante a sua sessão e são apagados automaticamente quando ela termina, ou na hora em que você clica em Apagar meus dados agora. Não há conta.',
      browser: {
        answer:
          'Só neste navegador: seu áudio nunca sai do seu dispositivo. Ele é apagado automaticamente depois de um período de inatividade, ou na hora em que você clica em Apagar meus dados agora. Não há conta.',
      },
    },
  ],
};
