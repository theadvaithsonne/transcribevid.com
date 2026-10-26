/**
 * Address slugs of the fr pages: English path -> the path after /fr/ (see docs/in-browser/I18N.md section 2).
 * Latin-script languages: ASCII, lower-case, hyphens, no diacritics, unique, never a reserved word (faq, how-it-works,
 * about, contact, privacy, terms, tools, guides, jobs, logs). Non-Latin scripts keep the English slug (leave pages out).
 * Guides keep the "guides/" segment: '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-localised'.
 */
export const SLUGS: Readonly<Record<string, string>> = {
  '/video-to-text': 'video-en-texte',
  '/audio-to-text': 'audio-en-texte',
  '/mp4-to-text': 'mp4-en-texte',
  '/mp3-to-text': 'mp3-en-texte',
  '/srt-subtitle-generator': 'generateur-de-sous-titres-srt',
  '/voice-recording-to-text': 'enregistrement-vocal-en-texte',
  '/wav-to-text': 'wav-en-texte',
  '/m4a-to-text': 'm4a-en-texte',
  '/webm-to-text': 'webm-en-texte',
  '/mov-to-text': 'mov-en-texte',
  '/whatsapp-voice-message-to-text': 'message-vocal-whatsapp-en-texte',
  '/meeting-recording-to-text': 'reunion-zoom-teams-meet-en-texte',
  '/lecture-to-text': 'cours-en-texte',
  '/podcast-transcript-generator': 'transcription-de-podcast',
  '/interview-transcription': 'transcription-d-entretiens',
  '/vtt-subtitle-generator': 'generateur-de-sous-titres-vtt',
  '/youtube-subtitle-generator': 'generateur-de-sous-titres-youtube',
  '/translate-audio-to-english': 'traduire-audio-en-anglais',
  '/guides/srt-vs-vtt': 'guides/srt-ou-vtt',
  '/guides/how-to-add-subtitles-to-a-video': 'guides/ajouter-des-sous-titres-a-une-video',
  '/guides/transcribe-video-without-uploading': 'guides/transcrire-une-video-sans-l-envoyer',
  '/guides/accurate-transcripts': 'guides/transcription-plus-precise',
  '/guides/what-is-whisper': 'guides/qu-est-ce-que-whisper',
};
