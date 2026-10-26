/**
 * The server's option rules (backend/app/schemas.py JobOptions) for the in-browser engine, plus the device rule: a
 * model the device plan does not offer is refused with the plan's reason, never swapped for another one.
 */
import { DEFAULT_OPTIONS, JobOptions } from '../../core/models';
import { LANGUAGES } from './reference-data';

/** Qwen3-ASR runs on the self-hosted server today; the browser port is a later milestone (M5). */
export const QWEN_BROWSER_REASON = 'Qwen3-ASR in the browser is being added; use Whisper for now.';

export class OptionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OptionsError';
  }
}

/** Why a model cannot be used here (null = it can), from the device plan. */
export type ModelGate = (model: string) => string | null;

const ENGINES = new Set(['whisper', 'qwen']);
const ROMANIZERS = new Set(['auto', 'indicxlit', 'basic']);
const SCRIPTS = new Set(['hinglish', 'original']);
const TASKS = new Set(['transcribe', 'translate']);

/** Fills the defaults and checks every field like schemas.py; throws OptionsError with the server's wording. */
export function validateOptions(input: Partial<JobOptions> | null | undefined, gate?: ModelGate, knownModels?: readonly string[]): JobOptions {
  const o: JobOptions = { ...DEFAULT_OPTIONS, ...(input ?? {}) };
  if (!ENGINES.has(o.engine)) throw new OptionsError("engine: Input should be 'whisper' or 'qwen'");
  if (!ROMANIZERS.has(o.romanizer)) throw new OptionsError("romanizer: Input should be 'auto', 'indicxlit' or 'basic'");
  if (!SCRIPTS.has(o.output_script)) throw new OptionsError("output_script: Input should be 'hinglish' or 'original'");
  if (!TASKS.has(o.task)) throw new OptionsError("task must be 'transcribe' or 'translate'");
  if (typeof o.prompt !== 'string') o.prompt = '';
  if (o.prompt.length > 1000) throw new OptionsError('prompt: String should have at most 1000 characters');
  const beam = Number(o.beam_size);
  if (!Number.isInteger(beam) || beam < 1 || beam > 10) throw new OptionsError('beam_size: Input should be between 1 and 10');
  o.beam_size = beam;
  for (const k of ['vad', 'enhance_audio', 'word_timestamps', 'condition_on_previous'] as const) o[k] = !!o[k];
  const lang = (o.language ?? '').trim().toLowerCase() || null;
  if (lang && !(lang in LANGUAGES)) throw new OptionsError(`Unsupported language '${lang}'`);
  o.language = lang;
  if (knownModels && !knownModels.includes(o.model)) throw new OptionsError(`Unknown model '${o.model}'`);
  const isQwen = o.model.startsWith('qwen3-asr-');
  if (isQwen !== (o.engine === 'qwen')) throw new OptionsError('Choose a model belonging to the selected recognition engine.');
  if (isQwen) throw new OptionsError(QWEN_BROWSER_REASON);
  const why = gate?.(o.model);
  if (why) throw new OptionsError(`The model '${o.model}' cannot run in this browser: ${why}.`);
  return o;
}
