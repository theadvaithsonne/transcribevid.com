import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Como transcrever um vídeo sem enviá-lo',
  lead: 'No transcribevid.com o reconhecimento de fala roda dentro do seu próprio navegador, então o seu arquivo de vídeo ou áudio é lido no seu dispositivo e não é enviado ao site, ao Google nem a mais ninguém. Este guia explica como isso funciona, o que o seu navegador ainda baixa, o que ainda é enviado e como você mesmo pode conferir tudo isso.',
  readingMinutes: 11,
  toolPath: '/video-to-text',
  toolCta: 'Transcrever um vídeo no seu dispositivo',
  blocks: [
    {
      title: 'O que "sem enviar" significa aqui',
      paragraphs: [
        'A maioria dos serviços de transcrição on-line funciona do mesmo jeito: você envia o arquivo para o servidor deles, um computador que você não vê o transcreve e você baixa o resultado. Sua gravação fica na máquina de outra pessoa pelo tempo que ela a mantiver.',
        'No transcribevid.com o trabalho acontece ao contrário. O programa de reconhecimento de fala vem até o seu navegador, e o seu navegador o executa no seu próprio computador ou celular. O arquivo de mídia é lido do seu disco pela página que você abriu. Ele nunca é anexado a uma requisição ao site e nunca é enviado ao Google, às empresas que hospedam os downloads nem a qualquer serviço de fala.',
        'É por isso que o site não impõe limite de tamanho nem de duração e não tem fila: não há um servidor nosso fazendo o trabalho, então nada gera custo por arquivo e ninguém espera na sua frente. Uma gravação muito longa ainda precisa de tempo e de memória livre no seu dispositivo. É também por isso que uma entrevista confidencial ou um vídeo particular da família pode ser transcrito sem sair do seu dispositivo.',
        'Este guia descreve o site transcribevid.com. Uma cópia do software que alguém instala no próprio servidor funciona de outro jeito: ela envia o arquivo a esse servidor por uma conexão criptografada e o apaga automaticamente depois.',
      ],
    },
    {
      title: 'Como funciona, passo a passo',
      steps: [
        {
          title: 'A página carrega',
          text: 'O seu navegador busca a página e o código do programa dela no transcribevid.com, que é hospedado na Cloudflare. É igual a abrir qualquer outro site.',
        },
        {
          title: 'O modelo de fala é baixado uma vez',
          text: 'Na primeira vez que você usa um nível de qualidade, o seu navegador baixa o modelo de reconhecimento de fala dele do Hugging Face, junto com os arquivos do mecanismo que o executa, do jsDelivr. Eles ficam no cache do seu navegador, então a próxima transcrição começa sem baixá-los de novo.',
        },
        {
          title: 'Seu arquivo é decodificado no seu dispositivo',
          text: 'Os decodificadores de áudio e vídeo embutidos no navegador transformam o arquivo em som mono simples de 16 kHz, que é o que o modelo lê. Para alguns formatos que o navegador não abre sozinho, como AVI, WMA e FLV, a página pergunta antes e depois baixa um conversor de cerca de 9 MB, que também roda no seu dispositivo.',
        },
        {
          title: 'Um worker executa o modelo',
          text: 'Uma thread em segundo plano da página, chamada Web Worker, executa o modelo para que a página continue respondendo. Ela usa o seu chip gráfico por meio do WebGPU quando o navegador o aceita e, caso contrário, o seu processador por meio do WebAssembly.',
        },
        {
          title: 'O texto aparece e fica no seu navegador',
          text: 'A transcrição é montada linha por linha, com marcas de tempo. Ela fica guardada no armazenamento do próprio navegador durante a sessão, e os arquivos SRT, VTT, TXT, Markdown, JSON e PDF que você baixa também são criados no seu dispositivo.',
        },
      ],
    },
    {
      title: 'O que o seu navegador baixa, sim',
      paragraphs: [
        'Não enviar não significa não baixar. Um modelo de fala é um arquivo grande, e o seu navegador precisa buscá-lo antes de poder transcrever qualquer coisa. Isto é o que chega e de onde vem.',
      ],
      table: {
        caption: 'O que a página baixa, de onde e quando',
        head: ['O quê', 'De onde', 'Quando', 'Tamanho aproximado'],
        rows: [
          [
            'A página e o código do programa dela',
            'transcribevid.com (Cloudflare)',
            'A cada visita, depois em cache',
            'Cerca de 200 KB',
          ],
          [
            'O código do mecanismo que executa o modelo',
            'transcribevid.com',
            'Na primeira transcrição, depois em cache',
            'Menos de 1 MB',
          ],
          [
            'O ambiente de execução do modelo (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Na primeira transcrição, depois em cache',
            'De 17 a 27 MB, aproximadamente',
          ],
          [
            'Um pequeno modelo de detecção de fala',
            'transcribevid.com',
            'Na primeira transcrição, depois em cache',
            'Cerca de 1,2 MB',
          ],
          [
            'O modelo de fala da qualidade escolhida',
            'huggingface.co (Hugging Face)',
            'Uma vez por qualidade escolhida, depois em cache',
            'De cerca de 40 MB a alguns GB (veja abaixo)',
          ],
          [
            'Um conversor para formatos que o navegador não abre (AVI, WMA, FLV e parecidos)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Só se o seu arquivo precisar, e só depois de você concordar',
            'Cerca de 9 MB',
          ],
          [
            'O modelo de grafia do híndi (IndicXlit)',
            'transcribevid.com',
            'Só quando o híndi é escrito em letras romanas (Hinglish), depois em cache',
            'Cerca de 13 MB',
          ],
        ],
      },
      after: [
        'Esses downloads são arquivos de programa e de modelo, não os seus dados. As empresas que os entregam veem os dados usuais de qualquer requisição da web, como o seu endereço de internet e o navegador, mas nunca a sua mídia nem a sua transcrição.',
      ],
    },
    {
      title: 'O que ainda é enviado, com franqueza',
      paragraphs: [
        'Três coisas chegam, sim, a um servidor, e nenhuma delas é o seu arquivo nem o seu texto.',
      ],
      bullets: [
        {
          title: 'A hospedagem.',
          text: 'A Cloudflare entrega o site, então ela processa o seu endereço de internet e os dados usuais da requisição para entregar e proteger o site.',
        },
        {
          title: 'Um total corrente.',
          text: 'Quando uma transcrição termina, o seu navegador envia uma requisição vazia ao contador do site, que soma um ao número mostrado no cabeçalho. Ela não leva arquivo, transcrição nem identificador. O contador é informado pelos navegadores dos visitantes e não é verificado de forma independente.',
        },
        {
          title: 'Publicidade.',
          text: 'O site é grátis porque mostra anúncios exibidos pelo Google AdSense, em páginas de informação e ao lado de uma transcrição pronta, nunca enquanto um arquivo está sendo transcrito. O Google usa cookies para anúncios e, onde a lei exige, pede o seu consentimento antes. Os scripts de anúncios do Google fazem requisições próprias ao Google, mas o seu arquivo e a sua transcrição nunca são enviados a ele.',
        },
      ],
      after: [
        'A política de privacidade descreve tudo isso por completo. Não há conta, e o site não pede nome nem e-mail.',
      ],
    },
    {
      title: 'Como conferir você mesmo',
      paragraphs: [
        'Você não precisa acreditar na nossa palavra. Todo navegador moderno consegue mostrar o que uma página envia e recebe, e a conferência leva dois minutos.',
      ],
      steps: [
        {
          title: 'Abra as ferramentas do desenvolvedor',
          text: 'No Chrome, no Edge ou no Firefox, abra a página inicial do transcribevid.com e pressione F12 (no Mac, Command, Option e I). Escolha a aba Rede (Network).',
        },
        {
          title: 'Limpe a lista',
          text: 'Pressione o botão de limpar, que parece um círculo com uma linha atravessada, para que só apareçam requisições novas.',
        },
        {
          title: 'Comece uma transcrição',
          text: 'Adicione um arquivo e pressione Transcrever. Mantenha a aba Rede visível.',
        },
        {
          title: 'Veja o que chega',
          text: 'Na primeira vez, você verá downloads grandes de huggingface.co e cdn.jsdelivr.net. Esses são o modelo e o mecanismo chegando.',
        },
        {
          title: 'Procure o que sai',
          text: 'Digite method:POST na caixa de filtro (Chrome e Edge; o Firefox aceita o mesmo filtro). A única requisição POST ao transcribevid.com deve ser uma requisição vazia a /api/count depois que a transcrição termina. Abra-a e confira o corpo da requisição: ele está vazio. Se a página mostrar anúncios, os scripts do próprio Google fazem requisições próprias ao Google, e nenhuma delas leva o seu arquivo nem a sua transcrição. Nada perto do tamanho do seu arquivo sai do seu dispositivo.',
        },
      ],
    },
    {
      title: 'Qual o tamanho do primeiro download, e qual a velocidade?',
      paragraphs: [
        'O tamanho depende do nível de qualidade e do tipo de dispositivo. Um dispositivo com WebGPU recebe uma versão compacta para o seu tamanho, enquanto um dispositivo que usa WebAssembly recebe uma versão diferente. A página informa o tamanho exato do download antes de começar, então você nunca é pego de surpresa. Estes são os tamanhos aproximados dos arquivos do modelo (os números do WebGPU valem para navegadores com suporte a shaders de 16 bits; outros dispositivos recebem outras versões):',
      ],
      table: {
        caption: 'Download aproximado do modelo na primeira vez',
        head: ['Qualidade escolhida', 'Modelo Whisper', 'Com WebGPU', 'Com WebAssembly'],
        rows: [
          ['Mais rápido', 'Base', 'Cerca de 146 MB', 'Cerca de 77 MB'],
          ['Padrão', 'Small', 'Cerca de 485 MB', 'Cerca de 249 MB'],
          ['Alta precisão', 'Large v3 Turbo', 'Cerca de 564 MB', 'Cerca de 1,1 GB'],
          [
            'Precisão máxima',
            'Large v3',
            'Cerca de 980 MB, mais cerca de 564 MB para o tempo por palavra',
            'Cerca de 1,8 GB, mais cerca de 1,1 GB para o tempo por palavra',
          ],
        ],
      },
      after: [
        'Acrescente alguns megabytes para os arquivos de configuração do modelo. O Large v3 não tem uma versão própria de tempo por palavra, então, com Tempo por palavra ativado, que é o padrão, a primeira execução dele também baixa o modelo de tempo do Large v3 Turbo, e a página avisa isso antes de você começar. Esse modelo Turbo fica guardado e é compartilhado com a escolha Alta precisão. Depois do primeiro download, o modelo é lido do cache do navegador, então as transcrições seguintes começam na hora. A velocidade daí em diante depende inteiramente do seu dispositivo: um computador com um chip gráfico capaz e WebGPU é muito mais rápido do que um celular ou um notebook antigo usando WebAssembly.',
      ],
    },
    {
      title: 'Quando esta é a ferramenta certa, e quando não é',
      paragraphs: [
        'Transcrever no próprio dispositivo combina bem com material privado e com arquivos longos. Não é a melhor ferramenta para tudo.',
      ],
      bullets: [
        {
          title: 'Bom para gravações confidenciais.',
          text: 'No transcribevid.com, entrevistas, reuniões, anotações médicas ou jurídicas e vídeos pessoais ficam no seu dispositivo.',
        },
        {
          title: 'Bom para arquivos longos.',
          text: 'No transcribevid.com não há envio para esperar nem limite de tamanho ou de duração definido. Uma gravação muito longa precisa de tempo e de memória livre, e um navegador sem suporte a WebCodecs pode recusar um arquivo muito longo.',
        },
        {
          title: 'Não serve para legendas ao vivo.',
          text: 'A transcrição é feita a partir de um arquivo ou gravação pronto. Ela não legenda um evento ao vivo enquanto ele acontece.',
        },
        {
          title: 'Não serve para nomes de quem fala.',
          text: 'As linhas têm marcas de tempo, mas o texto não diz quem está falando. Você pode digitar os nomes enquanto edita.',
        },
        {
          title: 'Não é o ideal em um celular fraco.',
          text: 'Os celulares têm menos memória. A página avisa e pode desativar as escolhas de qualidade maiores quando o seu dispositivo não consegue executá-las. Corte gravações muito longas em partes.',
        },
        {
          title: 'Não serve se você não consegue baixar um arquivo grande uma vez.',
          text: 'O primeiro uso exige uma conexão que consiga buscar dezenas ou centenas de megabytes.',
        },
      ],
    },
    {
      title: 'Limpar os seus dados depois',
      paragraphs: [
        'No transcribevid.com, as suas transcrições e o arquivo de origem ficam no armazenamento do navegador para que a página possa mostrá-los e deixar você editá-los e exportá-los. Elas são apagadas automaticamente quando a sua sessão termina depois de um período de inatividade, ou na hora em que você aperta Apagar meus dados agora no menu Transcrições. Dados apagados não podem ser recuperados, então exporte antes o que precisar.',
        'Os modelos de fala ficam no cache do navegador para que as transcrições seguintes sejam rápidas, até você apagá-los (Apagar meus dados agora também pode removê-los) ou o navegador limpar o próprio armazenamento. Se você usa um computador compartilhado ou público, aperte Apagar meus dados agora antes de sair, porque qualquer pessoa que consiga abrir esse perfil do navegador pode ler o que está guardado nele.',
      ],
    },
  ],
  faqs: [
    {
      question: 'É mesmo verdade que o meu arquivo nunca é enviado?',
      answer:
        'Sim, no transcribevid.com. O reconhecimento roda no seu navegador, e o seu arquivo é lido do seu próprio disco pela página. Você pode confirmar na aba Rede das ferramentas do desenvolvedor do navegador: a única requisição que envia algo ao transcribevid.com é uma requisição de contagem vazia depois que a transcrição termina, e os scripts de anúncios do Google fazem requisições próprias ao Google que nunca levam o seu arquivo.',
    },
    {
      question: 'A transcrição ainda funciona se a minha conexão for lenta?',
      answer:
        'A parte lenta é o primeiro download do modelo de fala, que pode ter centenas de megabytes. Depois que ele fica salvo no seu navegador, a transcrição em si usa o seu próprio dispositivo e não depende da velocidade da rede.',
    },
    {
      question: 'Por que o meu navegador baixa um modelo de outro site?',
      answer:
        'O modelo é o programa que reconhece a fala, e é grande demais para vir embutido na página. Ele é baixado do Hugging Face, um host público para esses modelos, e o mecanismo que o executa vem do jsDelivr. Nenhum dos dois recebe a sua mídia nem a sua transcrição.',
    },
    {
      question: 'Transcrever no meu dispositivo é mais rápido do que enviar?',
      answer:
        'Pode ser, porque não há envio nem fila, e um computador com WebGPU é rápido. Em um notebook antigo ou em um celular, o mesmo trabalho pode demorar mais do que em um servidor rápido. A primeira execução também inclui o download único do modelo.',
    },
  ],
  links: [
    {
      label: 'Transcrição de entrevistas',
      path: '/interview-transcription',
      note: 'O caminho privado para entrevistas de pesquisa, jornalismo e contratação.',
    },
    {
      label: 'O que é o Whisper?',
      path: '/guides/what-is-whisper',
      note: 'O modelo de fala que o seu navegador executa, explicado em palavras simples.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'Configurações e hábitos que dão um texto melhor, em qualquer dispositivo.',
    },
    {
      label: 'Vídeo em texto',
      path: '/video-to-text',
      note: 'Adicione um vídeo e veja-o virar texto com marcas de tempo no seu próprio dispositivo.',
    },
    {
      label: 'Gravação de reunião em texto',
      path: '/meeting-recording-to-text',
      note: 'Transforme uma gravação salva do Zoom, do Teams ou do Meet em uma transcrição pesquisável.',
    },
  ],
};
