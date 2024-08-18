import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import sequelize, { syncDatabase } from '../../../lib/sequelize';
import User from '../../../models/User';
import { getTodayListeningMinutes, getLastPlayedTrack, getTopTracks } from '../../../lib/spotify';

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email user-read-recently-played user-top-read',  // Added user-top-read scope
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // The Sync will only commence when a user presses the sign in button (better to write custom server.js at root)
        await syncDatabase(); // Sync the database when a user signs in

        const [existingUser, created] = await User.findOrCreate({
          where: { email: user.email },
          defaults: {
            name: user.name,
            spotifyId: profile.id,
          },
        });

        if (created) {
          console.log(`New user created: ${user.email}`);
        }

        return true;
      } catch (error) {
        console.error('Error during sign-in:', error);
        return true;
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    // Runs and stores user's highlight data to the database (which will be read in other API pages)
    async session({ session, token }) {
      session.accessToken = token.accessToken;

      if (token.accessToken) {
        const minutesListenedToday = await getTodayListeningMinutes(token.accessToken);
        const lastPlayedTrack = await getLastPlayedTrack(token.accessToken);
        const topTracks = await getTopTracks(token.accessToken); // Fetch top 4 tracks

        session.user.minutesListenedToday = minutesListenedToday;
        session.user.lastPlayedTrack = lastPlayedTrack;

        // Store the listening minutes, last played track, and top 4 tracks in the database
        await User.update(
          {
            listeningMinutes: minutesListenedToday,
            lastPlayedTrackName: lastPlayedTrack?.trackName || null,
            lastPlayedTrackArtist: lastPlayedTrack?.artistName || null,
            lastPlayedTrackAlbumImage: lastPlayedTrack?.albumImage || null,
            topTrack1Name: topTracks[0]?.trackName || null,
            topTrack1AlbumImage: topTracks[0]?.albumImage || null,
            topTrack2Name: topTracks[1]?.trackName || null,
            topTrack2AlbumImage: topTracks[1]?.albumImage || null,
            topTrack3Name: topTracks[2]?.trackName || null,
            topTrack3AlbumImage: topTracks[2]?.albumImage || null,
            topTrack4Name: topTracks[3]?.trackName || null,
            topTrack4AlbumImage: topTracks[3]?.albumImage || null,
          },
          { where: { email: session.user.email } }
        );
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
