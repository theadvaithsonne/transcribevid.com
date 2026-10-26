import { ToolPageContent } from '../tool-page.model';
import { CONTENT as AUDIO_TO_TEXT } from './audio-to-text';
import { CONTENT as HINDI_AUDIO_TO_TEXT } from './hindi-audio-to-text';
import { CONTENT as HINGLISH_TRANSCRIPTION } from './hinglish-transcription';
import { CONTENT as INTERVIEW_TRANSCRIPTION } from './interview-transcription';
import { CONTENT as LECTURE_TO_TEXT } from './lecture-to-text';
import { CONTENT as M4A_TO_TEXT } from './m4a-to-text';
import { CONTENT as MEETING_RECORDING_TO_TEXT } from './meeting-recording-to-text';
import { CONTENT as MP3_TO_TEXT } from './mp3-to-text';
import { CONTENT as MP4_TO_TEXT } from './mp4-to-text';
import { CONTENT as OTTER_AI_ALTERNATIVE } from './otter-ai-alternative';
import { CONTENT as PODCAST_TO_TEXT } from './podcast-to-text';
import { CONTENT as PRIVATE_TRANSCRIPTION } from './private-transcription';
import { CONTENT as SRT_SUBTITLE_GENERATOR } from './srt-subtitle-generator';
import { CONTENT as SUBTITLE_GENERATOR_FOR_REELS } from './subtitle-generator-for-reels';
import { CONTENT as TRANSLATE_HINDI_AUDIO_TO_ENGLISH } from './translate-hindi-audio-to-english';
import { CONTENT as TURBOSCRIBE_ALTERNATIVE } from './turboscribe-alternative';
import { CONTENT as VIDEO_TO_TEXT } from './video-to-text';
import { CONTENT as VOICE_RECORDING_TO_TEXT } from './voice-recording-to-text';
import { CONTENT as WAV_TO_TEXT } from './wav-to-text';
import { CONTENT as WHATSAPP_VOICE_NOTE_TO_TEXT } from './whatsapp-voice-note-to-text';

/** The text of every tool page, by route path (no leading slash). To add a page: a file here, an entry in tool-pages.list.ts and a route. */
export const TOOL_CONTENT: Readonly<Record<string, ToolPageContent>> = {
  'video-to-text': VIDEO_TO_TEXT,
  'audio-to-text': AUDIO_TO_TEXT,
  'mp4-to-text': MP4_TO_TEXT,
  'mp3-to-text': MP3_TO_TEXT,
  'wav-to-text': WAV_TO_TEXT,
  'm4a-to-text': M4A_TO_TEXT,
  'hindi-audio-to-text': HINDI_AUDIO_TO_TEXT,
  'hinglish-transcription': HINGLISH_TRANSCRIPTION,
  'translate-hindi-audio-to-english': TRANSLATE_HINDI_AUDIO_TO_ENGLISH,
  'srt-subtitle-generator': SRT_SUBTITLE_GENERATOR,
  'subtitle-generator-for-reels': SUBTITLE_GENERATOR_FOR_REELS,
  'voice-recording-to-text': VOICE_RECORDING_TO_TEXT,
  'whatsapp-voice-note-to-text': WHATSAPP_VOICE_NOTE_TO_TEXT,
  'meeting-recording-to-text': MEETING_RECORDING_TO_TEXT,
  'interview-transcription': INTERVIEW_TRANSCRIPTION,
  'lecture-to-text': LECTURE_TO_TEXT,
  'podcast-to-text': PODCAST_TO_TEXT,
  'private-transcription': PRIVATE_TRANSCRIPTION,
  'turboscribe-alternative': TURBOSCRIBE_ALTERNATIVE,
  'otter-ai-alternative': OTTER_AI_ALTERNATIVE,
};
