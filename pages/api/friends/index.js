// pages/api/friends/index.js

import { getSession } from 'next-auth/react';
import User from '../../../models/User';

export default async function handler(req, res) {
  const body = {...req.body} ;
  req.body = null ;
  const session = await getSession({ req:req });
  req.body = body ;

  if (!session) {
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

    if (req.method === 'GET') {
      const friendsData = currentUser.Friends.map(friend => ({
        id: friend.id,
        name: friend.name,
        points: friend.points,
        listeningMinutes: friend.listeningMinutes,
        lastPlayedTrack: {
          trackName: friend.lastPlayedTrackName,
          artistName: friend.lastPlayedTrackArtist,
          albumImage: friend.lastPlayedTrackAlbumImage,
        },
        topTracks: [
          {
            trackName: friend.topTrack1Name,
            albumImage: friend.topTrack1AlbumImage
          },
          {
            trackName: friend.topTrack2Name,
            albumImage: friend.topTrack2AlbumImage
          },
          {
            trackName: friend.topTrack3Name,
            albumImage: friend.topTrack3AlbumImage
          },
          {
            trackName: friend.topTrack4Name,
            albumImage: friend.topTrack4AlbumImage
          }
        ]
      }));

      return res.status(200).json(friendsData);
    } else if (req.method === 'POST') {
      const { friendEmail } = req.body;
      const friend = await User.findOne({ where: { email: friendEmail } });

      if (!friend) {
        return res.status(404).json({ message: 'Friend not found' });
      }

      await currentUser.addFriend(friend);
      return res.status(200).json({ message: 'Friend added successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error fetching friends data:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
