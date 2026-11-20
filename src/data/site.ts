export const site = {
  name: 'Dead Interval',
  description: 'An interactive archive of fictional infrastructure incidents.',
  headline: 'The system stayed healthy. Something inside it went quiet.',
  featuredCaseId: 'case-01',
  navigation: [
    { label: 'Cases', href: '/cases/' },
    { label: 'Entities', href: '/entities/' },
    { label: 'Signals', href: '/signals/' },
  ],
  signupPitch: 'Get new case files and premiere announcements. Unsubscribe anytime.',
  ogImage: '/og/dead-interval.jpg',
  ogImageAlt: 'A coral-lit underground wetware facility',
};
export const copy = {
  states: { 'in-development': 'In development', sealed: 'Sealed', released: 'Released' },
  puzzle: {
    invalid: 'Enter a positive sequence number.',
    neighbor: 'That sequence is present. Look for the gap.',
    wrong: 'That sequence does not match the gap.',
    correct: 'Sequence matched. One note recovered.',
  },
};
