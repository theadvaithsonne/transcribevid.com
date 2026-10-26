import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'O que é o Whisper? Fala em texto, explicado',
  lead: 'O Whisper é um modelo de reconhecimento de fala de código aberto que a OpenAI lançou em 2022. Ele transforma áudio falado em texto em cerca de cem idiomas e pode rodar no seu próprio computador. Este guia explica de onde ele veio, com o que aprendeu, como funciona, onde é forte e fraco e como o TranscribeVid o executa dentro do seu navegador.',
  readingMinutes: 8,
  toolPath: '/audio-to-text',
  toolCta: 'Experimentar o Whisper no seu próprio áudio',
  blocks: [
    {
      title: 'O Whisper em um parágrafo',
      paragraphs: [
        'O Whisper é uma rede neural treinada para ouvir fala e escrever o que ouve. Você dá som a ele; ele devolve texto com marcas de tempo e também pode dizer o idioma e traduzir fala para o inglês. Ele vem em vários tamanhos, de uma versão minúscula que cabe em um celular a uma grande que exige um computador potente.',
        'Ele não é um site nem um serviço. É um conjunto de arquivos: o modelo e o código para executá-lo. Qualquer pessoa pode baixá-los e usá-los, e é por isso que muitas ferramentas de transcrição gratuitas e privadas, esta inclusive, são construídas sobre ele.',
      ],
    },
    {
      title: 'De onde ele veio',
      paragraphs: [
        'A OpenAI publicou o Whisper em setembro de 2022, junto com um artigo de pesquisa chamado "Robust Speech Recognition via Large-Scale Weak Supervision". O código e os modelos treinados foram lançados sob a licença MIT, uma das licenças de código aberto mais permissivas. Ela permite usar, alterar e distribuir o software, inclusive em produtos comerciais.',
        'Antes do Whisper, o melhor reconhecimento de fala ficava quase todo preso nos serviços de grandes empresas ou era feito para um só idioma ou um só tipo de áudio. O Whisper mudou isso por ser bom o bastante, amplo o bastante e gratuito para você mesmo executar. A OpenAI também vende acesso a reconhecimento de fala pelo próprio serviço web, mas esse é um produto pago à parte. O modelo que você executa aqui no navegador é o aberto.',
      ],
    },
    {
      title: 'Com o que ele foi treinado',
      paragraphs: [
        'O Whisper aprendeu com cerca de 680.000 horas de áudio acompanhado de transcrições, coletadas na internet. Mais ou menos um terço desse áudio não era em inglês e cobria cerca de cem idiomas (o lançamento lista 99). As transcrições nem todas foram conferidas à mão, e é a isso que se refere "weak supervision" (supervisão fraca) no título do artigo.',
        'Disso saem dois resultados práticos. Como o áudio de treinamento era muito variado, com microfones, sotaques, salas e assuntos diferentes, o Whisper lida com gravações reais melhor do que modelos treinados com fala limpa de estúdio. Mas a quantidade de áudio de treinamento varia de idioma para idioma, então a precisão é desigual: em geral ele é mais forte em inglês e em outros idiomas muito falados que tiveram muitos exemplos, e mais fraco em idiomas com poucos dados de treinamento.',
      ],
    },
    {
      title: 'Como funciona, em termos simples',
      paragraphs: [
        'O Whisper corta o áudio em janelas de 30 segundos e transforma cada uma em uma imagem do som, chamada espectrograma, que mostra o volume de cada altura de tom ao longo do tempo. O modelo tem então duas metades. Um codificador estuda essa imagem. Um decodificador escreve o texto um pedacinho de cada vez, como uma pessoa que escreve uma frase pensando no que vem a seguir.',
        'O decodificador também escreve marcadores especiais: qual idioma ele acredita que está sendo falado, se deve transcrever ou traduzir e onde cada frase começa e termina no tempo. É daí que vêm as marcas de tempo.',
        'Gravações longas são tratadas janela por janela. Esse projeto é flexível, mas explica dois hábitos do Whisper: ele pode perder o fio entre as janelas e pode se repetir quando uma janela tem pouca fala. O TranscribeVid reduz os dois com um detector de fala que pula o silêncio e a maior parte do som que não é fala antes de o modelo vê-lo, e com verificações que pegam depois parte do texto repetido ou inventado.',
      ],
    },
    {
      title: 'Os tamanhos do modelo, e qual deles você recebe aqui',
      paragraphs: [
        'O Whisper vem em tamanhos. Modelos maiores erram menos, principalmente com ruído e em idiomas que não são o inglês, mas são mais lentos e exigem mais memória e um download maior. As quatro escolhas de qualidade da página de envio correspondem a esses tamanhos assim:',
      ],
      table: {
        caption: 'Tamanhos do Whisper e as escolhas no TranscribeVid',
        head: ['Modelo', 'Parâmetros (aprox.)', 'Onde encontrar aqui'],
        rows: [
          ['Tiny', '39 milhões', 'Mais opções, lista Modelo'],
          ['Base', '74 milhões', 'Mais rápido'],
          ['Small', '244 milhões', 'Padrão'],
          ['Medium', '769 milhões', 'Mais opções, lista Modelo'],
          ['Large v3 Turbo', '809 milhões', 'Alta precisão'],
          ['Large v3', '1,55 bilhão', 'Precisão máxima'],
        ],
      },
      after: [
        'O Large v3 foi lançado em novembro de 2023, e a versão Turbo veio depois, em 2024. O Turbo é um modelo grande enxuto, muito mais rápido e próximo dele em precisão para muitos idiomas, e é por isso que é a escolha Alta precisão. Um limite: a OpenAI diz que o Turbo não foi treinado para tradução e pode devolver o idioma original quando se pede tradução, então, para Saída, Traduzir para o inglês, escolha Precisão máxima. A lista de modelos também tem o Distil Large v3, uma versão destilada, menor e mais rápida do Whisper large v3, só para inglês. Em Mecanismo de reconhecimento há ainda o Qwen3 ASR, um mecanismo diferente e experimental para navegadores de computador com WebGPU. O Qwen3 ASR não é um modelo Whisper.',
      ],
    },
    {
      title: 'O que ele faz bem',
      bullets: [
        {
          title: 'Áudio do mundo real.',
          text: 'Gravações de celular, aulas, entrevistas e trilhas sonoras de vídeo com ruído moderado.',
        },
        {
          title: 'Muitos idiomas em um só modelo.',
          text: 'A mesma família de modelos lida com inglês, espanhol, híndi, árabe, japonês e dezenas de outros e muitas vezes descobre o idioma sozinha.',
        },
        {
          title: 'Pontuação e maiúsculas.',
          text: 'Ele escreve frases com letras maiúsculas e pontuação, em vez de uma longa sequência de palavras em minúsculas.',
        },
        {
          title: 'Marcas de tempo.',
          text: 'Cada linha vem com um horário de início e de fim e, com o tempo por palavra, a página consegue posicionar cada palavra.',
        },
        {
          title: 'Tradução para o inglês.',
          text: 'Ele pode transformar fala em outro idioma diretamente em texto em inglês, o que a página oferece como Saída, Traduzir para o inglês. O Turbo é a exceção: não foi treinado para tradução, então use Precisão máxima para isso.',
        },
      ],
    },
    {
      title: 'Onde ele tem dificuldade',
      paragraphs: [
        'O Whisper impressiona, e também erra. Conheça estes hábitos antes de confiar em uma transcrição.',
      ],
      bullets: [
        {
          title: 'Ele pode inventar texto.',
          text: 'Diante de silêncio, música ou ruído, pode escrever palavras fluentes que ninguém disse ou repetir uma frase sem parar. É um comportamento conhecido do modelo, não um defeito de uma gravação.',
        },
        {
          title: 'Nomes, números e palavras raras.',
          text: 'Ele escreve um nome do jeito que acha mais provável e pode trocar palavras de som parecido. Use a dica de vocabulário e depois confira os valores.',
        },
        {
          title: 'Idiomas desiguais.',
          text: 'A precisão varia conforme o idioma e o sotaque. Um modelo maior ajuda muito em idiomas com menos dados de treinamento.',
        },
        {
          title: 'Sem rótulos de quem fala.',
          text: 'Ele não diz quem está falando, e vozes sobrepostas muitas vezes são fundidas ou descartadas.',
        },
        {
          title: 'Não é ao vivo.',
          text: 'Ele trabalha em uma gravação janela por janela, então não foi feito para legendas que aparecem enquanto alguém fala.',
        },
      ],
    },
    {
      title: 'Como o TranscribeVid executa o Whisper no seu navegador',
      paragraphs: [
        'O Whisper original foi escrito para softwares especializados de aprendizado de máquina. Para executá-lo em uma página da web, os modelos são convertidos para um formato portátil chamado ONNX, e uma biblioteca chamada Transformers.js, do Hugging Face, os executa usando o ONNX Runtime. Em um computador com WebGPU, o trabalho é feito pelo chip gráfico, o que é rápido. Caso contrário, ele roda no processador por meio do WebAssembly, que é mais lento mas funciona em quase todo lugar.',
        'Para manter os downloads razoáveis, os modelos usam formatos numéricos compactos, que encolhem os arquivos, em geral com um pequeno custo em precisão. É assim que o maior modelo tem cerca de um gigabyte com WebGPU (1,8 GB com WebAssembly) em vez de vários.',
        'No transcribevid.com, rodar no navegador tem duas consequências. Primeiro, a privacidade: o seu arquivo de mídia é lido no seu dispositivo e não é enviado, então nenhum servidor nosso recebe o seu áudio. Segundo, a velocidade: ela depende do seu dispositivo, e o primeiro uso de cada nível de qualidade inclui um download único do modelo. O guia sobre transcrever sem enviar explica o que é baixado e como conferir.',
      ],
    },
  ],
  faqs: [
    {
      question: 'O Whisper é de uso gratuito?',
      answer:
        'O modelo e o código dele são gratuitos e de código aberto sob a licença MIT, então qualquer pessoa pode executá-los. Executar um modelo grande exige um computador capaz ou um servidor alugado, e a OpenAI também oferece o próprio serviço web pago. No transcribevid.com ele roda no seu dispositivo, então não há nada a pagar.',
    },
    {
      question: 'Quantos idiomas o Whisper entende?',
      answer:
        'Cerca de cem; o lançamento lista 99. A qualidade varia muito entre eles. O TranscribeVid oferece 61 deles na lista Idioma, e você também pode escolher Detectar automaticamente.',
    },
    {
      question: 'Qual tamanho do Whisper devo escolher?',
      answer:
        'Comece com Padrão, que é o modelo Small. Passe para Alta precisão em caso de sotaques, ruído ou idiomas que não são o inglês, e para Precisão máxima quando cada palavra conta e você pode esperar. Mais rápido serve só para fala clara e silenciosa.',
    },
    {
      question: 'Por que o Whisper às vezes escreve palavras onde ninguém está falando?',
      answer:
        'O modelo é construído para sempre produzir um texto plausível, então um trecho de silêncio, música ou ruído pode fazê-lo inventar algum. Manter Pular silêncios e música ativado pula a maior parte desses trechos antes de o modelo vê-los.',
    },
  ],
  links: [
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'As configurações e os hábitos que mais mudam o resultado do Whisper.',
    },
    {
      label: 'Transcrever um vídeo sem enviá-lo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'O que o seu navegador baixa para executar o Whisper e como conferir que nada é enviado.',
    },
    {
      label: 'Traduzir fala para o inglês',
      path: '/translate-audio-to-english',
      note: 'Use a tradução do Whisper para obter texto em inglês a partir de fala em outro idioma.',
    },
    {
      label: 'Áudio em texto',
      path: '/audio-to-text',
      note: 'Solte uma gravação e receba uma transcrição com marcas de tempo.',
    },
    {
      label: 'Áudio em híndi para texto (página em inglês)',
      path: '/hindi-audio-to-text',
      note: 'Como o Whisper lida com o híndi, incluindo uma opção Hinglish em letras romanas.',
    },
  ],
};
