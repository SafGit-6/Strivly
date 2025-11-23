const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model.js');


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport) {
  // Local Strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.password) {
        return done(null, false, { message: 'Please log in with Google.' });
      }

      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (err) {
      return done(err);
    }
  }));

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
    };

    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
      } else {
        // Check if user exists by email
        user = await User.findOne({ email: newUser.email });
        if (user) {
          // If user exists but is missing googleId, update them
          user.googleId = newUser.googleId;
          user.displayName = user.displayName || newUser.displayName;
          await user.save();
          done(null, user);
        } else {
          // Create new user
          user = await User.create(newUser);
          done(null, user);
        }
      }
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  }));

    // This strategy is for authenticating users based on the JWT sent in the request header
  passport.use(
    new JwtStrategy(
      {
        // Tell the strategy where to find the token
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Tell the strategy what secret it should use to verify the token's signature
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          // The payload contains the user's ID. Find the user in the database.
          const user = await User.findById(jwt_payload.id);

          if (user) {
            // If the user is found, pass the user object to the next stage
            return done(null, user);
          } else {
            // If the user is not found
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // Used to store user in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Used to retrieve user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};