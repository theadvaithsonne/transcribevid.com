import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT ou VTT: qual formato de legenda você deve usar?',
  lead: 'SRT é o padrão seguro: quase todo player de vídeo, editor e plataforma o lê. Escolha VTT (WebVTT) quando as legendas forem para o elemento de vídeo de uma página da web ou quando você precisar de estilo e posicionamento. Os dois são arquivos de texto simples, e você pode baixar qualquer um deles do seu vídeo aqui.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Gerar um arquivo SRT a partir do seu vídeo',
  blocks: [
    {
      title: 'A resposta curta',
      paragraphs: [
        'Se você não tem certeza, use SRT. É o formato mais antigo e mais simples, e é aceito por quase todo player de vídeo, editor de vídeo e formulário de envio que você provavelmente vai encontrar. Um arquivo de legendas que funciona em todo lugar vale mais do que um sofisticado.',
        'Use VTT quando o vídeo for reproduzido em uma página da web pelo elemento de vídeo HTML. Os navegadores carregam faixas de legenda só no formato WebVTT, então um arquivo SRT não funciona ali sem conversão. O VTT também é a melhor escolha quando você quer posicionar o texto na tela, usar negrito ou itálico com segurança ou identificar quem está falando.',
        'Todo o resto deste guia explica por quê, mostra como cada arquivo é por dentro e ensina a passar de um para o outro sem estragar nada.',
      ],
    },
    {
      title: 'Como é um arquivo SRT',
      paragraphs: [
        'SRT significa SubRip Text, nome de um programa do Windows do começo dos anos 2000 que copiava legendas de DVDs. O formato nunca foi padronizado formalmente, mas ficou tão comum que tudo o suporta. Um arquivo SRT é uma lista de blocos numerados, cada um separado do próximo por uma linha vazia.',
      ],
      code: {
        label: 'Um pequeno arquivo SRT',
        text: `1
00:00:01,000 --> 00:00:03,500
Welcome to the show.

2
00:00:03,800 --> 00:00:07,200
Today we look at how
subtitle files are built.

3
00:00:07,600 --> 00:00:10,000
Let's start with the basics.`,
      },
      after: [
        'Cada bloco tem três partes: um número sequencial, uma linha com o horário de início e o horário de fim e uma ou duas linhas de texto. Os horários são escritos como horas, minutos, segundos e milissegundos, e os milissegundos são separados por uma vírgula. Essa vírgula é o motivo mais comum de um arquivo convertido à mão falhar.',
        'Salve o arquivo como texto simples em UTF-8 com a extensão .srt. O UTF-8 importa assim que o texto tem acentos, devanágari, árabe ou qualquer outro caractere que não seja do inglês.',
      ],
    },
    {
      title: 'Como é um arquivo WebVTT',
      paragraphs: [
        'O WebVTT, normalmente abreviado como VTT, foi projetado para a web e é definido em uma especificação publicada pelo W3C, o órgão que padroniza as tecnologias da web. Ele se parece com o SRT, mas acrescenta uma linha de cabeçalho obrigatória e alguns extras opcionais.',
      ],
      code: {
        label: 'As mesmas legendas como arquivo WebVTT',
        text: `WEBVTT

NOTE This file was made from the SRT example.

intro
00:00:01.000 --> 00:00:03.500
Welcome to the show.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Today we look at how
subtitle files are built.

00:00:07.600 --> 00:00:10.000
<v Maria>Let's start with the basics.</v>`,
      },
      after: [
        'Quatro detalhes o distinguem. A primeira linha deve ser WEBVTT. Os milissegundos são separados por um ponto, não por uma vírgula. Uma fala pode ter um nome (a palavra intro acima) no lugar de um número, ou além dele, e os números são opcionais. E, depois dos horários, você pode acrescentar configurações como line, position e align, que movem o texto na tela.',
        'Você também pode escrever blocos NOTE para comentários que os espectadores nunca veem, marcar quem está falando com a tag v e usar tags simples como b, i e u para negrito, itálico e sublinhado. Salve o arquivo como UTF-8 com a extensão .vtt.',
      ],
    },
    {
      title: 'SRT e VTT comparados',
      paragraphs: [
        'Esta tabela coloca os dois lado a lado. As diferenças que importam no dia a dia são o cabeçalho, o separador decimal e onde cada formato é aceito.',
      ],
      table: {
        caption: 'SRT comparado com WebVTT',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['Extensão do arquivo', '.srt', '.vtt'],
          ['Primeira linha', 'O número 1', 'A palavra WEBVTT'],
          ['Formato do horário', '00:00:01,000 (vírgula)', '00:00:01.000 (ponto)'],
          ['Números das falas', 'Obrigatórios', 'Opcionais (um nome é permitido)'],
          [
            'Posição na tela',
            'Fora do formato',
            'Configurações da fala: line, position, align, size',
          ],
          [
            'Estilo e tags de quem fala',
            'Só tags básicas, o suporte varia por player',
            'Definidos na especificação, além de estilo com CSS',
          ],
          ['Comentários', 'Nenhum', 'Blocos NOTE'],
          ['Elemento de vídeo de página da web', 'Não aceito', 'O formato exigido'],
          ['Especificação formal', 'Nenhuma (um formato de fato)', 'Especificação do W3C'],
        ],
      },
      after: [
        'Em termos simples: o SRT é o arquivo mais simples e de alcance mais amplo, o VTT é o arquivo mais rico, com um lar mais estreito, porém mais moderno. Para legendas comuns de fala, o texto na tela fica igual nos dois.',
      ],
    },
    {
      title: 'Onde cada formato é aceito',
      paragraphs: [
        'O suporte muda com o tempo, e cada plataforma redige suas páginas de ajuda de um jeito, então use isto como um guia e confira a página de ajuda atual do serviço para o qual você envia.',
      ],
      bullets: [
        {
          title: 'Páginas da web.',
          text: 'O elemento track da tag de vídeo HTML precisa de WebVTT. É o único lugar onde o SRT não é uma opção.',
        },
        {
          title: 'YouTube.',
          text: 'O envio de legendas aceita SRT e também aceita VTT, entre outros formatos. O SRT é a escolha usual.',
        },
        {
          title: 'Players de computador e de celular.',
          text: 'O VLC e a maioria dos outros players leem SRT, e muitos também leem VTT. Um player costuma carregar um arquivo de legendas que tem o mesmo nome do vídeo.',
        },
        {
          title: 'Editores de vídeo.',
          text: 'A maioria dos editores importa SRT como uma faixa de legendas. Alguns importam VTT também. Se um formato for recusado, tente o outro.',
        },
        {
          title: 'Outras plataformas sociais e de aprendizagem.',
          text: 'Muitas pedem SRT ou VTT, algumas pedem só um deles. Leia a página de envio antes de exportar.',
        },
      ],
    },
    {
      title: 'Converter entre SRT e VTT à mão',
      paragraphs: [
        'Renomear o arquivo não basta. Um arquivo chamado talk.vtt que ainda tem conteúdo SRT é rejeitado pelos navegadores, porque falta o cabeçalho e os horários usam vírgulas. A conversão leva um minuto em qualquer editor de texto.',
      ],
      steps: [
        {
          title: 'SRT para VTT, primeiro passo',
          text: 'Adicione a linha WEBVTT no topo do arquivo, seguida de uma linha vazia.',
        },
        {
          title: 'SRT para VTT, segundo passo',
          text: 'Em cada linha de horário, troque a vírgula antes dos milissegundos por um ponto. Localizar e substituir nas linhas com -->, ou no padrão de dígitos em volta da vírgula, economiza tempo.',
        },
        {
          title: 'SRT para VTT, terceiro passo',
          text: 'Deixe os números onde estão, já que o VTT os permite como nomes de falas. Salve como UTF-8 com a extensão .vtt.',
        },
        {
          title: 'VTT para SRT',
          text: 'Faça o contrário: apague o cabeçalho, os blocos NOTE e quaisquer configurações depois dos horários, troque os pontos de volta por vírgulas, garanta que toda fala tenha um número e salve como .srt.',
        },
      ],
      after: [
        'Se você tem o ffmpeg instalado, ele também converte arquivos de legendas: ffmpeg -i talk.srt talk.vtt transforma um arquivo SRT em um arquivo VTT, e o mesmo comando com os nomes invertidos faz o caminho contrário. O jeito mais simples, porém, é baixar o formato de que você precisa na página da transcrição, porque os dois são gerados diretamente do mesmo texto.',
      ],
    },
    {
      title: 'Problemas comuns e suas causas',
      bullets: [
        {
          title: 'Acentos ou letras não latinas aparecem como símbolos estranhos.',
          text: 'O arquivo não foi salvo como UTF-8. Salve-o de novo com essa codificação.',
        },
        {
          title: 'Nada aparece na página da web.',
          text: 'O arquivo é SRT em vez de VTT, ou o servidor o envia com o tipo errado. Arquivos VTT devem ser servidos como text/vtt, e um arquivo em outro domínio também precisa das configurações de origem cruzada certas.',
        },
        {
          title: 'As legendas estão atrasadas ou adiantadas em todo lugar.',
          text: 'O arquivo inteiro está deslocado. A maioria dos players e editores permite deslocar as legendas por um tempo fixo, o que é mais fácil do que editar cada linha.',
        },
        {
          title: 'Duas legendas se sobrepõem na tela.',
          text: 'O horário de fim de uma fala é posterior ao horário de início da seguinte. Encurte a fala anterior.',
        },
        {
          title: 'As linhas são longas demais para ler.',
          text: 'Divida-as em duas linhas de tamanho mais ou menos igual. Cerca de 42 caracteres por linha é uma referência comum.',
        },
      ],
    },
    {
      title: 'Como obter um arquivo SRT ou VTT do seu vídeo aqui',
      paragraphs: [
        'Você não precisa escrever nenhum dos formatos. Adicione o seu arquivo de vídeo ou áudio na página inicial, escolha o idioma falado e deixe a transcrição terminar. Leia-a e corrija qualquer palavra errada: uma linha editada mantém seu horário de início e de fim, e as palavras dentro dela são distribuídas nesse intervalo em proporção ao seu tamanho.',
        'Depois abra o menu de download e escolha SRT ou VTT. Os dois são gerados da mesma transcrição editada, então você pode exportar um para o YouTube e o outro para a sua própria página da web sem repetir nenhum trabalho. Se você quer que as legendas se dividam bem nas palavras certas, deixe Tempo por palavra ativado em Mais opções.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Posso renomear um arquivo SRT para VTT e usá-lo no meu site?',
      answer:
        'Não. Um navegador rejeita um arquivo .vtt que não começa com WEBVTT, e os horários do SRT usam vírgulas onde o VTT precisa de pontos. Adicione o cabeçalho, troque as vírgulas ou baixe um arquivo VTT direto na página da transcrição.',
    },
    {
      question: 'Arquivos SRT e VTT diferem em tamanho ou qualidade?',
      answer:
        'Não. Os dois são arquivos de texto pequenos e nenhum afeta a qualidade do vídeo. A diferença está só nas coisas extras que o VTT pode descrever, como posição na tela e estilo, e em onde cada formato é aceito.',
    },
    {
      question: 'Legendas SRT podem ter negrito, itálico ou cor?',
      answer:
        'Alguns players entendem tags básicas como b e i no SRT, mas o suporte é irregular, então o resultado pode variar de player para player. O WebVTT define suas tags e o estilo com CSS em uma especificação, o que torna o resultado mais previsível na web.',
    },
    {
      question: 'Que codificação de texto um arquivo de legendas deve usar?',
      answer:
        'UTF-8. Ele lida com todos os idiomas e é o que os navegadores esperam para WebVTT. Se os caracteres das legendas parecem quebrados, o arquivo quase certamente foi salvo em uma codificação mais antiga.',
    },
  ],
  links: [
    {
      label: 'Gerador de legendas SRT',
      path: '/srt-subtitle-generator',
      note: 'Solte um vídeo e baixe um arquivo SRT feito a partir da fala dele.',
    },
    {
      label: 'Gerador de legendas VTT',
      path: '/vtt-subtitle-generator',
      note: 'O mesmo, para um arquivo WebVTT que funciona com o elemento de vídeo de uma página da web.',
    },
    {
      label: 'Como adicionar legendas a um vídeo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Passo a passo, da transcrição a um vídeo que mostra legendas no YouTube, no VLC ou em um editor.',
    },
    {
      label: 'Gerador de legendas para YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Crie um arquivo SRT para um vídeo seu e envie-o no YouTube Studio.',
    },
    {
      label: 'Como obter uma transcrição mais precisa',
      path: '/guides/accurate-transcripts',
      note: 'Um texto melhor significa menos correções antes de exportar as legendas.',
    },
  ],
};
