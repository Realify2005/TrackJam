// pages/api/friends/currently-playing.js
import { getSession } from 'next-auth/react';
import axios from 'axios';
import User from '../../../models/User';

export default async function handler(req, res) {
  const body = {...req.body};
  req.body = null;
  const session = await getSession({ req });
  req.body = body;
  
  console.log("this is the session");
  console.log(req);

  if (!session) {
    console.log('No session found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const currentUser = await User.findOne({
      where: { email: session.user.email },
      include: { model: User, as: 'Friends' }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendsListeningData = await Promise.all(currentUser.Friends.map(async (friend) => {
      const friendSession = await User.findOne({ where: { id: friend.id } });

      if (friendSession) {
        console.log(`Friend ID: ${friend.id}, Access Token: ${friendSession.accessToken}`);

        if (!friendSession.accessToken) {
          console.error(`Access token not found for friend ID: ${friend.id}`);
          return {
            id: friend.id,
            name: friend.name,
            currentlyPlaying: null,
          };
        }

        try {
          const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
              Authorization: `Bearer ${friendSession.accessToken}`,
            },
            params: {
              market: 'AU'
            }
          });

          if (response.status === 200 && response.data) {
            return {
              id: friend.id,
              name: friend.name,
              currentlyPlaying: response.data.item ? {
                trackName: response.data.item.name,
                artistName: response.data.item.artists.map(artist => artist.name).join(', '),
                albumName: response.data.item.album.name,
                albumImage: response.data.item.album.images[0]?.url,
              } : null,
            };
          } else {
            console.error(`Error fetching currently playing track for friend ID: ${friend.id}, Status: ${response.status}`);
          }
        } catch (err) {
          console.error(`Spotify API request failed for friend ID: ${friend.id}`, err);
        }
      } else {
        console.error(`Friend session not found for ID: ${friend.id}`);
      }

      return {
        id: friend.id,
        name: friend.name,
        currentlyPlaying: null,
      };
    }));

    return res.status(200).json(friendsListeningData);
  } catch (error) {
    console.error('Error fetching currently playing data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
