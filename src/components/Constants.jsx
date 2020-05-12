// List of constants
module.exports = Object.freeze({
  PATHS: {
    HOME: '/',
    LOGIN: '/login',
    OAUTH_RESULT: '/oauth',
    SIGNUP: '/signup',
    SETTING: '/settings/:tab',
    SUBMIT: '/submit',
    DRAFT: '/draft/:id',
    LEADERBOARD: '/leaderboard',
    ABOUT: '/about',
    PRIVACY: '/about#privacy-policy',
    TERMS: '/guidelines', // TODO: Update this with terms and conditions when available
    HOWITWORKS: '/how-it-works',
    GUIDELINES: '/guidelines',
    NEWSFEED: '/home/discover',
    ONGOING: '/home/ongoing',
    COMPLETED: '/home/completed',
    GLOBAL: '/home/global',
    STATS: '/stats'
  },
  IMG: {
    CLOUDFRONT: 'https://d1ppmvgsdgdlyy.cloudfront.net'
  }
});
