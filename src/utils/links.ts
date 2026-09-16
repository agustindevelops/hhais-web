/**
 * Centralized link definitions for flexibility and easy editing.
 * Use these constants throughout the app for project URLs, social links, etc.
 */

/** Project landing page paths (relative to app base) */
export const PROJECT_ROUTES = {
  laiz: '/projects/laiz',
} as const;

export const EVENT_ROUTES = {
  laizBirthdayLaunchParty: '/events/laiz-birthday-launch-party',
} as const;

export const TEAM_ROUTES = {
  index: '/team',
} as const;

/** External project links (websites, demos, etc.) */
export const PROJECT_LINKS = {
  laiz: {
    landing: PROJECT_ROUTES.laiz,
    youtube: 'https://www.youtube.com/watch?v=BJZBTsyEDrA',
    youtubeChannel: 'https://www.youtube.com/@HelpingHandAISolutions/videos',
  },
  aniahSocialEvents: 'https://www.aniahsocialevents.com',
  prospectigator: 'https://www.lucernadigital.com/lead-generation',
} as const;

/** Social media links */
export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@HelpingHandAISolutions/videos',
  instagram: 'https://www.instagram.com/helpinghand.ai?igsh=MWtkeHY4MmFtZWhxcA==',
  linkedin: 'https://www.linkedin.com/in/agustin-manriquez-cruz-9b9008227/',
} as const;
