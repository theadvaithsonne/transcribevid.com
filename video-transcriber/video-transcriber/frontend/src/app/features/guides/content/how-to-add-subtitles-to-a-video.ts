import { GuideContent } from '../guide.model';

export const CONTENT: GuideContent = {
  h1: 'How to add subtitles to a video, for free',
  lead: 'Making subtitles takes four steps: turn the speech into text, fix the mistakes, export an SRT or VTT file, and attach that file to the video. This guide walks through each step and shows how to attach the file in YouTube, VLC, a video editor, a web page, or permanently into the picture with ffmpeg.',
  readingMinutes: 8,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Make subtitles from your video',
  blocks: [
    {
      title: 'First decide: soft subtitles or burned-in subtitles',
      paragraphs: [
        'There are two ways to put subtitles on a video, and the choice decides which steps you need.',
      ],
      bullets: [
        {
          title: 'Soft subtitles (a separate track).',
          text: 'The subtitles are a file or a track next to the video. Viewers can switch them on and off, pick a language, and you can fix a typo later without touching the video. This is how YouTube, VLC, most players and web pages work. It needs a player that supports subtitle tracks.',
        },
        {
          title: 'Burned-in subtitles (part of the picture).',
          text: 'The text is drawn onto every frame, so it shows everywhere, including on platforms that accept no subtitle file. The price is that nobody can turn it off, you cannot correct it without exporting the video again, and the video has to be re-encoded.',
        },
      ],
      after: [
        'When in doubt, start with soft subtitles. Burn them in only when the place you are posting to has no subtitle upload.',
      ],
    },
    {
      title: 'The four steps at a glance',
      steps: [
        {
          title: 'Transcribe the video',
          text: 'Add the video on the home page, pick the spoken language and let the speech turn into timed text.',
        },
        {
          title: 'Fix the text',
          text: 'Read the transcript and correct names, numbers and unclear words. If the subtitle lines come out too long, choose a shorter Subtitle line length in the Export menu.',
        },
        {
          title: 'Export SRT or VTT',
          text: 'Download the subtitle file. SRT works almost everywhere. VTT is for the video element of a web page.',
        },
        {
          title: 'Attach the file',
          text: 'Upload it to YouTube, load it in your player or editor, or add it to your page. Or burn it into the video.',
        },
      ],
    },
    {
      title: 'Steps 1 and 2: transcribe the video and fix the text',
      paragraphs: [
        'Choose the video on the home page and select the language people speak in it, instead of leaving it on automatic detection. Naming the language is more reliable, especially for short clips and accents. The Standard quality suits most videos. Pick High accuracy for noisy sound or heavy accents.',
        'Keep Word-level timing switched on under More options. It is on by default, and it lets each subtitle start and end with the words instead of at the edges of a long block. When the transcript is ready, play the video next to it and read along. Words the recogniser was less sure of are underlined while the Underline unsure words switch is on (it is on by default), so check those first.',
        'Subtitles are read at speed, so shape the text for the viewer. These are widely used guidelines, not strict rules:',
      ],
      bullets: [
        {
          title: 'Line length.',
          text: 'About 42 characters per line, and no more than two lines at a time. The Export menu has a Subtitle line length choice: Short (32 letters), Standard (42) or Long (56).',
        },
        {
          title: 'On-screen time.',
          text: 'Each subtitle should stay up for at least about a second, and rarely longer than about seven.',
        },
        {
          title: 'Reading speed.',
          text: 'Around 15 to 20 characters per second is comfortable for most adults. If people cannot finish reading before the line changes, shorten the wording or let it stay longer.',
        },
        {
          title: 'Natural breaks.',
          text: 'A good subtitle breaks at the end of a phrase, not in the middle of a name or between an article and its noun. The export wraps long lines for you, so keep each edited line a complete phrase.',
        },
      ],
    },
    {
      title: 'Step 3: choose SRT or VTT',
      paragraphs: [
        'Download SRT unless the subtitles are for a video on your own web page. YouTube, VLC and nearly every editor take SRT. A web page needs VTT, because browsers read subtitle tracks in that format only.',
        'You can download both from the same transcript, so there is no need to decide in advance. The guide to SRT and VTT explains the exact differences, including what is inside each file.',
      ],
    },
    {
      title: 'Step 4: add the file to YouTube, VLC or an editor',
      paragraphs: [
        'Menu names change from time to time, so look for the closest match if a label differs from the one below.',
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: 'Open YouTube Studio, choose the video, open Subtitles, add a language, then choose to upload a file. Pick the option for a file with timing, select your SRT, and publish. YouTube lets you edit the lines afterwards in the same screen.',
        },
        {
          title: 'VLC.',
          text: 'Play the video, then choose Subtitle, Add Subtitle File from the menu and select your SRT. You can also drag the file onto the player window. Or save the SRT next to the video with the same name (lecture.mp4 and lecture.srt) and VLC usually loads it by itself.',
        },
        {
          title: 'Video editors.',
          text: 'Most editors can import an SRT file as a captions or subtitles track, from a menu such as File, Import, or from the captions panel. Once it is on the timeline you can restyle the text. If one format is refused, try the other.',
        },
        {
          title: 'Phones and tablets.',
          text: 'A video player app that supports subtitle files, such as VLC for mobile, can load an SRT file from your files. The built-in gallery player of many phones cannot.',
        },
      ],
    },
    {
      title: 'Adding subtitles to a web page with the track element',
      paragraphs: [
        'On your own website the HTML video element loads subtitles through a track element that points at a WebVTT file. Export VTT, upload it next to the video, and add one line.',
      ],
      code: {
        label: 'A video with a subtitle track',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English" default>
</video>`,
      },
      after: [
        'The default attribute shows the track without the viewer choosing it. Add one track line per language. If the VTT file lives on a different domain from the page, that server must allow cross-origin requests, or the browser will not load it.',
      ],
    },
    {
      title: 'Adding a soft subtitle track to an MP4 with ffmpeg',
      paragraphs: [
        'ffmpeg is a free command-line tool that can pack the subtitles inside the MP4 file, so the video and its subtitles travel as one file. The video and sound are copied untouched, so this is fast and loses no quality. Put the video and the SRT file in one folder and run this command there.',
      ],
      code: {
        label: 'Soft subtitles inside an MP4 (viewers can switch them off)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=eng talk-subtitled.mp4`,
      },
      after: [
        'The -map options choose exactly what goes into the new file: all the video, any sound (the question mark lets the command carry on if there is none), and the subtitle file. Choosing the streams by hand avoids errors on phone and camera files that also hold extra data tracks, which MP4 often cannot copy. The mov_text setting is the subtitle type MP4 files use. The language code is three letters: eng for English, spa for Spanish, hin for Hindi, and so on. Players such as VLC show the track in their subtitle menu.',
      ],
    },
    {
      title: 'Burning subtitles into the picture with ffmpeg',
      paragraphs: [
        'For a platform that accepts only a video, draw the text onto every frame. This re-encodes the video, so it takes longer and the file is made again. The sound is copied as it is. Run it in the folder that holds both files, which avoids trouble with file paths.',
      ],
      code: {
        label: 'Burned-in subtitles (permanent, cannot be switched off)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "To change the look, add a style after the file name, for example subtitles=talk.srt:force_style='FontSize=22' inside the quotes of the command. Keep a copy of the original video, because a burned-in version cannot be turned back into soft subtitles.",
      ],
    },
    {
      title: 'Accessibility, and why you must check the text',
      paragraphs: [
        'Subtitles help people who are deaf or hard of hearing, people watching on a train or in a quiet office with the sound off, people who are still learning the language, and anyone who finds it easier to follow written words. Many viewers switch them on even when they could hear the sound.',
        'Speech recognition is good, but it is not perfect, and a subtitle with a wrong name or number can mislead. Always read the transcript against the video before you publish it, and take extra care with names, figures, technical terms and anything legal or medical. Subtitles that also describe important sounds, such as laughter or a door closing, are more useful to people who cannot hear them, and you can add those by hand while you edit.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between subtitles and captions?',
      answer:
        'Subtitles translate or write out the speech for viewers who can hear the video. Captions also describe sounds, such as music or laughter, for viewers who cannot hear. The files are the same kind of file, so you can add sound descriptions to an SRT file yourself if you want captions.',
    },
    {
      question: 'Do I need special software to add subtitles?',
      answer:
        'No. Upload the SRT file in YouTube Studio, drag it onto VLC, or import it in your editor. Only packing the file into an MP4, or burning the text into the picture, needs a tool such as ffmpeg or a video editor that can export it.',
    },
    {
      question: 'Can I add subtitles in more than one language?',
      answer:
        'Yes, with soft subtitles. Make one file for each language and add each as its own track. This site can write the transcript in the language spoken and can translate speech into English, but you would need to translate the text into other languages yourself or with another tool.',
    },
    {
      question: 'Why are my subtitles out of sync with the video?',
      answer:
        'Either the whole file is shifted, which most players can fix with a subtitle delay setting, or the video was edited after the subtitles were made. Subtitles follow the time of the audio they were made from, so transcribe the final cut of the video.',
    },
  ],
  links: [
    {
      label: 'SRT subtitle generator',
      path: '/srt-subtitle-generator',
      note: 'Start here to turn a video into an SRT file.',
    },
    {
      label: 'SRT vs VTT',
      path: '/guides/srt-vs-vtt',
      note: 'What is inside each file, and which one to download for your case.',
    },
    {
      label: 'VTT subtitle generator',
      path: '/vtt-subtitle-generator',
      note: 'Get the WebVTT file that the video element of a web page needs.',
    },
    {
      label: 'YouTube subtitle generator',
      path: '/youtube-subtitle-generator',
      note: 'The YouTube-specific route, from the file to the Studio upload.',
    },
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Get English subtitles from a video spoken in another language.',
    },
  ],
};
