const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config;
const passport = require("passport");
const db = require("./src/models");
const { v4: uuidv4 } = require("uuid");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async function (token, refreshToken, profile, cb) {
      const refresh_token = uuidv4();
      profile.refresh_token = refresh_token;
      try {
        if (profile?.id) {
          const response = await db.Teacher.findOrCreate({
            where: { id: profile.id },
            defaults: {
              id: profile.id,
              email: profile.emails[0]?.value,
              name: profile?.displayName,
              avatar: profile?.photos[0]?.value,
              refresh_token,
            },
          });
          if (!response[1]) {
            await db.Teacher.update(
              {
                refresh_token,
              },
              {
                where: { id: profile.id },
              }
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
      //them user vao db
      // console.log(profile);
      return cb(null, profile);
    }
  )
);
