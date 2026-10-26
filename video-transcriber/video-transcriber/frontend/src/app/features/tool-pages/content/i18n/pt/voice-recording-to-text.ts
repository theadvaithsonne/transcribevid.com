import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Gravação de voz em texto',
  h1: 'Gravação de voz em texto, direto do seu navegador',
  lead: 'Grave com o microfone na página ou envie uma nota de voz do celular e leia suas palavras em texto depois. Grátis, sem login, em mais de 50 idiomas.',
  dropKind: 'audio',
  dropNoun: 'a gravação de voz',
  record: true,

  whyTitle: 'Para que isto serve, e para que não serve',
  why: [
    'Falar é mais rápido do que digitar, então muita gente registra ideias, anotações de reuniões, pontos de aulas e primeiros rascunhos em uma gravação de voz e os transforma em texto depois. Esta página foi feita para isso: grave ou envie, depois leia, edite e baixe o texto.',
    'Não é ditado ao vivo. Você grava, para, e a transcrição é feita a partir da gravação inteira, então as palavras não aparecem enquanto você ainda está falando. Em troca, cada linha recebe uma marca de tempo.',
  ],

  howTitle: 'Como transformar uma gravação de voz em texto',
  howToDescription:
    'Grave com o microfone ou envie uma nota de voz, escolha o idioma, aguarde a transcrição e baixe-a.',
  steps: [
    {
      title: 'Grave ou escolha um arquivo',
      text: 'Solte uma nota de voz na caixa no topo desta página (as gravações do Gravador de Voz do iPhone são arquivos M4A) ou clique em Escolher um arquivo. Para gravar, clique em Gravar com o microfone, abaixo da caixa, depois em Gravar do microfone, e permita o acesso quando o navegador perguntar.',
    },
    {
      title: 'Pare e escolha o idioma',
      text: 'Se estiver gravando, clique em Parar a gravação quando terminar. Depois selecione o idioma falado ou mantenha a detecção automática.',
    },
    {
      title: 'Aguarde a transcrição',
      text: 'O texto aparece linha por linha, com uma barra de progresso e uma estimativa do tempo restante.',
    },
    {
      title: 'Edite e baixe',
      text: 'Corrija qualquer palavra e baixe TXT, Markdown ou PDF. As transcrições existem só na sua sessão, então salve o que precisar.',
    },
  ],

  formatsTitle: 'Formatos de nota de voz e downloads',
  formatsIntro:
    'Gravadores de voz de celular e de computador salvam em formatos diferentes. Todos estes funcionam.',
  uploadTitle: 'Arquivos de gravação que você pode enviar',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'suas palavras em texto simples' },
    { name: 'Markdown', use: 'notas com horários' },
    { name: 'PDF', use: 'uma cópia da nota para imprimir' },
    { name: 'SRT', use: 'linhas com tempo, se a gravação acompanha um vídeo' },
    { name: 'VTT', use: 'linhas com tempo para players da web' },
    { name: 'JSON', use: 'linhas estruturadas para programas' },
  ],

  tipsTitle: 'Dicas para gravações de voz',
  tips: [
    {
      title: 'Teste o microfone.',
      text: 'Grave dez segundos e ouça antes de uma sessão longa.',
    },
    {
      title: 'Fale em ritmo constante.',
      text: 'Fale perto do microfone em uma sala silenciosa. Ventiladores, teclados e vento são captados com a mesma clareza que a sua voz.',
    },
    {
      title: 'Diga nomes e números com clareza.',
      text: 'Adicione palavras incomuns à dica de vocabulário em Mais opções e é muito mais provável que saiam certas.',
    },
    {
      title: 'Sem botão de microfone?',
      text: 'Alguns navegadores só permitem gravar em páginas seguras ou depois que você dá permissão. Grave com o app de gravador de voz do celular e envie o arquivo.',
    },
    {
      title: 'Respeite as outras pessoas.',
      text: 'Avise as pessoas quando for gravá-las e peça a permissão delas antes.',
    },
  ],

  faqs: [
    {
      question: 'Isto é ditado ao vivo?',
      answer:
        'Não. Você grava primeiro e a transcrição é feita depois. Para palavras que aparecem enquanto você fala, use o recurso de ditado do celular ou do computador.',
    },
    {
      question: 'Posso usar no celular?',
      answer:
        'Sim. Abra a página no navegador do celular e grave na própria página, ou envie um arquivo de nota de voz que você já salvou.',
    },
    {
      question: 'Qual pode ser a duração de uma gravação?',
      answer:
        '{limits} Arquivos mais longos são recusados antes de serem processados, então divida-os antes. Não há cota diária nem mensal.',
      browser: {
        answer:
          'Não definimos limite: a gravação é transcrita no navegador, no seu próprio dispositivo, então uma gravação longa apenas demora mais. A página avisa se o dispositivo for mais lento. Não há cota diária nem mensal.',
      },
    },
    {
      question: 'Ele distingue quem fala?',
      answer:
        'Não. Nomes ou rótulos de quem fala não são adicionados. Cada linha tem uma marca de tempo, e você pode digitar os nomes no texto ao editar.',
    },
    {
      question: 'Minha gravação de voz fica guardada?',
      answer:
        'Só durante a sua sessão. Ela é apagada quando a sessão termina, depois de um período de inatividade ou quando você clica em Apagar meus dados agora. Não há conta.',
      browser: {
        answer:
          'Só neste navegador: sua gravação nunca sai do seu dispositivo. Ela é apagada depois de um período de inatividade ou quando você clica em Apagar meus dados agora. Não há conta.',
      },
    },
  ],
};
