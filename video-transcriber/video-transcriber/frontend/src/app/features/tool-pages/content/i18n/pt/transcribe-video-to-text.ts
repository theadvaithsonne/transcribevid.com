import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Transcrever vídeo em texto',
  h1: 'Transcrever vídeo em texto: grátis, sem cadastro, sem limite diário',
  browserH1: 'Transcrever vídeo em texto: grátis, sem cadastro, sem limite, sem enviar nada',
  lead: 'Adicione um vídeo e receba a fala dele em texto, com o horário em cada linha. Não é preciso criar conta nem há limite diário, então o próximo vídeo pode começar assim que este terminar.',
  browserLead:
    'Adicione um vídeo e receba a fala dele em texto, com o horário em cada linha. Não é preciso criar conta, não há limite diário nem limite de tamanho de arquivo, e o vídeo nunca é enviado: quem faz o trabalho é o seu próprio dispositivo.',
  dropKind: 'video',
  dropNoun: 'o vídeo',

  whyTitle: 'O que "grátis" deveria significar ao transcrever um vídeo',
  why: [
    'Muitos sites que dizem oferecer "transcrição de vídeo grátis" dão a você um minuto, ou alguns arquivos, e depois pedem uma conta ou um cartão. Antes de escolher um, confira quatro coisas: se é preciso se cadastrar, quantos minutos ou arquivos você recebe, qual o tamanho máximo do arquivo e se você pode baixar o resultado.',
    'Aqui a resposta para cada uma é simples. Você adiciona o vídeo, não há nada para se cadastrar, não existe contagem diária ou mensal, e a transcrição é baixada em TXT, SRT, VTT, PDF, Markdown ou JSON sem custo. A ferramenta não identifica quem está falando e não aceita links: você adiciona o próprio arquivo.',
  ],
  browserWhy: [
    'Muitos sites que dizem oferecer "transcrição de vídeo grátis" dão a você um minuto, ou alguns arquivos, e depois pedem uma conta ou um cartão. Antes de escolher um, confira quatro coisas: se é preciso se cadastrar, quantos minutos ou arquivos você recebe, qual o tamanho máximo do arquivo e se você pode baixar o resultado.',
    'Aqui a resposta para cada uma é simples. Você adiciona o vídeo, não há nada para se cadastrar, não existe contagem diária ou mensal nem limite de tamanho, e a transcrição é baixada em TXT, SRT, VTT, PDF, Markdown ou JSON sem custo. Como o trabalho é feito pelo seu dispositivo, a memória dele é o único limite real: um vídeo muito longo pode ser demais para um celular, então corte-o em partes antes. A ferramenta não identifica quem está falando e não aceita links: você adiciona o próprio arquivo.',
  ],

  sections: [
    {
      title: 'Limites gratuitos de outros sites de transcrição de vídeo, conferidos em outubro de 2026',
      paragraphs: [
        'São citações da página de cada ferramenta como estava em 28 de outubro de 2026, traduzidas das páginas em inglês dos fornecedores. Os planos mudam, então consulte a página antes de confiar em um número. O guia indicado no fim desta página traz a tabela completa, com um link para cada fonte.',
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '"Transcrições ilimitadas de graça. Não é necessário cadastro." A ferramenta gratuita aceita arquivos MP3, WAV, MP4 e MOV, e atribui todo o texto de uma gravação com vários falantes a um único falante.',
        },
        { title: 'VoiceCheap.', text: '"Grátis para arquivos de até 60 minutos, com 1 transcrição por dia."' },
        { title: 'RecCloud.', text: '"Nosso plano gratuito permite vídeos de até 10 minutos de duração."' },
        { title: 'Caption-X.', text: '"O plano gratuito cobre 5 transcrições no total, de até 5 minutos cada."' },
        { title: 'Maestra.', text: 'Uma "prévia de 1 minuto" e "Cadastre-se para baixar ou exportar sua transcrição."' },
        { title: 'Any2Text.', text: '"Primeiros 15 minutos grátis", depois $0.035 por minuto.' },
      ],
    },
    {
      title: 'Para onde vai o seu vídeo enquanto é transcrito',
      paragraphs: [
        'O vídeo é enviado ao servidor que executa este site, é transcrito lá e é apagado quando a sua sessão termina. Ele não é publicado em nenhum outro lugar.',
      ],
      browser: {
        paragraphs: [
          'O vídeo fica no seu dispositivo. O navegador o lê, extrai o som e executa nele o modelo de fala Whisper, então nenhum arquivo é enviado para nós nem para ninguém.',
          'Só as ferramentas são baixadas: a página, o modelo de fala e o mecanismo que o executa. O modelo tem entre cerca de 77 MB e pouco mais de 1 GB, conforme o nível de qualidade e o dispositivo, e depois fica guardado no navegador. Para ver com os próprios olhos, abra o painel de rede do navegador enquanto um vídeo é transcrito.',
        ],
      },
    },
    {
      title: 'Quatro níveis de qualidade para vídeos diferentes',
      paragraphs: [
        'Mais rápido usa o modelo pequeno Base e serve para um rascunho rápido de fala clara. Padrão usa um modelo maior e é a escolha habitual. Alta precisão executa o Large v3 Turbo e lida melhor com sotaques e ambientes barulhentos. Precisão máxima executa o Large v3 completo e comete menos erros, mas demora mais.',
        'Quanto maior o modelo, mais tempo leva: Mais rápido precisa de menos tempo e Precisão máxima de mais. Teste Padrão primeiro e suba de nível só se o texto não ficar bom o bastante.',
      ],
      browser: {
        paragraphs: [
          'Mais rápido usa o modelo pequeno Base e serve para um rascunho rápido de fala clara. Padrão usa um modelo maior e é a escolha habitual. Alta precisão executa o Large v3 Turbo e lida melhor com sotaques e ambientes barulhentos. Precisão máxima executa o Large v3 completo e comete menos erros, mas demora mais.',
          'Quem faz o trabalho é o seu dispositivo, então a velocidade depende dele: um notebook recente é muito mais rápido que um celular antigo, e no celular Mais rápido é o nível indicado. Em um notebook, teste Padrão primeiro e suba de nível só se o texto não ficar bom o bastante.',
        ],
      },
    },
  ],

  howTitle: 'Como transcrever um vídeo em quatro passos',
  howToDescription: 'Adicione o vídeo, escolha o idioma e o nível de qualidade, aguarde o texto aparecer, depois edite e baixe.',
  steps: [
    {
      title: 'Adicione o vídeo',
      text: 'Solte o arquivo na caixa no topo desta página ou clique em Escolher um arquivo. Um link de vídeo da web não é aceito.',
    },
    {
      title: 'Escolha o idioma e a qualidade',
      text: 'Indique o idioma falado, se você souber, e escolha um nível de qualidade. Padrão é um bom começo; use Alta precisão ou Precisão máxima para sotaques, ruído ou um idioma como o híndi.',
    },
    {
      title: 'Aguarde o texto',
      text: 'As linhas aparecem uma a uma, com uma barra de progresso e o tempo restante.',
      browser: {
        text: 'As linhas aparecem uma a uma, com uma barra de progresso e o tempo restante. Na primeira vez que você usa um nível, o modelo é baixado uma só vez; os vídeos seguintes começam na hora.',
      },
    },
    {
      title: 'Edite e baixe',
      text: 'Corrija qualquer linha no editor e depois baixe TXT, SRT, VTT, PDF, Markdown ou JSON. Baixe antes de sair: nada é guardado para você depois da sessão.',
      browser: {
        text: 'Corrija qualquer linha no editor e depois baixe TXT, SRT, VTT, PDF, Markdown ou JSON. A transcrição fica neste navegador por um tempo, mas baixe o que quiser guardar.',
      },
    },
  ],

  formatsTitle: 'Vídeos que você pode adicionar e arquivos que recebe de volta',
  formatsIntro: 'O que é lido é a faixa de áudio, então a imagem pode ter qualquer qualidade. Arquivos só de áudio também funcionam.',
  uploadTitle: 'Arquivos de vídeo que você pode adicionar',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'texto simples, ou com o horário em cada linha' },
    { name: 'SRT', use: 'legendas para editores e players' },
    { name: 'VTT', use: 'legendas para vídeo na web' },
    { name: 'PDF', use: 'uma transcrição para imprimir ou compartilhar' },
    { name: 'Markdown', use: 'anotações com marcas de tempo' },
    { name: 'JSON', use: 'palavras e tempos para desenvolvedores' },
  ],

  tipsTitle: 'Como aproveitar mais uma transcrição gratuita',
  tips: [
    {
      title: 'Teste o primeiro minuto antes do vídeo inteiro.',
      text: 'Corte ou reproduza um minuto do vídeo e transcreva só esse trecho. Se o texto sair errado, mude o idioma ou o nível de qualidade antes de gastar tempo com o arquivo completo.',
    },
    {
      title: 'Confira o que está na tela, e não só o que você ouve.',
      text: 'Só a fala é escrita. Nomes que aparecem em um slide mas nunca são ditos não estarão no texto.',
    },
    {
      title: 'Divida uma gravação muito longa.',
      text: 'Um vídeo de várias horas é mais fácil de tratar em partes de cerca de uma hora cada: você começa a ler mais cedo e refazer um erro custa menos.',
      browser: {
        title: 'Divida uma gravação muito longa no celular.',
        text: 'Não há limite de tamanho, mas um vídeo de várias horas exige muita memória. No celular, partes de cerca de uma hora cada são bem mais seguras, e em um notebook você geralmente consegue ir muito além.',
      },
    },
    {
      title: 'Baixe também o arquivo de legendas, além do texto.',
      text: 'O arquivo SRT guarda o tempo, então a mesma execução entrega uma transcrição para ler e legendas para adicionar ao vídeo.',
    },
  ],

  faqs: [
    {
      question: 'Posso colar um link do YouTube, do TikTok ou do Google Drive em vez de um arquivo?',
      answer: 'Não. Esta ferramenta trabalha com um arquivo que você adiciona ou grava. Se o vídeo é seu, use o arquivo original; no caso do vídeo de outra pessoa, é preciso ter o direito de usá-lo.',
    },
    {
      question: 'A transcrição mostra quem está falando?',
      answer: 'Não. As linhas têm horário, mas não nomes de falantes. Você pode digitar os nomes no texto, no editor, o que é rápido numa entrevista com duas pessoas.',
    },
    {
      question: 'Realmente não há limite de quantos vídeos posso transcrever?',
      answer: 'Não há conta, plano nem contagem diária ou mensal. {limits} Se muita gente estiver usando o serviço, seu vídeo pode esperar um tempo em uma fila.',
      browser: {
        answer:
          'Não há conta, plano nem contagem diária ou mensal, e não há limite de tamanho. O único limite é o seu dispositivo: um vídeo muito longo demora mais e exige mais memória, então o celular se sai melhor com partes de cerca de uma hora. Os anúncios mantêm o site gratuito, e nenhum é exibido enquanto um vídeo é transcrito.',
      },
    },
    {
      question: 'Qual nível de qualidade serve para um vídeo longo?',
      answer: 'Padrão é a escolha habitual. Mais rápido é mais veloz, mas comete mais erros; Alta precisão e Precisão máxima levam mais tempo e compensam em sotaques, ruído e idiomas como o híndi.',
    },
    {
      question: 'O vídeo sai do meu computador?',
      answer: 'Ele é enviado ao servidor que executa este site e apagado quando a sua sessão termina.',
      browser: {
        answer: 'Não. O navegador transcreve o vídeo no seu próprio dispositivo, e nenhum arquivo é enviado para nós. Só o modelo de fala e o mecanismo dele são baixados, uma única vez.',
      },
    },
  ],

  links: [
    {
      label: 'Ferramentas grátis de vídeo em texto comparadas',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Todos os limites em uma tabela, citados da página de cada ferramenta.',
    },
    {
      label: 'Transcrever um vídeo sem enviá-lo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Como o trabalho fica no seu dispositivo e como conferir você mesmo.',
    },
    {
      label: 'Como transcrever um vídeo em texto',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Cinco formas de fazer isso e qual combina com o seu vídeo.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'Hábitos e ajustes que reduzem erros em qualquer vídeo.',
    },
  ],
};
