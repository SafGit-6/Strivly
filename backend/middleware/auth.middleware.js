const passport = require('passport');

// This is our protection middleware.
// It uses passport to authenticate with the 'jwt' strategy we just created.
// { session: false } tells passport not to create a session, because we are using stateless tokens.
const protect = passport.authenticate('jwt', { session: false });

module.exports = protect;