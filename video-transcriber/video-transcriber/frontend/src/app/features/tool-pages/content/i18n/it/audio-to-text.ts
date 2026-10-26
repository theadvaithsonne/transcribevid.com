import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Audio in testo',
  h1: "Trasforma l'audio in testo senza registrarti",
  lead: "Inserisci un podcast, un'intervista, una lezione o una nota vocale e ottieni una trascrizione con timestamp che puoi cercare, modificare e scaricare. Gratis, senza limiti e in più di 50 lingue.",
  dropKind: 'audio',
  dropNoun: 'il tuo file audio',
  record: true,

  whyTitle: "Quando conviene trasformare l'audio in testo",
  why: [
    "L'audio è il formato più difficile da scorrere. Non puoi cercarlo, sfogliarlo o citarlo senza riascoltarlo. Una trascrizione ti permette di trovare il minuto in cui è stato detto qualcosa, estrarre citazioni esatte e leggere una conversazione di un'ora in pochi minuti.",
    'I casi tipici sono le note di puntata dei podcast, le interviste per giornalismo o ricerca, la storia orale, le note vocali, le bozze dettate e le registrazioni di lezioni o interventi. Trascrivi solo registrazioni che hai fatto tu o che hai il permesso di usare.',
  ],

  howTitle: "Come convertire l'audio in testo",
  howToDescription:
    'Aggiungi un file audio o registrane uno, scegli la lingua, attendi la trascrizione e scaricala.',
  steps: [
    {
      title: 'Aggiungi il tuo audio',
      text: 'Trascina un file audio nel riquadro in cima a questa pagina oppure premi Scegli un file. Per registrarne uno nuovo, premi Registra con il microfono sotto il riquadro.',
    },
    {
      title: 'Scegli la lingua',
      text: 'Seleziona la lingua parlata oppure lascia attivo il riconoscimento automatico. Standard è un buon inizio per un parlato chiaro. Più veloce è rapido, Massima precisione richiede più tempo e commette meno errori.',
    },
    {
      title: 'Attendi il testo',
      text: "Le righe compaiono man mano che vengono riconosciute. Migliora l'audio, attivo per impostazione predefinita, filtra rimbombi e fruscii e uniforma i parlanti a voce bassa.",
    },
    {
      title: 'Rivedi ed esporta',
      text: 'Riproduci qualsiasi riga dal suo timestamp, correggi gli errori, poi scarica la trascrizione nel formato che ti serve.',
    },
  ],

  formatsTitle: 'File audio supportati e download',
  formatsIntro:
    "I formati audio più comuni funzionano. Sono accettati anche i file video, e se ne usa solo l'audio.",
  uploadTitle: 'File audio che puoi caricare',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'testo pulito per appunti e bozze' },
    { name: 'Markdown', use: "testo con i tempi, pronto per un'app di note" },
    { name: 'PDF', use: 'una trascrizione stampabile' },
    { name: 'SRT', use: 'righe temporizzate per sottotitoli' },
    { name: 'VTT', use: 'righe temporizzate per lettori web' },
    { name: 'JSON', use: 'ogni riga e ogni tempo, per i programmi' },
  ],

  tipsTitle: 'Consigli per trascrizioni audio accurate',
  tips: [
    {
      title: 'Avvicinati al microfono.',
      text: 'Eco e distanza di solito contano più del formato del file. Una stanza silenziosa e un microfono vicino valgono più di qualsiasi impostazione.',
    },
    {
      title: 'Una voce alla volta.',
      text: 'Parlanti che si sovrappongono, musica sotto il parlato e forte rumore di fondo causano la maggior parte degli errori.',
    },
    {
      title: "Carica l'originale.",
      text: "Salvare di nuovo una registrazione in un file più piccolo elimina dettagli. Usa l'originale o la copia di qualità migliore che hai.",
    },
    {
      title: 'Usa un suggerimento di vocabolario.',
      text: 'Nomi, marchi e termini tecnici sono ciò che i riconoscitori sbagliano di più. Elencali in Altre opzioni.',
    },
    {
      title: 'Chiedi prima di registrare.',
      text: 'Ottieni il permesso prima di registrare o trascrivere la voce di altre persone e controlla le regole locali sulla registrazione delle chiamate.',
    },
  ],

  faqs: [
    {
      question: 'Quali formati audio posso convertire in testo?',
      answer:
        "MP3, WAV, M4A, AAC, FLAC, OGG e OPUS. Funzionano anche file video come MP4 e MKV, perché si usa solo l'audio.",
    },
    {
      question: 'Posso registrare audio direttamente nella pagina?',
      answer:
        "Sì, nei browser che consentono l'accesso al microfono. Premi Registra dal microfono, consenti l'accesso quando richiesto, poi interrompi. La registrazione viene trascritta dopo l'interruzione, non mentre parli.",
    },
    {
      question: "Funziona per un'intervista a due persone?",
      answer:
        'Sì, viene trascritto il parlato di entrambe. Non vengono aggiunti nomi o etichette dei parlanti, ma ogni riga ha un timestamp e puoi scrivere i nomi nel testo mentre modifichi.',
    },
    {
      question: "Quanto può durare l'audio?",
      answer:
        "{limits} I file più lunghi o più grandi vengono rifiutati prima di essere elaborati, quindi dividili prima. Non c'è una quota giornaliera o mensile.",
      browser: {
        answer:
          "Non impostiamo alcun limite: l'audio viene trascritto nel browser, sul tuo dispositivo, quindi le registrazioni lunghe richiedono semplicemente più tempo e abbastanza memoria libera. La pagina ti avvisa su un dispositivo più lento. Non c'è una quota giornaliera o mensile.",
      },
    },
    {
      question: 'Il mio audio viene conservato?',
      answer:
        "I file vengono conservati solo per la tua sessione e cancellati automaticamente al termine, oppure subito quando premi Elimina ora i miei dati. Non c'è alcun account.",
      browser: {
        answer:
          "Solo in questo browser: il tuo audio non lascia mai il tuo dispositivo. Viene cancellato automaticamente dopo un periodo di inattività, oppure subito quando premi Elimina ora i miei dati. Non c'è alcun account.",
      },
    },
  ],
};
