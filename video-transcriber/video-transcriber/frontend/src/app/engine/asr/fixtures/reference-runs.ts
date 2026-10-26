/**
 * Outputs of the spike's reference engine recorded in headless Chrome (scratch asr/results, built by
 * scratch m3-asr/make-fixtures.mjs). Words are [word, start, end, probability] in seconds,
 * window-relative (offset 0). Used as golden data by the asr specs; the browser check compares the
 * ported engine against the same runs.
 */
export type RecordedWord = [string, number, number, number];

export interface RecordedSegment {
  start: number;
  end: number;
  text: string;
  tokens?: number[];
  confidence?: number;
  words: RecordedWord[];
}

export interface RecordedWindow {
  source: string;
  audioSeconds: number;
  text: string;
  tokens: number[];
  tokenLogprobs: number[];
  avgLogprob: number;
  noSpeechProb: number;
  compressionRatio: number;
  consumedSeconds: number;
  singleTimestampEnding: boolean;
  segments: RecordedSegment[];
}

export interface RecordedRun {
  source: string;
  text: string;
  wer: number;
  nWords: number;
  segments: RecordedSegment[];
}

export const TINY_WASM_PASSAGE_C: RecordedWindow = {
  source: 'results/ref-smoke-rerun2-tiny-wasm.json (tiny WASM q8, passage-c, greedy, words)',
  audioSeconds: 6.9581875,
  text: 'Please remember to submit your report by Friday April 12, and send a copy to the Finance Team.',
  tokens: [
    50364, 2555, 1604, 281, 10315, 428, 2275, 538, 6984, 6929, 2272, 11, 293, 2845, 257, 5055, 281,
    264, 25765, 7606, 13, 50714,
  ],
  tokenLogprobs: [
    -0.06670858711004257, -0.06468547880649567, -0.03616165369749069, -0.0007348607177846134,
    -0.012216602452099323, -0.005838936660438776, -0.01873042993247509, -0.0052071730606257915,
    -0.010560330003499985, -0.44338542222976685, -0.04356399178504944, -0.8919426798820496,
    -0.07057835906744003, -0.03085528314113617, -0.013924796134233475, -0.011378442868590355,
    -0.0043883356265723705, -0.012613208964467049, -0.43506935238838196, -0.5421472191810608,
    -0.1714422106742859, -2.103825092315674, -0.005902391858398914,
  ],
  avgLogprob: -0.21747221037208952,
  noSpeechProb: 0.002219831679661281,
  compressionRatio: 1.0561797752808988,
  consumedSeconds: 6.9581875,
  singleTimestampEnding: true,
  segments: [
    {
      start: 0,
      end: 6.3,
      text: 'Please remember to submit your report by Friday April 12, and send a copy to the Finance Team.',
      tokens: [
        2555, 1604, 281, 10315, 428, 2275, 538, 6984, 6929, 2272, 11, 293, 2845, 257, 5055, 281,
        264, 25765, 7606, 13,
      ],
      confidence: 0.9073519061009089,
      words: [
        [' Please', 0, 0.44, 0.893986165523529],
        [' remember', 0.44, 0.92, 0.9771029353141785],
        [' to', 0.92, 1.18, 0.9993045330047607],
        [' submit', 1.18, 1.44, 0.9902442693710327],
        [' your', 1.44, 1.74, 0.9925701022148132],
        [' report', 1.74, 2, 0.9900319576263428],
        [' by', 2, 2.3, 0.9961581826210022],
        [' Friday', 2.3, 2.64, 0.9874095320701599],
        [' April', 2.64, 3.04, 0.7875369787216187],
        [' 12,', 3.04, 3.58, 0.9419633150100708],
        [' and', 4.16, 4.38, 0.9876938462257385],
        [' send', 4.38, 4.62, 0.9517859816551208],
        [' a', 4.62, 4.86, 0.9861669540405273],
        [' copy', 4.86, 5.02, 0.9910829663276672],
        [' to', 5.02, 5.26, 0.998029887676239],
        [' the', 5.26, 5.4, 0.9925345182418823],
        [' Finance', 5.4, 5.78, 0.44838497042655945],
        [' Team.', 5.78, 6.3, 0.4203472137451172],
      ],
    },
  ],
};

export const TINY_WASM_PASSAGE_B: RecordedRun = {
  source: 'results/qual-tiny-wasm-q8-v2.json (tiny WASM q8, passage-b, greedy, words)',
  text: "Welcome back to the show. Last week we talked about gardening, and today we're moving on to cooking. I've got three simple recipes for you, and each one takes less than 20 minutes. Are you ready to get started? Let's begin with the soup, because it's the easiest of them all, and you probably have most of the ingredients in your kitchen already.",
  wer: 0,
  nWords: 63,
  segments: [
    {
      start: 0,
      end: 1.54,
      text: 'Welcome back to the show.',
      words: [
        [' Welcome', 0, 0.48, 0.91],
        [' back', 0.48, 0.8, 0.992],
        [' to', 0.8, 0.98, 0.999],
        [' the', 0.98, 1.12, 0.987],
        [' show.', 1.12, 1.54, 0.993],
      ],
    },
    {
      start: 2.4,
      end: 6.14,
      text: "Last week we talked about gardening, and today we're moving on to cooking.",
      words: [
        [' Last', 2.4, 2.46, 0.983],
        [' week', 2.46, 2.74, 0.995],
        [' we', 2.74, 2.92, 0.996],
        [' talked', 2.92, 3.2, 0.999],
        [' about', 3.2, 3.54, 1],
        [' gardening,', 3.54, 3.9, 0.982],
        [' and', 4.42, 4.56, 0.994],
        [' today', 4.56, 4.86, 0.997],
        [" we're", 4.86, 5.04, 0.887],
        [' moving', 5.04, 5.38, 0.997],
        [' on', 5.38, 5.62, 0.92],
        [' to', 5.62, 5.74, 0.993],
        [' cooking.', 5.74, 6.14, 0.995],
      ],
    },
    {
      start: 7.04,
      end: 11.7,
      text: "I've got three simple recipes for you, and each one takes less than 20 minutes.",
      words: [
        [" I've", 7.04, 7.28, 0.976],
        [' got', 7.28, 7.44, 0.996],
        [' three', 7.44, 7.7, 0.855],
        [' simple', 7.7, 8.1, 0.997],
        [' recipes', 8.1, 8.52, 0.996],
        [' for', 8.52, 8.9, 0.999],
        [' you,', 8.9, 9.12, 0.999],
        [' and', 9.44, 9.66, 0.987],
        [' each', 9.66, 9.86, 0.996],
        [' one', 9.86, 10.06, 0.997],
        [' takes', 10.06, 10.36, 0.995],
        [' less', 10.36, 10.68, 0.996],
        [' than', 10.68, 10.84, 0.995],
        [' 20', 10.84, 11.2, 0.887],
        [' minutes.', 11.2, 11.7, 0.986],
      ],
    },
    {
      start: 12.56,
      end: 13.9,
      text: 'Are you ready to get started?',
      words: [
        [' Are', 12.56, 12.72, 0.974],
        [' you', 12.72, 12.9, 0.998],
        [' ready', 12.9, 13.12, 0.999],
        [' to', 13.12, 13.28, 0.999],
        [' get', 13.28, 13.58, 0.998],
        [' started?', 13.58, 13.9, 0.999],
      ],
    },
    {
      start: 14.76,
      end: 22,
      text: "Let's begin with the soup, because it's the easiest of them all, and you probably have most of the ingredients in your kitchen already.",
      words: [
        [" Let's", 14.76, 15.06, 0.991],
        [' begin', 15.06, 15.32, 0.997],
        [' with', 15.32, 15.54, 0.999],
        [' the', 15.54, 15.7, 0.99],
        [' soup,', 15.7, 15.94, 0.976],
        [' because', 16.38, 16.78, 0.998],
        [" it's", 16.78, 17.1, 0.989],
        [' the', 17.1, 17.18, 0.999],
        [' easiest', 17.18, 17.54, 0.994],
        [' of', 17.54, 17.86, 0.99],
        [' them', 17.86, 18.08, 0.99],
        [' all,', 18.08, 18.32, 0.998],
        [' and', 18.56, 18.86, 0.996],
        [' you', 18.86, 18.98, 0.995],
        [' probably', 18.98, 19.34, 0.995],
        [' have', 19.34, 19.66, 0.997],
        [' most', 19.66, 19.96, 0.991],
        [' of', 19.96, 20.1, 0.998],
        [' the', 20.1, 20.28, 0.999],
        [' ingredients', 20.28, 20.62, 0.999],
        [' in', 20.62, 20.98, 0.997],
        [' your', 20.98, 21.16, 0.996],
        [' kitchen', 21.16, 21.46, 0.993],
        [' already.', 21.46, 22, 0.996],
      ],
    },
  ],
};

export const BASE_WEBGPU_PASSAGE_B: RecordedRun = {
  source: 'results/qual-base-webgpu-fp16-v2.json (base WebGPU fp16, passage-b, greedy, words)',
  text: "Welcome back to the show. Last week we talked about gardening, and today we're moving on to cooking. I've got three simple recipes for you, and each one takes less than 20 minutes. Are you ready to get started? Let's begin with the soup, because it's the easiest of them all, and you probably have most of the ingredients in your kitchen already.",
  wer: 0,
  nWords: 63,
  segments: [
    {
      start: 0,
      end: 5.92,
      text: "Welcome back to the show. Last week we talked about gardening, and today we're moving on to cooking.",
      words: [
        [' Welcome', 0, 0.32, 0.92],
        [' back', 0.32, 0.62, 0.982],
        [' to', 0.62, 0.86, 0.999],
        [' the', 0.86, 0.96, 0.965],
        [' show.', 0.96, 1.2, 0.991],
        [' Last', 1.78, 2.32, 0.983],
        [' week', 2.32, 2.6, 0.997],
        [' we', 2.6, 2.82, 0.994],
        [' talked', 2.82, 3.04, 0.998],
        [' about', 3.04, 3.4, 0.999],
        [' gardening,', 3.4, 3.76, 0.993],
        [' and', 4.22, 4.48, 0.993],
        [' today', 4.48, 4.72, 0.998],
        [" we're", 4.72, 4.96, 0.989],
        [' moving', 4.96, 5.24, 0.998],
        [' on', 5.24, 5.46, 0.934],
        [' to', 5.46, 5.62, 0.999],
        [' cooking.', 5.62, 5.92, 0.991],
      ],
    },
    {
      start: 6.78,
      end: 11.4,
      text: "I've got three simple recipes for you, and each one takes less than 20 minutes.",
      words: [
        [" I've", 6.78, 7.14, 0.986],
        [' got', 7.14, 7.26, 0.998],
        [' three', 7.26, 7.54, 0.927],
        [' simple', 7.54, 7.94, 0.999],
        [' recipes', 7.94, 8.26, 0.999],
        [' for', 8.26, 8.74, 0.999],
        [' you,', 8.74, 8.94, 0.998],
        [' and', 9.36, 9.56, 0.995],
        [' each', 9.56, 9.76, 0.999],
        [' one', 9.76, 9.96, 0.998],
        [' takes', 9.96, 10.24, 0.999],
        [' less', 10.24, 10.5, 0.999],
        [' than', 10.5, 10.76, 0.998],
        [' 20', 10.76, 11.1, 0.898],
        [' minutes.', 11.1, 11.4, 0.998],
      ],
    },
    {
      start: 12.28,
      end: 18.14,
      text: "Are you ready to get started? Let's begin with the soup, because it's the easiest of them all,",
      words: [
        [' Are', 12.28, 12.62, 0.985],
        [' you', 12.62, 12.78, 0.997],
        [' ready', 12.78, 12.98, 0.999],
        [' to', 12.98, 13.2, 0.999],
        [' get', 13.2, 13.36, 0.998],
        [' started?', 13.36, 13.7, 0.998],
        [" Let's", 14.42, 14.98, 0.991],
        [' begin', 14.98, 15.2, 0.997],
        [' with', 15.2, 15.44, 1],
        [' the', 15.44, 15.56, 0.996],
        [' soup,', 15.56, 15.78, 0.993],
        [' because', 16.22, 16.64, 0.997],
        [" it's", 16.64, 16.94, 0.996],
        [' the', 16.94, 17.08, 0.997],
        [' easiest', 17.08, 17.44, 0.996],
        [' of', 17.44, 17.72, 1],
        [' them', 17.72, 17.84, 1],
        [' all,', 17.84, 18.14, 0.998],
      ],
    },
    {
      start: 18.56,
      end: 21.82,
      text: 'and you probably have most of the ingredients in your kitchen already.',
      words: [
        [' and', 18.56, 18.68, 0.995],
        [' you', 18.68, 18.82, 0.999],
        [' probably', 18.82, 19.24, 0.995],
        [' have', 19.24, 19.52, 1],
        [' most', 19.52, 19.8, 0.998],
        [' of', 19.8, 20, 1],
        [' the', 20, 20.16, 1],
        [' ingredients', 20.16, 20.6, 0.997],
        [' in', 20.6, 20.86, 1],
        [' your', 20.86, 21.02, 0.999],
        [' kitchen', 21.02, 21.32, 0.997],
        [' already.', 21.32, 21.82, 0.991],
      ],
    },
  ],
};

export const BASE_WEBGPU_PASSAGE_C: RecordedRun = {
  source: 'results/qual-base-webgpu-fp16-v2.json (base WebGPU fp16, passage-c, greedy, words)',
  text: 'Please remember to submit your report by Friday April 12, and send a copy to the finance team.',
  wer: 0.05555555555555555,
  nWords: 18,
  segments: [
    {
      start: 0,
      end: 6.12,
      text: 'Please remember to submit your report by Friday April 12, and send a copy to the finance team.',
      words: [
        [' Please', 0, 0.36, 0.905],
        [' remember', 0.36, 0.8, 0.972],
        [' to', 0.8, 1.02, 1],
        [' submit', 1.02, 1.32, 0.995],
        [' your', 1.32, 1.54, 0.997],
        [' report', 1.54, 1.82, 0.941],
        [' by', 1.82, 2.14, 0.994],
        [' Friday', 2.14, 2.48, 0.976],
        [' April', 2.48, 2.88, 0.509],
        [' 12,', 2.88, 3.42, 0.99],
        [' and', 3.94, 4.22, 0.99],
        [' send', 4.22, 4.42, 0.997],
        [' a', 4.42, 4.62, 1],
        [' copy', 4.62, 4.92, 0.997],
        [' to', 4.92, 5.14, 0.999],
        [' the', 5.14, 5.26, 0.975],
        [' finance', 5.26, 5.6, 0.614],
        [' team.', 5.6, 6.12, 0.999],
      ],
    },
  ],
};
