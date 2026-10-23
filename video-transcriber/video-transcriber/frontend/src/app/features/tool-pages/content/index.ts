import { ToolPageContent } from '../tool-page.model';
import { CONTENT as AUDIO_TO_TEXT } from './audio-to-text';
import { CONTENT as MP3_TO_TEXT } from './mp3-to-text';
import { CONTENT as MP4_TO_TEXT } from './mp4-to-text';
import { CONTENT as SRT_SUBTITLE_GENERATOR } from './srt-subtitle-generator';
import { CONTENT as VIDEO_TO_TEXT } from './video-to-text';
import { CONTENT as VOICE_RECORDING_TO_TEXT } from './voice-recording-to-text';

/** The text of every tool page, by route path (no leading slash). To add a page: a file here, an entry in tool-pages.list.ts and a route. */
export const TOOL_CONTENT: Readonly<Record<string, ToolPageContent>> = {
  'video-to-text': VIDEO_TO_TEXT,
  'audio-to-text': AUDIO_TO_TEXT,
  'mp4-to-text': MP4_TO_TEXT,
  'mp3-to-text': MP3_TO_TEXT,
  'srt-subtitle-generator': SRT_SUBTITLE_GENERATOR,
  'voice-recording-to-text': VOICE_RECORDING_TO_TEXT,
};
