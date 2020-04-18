const ROUTES = {
  production: {
    giving_tree: 'https://api.givingtreeproject.org',
    socket: 'https://api.givingtreeproject.org'
  },
  development: {
    giving_tree: 'http://localhost:3000',
    socket: 'http://localhost:3000'
  },
  sandbox: { // staging as well
    giving_tree: 'https://api-staging.givingtreeproject.org',
    socket: 'https://api-staging.givingtreeproject.org'
  },
  local: {
    giving_tree: 'http://localhost:3000',
    socket: 'http://localhost:3000'
  }
};

export default ROUTES;
