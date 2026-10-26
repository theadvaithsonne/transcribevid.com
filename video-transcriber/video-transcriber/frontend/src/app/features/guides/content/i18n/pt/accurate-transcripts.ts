import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Como obter uma transcrição mais precisa',
  lead: 'A precisão depende primeiro do som e depois de três escolhas que você controla: o idioma, o nível de qualidade e uma dica de vocabulário. Este guia mostra o que mudar antes de gravar, quais configurações ajudam, como encontrar os erros que sobram e o que o reconhecimento de fala não consegue fazer de jeito nenhum.',
  readingMinutes: 10,
  toolPath: '/video-to-text',
  toolCta: 'Transcrever um vídeo com as melhores configurações',
  blocks: [
    {
      title: 'O que decide a precisão de uma transcrição',
      paragraphs: [
        'O reconhecimento de fala escuta mais ou menos como você. Se a pessoa fala com clareza, perto do microfone, em uma sala silenciosa, em um idioma que o modelo conhece bem, a transcrição costuma ser muito boa. Se o som é distante, ruidoso, com eco ou cheio de vozes, até uma pessoa precisa se concentrar, e o programa erra mais.',
        'Isso dá uma ordem simples de prioridades. Primeiro arrume o áudio, porque nada adiante consegue recuperar palavras que nunca foram captadas. Depois diga ao programa o idioma. Depois escolha um nível de qualidade que combine com a dificuldade. Depois dê a ele as palavras incomuns que ele não consegue adivinhar. Por fim, confira o resultado, porque nenhuma transcrição é perfeita.',
      ],
    },
    {
      title: 'Melhore a própria gravação',
      paragraphs: [
        'Alguns minutos de cuidado na hora de gravar valem mais do que qualquer configuração depois.',
      ],
      bullets: [
        {
          title: 'Chegue perto.',
          text: 'Ponha o microfone a uma ou duas mãos de distância da boca de quem fala. Um celular segurado perto ganha de um notebook do outro lado da mesa.',
        },
        {
          title: 'Escolha uma sala silenciosa e macia.',
          text: 'Cortinas, tapetes e sofás absorvem o eco. Paredes nuas e salas grandes e vazias embaralham as palavras. Desligue ventiladores, ar-condicionado e notificações.',
        },
        {
          title: 'Tire a música de baixo da voz.',
          text: 'É difícil separar a música de fundo da fala. Coloque-a depois de transcrever, não antes.',
        },
        {
          title: 'Uma voz de cada vez.',
          text: 'Pessoas falando ao mesmo tempo são o caso mais difícil. Peça que esperem a vez uns dos outros e use um microfone por pessoa quando puder.',
        },
        {
          title: 'Não se preocupe com a taxa de amostragem.',
          text: 'Os modelos de fala leem o som a 16 kHz em mono, e a página converte qualquer arquivo para isso automaticamente. Uma taxa maior ou uma mixagem surround não ajuda; o que conta são a distância, o ruído e o volume.',
        },
        {
          title: 'Evite compressão pesada.',
          text: 'Arquivos com taxa de bits muito baixa, como uma mensagem de voz espremida por uma conexão fraca, perdem detalhes de que o modelo precisa. Use a gravação original quando tiver.',
        },
      ],
    },
    {
      title: 'Diga a ele o idioma',
      paragraphs: [
        'A página consegue detectar o idioma sozinha, e em uma gravação longa em português claro costuma acertar. Mas em trechos curtos, sotaques fortes e gravações que misturam idiomas, a detecção pode errar, e um palpite errado deixa a transcrição inteira ruim. Escolher o idioma na lista Idioma leva um clique e elimina o risco.',
        'Se a página não consegue identificar o idioma com segurança, ela avisa e pede que você escolha o que está ouvindo. Faça isso e execute de novo. Para uma fala que alterna entre dois idiomas, como híndi e inglês, escolha o idioma principal e confira os trechos no outro.',
      ],
    },
    {
      title: 'Escolha o nível de qualidade certo',
      paragraphs: [
        'As quatro escolhas de qualidade executam tamanhos diferentes da mesma família de modelos. Um modelo maior erra menos com sotaques, ruído, outros idiomas e palavras raras, mas demora mais e tem um primeiro download maior.',
      ],
      table: {
        caption: 'As escolhas de qualidade e quando usar cada uma',
        head: ['Escolha', 'Melhor para', 'Contrapartida'],
        rows: [
          [
            'Mais rápido',
            'Fala clara em uma gravação silenciosa, rascunhos rápidos',
            'Mais erros dos quatro em áudio difícil',
          ],
          [
            'Padrão',
            'A maioria dos vídeos e gravações de voz (a escolha inicial de sempre)',
            'Um bom equilíbrio entre velocidade e precisão',
          ],
          [
            'Alta precisão',
            'Sotaques, ruído de fundo, fala que não é em inglês',
            'Mais lenta, download maior',
          ],
          [
            'Precisão máxima',
            'Áudio difícil em que cada palavra conta',
            'A mais lenta, o maior download',
          ],
        ],
      },
      after: [
        'Um bom hábito é começar com Padrão em um trecho curto da sua gravação, ler o resultado e subir um nível só se os erros incomodarem. Em Mais opções, você também pode escolher na lista completa de modelos. Em alguns dispositivos, Alta precisão e Precisão máxima aparecem acinzentadas, com o motivo mostrado, como "precisa de 8 GB" ou "use um computador para este tamanho", porque os modelos maiores precisam de mais memória. Cada escolha maior também é um primeiro download maior, e a página mostra o tamanho antes de você começar.',
      ],
    },
    {
      title: 'Use a dica de vocabulário para nomes e jargão',
      paragraphs: [
        'Os modelos de fala conhecem bem as palavras comuns e mal as raras. O nome de uma pessoa, uma empresa, um produto, um lugar ou um termo técnico é escrito do jeito que o modelo considera mais provável, e isso muitas vezes está errado. A Dica de vocabulário, em Mais opções, existe para isso.',
        'Digite as palavras incomuns do jeito que você quer que sejam escritas, por exemplo uma frase como "Entrevista com o Dr. Okafor sobre Kubernetes e PostgreSQL." Uma linha curta e natural que contenha as palavras funciona melhor do que uma lista longa. Ela é opcional e pode ter até 1.000 caracteres. A página não a guarda nas suas configurações lembradas, caso ela contenha nomes privados.',
        'A dica ajuda na grafia. Ela não ensina o modelo a ouvir uma palavra murmurada ou encoberta por ruído.',
      ],
    },
    {
      title: 'Melhorar o áudio e Pular silêncios e música',
      paragraphs: [
        'Duas opções em Mais opções vêm ativadas por padrão, e para a maioria das gravações você deve deixá-las ativadas.',
      ],
      bullets: [
        {
          title: 'Melhorar o áudio.',
          text: 'Filtra o ruído grave muito baixo e o chiado muito agudo e depois nivela o volume para que uma pessoa que fala baixo não se perca ao lado de uma que fala alto. Se uma gravação soa bem para você mas a transcrição está estranha, tente uma vez com esta opção desligada para ver se o filtro é a causa.',
        },
        {
          title: 'Pular silêncios e música.',
          text: 'Um detector de fala encontra os trechos com voz humana e passa só esses ao modelo. O silêncio e a maior parte do som que não é fala, como música sem canto, nunca chegam a ele, o que evita grande parte do texto inventado que um modelo pode produzir quando não tem nada para ouvir. Música com canto ainda pode passar. Desligue-a só se uma fala baixa estiver sendo descartada.',
        },
      ],
      after: [
        'Tempo por palavra também vem ativado por padrão. Ele não muda quais palavras são encontradas, mas permite que as legendas comecem e terminem exatamente com as palavras e alimenta as marcas que mostram quais palavras eram incertas.',
      ],
    },
    {
      title: 'Confira o resultado: onde os erros se escondem',
      paragraphs: [
        'Quando a transcrição estiver pronta, não a leia de cima a baixo primeiro. Procure as marcas. As palavras de que o modelo teve menos certeza ficam sublinhadas, com um sublinhado mais forte para as menos certas. Se a transcrição inteira tem pouca confiança, ou se o idioma era incerto, a página mostra um aviso com um botão para rever o idioma e a qualidade.',
        'A nota de confiança é uma pista de onde olhar, não uma porcentagem de precisão, então uma palavra sem sublinhado ainda pode estar errada. Gaste a atenção nesta ordem:',
      ],
      bullets: [
        {
          title: 'Nomes e lugares.',
          text: 'São os erros mais comuns e os mais constrangedores.',
        },
        {
          title: 'Números, datas e unidades.',
          text: 'Um valor errado muda o sentido. Confira cada um com a gravação.',
        },
        {
          title: 'Palavras que soam parecido.',
          text: 'Cem e sem, mas e mais, ou "a gente" e "agente" são escolhidos pelo contexto e podem ser trocados.',
        },
        {
          title: 'Trechos perto de ruído ou de vozes sobrepostas.',
          text: 'Escute de novo na marca de tempo. Clique em uma linha para ir direto àquele momento.',
        },
      ],
      after: [
        'Corrija o que achar diretamente no texto. Suas edições ficam na transcrição e entram em todas as exportações.',
      ],
    },
    {
      title: 'Problema e o que tentar',
      table: {
        caption: 'Problemas comuns e o que tentar primeiro',
        head: ['Problema', 'O que tentar'],
        rows: [
          [
            'Idioma errado, ou texto na escrita errada',
            'Escolha você mesmo o idioma em vez de Detectar automaticamente',
          ],
          [
            'Nomes e marcas escritos errado',
            'Adicione-os à Dica de vocabulário em Mais opções e depois transcreva o arquivo de novo a partir da página inicial',
          ],
          [
            'Muitos erros em sotaques ou em som ruidoso',
            'Suba um nível de qualidade e mantenha Melhorar o áudio ativado',
          ],
          [
            'Aparece texto onde ninguém está falando',
            'Mantenha Pular silêncios e música ativado; corte as partes longas só de silêncio ou música',
          ],
          [
            'A mesma frase se repete várias vezes',
            'Mantenha Usar o texto anterior como contexto desligado e tente um nível de qualidade diferente',
          ],
          [
            'Duas pessoas falando uma por cima da outra',
            'Não há solução por software: grave-as em microfones separados da próxima vez',
          ],
          [
            'Uma pessoa muito baixa ou distante não é captada',
            'Mantenha Melhorar o áudio ativado; se a fala continuar sendo descartada, desligue Pular silêncios e música para esse arquivo',
          ],
        ],
      },
    },
    {
      title: 'O que o reconhecimento de fala não consegue fazer',
      paragraphs: [
        'Conhecer os limites ajuda a perceber os problemas cedo. Uma transcrição feita por qualquer reconhecimento de fala, inclusive este, pode conter o seguinte.',
      ],
      bullets: [
        {
          title: 'Nenhum nome de quem fala.',
          text: 'Ele escreve o que foi dito, não quem disse. Acrescente os nomes à mão enquanto edita.',
        },
        {
          title: 'Texto inventado.',
          text: 'Diante de silêncio, música ou ruído, um modelo pode produzir palavras fluentes que ninguém disse, ou repetir uma frase muitas vezes. Se você vê texto onde não ouve nada, apague-o.',
        },
        {
          title: 'Homófonos e palavras raras erradas.',
          text: 'Ele escolhe a palavra mais provável, que nem sempre é a certa.',
        },
        {
          title: 'Palavras perdidas em vozes cruzadas.',
          text: 'A fala sobreposta costuma ser transcrita como uma voz só ou ser descartada em parte.',
        },
        {
          title: 'Nenhuma garantia.',
          text: 'Para qualquer coisa jurídica, médica, financeira ou publicada, trate a transcrição como um rascunho que uma pessoa precisa conferir.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Qual nível de qualidade dá a transcrição mais precisa?',
      answer:
        'Precisão máxima costuma errar menos, com Alta precisão muitas vezes logo atrás, depois Padrão e Mais rápido. A diferença pesa mais para sotaques, ruído e idiomas que não são o inglês. Em fala clara em inglês as diferenças são pequenas, então Padrão muitas vezes basta.',
    },
    {
      question: 'Um microfone melhor ajuda mais do que uma configuração melhor?',
      answer:
        'Em geral, sim. Um som limpo e próximo deixa um modelo menor ir bem, enquanto um som ruim limita até o maior. Aproximar o microfone e reduzir o ruído de fundo é a melhoria mais barata que você pode fazer.',
    },
    {
      question: 'Devo limpar o áudio em um editor antes de transcrever?',
      answer:
        'Raramente. A página já filtra o ruído grave e o chiado e nivela o volume quando Melhorar o áudio está ativado. Filtros pesados de redução de ruído em um editor podem distorcer a fala e piorar o reconhecimento, então use configurações leves ou nenhuma.',
    },
    {
      question: 'Por que dois níveis de qualidade dão textos diferentes para o mesmo arquivo?',
      answer:
        'São tamanhos diferentes de modelo, então cada um ouve e escreve um trecho difícil do seu jeito. Onde duas execuções discordam, escute esse trecho na marca de tempo dele, porque provavelmente é um trecho difícil e vale conferir de ouvido.',
    },
    {
      question: 'Posso deixar a transcrição mais precisa editando-a?',
      answer:
        'Editar corrige o texto que você exporta; não treina o modelo de novo. Corrija nomes, números e palavras pouco claras na página da transcrição e baixe a versão corrigida. Uma nova execução com uma dica de vocabulário reduz as correções da próxima vez.',
    },
  ],
  links: [
    {
      label: 'O que é o Whisper?',
      path: '/guides/what-is-whisper',
      note: 'O modelo de fala por trás dos níveis de qualidade e onde ele é forte ou fraco.',
    },
    {
      label: 'Transcrição de entrevistas',
      path: '/interview-transcription',
      note: 'Dicas para transcrever uma conversa com duas vozes e muitos nomes.',
    },
    {
      label: 'Aula em texto',
      path: '/lecture-to-text',
      note: 'Obtenha anotações de uma aula gravada, mesmo do fundo de uma sala grande.',
    },
    {
      label: 'Áudio em híndi para texto (página em inglês)',
      path: '/hindi-audio-to-text',
      note: 'Escolher o idioma importa muito para o híndi e para outras falas que não são em inglês.',
    },
    {
      label: 'Transcrever um vídeo sem enviá-lo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Como o mecanismo no navegador funciona e o que muda conforme o dispositivo que você usa.',
    },
  ],
};
