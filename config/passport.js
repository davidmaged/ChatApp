var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Users = require('../app/models/Users');
var server = require('../server');
const secret = require('./secret');

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = secret.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    Users.findOne({_id: jwt_payload._id}, function(err, user)
    {
      if (err)
      {
        return done(err, false);
      }
      if (user)
      {
        done(null, user);
      }else
      {
        done(null, false);
      }
    });
  }));
};
