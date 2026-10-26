import { DEFAULT_OPTIONS } from '../../core/models';
import { FakeEngine, engineSegment, makeRunner, mediaFile, playSuccess, settle } from '../../testing/engine-fakes';
import type { RunnerEvent } from './job-runner';
import { QWEN_BROWSER_REASON } from './options';

describe('JobRunner (the in-browser job queue)', () => {
  it('creates a queued job like POST /api/jobs: title from the file name, media kind by extension, file stored', async () => {
    const { runner, store } = await makeRunner();
    const job = await runner.create(mediaFile('My Talk.final.mp3'), { ...DEFAULT_OPTIONS, language: 'DE ' });
    expect(job).toMatchObject({ title: 'My Talk.final', filename: 'My Talk.final.mp3', status: 'queued', media_kind: 'audio', size_bytes: 3 });
    expect(job.options.language).toBe('de');
    expect(await store.getMedia(job.id)).toBeInstanceOf(Blob);
    expect((await runner.create(mediaFile('clip.mov'), {})).media_kind).toBe('video');
  });

  it('refuses an empty file (400), an unknown model, Qwen (with the exact reason) and a model the device cannot run (422)', async () => {
    const { runner } = await makeRunner();
    await expect(runner.create(mediaFile('x.mp3', ''), {})).rejects.toMatchObject({ status: 400, message: 'The uploaded file is empty.' });
    await expect(runner.create(mediaFile(), { model: 'huge' })).rejects.toMatchObject({ status: 422, message: "Unknown model 'huge'" });
    await expect(runner.create(mediaFile(), { engine: 'qwen', model: 'qwen3-asr-0.6b' })).rejects.toMatchObject({
      status: 422,
      message: QWEN_BROWSER_REASON,
    });
    await expect(runner.create(mediaFile(), { model: 'large-v3' })).rejects.toMatchObject({
      status: 422,
      message: "The model 'large-v3' cannot run in this browser: needs 8 GB.",
    });
    await expect(runner.create(mediaFile(), { beam_size: 11 })).rejects.toMatchObject({ status: 422 });
  });

  it('runs one job at a time, in order, and holds the wake lock while it works', async () => {
    const { runner, engine, store, wake } = await makeRunner();
    const a = await runner.create(mediaFile('a.mp3'), {});
    const b = await runner.create(mediaFile('b.mp3'), {});
    await settle();
    expect(engine.runs.map((r) => r.req.id)).toEqual([a.id]);
    expect((await store.get(a.id))!.status).toBe('running');
    expect((await store.get(b.id))!.status).toBe('queued');
    expect(wake.starts).toBe(1);
    playSuccess(engine.last);
    await settle();
    expect(engine.runs.map((r) => r.req.id)).toEqual([a.id, b.id]);
    playSuccess(engine.last);
    await settle();
    expect((await store.get(b.id))!.status).toBe('done');
    expect(wake.stops).toBeGreaterThanOrEqual(1);
  });

  it('follows the phases, the model download, progress + ETA (jobs.py rules) and finishes with stats', async () => {
    let t = 1_000_000;
    const { runner, engine, store } = await makeRunner({ now: () => t });
    const events: RunnerEvent[] = [];
    runner.subscribe((e) => events.push(e));
    const job = await runner.create(mediaFile(), { output_script: 'original' });
    await settle();
    const run = engine.last;
    const id = run.req.id;
    run.onEvent({ type: 'phase', id, phase: 'extracting', progress: 0, eta: null });
    run.onEvent({ type: 'phase', id, phase: 'loading_model', progress: 0, eta: null });
    run.onEvent({ type: 'progress', id, kind: 'download', loaded: 40, total: 100, file: 'decoder_model_merged.onnx' });
    await settle();
    expect((await store.get(id))!.phase).toBe('loading_model');
    expect(runner.download(id)).toEqual({ loaded: 40, total: 100, file: 'decoder_model_merged.onnx' });
    run.onEvent({ type: 'phase', id, phase: 'transcribing', progress: 0, eta: null });
    await settle();
    expect(runner.download(id)).toBeNull();
    t += 10_000; // 10 s transcribing, 25 % done -> 30 s left
    run.onEvent({ type: 'segments', id, segments: [engineSegment(0, 0, 2, 'one two')], since: 0, progress: 0.25, language: 'en', duration: 8 });
    await settle();
    let stored = (await store.get(id))!;
    expect(stored).toMatchObject({ progress: 0.25, eta_seconds: 30, language: 'en', duration: 8, segment_count: 1 });
    expect(events.some((e) => e.type === 'segments' && e.since === 0 && e.segments.length === 1)).toBe(true);
    run.resolve({ language: 'en', language_probability: 0.912, duration: 8, dropped: { empty: 0, no_speech: 0, repetition: 0 }, windows: 1 });
    await settle();
    stored = (await store.get(job.id))!;
    expect(stored).toMatchObject({ status: 'done', progress: 1, phase: null, eta_seconds: null, language_probability: 0.912 });
    expect(stored.stats?.word_count).toBe(2);
    expect(stored.finished_at).not.toBeNull();
  });

  it('converts Hindi / English to Hinglish on the page (engine.py rule), not other languages or translations', async () => {
    const { runner, engine, store, hinglish } = await makeRunner();
    const hi = await runner.create(mediaFile(), { output_script: 'hinglish' });
    await settle();
    playSuccess(engine.last, [engineSegment(0, 0, 1, 'namaste')], 'hi');
    await settle();
    expect((await store.get(hi.id))!.segments[0].text).toBe('namaste (roman)');
    const de = await runner.create(mediaFile(), { output_script: 'hinglish' });
    await settle();
    playSuccess(engine.last, [engineSegment(0, 0, 1, 'hallo')], 'de');
    await settle();
    expect((await store.get(de.id))!.segments[0].text).toBe('hallo');
    expect(hinglish.calls.filter((c) => c.kind === 'convert')).toHaveLength(1);
  });

  it('cancels a queued job at once; a running one cooperatively, keeping the text found so far', async () => {
    const { runner, engine, store } = await makeRunner();
    const a = await runner.create(mediaFile('a.mp3'), {});
    const b = await runner.create(mediaFile('b.mp3'), {});
    await settle();
    expect((await runner.cancel(b.id)).status).toBe('cancelled');
    const running = await runner.cancel(a.id);
    expect(running).toMatchObject({ status: 'running', cancel_requested: true });
    expect(engine.cancelled).toEqual([a.id]);
    const run = engine.last;
    run.onEvent({ type: 'segments', id: a.id, segments: [engineSegment(0, 0, 1, 'kept')], since: 0, progress: 0.1, language: 'en', duration: 9 });
    await settle();
    run.reject(FakeEngine.cancelledError());
    await settle();
    const done = (await store.get(a.id))!;
    expect(done).toMatchObject({ status: 'cancelled', cancel_requested: false });
    expect(done.segments.map((s) => s.text)).toEqual(['kept']);
    expect(engine.runs).toHaveLength(1); // b never ran
  });

  it('a failed run ends in "error" with the engine\'s user message', async () => {
    const { runner, engine, store } = await makeRunner();
    const job = await runner.create(mediaFile(), {});
    await settle();
    engine.last.reject({ cancelled: false, userMessage: 'This file is empty (0 bytes).', technical: 'EMPTY_FILE' });
    await settle();
    expect(await store.get(job.id)).toMatchObject({ status: 'error', error: 'This file is empty (0 bytes).' });
  });

  it('delete: refused while running (and a cancel is requested), allowed otherwise; unknown ids are 404', async () => {
    const { runner, engine, store } = await makeRunner();
    const job = await runner.create(mediaFile(), {});
    await settle();
    await expect(runner.delete(job.id)).rejects.toMatchObject({ status: 409, message: 'Cancel the running job first.' });
    expect(engine.cancelled).toContain(job.id);
    playSuccess(engine.last);
    await settle();
    await runner.delete(job.id);
    expect(await store.get(job.id)).toBeNull();
    await expect(runner.delete(job.id)).rejects.toMatchObject({ status: 404 });
  });

  it('rerun: refused while in progress; otherwise a new job with the same file, merged options, explicit null language', async () => {
    const { runner, engine, store } = await makeRunner();
    const job = await runner.create(mediaFile(), { language: 'en' });
    await settle();
    await expect(runner.rerun(job.id, {})).rejects.toMatchObject({ status: 409, message: 'This job is still in progress.' });
    playSuccess(engine.last);
    await settle();
    await runner.patchJob(job.id, { title: 'Renamed' });
    const again = await runner.rerun(job.id, { model: 'base', language: null });
    expect(again.id).not.toBe(job.id);
    expect(again).toMatchObject({ title: 'Renamed', status: 'queued', segment_count: 0 });
    expect(again.options).toMatchObject({ model: 'base', language: null });
    expect(await store.getMedia(again.id)).toBeInstanceOf(Blob);
    await expect(runner.rerun('nope', {})).rejects.toMatchObject({ status: 404 });
  });

  it('PATCH: title cleaned like jobs.py; edits only when done (applyEdits); style only when finished', async () => {
    const { runner, engine, store, hinglish } = await makeRunner();
    const job = await runner.create(mediaFile(), {});
    await settle();
    await expect(runner.patchJob(job.id, { segments: [{ id: 0, text: 'x' }] })).rejects.toMatchObject({
      status: 409,
      message: 'The transcript is not finished yet.',
    });
    await expect(runner.patchJob(job.id, { output_script: 'original' })).rejects.toMatchObject({ status: 409 });
    playSuccess(engine.last, [engineSegment(0, 0, 1, 'hello there'), engineSegment(1, 1, 2, 'second line')], 'en');
    await settle();
    expect((await runner.patchJob(job.id, { title: '   ' })).title).toBe(job.title);
    expect((await runner.patchJob(job.id, { title: `  ${'a'.repeat(250)} ` })).title).toHaveLength(200);
    const edited = await runner.patchJob(job.id, { segments: [{ id: 0, text: ' changed ' }, { id: 1, text: 'second line', deleted: true }] });
    expect(edited.segments).toHaveLength(1);
    expect(edited.segments[0]).toMatchObject({ text: 'changed', edited: true, words: null });
    expect(edited.stats?.word_count).toBe(1);
    const styled = await runner.patchJob(job.id, { output_script: 'original', romanizer: 'basic' });
    expect(styled.options).toMatchObject({ output_script: 'original', romanizer: 'basic' });
    expect(hinglish.calls.at(-1)).toMatchObject({ kind: 'restyle', script: 'original', romanizer: 'basic' });
    expect((await store.get(job.id))!.segments[0].text).toBe('changed'); // the edited line is kept
  });

  it('style change of a translation is refused (409)', async () => {
    const { runner, engine } = await makeRunner();
    const job = await runner.create(mediaFile(), { task: 'translate' });
    await settle();
    playSuccess(engine.last);
    await settle();
    await expect(runner.patchJob(job.id, { output_script: 'hinglish' })).rejects.toMatchObject({
      status: 409,
      message: 'This transcript is an English translation; its script cannot be changed.',
    });
  });

  it('passes the device plan and the job options to the engine', async () => {
    const { runner, engine } = await makeRunner();
    await runner.create(mediaFile(), { model: 'tiny', beam_size: 1 });
    await settle();
    expect(engine.last.req.plan).toEqual({ backend: 'wasm', shaderF16: false, recycleEvery: 0 });
    expect(engine.last.req.options).toMatchObject({ model: 'tiny', beam_size: 1 });
    expect(engine.last.req.file).toBeInstanceOf(Blob);
  });
});
