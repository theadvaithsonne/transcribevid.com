/**
 * Address slugs of the de pages: English path -> the path after /de/ (see docs/in-browser/I18N.md section 2).
 * Latin-script languages: ASCII, lower-case, hyphens, no diacritics, unique, never a reserved word (faq, how-it-works,
 * about, contact, privacy, terms, tools, guides, jobs, logs). Non-Latin scripts keep the English slug (leave pages out).
 * Guides keep the "guides/" segment: '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-localised'.
 */
export const SLUGS: Readonly<Record<string, string>> = {
  '/video-to-text': 'video-zu-text',
  '/audio-to-text': 'audio-zu-text',
  '/mp4-to-text': 'mp4-zu-text',
  '/mp3-to-text': 'mp3-zu-text',
  '/srt-subtitle-generator': 'untertitel-generator-srt',
  '/voice-recording-to-text': 'sprachaufnahme-zu-text',
  '/wav-to-text': 'wav-zu-text',
  '/m4a-to-text': 'm4a-zu-text',
  '/webm-to-text': 'webm-zu-text',
  '/mov-to-text': 'mov-zu-text',
  '/whatsapp-voice-message-to-text': 'whatsapp-sprachnachricht-zu-text',
  '/meeting-recording-to-text': 'meeting-aufzeichnung-zoom-teams-meet-zu-text',
  '/lecture-to-text': 'vorlesung-zu-text',
  '/podcast-transcript-generator': 'podcast-transkript-generator',
  '/interview-transcription': 'interview-transkription',
  '/vtt-subtitle-generator': 'untertitel-generator-vtt',
  '/youtube-subtitle-generator': 'youtube-untertitel-generator',
  '/translate-audio-to-english': 'audio-ins-englische-uebersetzen',
  '/guides/srt-vs-vtt': 'guides/srt-oder-vtt',
  '/guides/how-to-add-subtitles-to-a-video': 'guides/untertitel-zu-einem-video-hinzufuegen',
  '/guides/transcribe-video-without-uploading': 'guides/video-transkribieren-ohne-hochladen',
  '/guides/accurate-transcripts': 'guides/genauere-transkripte',
  '/guides/what-is-whisper': 'guides/was-ist-whisper',
};
