import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Come ottenere una trascrizione più accurata',
  lead: 'La precisione dipende prima di tutto dal suono, poi da tre scelte che controlli tu: la lingua, il livello di qualità e un suggerimento di vocabolario. Questa guida mostra cosa cambiare prima di registrare, quali impostazioni aiutano, come individuare gli errori che restano e cosa il riconoscimento vocale non può fare in alcun modo.',
  readingMinutes: 9,
  toolPath: '/video-to-text',
  toolCta: 'Trascrivi un video con le impostazioni migliori',
  blocks: [
    {
      title: 'Cosa decide quanto è accurata una trascrizione',
      paragraphs: [
        'Il riconoscimento vocale ascolta, più o meno come fai tu. Se una persona parla in modo chiaro, vicino al microfono, in una stanza silenziosa, in una lingua che il modello conosce bene, la trascrizione di solito è ottima. Se il suono è lontano, rumoroso, pieno di eco o affollato di voci, anche una persona deve concentrarsi, e il software sbaglia di più.',
        "Ne esce un semplice ordine di priorità. Sistema prima l'audio, perché nulla a valle può recuperare parole che non sono mai state registrate. Poi indica al programma la lingua. Poi scegli un livello di qualità adatto alla difficoltà. Poi dagli le parole insolite che non può indovinare. Infine controlla il risultato, perché nessuna trascrizione è perfetta.",
      ],
    },
    {
      title: 'Migliora la registrazione stessa',
      paragraphs: [
        'Pochi minuti di attenzione mentre registri valgono più di qualsiasi impostazione dopo.',
      ],
      bullets: [
        {
          title: 'Avvicinati.',
          text: "Metti il microfono a una o due spanne dalla bocca di chi parla. Un telefono tenuto vicino batte un portatile dall'altra parte del tavolo.",
        },
        {
          title: 'Scegli una stanza silenziosa e morbida.',
          text: "Tende, moquette e divani assorbono l'eco. Pareti nude e grandi stanze vuote impastano le parole. Spegni ventilatori, aria condizionata e notifiche.",
        },
        {
          title: 'Tieni la musica lontana dalla voce.',
          text: 'La musica di sottofondo è difficile da separare dal parlato. Aggiungila dopo aver trascritto, non prima.',
        },
        {
          title: 'Una voce alla volta.',
          text: 'Le persone che parlano sovrapposte sono il caso più difficile. Chiedi di aspettarsi a vicenda e usa un microfono per persona dove puoi.',
        },
        {
          title: 'Non preoccuparti della frequenza di campionamento.',
          text: 'I modelli vocali leggono il suono a 16 kHz in mono, e la pagina converte automaticamente qualsiasi file a quel formato. Una frequenza più alta o un mix surround non aiuta; contano distanza, rumore e livello.',
        },
        {
          title: 'Evita la compressione pesante.',
          text: "I file con bitrate molto basso, come un messaggio vocale compresso su una connessione debole, perdono dettagli di cui il modello ha bisogno. Usa la registrazione originale quando ce l'hai.",
        },
      ],
    },
    {
      title: 'Indica la lingua',
      paragraphs: [
        "La pagina può rilevare la lingua da sola, e per una registrazione lunga in inglese chiaro di solito ci azzecca. Ma per clip brevi, forti accenti e registrazioni che mescolano le lingue, il rilevamento può sbagliare, e un'ipotesi sbagliata peggiora l'intera trascrizione. Scegliere la lingua nell'elenco Lingua richiede un clic ed elimina il rischio.",
        "Se la pagina non riesce a identificare la lingua con sicurezza, lo dice e ti chiede di scegliere quella che senti. Fallo ed eseguila di nuovo. Per un parlato che passa da una lingua all'altra, come hindi e inglese, scegli la lingua principale e controlla i passaggi nell'altra.",
      ],
    },
    {
      title: 'Scegli il giusto livello di qualità',
      paragraphs: [
        'Le quattro scelte di qualità eseguono dimensioni diverse della stessa famiglia di modelli. Un modello più grande sbaglia meno con accenti, rumore, altre lingue e parole rare, ma richiede più tempo e ha un primo download più grande.',
      ],
      table: {
        caption: 'Le scelte di qualità e quando usare ciascuna',
        head: ['Scelta', 'Ideale per', 'Compromesso'],
        rows: [
          [
            'Più veloce',
            'Parlato chiaro in una registrazione silenziosa, bozze rapide',
            'Il maggior numero di errori tra le quattro su un audio difficile',
          ],
          [
            'Standard',
            'La maggior parte dei video e delle registrazioni vocali (la scelta di partenza abituale)',
            'Un buon equilibrio tra velocità e precisione',
          ],
          [
            'Alta precisione',
            'Accenti, rumore di fondo, parlato non inglese',
            'Più lenta, download più grande',
          ],
          [
            'Massima precisione',
            'Audio difficile in cui conta ogni parola',
            'La più lenta, il download più grande',
          ],
        ],
      },
      after: [
        "Una buona abitudine è iniziare con Standard su un breve campione della registrazione, leggerlo e salire di un livello solo se gli errori ti danno fastidio. In Altre opzioni puoi anche scegliere dall'elenco completo dei modelli. Su alcuni dispositivi Alta precisione e Massima precisione sono disattivate, con il motivo indicato, per esempio «richiede 8 GB» o «usa un computer per questa dimensione», perché i modelli più grandi richiedono più memoria. Inoltre, ogni scelta più grande è un primo download più grande, e la pagina ne mostra la dimensione prima che tu inizi.",
      ],
    },
    {
      title: 'Usa il suggerimento di vocabolario per nomi e gergo',
      paragraphs: [
        "I modelli vocali conoscono bene le parole comuni e male quelle rare. Il nome di una persona, un'azienda, un prodotto, un luogo o un termine tecnico viene scritto come il modello lo ritiene più probabile, e spesso è sbagliato. Il Suggerimento di vocabolario in Altre opzioni esiste per questo.",
        'Scrivi le parole insolite come vuoi che vengano scritte, per esempio una frase come «Intervista con la dott.ssa Okafor su Kubernetes e PostgreSQL.» Una riga breve e naturale che contiene le parole funziona meglio di un lungo elenco. È facoltativo e può contenere fino a 1.000 caratteri. La pagina non lo conserva tra le impostazioni ricordate, nel caso contenga nomi privati.',
        "Il suggerimento aiuta con l'ortografia. Non insegna al modello a sentire una parola biascicata o coperta dal rumore.",
      ],
    },
    {
      title: "Migliora l'audio e Salta silenzi e musica",
      paragraphs: [
        'Due interruttori in Altre opzioni sono attivi per impostazione predefinita, e per la maggior parte delle registrazioni conviene lasciarli attivi.',
      ],
      bullets: [
        {
          title: "Migliora l'audio.",
          text: 'Filtra i rumori di fondo molto bassi e i fruscii molto alti, poi uniforma il volume così che una persona che parla piano non si perda accanto a una che parla forte. Se una registrazione ti suona bene ma la trascrizione è strana, prova una volta con questo interruttore disattivato per vedere se la causa è il filtro.',
        },
        {
          title: 'Salta silenzi e musica.',
          text: 'Un rilevatore di voce trova i tratti con una voce umana e passa solo quelli al modello. Silenzio e la maggior parte dei suoni che non sono parlato, come la musica senza canto, non lo raggiungono mai, il che evita gran parte del testo inventato che un modello può produrre quando non ha nulla da sentire. La musica con voce cantata può comunque passare. Disattivalo solo se il parlato a bassa voce viene scartato.',
        },
      ],
      after: [
        'Anche Tempi per parola è attivo per impostazione predefinita. Non cambia quali parole vengono trovate, ma permette ai sottotitoli di iniziare e finire esattamente con le parole e alimenta i segni che mostrano quali parole erano incerte.',
      ],
    },
    {
      title: 'Controlla il risultato: dove si nascondono gli errori',
      paragraphs: [
        "Quando la trascrizione è pronta, non leggerla subito dall'inizio alla fine. Cerca i segni. Le parole di cui il modello era meno sicuro sono sottolineate, con una sottolineatura più marcata per le meno certe. Se l'intera trascrizione ha una bassa affidabilità, o la lingua era incerta, la pagina mostra un avviso con un pulsante per rivedere lingua e qualità.",
        'Il punteggio di affidabilità è un indizio su dove guardare, non una percentuale di precisione, quindi una parola senza sottolineatura può comunque essere sbagliata. Dedica la tua attenzione in questo ordine:',
      ],
      bullets: [
        {
          title: 'Nomi e luoghi.',
          text: 'Sono gli errori più comuni e i più imbarazzanti.',
        },
        {
          title: 'Numeri, date e unità.',
          text: 'Una cifra sbagliata cambia il significato. Controlla ciascuna con la registrazione.',
        },
        {
          title: 'Parole che suonano uguali.',
          text: 'Parole come «ha» e «a», «anno» e «hanno», o «e» ed «è», vengono scelte dal contesto e possono essere scambiate.',
        },
        {
          title: 'Passaggi vicini a rumori o a voci sovrapposte.',
          text: 'Riascolta al timestamp. Fai clic su una riga per saltare a quel momento.',
        },
      ],
      after: [
        'Correggi ciò che trovi direttamente nel testo. Le tue modifiche restano nella trascrizione e confluiscono in ogni esportazione.',
      ],
    },
    {
      title: 'Problema e cosa provare',
      table: {
        caption: 'Problemi comuni e cosa provare per primo',
        head: ['Problema', 'Cosa provare'],
        rows: [
          [
            'Lingua sbagliata, o testo nella scrittura sbagliata',
            'Scegli tu la lingua invece di Rileva automaticamente',
          ],
          [
            'Nomi e marchi scritti in modo sbagliato',
            'Aggiungili al Suggerimento di vocabolario in Altre opzioni, poi trascrivi di nuovo il file dalla home page',
          ],
          [
            'Molti errori con accenti o suono rumoroso',
            "Sali di un livello di qualità e tieni attivo Migliora l'audio",
          ],
          [
            'Compare testo dove nessuno parla',
            'Tieni attivo Salta silenzi e musica; taglia le parti lunghe di silenzio o di sola musica',
          ],
          [
            'La stessa frase si ripete più e più volte',
            'Tieni disattivato Usa il testo precedente come contesto e prova un livello di qualità diverso',
          ],
          [
            "Due persone che parlano una sopra l'altra",
            "Non c'è rimedio nel software: la prossima volta registrale con microfoni separati",
          ],
          [
            'Una persona molto piano o lontana non viene colta',
            "Tieni attivo Migliora l'audio; se il parlato viene comunque scartato, disattiva Salta silenzi e musica per quel file",
          ],
        ],
      },
    },
    {
      title: 'Cosa il riconoscimento vocale non può fare',
      paragraphs: [
        'Conoscere i limiti ti aiuta a individuare presto i problemi. La trascrizione di qualsiasi riconoscimento vocale, compreso questo, può contenere quanto segue.',
      ],
      bullets: [
        {
          title: 'Nessun nome dei parlanti.',
          text: 'Scrive ciò che è stato detto, non chi lo ha detto. Aggiungi i nomi a mano mentre modifichi.',
        },
        {
          title: 'Testo inventato.',
          text: 'Di fronte a silenzio, musica o rumore, un modello può produrre parole fluenti che nessuno ha pronunciato, oppure ripetere una frase molte volte. Se vedi testo dove non senti nulla, eliminalo.',
        },
        {
          title: 'Omofoni sbagliati e parole rare.',
          text: 'Sceglie la parola più probabile, che non è sempre quella giusta.',
        },
        {
          title: 'Parole perse nelle sovrapposizioni.',
          text: 'Il parlato sovrapposto di solito viene trascritto come una sola voce o in parte scartato.',
        },
        {
          title: 'Nessuna garanzia.',
          text: 'Per qualsiasi cosa legale, medica, finanziaria o da pubblicare, tratta la trascrizione come una bozza che una persona deve controllare.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Quale livello di qualità dà la trascrizione più accurata?',
      answer:
        "Massima precisione di solito commette meno errori, con Alta precisione spesso poco dietro, poi Standard e Più veloce. Il divario conta soprattutto con accenti, rumore e lingue diverse dall'inglese. Su un parlato inglese chiaro le differenze sono piccole, quindi Standard spesso basta.",
    },
    {
      question: "Un microfono migliore aiuta più di un'impostazione migliore?",
      answer:
        'Di solito sì. Un suono pulito e ravvicinato permette a un modello più piccolo di andare bene, mentre un suono scadente limita anche il più grande. Avvicinare il microfono e ridurre il rumore di fondo è il miglioramento più economico che puoi fare.',
    },
    {
      question: "Devo ripulire l'audio in un editor prima di trascrivere?",
      answer:
        "Raramente. La pagina filtra già rumori bassi e fruscii e uniforma il volume quando Migliora l'audio è attivo. I filtri di riduzione del rumore pesanti in un editor possono distorcere il parlato e peggiorare il riconoscimento, quindi usa impostazioni leggere o nessuna.",
    },
    {
      question: 'Perché due livelli di qualità danno testi diversi per lo stesso file?',
      answer:
        'Sono dimensioni diverse di modello, quindi ciascuno sente e scrive un passaggio difficile a modo suo. Dove due esecuzioni non concordano, ascolta quel passaggio al suo timestamp, perché probabilmente è difficile e vale la pena controllarlo a orecchio.',
    },
    {
      question: 'Posso rendere la trascrizione più accurata modificandola?',
      answer:
        'La modifica corregge il testo che esporti; non riaddestra il modello. Correggi nomi, numeri e parole poco chiare nella pagina della trascrizione e scarica la versione corretta. Una nuova esecuzione con un suggerimento di vocabolario riduce le correzioni la volta dopo.',
    },
  ],
  links: [
    {
      label: "Cos'è Whisper?",
      path: '/guides/what-is-whisper',
      note: 'Il modello vocale dietro i livelli di qualità, e dove è forte o debole.',
    },
    {
      label: 'Trascrizione di interviste',
      path: '/interview-transcription',
      note: 'Consigli per trascrivere una conversazione con due voci e molti nomi.',
    },
    {
      label: 'Lezione in testo',
      path: '/lecture-to-text',
      note: 'Ricava appunti da una lezione registrata, anche dal fondo di una grande aula.',
    },
    {
      label: 'Audio hindi in testo (pagina in inglese)',
      path: '/hindi-audio-to-text',
      note: "Scegliere la lingua conta moltissimo per l'hindi e per altro parlato non inglese.",
    },
    {
      label: 'Trascrivere un video senza caricarlo',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Come funziona il motore nel browser e cosa cambia il dispositivo che usi.',
    },
  ],
};
