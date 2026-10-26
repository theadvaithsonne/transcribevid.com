import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Registrazione vocale in testo',
  h1: 'Registrazione vocale in testo, direttamente dal browser',
  lead: 'Registra con il microfono nella pagina, oppure carica una nota vocale dal telefono, e leggi poi le tue parole come testo. Gratis, senza registrazione, in più di 50 lingue.',
  dropKind: 'audio',
  dropNoun: 'la tua registrazione vocale',
  record: true,

  whyTitle: 'A cosa serve e a cosa non serve',
  why: [
    'Parlare è più veloce che scrivere, quindi molte persone raccolgono idee, appunti di riunione, punti di una lezione e prime bozze come registrazione vocale e le trasformano in testo in un secondo momento. Questa pagina è fatta per questo: registra o carica, poi leggi, modifica e scarica il testo.',
    "Non è dettatura dal vivo. Registri, interrompi e la trascrizione viene creata dall'intera registrazione, quindi le parole non compaiono mentre stai ancora parlando. In cambio, ogni riga ha un timestamp.",
  ],

  howTitle: 'Come trasformare una registrazione vocale in testo',
  howToDescription:
    'Registra con il microfono o carica una nota vocale, scegli la lingua, attendi la trascrizione e scaricala.',
  steps: [
    {
      title: 'Registra o scegli un file',
      text: "Trascina una nota vocale nel riquadro in cima a questa pagina (le Memo Vocali di iPhone sono file M4A) oppure premi Scegli un file. Per registrare invece, premi Registra con il microfono sotto il riquadro, poi Registra dal microfono, e consenti l'accesso quando te lo chiede il browser.",
    },
    {
      title: 'Interrompi e scegli la lingua',
      text: 'Se stai registrando, premi Interrompi la registrazione quando hai finito. Poi seleziona la lingua parlata oppure lascia attivo il riconoscimento automatico.',
    },
    {
      title: 'Attendi la trascrizione',
      text: 'Il testo compare riga per riga, con una barra di avanzamento e una stima del tempo rimanente.',
    },
    {
      title: 'Modifica e scarica',
      text: 'Correggi qualsiasi parola, poi scarica TXT, Markdown o PDF. Le trascrizioni esistono solo nella tua sessione, quindi salva ciò che ti serve.',
    },
  ],

  formatsTitle: 'Formati delle note vocali e download',
  formatsIntro:
    'I registratori vocali di telefoni e computer salvano in formati diversi. Funzionano tutti questi.',
  uploadTitle: 'File di registrazione che puoi caricare',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'le tue parole come testo semplice' },
    { name: 'Markdown', use: 'appunti con i tempi' },
    { name: 'PDF', use: 'una copia stampabile della nota' },
    { name: 'SRT', use: 'righe temporizzate, se la registrazione accompagna un video' },
    { name: 'VTT', use: 'righe temporizzate per i lettori web' },
    { name: 'JSON', use: 'righe strutturate per i programmi' },
  ],

  tipsTitle: 'Consigli per le registrazioni vocali',
  tips: [
    {
      title: 'Prova il microfono.',
      text: 'Registra dieci secondi e riascoltali prima di una sessione lunga.',
    },
    {
      title: 'Parla con un ritmo costante.',
      text: 'Parla vicino al microfono in una stanza silenziosa. Ventole, tastiere e vento si sentono chiaramente quanto te.',
    },
    {
      title: 'Pronuncia chiaramente nomi e numeri.',
      text: 'Aggiungi le parole insolite al suggerimento di vocabolario in Altre opzioni e sarà molto più probabile che vengano scritte bene.',
    },
    {
      title: 'Nessun pulsante del microfono?',
      text: "Alcuni browser consentono la registrazione solo su pagine sicure o dopo che hai dato il permesso. Registra con l'app di registrazione vocale del telefono e carica il file.",
    },
    {
      title: 'Pensa alle altre persone.',
      text: "Di' alle persone quando le registri e ottieni prima il loro permesso.",
    },
  ],

  faqs: [
    {
      question: 'È dettatura dal vivo?',
      answer:
        'No. Prima registri e la trascrizione viene creata dopo. Per avere le parole che compaiono mentre parli, usa invece la funzione di dettatura del telefono o del computer.',
    },
    {
      question: 'Posso usarlo sul telefono?',
      answer:
        'Sì. Apri la pagina nel browser del telefono e registra nella pagina, oppure carica una nota vocale che hai già salvato.',
    },
    {
      question: 'Quanto può durare una registrazione?',
      answer:
        "{limits} I file più lunghi vengono rifiutati prima di essere elaborati, quindi dividili prima. Non c'è una quota giornaliera o mensile.",
      browser: {
        answer:
          "Non impostiamo alcun limite: la registrazione viene trascritta nel browser, sul tuo dispositivo, quindi una registrazione lunga richiede semplicemente più tempo. La pagina ti avvisa su un dispositivo più lento. Non c'è una quota giornaliera o mensile.",
      },
    },
    {
      question: 'Distingue i parlanti?',
      answer:
        'No. Non vengono aggiunti nomi o etichette dei parlanti. Ogni riga ha un timestamp e puoi scrivere i nomi nel testo mentre modifichi.',
    },
    {
      question: 'La mia registrazione vocale viene conservata?',
      answer:
        "Solo per la tua sessione. Viene cancellata quando la sessione termina, dopo un periodo di inattività, oppure quando premi Elimina ora i miei dati. Non c'è alcun account.",
      browser: {
        answer:
          "Solo in questo browser: la tua registrazione non lascia mai il tuo dispositivo. Viene cancellata dopo un periodo di inattività, oppure quando premi Elimina ora i miei dati. Non c'è alcun account.",
      },
    },
  ],
};
