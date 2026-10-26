/**
 * Address slugs of the it pages: English path -> the path after /it/ (see docs/in-browser/I18N.md section 2).
 * Latin-script languages: ASCII, lower-case, hyphens, no diacritics, unique, never a reserved word (faq, how-it-works,
 * about, contact, privacy, terms, tools, guides, jobs, logs). Non-Latin scripts keep the English slug (leave pages out).
 * Guides keep the "guides/" segment: '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-localised'.
 */
export const SLUGS: Readonly<Record<string, string>> = {
  '/video-to-text': 'video-in-testo',
  '/audio-to-text': 'audio-in-testo',
  '/mp4-to-text': 'mp4-in-testo',
  '/mp3-to-text': 'mp3-in-testo',
  '/srt-subtitle-generator': 'generatore-di-sottotitoli-srt',
  '/voice-recording-to-text': 'registrazione-vocale-in-testo',
  '/wav-to-text': 'wav-in-testo',
  '/m4a-to-text': 'm4a-in-testo',
  '/webm-to-text': 'webm-in-testo',
  '/mov-to-text': 'mov-in-testo',
  '/whatsapp-voice-message-to-text': 'vocale-whatsapp-in-testo',
  '/meeting-recording-to-text': 'riunione-zoom-teams-meet-in-testo',
  '/lecture-to-text': 'lezione-in-testo',
  '/podcast-transcript-generator': 'trascrizione-podcast',
  '/interview-transcription': 'trascrizione-interviste',
  '/vtt-subtitle-generator': 'generatore-di-sottotitoli-vtt',
  '/youtube-subtitle-generator': 'sottotitoli-youtube',
  '/translate-audio-to-english': 'traduci-audio-in-inglese',
  '/guides/srt-vs-vtt': 'guides/srt-o-vtt',
  '/guides/how-to-add-subtitles-to-a-video': 'guides/come-aggiungere-sottotitoli-a-un-video',
  '/guides/transcribe-video-without-uploading': 'guides/trascrivere-video-senza-caricarlo',
  '/guides/accurate-transcripts': 'guides/trascrizione-piu-accurata',
  '/guides/what-is-whisper': 'guides/cos-e-whisper',
};
