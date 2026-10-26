import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Como adicionar legendas a um vídeo, de graça',
  lead: 'Fazer legendas leva quatro passos: transformar a fala em texto, corrigir os erros, exportar um arquivo SRT ou VTT e anexar esse arquivo ao vídeo. Este guia percorre cada passo e mostra como anexar o arquivo no YouTube, no VLC, em um editor de vídeo, em uma página da web ou de forma permanente na imagem com o ffmpeg.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Criar legendas a partir do seu vídeo',
  blocks: [
    {
      title: 'Primeiro decida: legendas separadas ou legendas gravadas na imagem',
      paragraphs: [
        'Há duas formas de pôr legendas em um vídeo, e a escolha define quais passos você precisa seguir.',
      ],
      bullets: [
        {
          title: 'Legendas separadas (uma faixa à parte).',
          text: 'As legendas são um arquivo ou uma faixa ao lado do vídeo. Os espectadores podem ligá-las e desligá-las e escolher um idioma, e você pode corrigir um erro de digitação depois sem mexer no vídeo. É assim que funcionam o YouTube, o VLC, a maioria dos players e as páginas da web. Exige um player que aceite faixas de legenda.',
        },
        {
          title: 'Legendas gravadas na imagem (parte do vídeo).',
          text: 'O texto é desenhado em cada quadro, então aparece em qualquer lugar, inclusive em plataformas que não aceitam arquivo de legendas. O preço é que ninguém pode desligá-lo, você não consegue corrigi-lo sem exportar o vídeo de novo e o vídeo precisa ser recodificado.',
        },
      ],
      after: [
        'Na dúvida, comece com legendas separadas. Grave-as na imagem só quando o lugar onde você vai publicar não aceitar o envio de legendas.',
      ],
    },
    {
      title: 'Os quatro passos em resumo',
      steps: [
        {
          title: 'Transcreva o vídeo',
          text: 'Adicione o vídeo na página inicial, escolha o idioma falado e deixe a fala virar texto com marcas de tempo.',
        },
        {
          title: 'Corrija o texto',
          text: 'Leia a transcrição e corrija nomes, números e palavras pouco claras. Se as linhas das legendas saírem longas demais, escolha um Tamanho da linha da legenda menor no menu Exportar.',
        },
        {
          title: 'Exporte SRT ou VTT',
          text: 'Baixe o arquivo de legendas. O SRT funciona em quase todo lugar. O VTT é para o elemento de vídeo de uma página da web.',
        },
        {
          title: 'Anexe o arquivo',
          text: 'Envie-o ao YouTube, carregue-o no seu player ou editor ou adicione-o à sua página. Ou grave-o na imagem do vídeo.',
        },
      ],
    },
    {
      title: 'Passos 1 e 2: transcreva o vídeo e corrija o texto',
      paragraphs: [
        'Escolha o vídeo na página inicial e selecione o idioma em que as pessoas falam nele, em vez de deixar na detecção automática. Informar o idioma é mais confiável, principalmente em trechos curtos e com sotaque. A qualidade Padrão serve para a maioria dos vídeos. Escolha Alta precisão para som com ruído ou sotaques fortes.',
        'Mantenha Tempo por palavra ativado em Mais opções. Ele vem ativado por padrão e faz cada legenda começar e terminar junto com as palavras, em vez de nas bordas de um bloco longo. Quando a transcrição estiver pronta, reproduza o vídeo ao lado dela e acompanhe a leitura. As palavras de que o reconhecimento teve menos certeza ficam sublinhadas enquanto a opção Sublinhar palavras incertas está ligada (ela vem ligada por padrão), então confira essas primeiro.',
        'As legendas são lidas rápido, então molde o texto pensando no espectador. Estas são orientações muito usadas, não regras rígidas:',
      ],
      bullets: [
        {
          title: 'Tamanho da linha.',
          text: 'Cerca de 42 caracteres por linha, e no máximo duas linhas por vez. O menu Exportar tem a escolha Tamanho da linha da legenda: Curta (32 letras), Padrão (42) ou Longa (56).',
        },
        {
          title: 'Tempo na tela.',
          text: 'Cada legenda deve ficar no ar por pelo menos cerca de um segundo e raramente por mais de uns sete.',
        },
        {
          title: 'Velocidade de leitura.',
          text: 'De 15 a 20 caracteres por segundo é confortável para a maioria dos adultos. Se as pessoas não conseguem terminar de ler antes de a linha mudar, encurte o texto ou deixe-o ficar mais tempo.',
        },
        {
          title: 'Quebras naturais.',
          text: 'Uma boa legenda quebra no fim de uma frase, não no meio de um nome nem entre um artigo e o substantivo. A exportação quebra as linhas longas para você, então mantenha cada linha editada como uma frase completa.',
        },
      ],
    },
    {
      title: 'Passo 3: escolha SRT ou VTT',
      paragraphs: [
        'Baixe SRT, a menos que as legendas sejam para um vídeo na sua própria página da web. O YouTube, o VLC e quase todo editor aceitam SRT. Uma página da web precisa de VTT, porque os navegadores leem faixas de legenda só nesse formato.',
        'Você pode baixar os dois da mesma transcrição, então não precisa decidir de antemão. O guia sobre SRT e VTT explica as diferenças exatas, incluindo o que há dentro de cada arquivo.',
      ],
    },
    {
      title: 'Passo 4: adicione o arquivo no YouTube, no VLC ou em um editor',
      paragraphs: [
        'Os nomes dos menus mudam de vez em quando, então procure o mais parecido se um rótulo for diferente do indicado abaixo.',
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: 'Abra o YouTube Studio, escolha o vídeo, abra Legendas, adicione um idioma e depois escolha enviar um arquivo. Escolha a opção de arquivo com sincronização, selecione o seu SRT e publique. O YouTube permite editar as linhas depois, na mesma tela.',
        },
        {
          title: 'VLC.',
          text: 'Reproduza o vídeo, depois escolha Legenda, Adicionar arquivo de legenda no menu e selecione o seu SRT. Você também pode arrastar o arquivo para a janela do player. Ou salve o SRT ao lado do vídeo com o mesmo nome (lecture.mp4 e lecture.srt) e o VLC costuma carregá-lo sozinho.',
        },
        {
          title: 'Editores de vídeo.',
          text: 'A maioria dos editores importa um arquivo SRT como uma faixa de legendas, a partir de um menu como Arquivo, Importar, ou do painel de legendas. Quando ele estiver na linha do tempo, você pode mudar o estilo do texto. Se um formato for recusado, tente o outro.',
        },
        {
          title: 'Celulares e tablets.',
          text: 'Um app de player de vídeo que aceite arquivos de legendas, como o VLC para celular, pode carregar um arquivo SRT dos seus arquivos. O player da galeria de muitos celulares não consegue.',
        },
      ],
    },
    {
      title: 'Adicionar legendas a uma página da web com o elemento track',
      paragraphs: [
        'No seu próprio site, o elemento de vídeo HTML carrega legendas por meio de um elemento track que aponta para um arquivo WebVTT. Exporte o VTT, envie-o para o lado do vídeo e adicione uma linha.',
      ],
      code: {
        label: 'Um vídeo com uma faixa de legendas',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English" default>
</video>`,
      },
      after: [
        'O atributo default mostra a faixa sem o espectador precisar escolhê-la. Adicione uma linha track por idioma. Se o arquivo VTT estiver em um domínio diferente do da página, esse servidor precisa permitir requisições de origem cruzada, ou o navegador não o carrega.',
      ],
    },
    {
      title: 'Adicionar uma faixa de legendas separada a um MP4 com o ffmpeg',
      paragraphs: [
        'O ffmpeg é uma ferramenta gratuita de linha de comando que pode embalar as legendas dentro do arquivo MP4, de modo que o vídeo e as legendas viajam como um arquivo só. O vídeo e o som são copiados sem alteração, então é rápido e não perde qualidade. Coloque o vídeo e o arquivo SRT em uma mesma pasta e execute este comando nela.',
      ],
      code: {
        label: 'Legendas separadas dentro de um MP4 (os espectadores podem desligá-las)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=eng talk-subtitled.mp4`,
      },
      after: [
        'As opções -map escolhem exatamente o que vai para o novo arquivo: todo o vídeo, qualquer som (o ponto de interrogação deixa o comando seguir se não houver nenhum) e o arquivo de legendas. Escolher os fluxos à mão evita erros em arquivos de celular e de câmera que também têm faixas de dados extras, que o MP4 muitas vezes não consegue copiar. A configuração mov_text é o tipo de legenda que os arquivos MP4 usam. O código de idioma tem três letras: eng para inglês, por para português, hin para híndi e assim por diante. Players como o VLC mostram a faixa no menu de legendas.',
      ],
    },
    {
      title: 'Gravar as legendas na imagem com o ffmpeg',
      paragraphs: [
        'Para uma plataforma que aceita só um vídeo, desenhe o texto em cada quadro. Isso recodifica o vídeo, então demora mais e o arquivo é feito de novo. O som é copiado como está. Execute o comando na pasta que tem os dois arquivos, o que evita problemas com caminhos de arquivo.',
      ],
      code: {
        label: 'Legendas gravadas na imagem (permanentes, não podem ser desligadas)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "Para mudar a aparência, acrescente um estilo depois do nome do arquivo, por exemplo subtitles=talk.srt:force_style='FontSize=22' dentro das aspas do comando. Guarde uma cópia do vídeo original, porque uma versão com legendas gravadas na imagem não volta a ser legendas separadas.",
      ],
    },
    {
      title: 'Acessibilidade, e por que você precisa conferir o texto',
      paragraphs: [
        'As legendas ajudam pessoas surdas ou com deficiência auditiva, pessoas que assistem no metrô ou em um escritório silencioso com o som desligado, pessoas que ainda estão aprendendo o idioma e qualquer um que ache mais fácil acompanhar palavras escritas. Muitos espectadores as ligam mesmo podendo ouvir o som.',
        'O reconhecimento de fala é bom, mas não é perfeito, e uma legenda com um nome ou número errado pode induzir ao erro. Leia sempre a transcrição com o vídeo antes de publicá-la e tome cuidado redobrado com nomes, valores, termos técnicos e qualquer coisa jurídica ou médica. Legendas que também descrevem sons importantes, como risadas ou uma porta fechando, são mais úteis para quem não consegue ouvi-los, e você pode acrescentá-las à mão enquanto edita.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Qual é a diferença entre legendas e legendas descritivas (closed captions)?',
      answer:
        'As legendas traduzem ou escrevem a fala para espectadores que conseguem ouvir o vídeo. As legendas descritivas também descrevem os sons, como música ou risos, para espectadores que não conseguem ouvir. Os arquivos são do mesmo tipo, então você pode acrescentar descrições de sons a um arquivo SRT por conta própria se quiser legendas descritivas.',
    },
    {
      question: 'Preciso de um programa especial para adicionar legendas?',
      answer:
        'Não. Envie o arquivo SRT no YouTube Studio, arraste-o para o VLC ou importe-o no seu editor. Só embalar o arquivo em um MP4 ou gravar o texto na imagem exige uma ferramenta como o ffmpeg ou um editor de vídeo que consiga exportar assim.',
    },
    {
      question: 'Posso adicionar legendas em mais de um idioma?',
      answer:
        'Sim, com legendas separadas. Faça um arquivo para cada idioma e adicione cada um como uma faixa própria. Este site pode escrever a transcrição no idioma falado e pode traduzir a fala para o inglês, mas você precisaria traduzir o texto para outros idiomas por conta própria ou com outra ferramenta.',
    },
    {
      question: 'Por que minhas legendas estão fora de sincronia com o vídeo?',
      answer:
        'Ou o arquivo inteiro está deslocado, o que a maioria dos players corrige com uma configuração de atraso das legendas, ou o vídeo foi editado depois de as legendas serem feitas. As legendas seguem o tempo do áudio a partir do qual foram feitas, então transcreva o corte final do vídeo.',
    },
  ],
  links: [
    {
      label: 'Gerador de legendas SRT',
      path: '/srt-subtitle-generator',
      note: 'Comece aqui para transformar um vídeo em um arquivo SRT.',
    },
    {
      label: 'SRT ou VTT',
      path: '/guides/srt-vs-vtt',
      note: 'O que há dentro de cada arquivo e qual baixar no seu caso.',
    },
    {
      label: 'Gerador de legendas VTT',
      path: '/vtt-subtitle-generator',
      note: 'Obtenha o arquivo WebVTT de que o elemento de vídeo de uma página da web precisa.',
    },
    {
      label: 'Gerador de legendas para YouTube',
      path: '/youtube-subtitle-generator',
      note: 'O caminho específico do YouTube, do arquivo ao envio no Studio.',
    },
    {
      label: 'Traduzir fala para o inglês',
      path: '/translate-audio-to-english',
      note: 'Receba legendas em inglês de um vídeo falado em outro idioma.',
    },
  ],
};
