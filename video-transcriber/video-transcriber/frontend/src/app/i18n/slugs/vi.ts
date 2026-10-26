/**
 * Address slugs of the vi pages: English path -> the path after /vi/ (see docs/in-browser/I18N.md section 2).
 * Latin-script languages: ASCII, lower-case, hyphens, no diacritics, unique, never a reserved word (faq, how-it-works,
 * about, contact, privacy, terms, tools, guides, jobs, logs). Non-Latin scripts keep the English slug (leave pages out).
 * Guides keep the "guides/" segment: '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-localised'.
 */
export const SLUGS: Readonly<Record<string, string>> = {
  '/video-to-text': 'chuyen-video-thanh-van-ban',
  '/audio-to-text': 'chuyen-am-thanh-thanh-van-ban',
  '/mp4-to-text': 'mp4-thanh-van-ban',
  '/mp3-to-text': 'mp3-thanh-van-ban',
  '/srt-subtitle-generator': 'tao-phu-de-srt',
  '/voice-recording-to-text': 'ghi-am-giong-noi-thanh-van-ban',
  '/wav-to-text': 'wav-thanh-van-ban',
  '/m4a-to-text': 'm4a-thanh-van-ban',
  '/webm-to-text': 'webm-thanh-van-ban',
  '/mov-to-text': 'mov-thanh-van-ban',
  '/whatsapp-voice-message-to-text': 'tin-nhan-thoai-whatsapp-thanh-van-ban',
  '/meeting-recording-to-text': 'ban-ghi-cuoc-hop-thanh-van-ban',
  '/lecture-to-text': 'bai-giang-thanh-van-ban',
  '/podcast-transcript-generator': 'tao-ban-go-bang-podcast',
  '/interview-transcription': 'go-bang-phong-van',
  '/vtt-subtitle-generator': 'tao-phu-de-vtt',
  '/youtube-subtitle-generator': 'tao-phu-de-youtube',
  '/translate-audio-to-english': 'dich-am-thanh-sang-tieng-anh',
  '/guides/srt-vs-vtt': 'guides/srt-hay-vtt',
  '/guides/how-to-add-subtitles-to-a-video': 'guides/cach-them-phu-de-vao-video',
  '/guides/transcribe-video-without-uploading':
    'guides/chuyen-video-thanh-van-ban-khong-can-tai-len',
  '/guides/accurate-transcripts': 'guides/ban-go-bang-chinh-xac-hon',
  '/guides/what-is-whisper': 'guides/whisper-la-gi',
};
