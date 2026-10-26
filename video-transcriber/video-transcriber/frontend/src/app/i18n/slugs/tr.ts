/**
 * Address slugs of the tr pages: English path -> the path after /tr/ (see docs/in-browser/I18N.md section 2).
 * Latin-script languages: ASCII, lower-case, hyphens, no diacritics, unique, never a reserved word (faq, how-it-works,
 * about, contact, privacy, terms, tools, guides, jobs, logs). Non-Latin scripts keep the English slug (leave pages out).
 * Guides keep the "guides/" segment: '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-localised'.
 */
export const SLUGS: Readonly<Record<string, string>> = {
  '/video-to-text': 'video-yaziya-cevirme',
  '/audio-to-text': 'ses-yaziya-cevirme',
  '/mp4-to-text': 'mp4-yaziya-cevirme',
  '/mp3-to-text': 'mp3-yaziya-cevirme',
  '/srt-subtitle-generator': 'srt-altyazi-olusturucu',
  '/voice-recording-to-text': 'ses-kaydini-yaziya-dokme',
  '/wav-to-text': 'wav-yaziya-cevirme',
  '/m4a-to-text': 'm4a-yaziya-cevirme',
  '/webm-to-text': 'webm-yaziya-cevirme',
  '/mov-to-text': 'mov-yaziya-cevirme',
  '/whatsapp-voice-message-to-text': 'whatsapp-ses-mesaji-yaziya-cevirme',
  '/meeting-recording-to-text': 'zoom-teams-meet-kaydi-yaziya-cevirme',
  '/lecture-to-text': 'ders-kaydi-yaziya-cevirme',
  '/podcast-transcript-generator': 'podcast-transkript-olusturucu',
  '/interview-transcription': 'roportaj-yaziya-dokme',
  '/vtt-subtitle-generator': 'vtt-altyazi-olusturucu',
  '/youtube-subtitle-generator': 'youtube-altyazi-olusturucu',
  '/translate-audio-to-english': 'sesi-ingilizceye-cevirme',
  '/guides/srt-vs-vtt': 'guides/srt-ve-vtt-farki',
  '/guides/how-to-add-subtitles-to-a-video': 'guides/videoya-altyazi-ekleme',
  '/guides/transcribe-video-without-uploading': 'guides/videoyu-yuklemeden-yaziya-dokme',
  '/guides/accurate-transcripts': 'guides/daha-dogru-transkript',
  '/guides/what-is-whisper': 'guides/whisper-nedir',
};
