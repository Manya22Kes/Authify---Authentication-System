const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const env = require("./env");

console.log("GitHub Client ID:", env.GITHUB_CLIENT_ID);
console.log("GitHub Secret Exists:", !!env.GITHUB_CLIENT_SECRET);
console.log("Base URL:", env.BASE_URL);

passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: `${env.BASE_URL}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      return done(null, profile);
    },
  ),
);

module.exports = passport;
