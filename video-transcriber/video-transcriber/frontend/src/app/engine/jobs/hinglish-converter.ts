/**
 * The page's Hinglish step (engine.py:513-515 and jobs.py restyle): the engine worker hands over recognised segments,
 * this converts them with the shared, lazily loaded IndicXlit worker (engine/hinglish), or with the basic rules.
 */
import type { JobOptions, Segment } from '../../core/models';
import { NeuralConverter, RomanizerName, Segment as HSegment, convertSegment, restyleSegment } from '../hinglish/hinglish';
import type { IndicXlitClient } from '../hinglish/indicxlit-client';

export interface HinglishConverter {
  /** Converts freshly recognised segments (they already carry original_text). */
  convert(segments: readonly Segment[], romanizer: JobOptions['romanizer']): Promise<Segment[]>;
  /** "Apply style only": reconverts the stored recognition text; edited lines are kept as they are. */
  restyle(segments: readonly Segment[], outputScript: JobOptions['output_script'], romanizer: JobOptions['romanizer']): Promise<Segment[]>;
  dispose(): void;
}

/** Where the page serves the IndicXlit model (frontend/public/models/indicxlit). */
export const INDICXLIT_BASE = '/models/indicxlit/';

export interface IndicXlitHinglishOptions {
  base?: string;
  /** creates the client (tests pass a fake); default: IndicXlitClient with one worker, imported on first use */
  client?: () => Promise<Pick<IndicXlitClient, 'load' | 'transliterate' | 'dispose'>>;
  log?: (level: 'INFO' | 'WARNING', message: string) => void;
}

/**
 * IndicXlit when it loads (about 12 MB, once), else the basic rules for 'auto'. 'indicxlit' without the model fails
 * the way the server does (RomanizerUnavailable).
 */
export class IndicXlitHinglish implements HinglishConverter {
  private neural: Promise<NeuralConverter | null> | null = null;
  private client: Pick<IndicXlitClient, 'load' | 'transliterate' | 'dispose'> | null = null;

  constructor(private readonly options: IndicXlitHinglishOptions = {}) {}

  private load(): Promise<NeuralConverter | null> {
    this.neural ??= (async () => {
      try {
        const make =
          this.options.client ??
          (async () => {
            const { IndicXlitClient } = await import('../hinglish/indicxlit-client');
            return new IndicXlitClient({ workers: 1 });
          });
        const client = await make();
        await client.load(this.options.base ?? INDICXLIT_BASE);
        this.client = client;
        this.options.log?.('INFO', 'IndicXlit converter loaded');
        return client as NeuralConverter;
      } catch (e) {
        this.options.log?.('WARNING', `IndicXlit could not be loaded: ${(e as Error)?.message ?? e}`);
        this.neural = null; // try again next time (the network may be back)
        return null;
      }
    })();
    return this.neural;
  }

  private async converter(romanizer: RomanizerName): Promise<NeuralConverter | null> {
    return romanizer === 'basic' ? null : this.load();
  }

  async convert(segments: readonly Segment[], romanizer: JobOptions['romanizer']): Promise<Segment[]> {
    const method = (romanizer ?? 'auto') as RomanizerName;
    const neural = await this.converter(method);
    const out: Segment[] = [];
    for (const s of segments) out.push((await convertSegment(s as unknown as HSegment, method, { neural })) as unknown as Segment);
    return out;
  }

  async restyle(
    segments: readonly Segment[],
    outputScript: JobOptions['output_script'],
    romanizer: JobOptions['romanizer'],
  ): Promise<Segment[]> {
    const method = (romanizer ?? 'auto') as RomanizerName;
    const neural = outputScript === 'hinglish' ? await this.converter(method) : null;
    const out: Segment[] = [];
    for (const s of segments) {
      out.push((await restyleSegment(s as unknown as HSegment, outputScript, method, { neural })) as unknown as Segment);
    }
    return out;
  }

  dispose(): void {
    this.client?.dispose();
    this.client = null;
    this.neural = null;
  }
}
