/**
 * Address slugs of the pt pages: English path -> the path after /pt/ (see docs/in-browser/I18N.md section 2).
 * Latin-script languages: ASCII, lower-case, hyphens, no diacritics, unique, never a reserved word (faq, how-it-works,
 * about, contact, privacy, terms, tools, guides, jobs, logs). Non-Latin scripts keep the English slug (leave pages out).
 * Guides keep the "guides/" segment: '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-localised'.
 */
export const SLUGS: Readonly<Record<string, string>> = {
  '/video-to-text': 'video-em-texto',
  '/audio-to-text': 'audio-em-texto',
  '/mp4-to-text': 'mp4-em-texto',
  '/mp3-to-text': 'mp3-em-texto',
  '/srt-subtitle-generator': 'gerador-de-legendas-srt',
  '/voice-recording-to-text': 'gravacao-de-voz-em-texto',
  '/wav-to-text': 'wav-em-texto',
  '/m4a-to-text': 'm4a-em-texto',
  '/webm-to-text': 'webm-em-texto',
  '/mov-to-text': 'mov-em-texto',
  '/whatsapp-voice-message-to-text': 'audio-do-whatsapp-para-texto',
  '/meeting-recording-to-text': 'reuniao-zoom-teams-meet-em-texto',
  '/lecture-to-text': 'aula-em-texto',
  '/podcast-transcript-generator': 'gerador-de-transcricao-de-podcast',
  '/interview-transcription': 'transcricao-de-entrevistas',
  '/vtt-subtitle-generator': 'gerador-de-legendas-vtt',
  '/youtube-subtitle-generator': 'gerador-de-legendas-youtube',
  '/translate-audio-to-english': 'traduzir-audio-para-ingles',
  '/guides/srt-vs-vtt': 'guides/srt-ou-vtt',
  '/guides/how-to-add-subtitles-to-a-video': 'guides/como-adicionar-legendas-a-um-video',
  '/guides/transcribe-video-without-uploading': 'guides/transcrever-video-sem-enviar',
  '/guides/accurate-transcripts': 'guides/transcricao-mais-precisa',
  '/guides/what-is-whisper': 'guides/o-que-e-whisper',
};
