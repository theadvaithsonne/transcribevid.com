/**
 * Address slugs of the es pages: English path -> the path after /es/ (see docs/in-browser/I18N.md section 2).
 * Latin-script languages: ASCII, lower-case, hyphens, no diacritics, unique, never a reserved word (faq, how-it-works,
 * about, contact, privacy, terms, tools, guides, jobs, logs). Non-Latin scripts keep the English slug (leave pages out).
 * Guides keep the "guides/" segment: '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-localised'.
 */
export const SLUGS: Readonly<Record<string, string>> = {
  '/video-to-text': 'video-a-texto',
  '/audio-to-text': 'audio-a-texto',
  '/mp4-to-text': 'mp4-a-texto',
  '/mp3-to-text': 'mp3-a-texto',
  '/srt-subtitle-generator': 'generador-de-subtitulos-srt',
  '/voice-recording-to-text': 'grabacion-de-voz-a-texto',
  '/wav-to-text': 'wav-a-texto',
  '/m4a-to-text': 'm4a-a-texto',
  '/webm-to-text': 'webm-a-texto',
  '/mov-to-text': 'mov-a-texto',
  '/whatsapp-voice-message-to-text': 'nota-de-voz-whatsapp-a-texto',
  '/meeting-recording-to-text': 'reunion-zoom-teams-meet-a-texto',
  '/lecture-to-text': 'clase-a-texto',
  '/podcast-transcript-generator': 'generador-de-transcripcion-de-podcast',
  '/interview-transcription': 'transcripcion-de-entrevistas',
  '/vtt-subtitle-generator': 'generador-de-subtitulos-vtt',
  '/youtube-subtitle-generator': 'generador-de-subtitulos-youtube',
  '/translate-audio-to-english': 'traducir-audio-a-ingles',
  '/guides/srt-vs-vtt': 'guides/srt-o-vtt',
  '/guides/how-to-add-subtitles-to-a-video': 'guides/como-poner-subtitulos-a-un-video',
  '/guides/transcribe-video-without-uploading': 'guides/transcribir-video-sin-subirlo',
  '/guides/accurate-transcripts': 'guides/transcripcion-mas-precisa',
  '/guides/what-is-whisper': 'guides/que-es-whisper',
};
