/**
 * Third-party code and models the in-browser edition downloads at run time (not bundled into the app), with the
 * notices their licences ask for. The legal / licences page links or renders `THIRD_PARTY_NOTICES` (the full text and
 * the reasoning are in docs/in-browser/LICENCES.md). Plain data, no Angular.
 */

export interface ThirdPartyNotice {
  id: string;
  name: string;
  /** SPDX expression */
  licence: string;
  /** what the visitor's browser downloads, and when */
  what: string;
  /** where the exact version can be fetched */
  source: string;
  /** the corresponding source code (GPL) or the project home */
  sourceCode: string;
  /** the sentence the licence asks us to show */
  notice: string;
  licenceUrl: string;
}

export const FFMPEG_NOTICE: ThirdPartyNotice = {
  id: 'ffmpeg-wasm-core',
  name: 'FFmpeg (ffmpeg.wasm core 0.12.10)',
  licence: 'GPL-2.0-or-later',
  what:
    'A 9 MB converter that runs in your browser. It is downloaded only when a file needs it (AVI, WMA, FLV, AMR and ' +
    'other formats your browser cannot open) and only after you agree. It is never part of the website itself.',
  source: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/',
  sourceCode: 'https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.10',
  notice:
    'This converter is FFmpeg (https://ffmpeg.org) compiled to WebAssembly by the ffmpeg.wasm project, licensed under ' +
    'the GNU General Public License version 2 or later. It is used unmodified. Its complete corresponding source code, ' +
    'including the build scripts and the FFmpeg and library sources it is built from, is available at ' +
    'https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.10; on request we will also provide a copy.',
  licenceUrl: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
};

export const QWEN_NOTICE: ThirdPartyNotice = {
  id: 'qwen3-asr',
  name: 'Qwen3-ASR 0.6B / 1.7B (ONNX exports)',
  licence: 'Apache-2.0',
  what:
    'Speech-recognition models downloaded into your browser when you choose Qwen3 ASR (0.9 GB or 1.95 GB, kept in ' +
    'the browser cache until you delete them).',
  source:
    'https://huggingface.co/jiangzhuo9357/Qwen3-ASR-0.6B-ONNX, https://huggingface.co/jiangzhuo9357/Qwen3-ASR-1.7B-ONNX, ' +
    'https://huggingface.co/sorryhyun/qwen3-asr-onnx-gqa',
  sourceCode: 'https://github.com/QwenLM/Qwen3-ASR',
  notice:
    'Qwen3-ASR by the Qwen team, Alibaba Cloud, licensed under the Apache License 2.0. The files used are ONNX ' +
    'conversions of Qwen/Qwen3-ASR-0.6B and Qwen/Qwen3-ASR-1.7B by jiangzhuo9357 (encoder, embeddings, tokenizer) and ' +
    'sorryhyun (decoder), also Apache-2.0; they are used unmodified, pinned to fixed revisions and checked by hash.',
  licenceUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
};

/** Everything the browser may download at run time besides the Whisper models (listed on the model pages). */
export const THIRD_PARTY_NOTICES: readonly ThirdPartyNotice[] = [FFMPEG_NOTICE, QWEN_NOTICE];
