// List of constants
module.exports = Object.freeze({
  PATHS: {
    HOME: '/',
    LOGIN: '/login',
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
  },
  BREAKPOINTS: {
    xs: '(max-width: 414px)',
    sm: '(min-width: 415px) and (max-width: 767px)',
    md: '(min-width: 768px) and (max-width: 1023px)',
    lg: '(min-width: 1024px) and (max-width: 1279px)',
    xl: '(min-width: 1280px)'
  }
});
