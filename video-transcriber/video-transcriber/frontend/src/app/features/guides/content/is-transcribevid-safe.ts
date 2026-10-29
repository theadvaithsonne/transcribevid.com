import { GuideContent } from '../guide.model';

/** Every statement here is one the site's own privacy policy and code make (checked 29 October 2026). No audit, certificate, user count or review is claimed because none exists. */
export const CONTENT: GuideContent = {
  h1: 'Is TranscribeVid safe? Who runs it, what it does with your video, and how to check',
  lead: 'TranscribeVid is a small website run by one named developer. Your video or audio is transcribed inside your own browser and is not sent to the site, there is no account, and no payment is ever asked for. It has not been independently audited and has no security certificate, so this page says exactly what it does and shows you how to check the main claim yourself.',
  readingMinutes: 6,
  toolPath: '/video-to-text',
  toolCta: 'Transcribe a video on your device',
  blocks: [
    {
      title: 'The short answer',
      bullets: [
        {
          title: 'Your file stays on your device.',
          text: 'The speech recognition program runs in your browser. The video or audio is read from your disk by the page you have open and is not attached to any request to the site.',
        },
        {
          title: 'There is nothing to sign up for or pay.',
          text: 'No account, no password, no e-mail address and no card number. The site has no paid plan and takes no payments.',
        },
        {
          title: 'It is small, new and unaudited.',
          text: 'One developer runs it. No outside company has audited it, and it holds no security certificate. If your employer needs one, use a service that has it.',
        },
        {
          title: 'You can check the key claim in two minutes.',
          text: 'Your browser can show you what the page sends. The steps are further down.',
        },
      ],
    },
    {
      title: 'Who runs TranscribeVid',
      paragraphs: [
        'The site is run by Advaith Bibhishan Sonne, an independent software developer in Bengaluru, India. Their name and contact e-mail are written on the About page, and their postal address on the Contact, Privacy and Terms pages, so you know whom you are dealing with and where to send a question.',
        'It is run by one person, not by a larger company. The website is new, which is why you will find few reviews or articles about it yet. A new site has not had the time to earn a reputation, so judge it by what you can check rather than by how well known it is.',
      ],
    },
    {
      title: 'What happens to your video and your text',
      paragraphs: [
        'The recognition model, OpenAI\'s open Whisper, is downloaded to your browser the first time you pick a quality level and is kept in your browser\'s cache for next time. Your file is decoded on your device, the model runs on your graphics chip or processor, and the transcript is built on your device.',
        'The transcript, your edits and the source file are kept in your browser\'s own storage, and nowhere else. They are deleted automatically when your session ends after a period of inactivity, or at once when you press Delete my data now in the Transcripts menu. The site keeps no copy of them and has no way to read them.',
        'Two consequences are worth knowing. First, anyone who can use the same browser profile can see what is stored there until it is deleted, so press Delete my data now on a shared or borrowed computer. Second, because nothing is kept on our side, a deleted transcript cannot be recovered: download what you need to keep.',
      ],
    },
    {
      title: 'What does reach a server',
      paragraphs: [
        'Some things do travel over the internet, and none of them is your file or your text.',
      ],
      bullets: [
        {
          title: 'The model and its engine.',
          text: 'Your browser downloads the speech model from Hugging Face and the engine files from jsDelivr. They receive the usual details of any web request, such as your internet address, and never your media.',
        },
        {
          title: 'The website itself.',
          text: 'Cloudflare delivers the pages. Cloudflare Web Analytics counts visits, such as which page was opened and from which country, and says it uses no cookies and keeps no identifier on your device.',
        },
        {
          title: 'One running total.',
          text: 'When a transcription finishes, your browser sends one empty request that adds one to the number shown in the header. It carries no file, no text and no identifier.',
        },
        {
          title: 'Advertising.',
          text: 'See the next section.',
        },
      ],
      after: [
        'The step-by-step guide on transcribing a video without uploading it lists every download, with its source and size, in a table.',
      ],
    },
    {
      title: 'How the site pays for itself',
      paragraphs: [
        'TranscribeVid is free to use. It is paid for by ads from Google AdSense on information pages such as the home page, the tool pages and the guides. Ads are never shown while a file is being transcribed and never beside a transcript.',
        'Google uses cookies for its ads, and where the law requires it, asks for your consent first. The site itself sets no cookies. You can change your choice at any time with Privacy and cookie settings at the bottom of any page that shows ads. Your file and your transcript are never sent to Google.',
      ],
    },
    {
      title: 'What we cannot promise',
      paragraphs: ['Being straightforward about limits is part of being trustworthy, so here are the ones that matter for safety.'],
      bullets: [
        { title: 'No audit and no certificate.', text: 'Nobody outside has reviewed the site\'s security. It has no SOC 2, ISO 27001 or similar certificate.' },
        { title: 'No guarantee about your device.', text: 'The site cannot protect a browser that has been infected, or a browser extension that reads the pages you open. Keep your browser up to date.' },
        { title: 'No promise of perfect text.', text: 'Speech recognition makes mistakes, especially with noise, accents and names. Check anything important before you rely on it.' },
        { title: 'No legal or medical advice.', text: 'For regulated material, such as patient or legal records, your organisation\'s rules decide whether any tool may be used, however it works.' },
      ],
    },
    {
      title: 'Five checks you can make in a minute',
      steps: [
        { title: 'Read the address', text: 'It must be exactly transcribevid.com, with a closed padlock beside it. Sites with similar spellings exist and have no connection to this one.' },
        { title: 'Look for a payment or sign-in prompt', text: 'There is none, anywhere on the site. If a page claiming to be TranscribeVid asks for a card number or a password, it is not this site.' },
        { title: 'Open the Privacy page', text: 'Link at the bottom of every page. It names the operator and says what is stored and for how long.' },
        { title: 'Watch the Network tab', text: 'Press F12, choose Network, start a transcription and look for what goes out. The only request that reaches transcribevid.com with a body is one empty request after the transcript is done.' },
        { title: 'Try a short, harmless file first', text: 'Use a recording with nothing private in it, see how the site behaves, and then decide about the rest.' },
      ],
    },
    {
      title: 'Sites with a similar name',
      paragraphs: [
        'Other sites have names close to this one. TranscribeVid has no connection to any of them, including transcriptvid.com, and nothing said about a site with a different spelling applies to this one. Because the name is easy to mistype, bookmark the address once you have checked it, and do not follow a link to a transcription site from an e-mail or message you were not expecting.',
        'If you find something that looks wrong on transcribevid.com itself, or a page that imitates it, please write to the e-mail address on the Contact page so it can be dealt with.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Does TranscribeVid ask for a password or a card number?',
      answer: 'No. There is no account to log in to and no paid plan. A page that asks for either, and says it is TranscribeVid, is not this site.',
    },
    {
      question: 'Is it safe to transcribe a confidential interview here?',
      answer: 'The file is not sent to the site, which is the main risk with online services. It is still read by your own browser and stored in it until your session ends, so use a device you trust and press Delete my data now when you are finished. If your organisation requires an audited tool, follow its rules.',
    },
    {
      question: 'Has TranscribeVid been independently audited or certified?',
      answer: 'No. It is run by one developer and has no external security audit or certificate. That is why this page explains how it works and how to check it, instead of asking you to take its word.',
    },
    {
      question: 'Who do I contact with a privacy or security concern?',
      answer: 'Write to the e-mail address on the Contact page, which is the operator\'s own. Because the site keeps no account and no copy of your files, it usually cannot look up a person, but it will read and answer what you send.',
    },
  ],
  links: [
    {
      label: 'How to transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Every download with its source and size, and how to watch what the page sends.',
    },
    {
      label: 'Private transcription, with nothing uploaded',
      path: '/private-transcription',
      note: 'When a transcript made on your own device suits private recordings.',
    },
    {
      label: 'Frequently asked questions',
      path: '/faq',
      note: 'Short answers about limits, languages, formats and your files.',
    },
    {
      label: 'How TranscribeVid works',
      path: '/how-it-works',
      note: 'The steps from your file to a finished transcript.',
    },
  ],
};
