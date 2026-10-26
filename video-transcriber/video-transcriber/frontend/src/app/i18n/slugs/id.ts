/**
 * Address slugs of the id pages: English path -> the path after /id/ (see docs/in-browser/I18N.md section 2).
 * Latin-script languages: ASCII, lower-case, hyphens, no diacritics, unique, never a reserved word (faq, how-it-works,
 * about, contact, privacy, terms, tools, guides, jobs, logs). Non-Latin scripts keep the English slug (leave pages out).
 * Guides keep the "guides/" segment: '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-localised'.
 */
export const SLUGS: Readonly<Record<string, string>> = {
  '/video-to-text': 'video-ke-teks',
  '/audio-to-text': 'audio-ke-teks',
  '/mp4-to-text': 'mp4-ke-teks',
  '/mp3-to-text': 'mp3-ke-teks',
  '/srt-subtitle-generator': 'pembuat-subtitle-srt',
  '/voice-recording-to-text': 'rekaman-suara-ke-teks',
  '/wav-to-text': 'wav-ke-teks',
  '/m4a-to-text': 'm4a-ke-teks',
  '/webm-to-text': 'webm-ke-teks',
  '/mov-to-text': 'mov-ke-teks',
  '/whatsapp-voice-message-to-text': 'pesan-suara-whatsapp-ke-teks',
  '/meeting-recording-to-text': 'rekaman-rapat-ke-teks',
  '/lecture-to-text': 'kuliah-ke-teks',
  '/podcast-transcript-generator': 'pembuat-transkrip-podcast',
  '/interview-transcription': 'transkripsi-wawancara',
  '/vtt-subtitle-generator': 'pembuat-subtitle-vtt',
  '/youtube-subtitle-generator': 'pembuat-subtitle-youtube',
  '/translate-audio-to-english': 'terjemahkan-audio-ke-bahasa-inggris',
  '/guides/srt-vs-vtt': 'guides/srt-atau-vtt',
  '/guides/how-to-add-subtitles-to-a-video': 'guides/cara-menambahkan-subtitle-ke-video',
  '/guides/transcribe-video-without-uploading': 'guides/transkripsi-video-tanpa-mengunggah',
  '/guides/accurate-transcripts': 'guides/transkrip-lebih-akurat',
  '/guides/what-is-whisper': 'guides/apa-itu-whisper',
};
