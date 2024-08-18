// pages/api/user/points.js
import { getSession } from 'next-auth/react';
import User from '../../../models/User';

export default async function handler(req, res) {
  const body = {...req.body} ;
  req.body = null ;
  const session = await getSession({ req:req });
  req.body = body ;
  
  console.log("this is the session");
  console.log(req);

  if (!session) {
    console.log('No session found'); // Log for debugging
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

    const { action, friendId } = req.body;

    if (action === 'add') {
      // Add 10 points to the current user
      currentUser.points += 10;

      // Find and add 30 points to the specific friend if friendId is provided
      if (friendId) {
        const friend = currentUser.Friends.find(f => f.id === friendId);
        if (friend) {
          friend.points += 30;
          await friend.save();
        } else {
          return res.status(404).json({ message: 'Friend not found' });
        }
      }
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await currentUser.save(); // Save the updated user points

    return res.status(200).json({
      points: currentUser.points,
    });
  } catch (error) {
    console.error('Error updating points:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
