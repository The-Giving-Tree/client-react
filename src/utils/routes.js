const ROUTES = {
  production: {
    giving_tree: 'https://api.givingtreeproject.org',
    socket: 'https://api.givingtreeproject.org'
  },
  development: {
    giving_tree: 'http://localhost:3000',
    socket: 'http://localhost:3000'
  },
  staging: {
    giving_tree: 'https://api-staging.givingtreeproject.org',
    socket: 'https://api-staging.givingtreeproject.org'
  },
  sandbox: {
    giving_tree: 'http://localhost:3000',
    socket: 'http://localhost:3000'
  },
  local: {
    giving_tree: 'http://localhost:3000',
    socket: 'http://localhost:3000'
  }
};

export default ROUTES;
