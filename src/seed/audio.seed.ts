import type { AudioTrack } from '@/features/audio/store/audioStore';

export const fantasyAudio: Omit<AudioTrack, 'id' | 'campaignId'>[] = [
  {
    title: 'Epischer Kampf (Boss)',
    type: 'music',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder URL
    tags: ['Kampf', 'Episch', 'Boss']
  },
  {
    title: 'Die Alte Taverne',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=roWQvwGkVGQ',
    tags: ['Taverne', 'Stadt', 'Entspannt']
  },
  {
    title: 'Dichter Wald bei Nacht',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=xNN7iTA57jM',
    tags: ['Wald', 'Nacht', 'Natur']
  },
  {
    title: 'Schwertklirren & Kampfschreie',
    type: 'sfx',
    url: 'https://www.youtube.com/watch?v=vVjV2x2Qk1k',
    tags: ['Kampf', 'SFX']
  }
];

export const cthulhuAudio: Omit<AudioTrack, 'id' | 'campaignId'>[] = [
  {
    title: '1920s Jazz Bar',
    type: 'music',
    url: 'https://www.youtube.com/watch?v=wXhRQkI2DqQ',
    tags: ['1920s', 'Jazz', 'Bar', 'Entspannt']
  },
  {
    title: 'Unheimliches Sanatorium',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=9_z0k1U0aD0',
    tags: ['Sanatorium', 'Grusel', 'Wahnsinn']
  },
  {
    title: 'Starker Regen & Donner',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    tags: ['Regen', 'Wetter', 'Stadt']
  },
  {
    title: 'Unmenschliches Gebrüll',
    type: 'sfx',
    url: 'https://www.youtube.com/watch?v=Hrv43O2O-I4',
    tags: ['Monster', 'Erschrecken', 'SFX']
  }
];

export const sciFiAudio: Omit<AudioTrack, 'id' | 'campaignId'>[] = [
  {
    title: 'Ruhiger Hyperraumflug',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=1xNXVnZofQc', // Placeholder
    tags: ['Schiff', 'Reise', 'Entspannt']
  },
  {
    title: 'Roter Alarm & Blasterfeuer',
    type: 'sfx',
    url: 'https://www.youtube.com/watch?v=r_G-fFXX52E',
    tags: ['Kampf', 'Alarm', 'Gefahr']
  },
  {
    title: 'Alien-Planet Dschungel',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=f-BwbN_Z_zI',
    tags: ['Planet', 'Natur', 'Fremd']
  },
  {
    title: 'Synth-Kampfmusik',
    type: 'music',
    url: 'https://www.youtube.com/watch?v=sC0cvwnG0Ik',
    tags: ['Kampf', 'Synthesizer', 'Action']
  }
];

export const cyberpunkAudio: Omit<AudioTrack, 'id' | 'campaignId'>[] = [
  {
    title: 'Neonlicht-Straßenschlucht (Regen)',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=qIfjPZ_pEaA',
    tags: ['Stadt', 'Regen', 'Dunkel']
  },
  {
    title: 'Dark Darksynth Club',
    type: 'music',
    url: 'https://www.youtube.com/watch?v=h1Ze3bXlOIM',
    tags: ['Club', 'Action', 'Elektronisch']
  },
  {
    title: 'Cyber-Hacking Terminal',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=hO3k9Y7zZp0',
    tags: ['Hacking', 'Computer', 'Spannung']
  },
  {
    title: 'Feuergefecht & Sirenen',
    type: 'sfx',
    url: 'https://www.youtube.com/watch?v=B9_12bE-2_g',
    tags: ['Kampf', 'Polizei', 'Action']
  }
];

export const modernAudio: Omit<AudioTrack, 'id' | 'campaignId'>[] = [
  {
    title: 'Großstadt-Verkehr',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=O1k96JjFmCQ',
    tags: ['Stadt', 'Alltag', 'Autos']
  },
  {
    title: 'Ermittlung & Spannung',
    type: 'music',
    url: 'https://www.youtube.com/watch?v=7b7pS2x75wI',
    tags: ['Spannung', 'Geheimnis', 'Krimi']
  },
  {
    title: 'Büro-Atmosphäre (Tippen & Murmeln)',
    type: 'ambience',
    url: 'https://www.youtube.com/watch?v=2T9uE2n7n48',
    tags: ['Büro', 'Polizei', 'Entspannt']
  },
  {
    title: 'Pistolenschüsse',
    type: 'sfx',
    url: 'https://www.youtube.com/watch?v=1FhW60jC_0Q',
    tags: ['Kampf', 'Waffen', 'SFX']
  }
];
