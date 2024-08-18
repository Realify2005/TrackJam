// models/User.js

import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: DataTypes.STRING,
  spotifyId: {
    type: DataTypes.STRING,
    unique: true,
  },
  points: {
    type: DataTypes.FLOAT,
    defaultValue: 100,
  },
  listeningMinutes: DataTypes.FLOAT,
  lastPlayedTrackName: DataTypes.STRING, // Last played track fields
  lastPlayedTrackArtist: DataTypes.STRING,
  lastPlayedTrackAlbumImage: DataTypes.STRING,
  
  // Fields for top 4 tracks
  topTrack1Name: DataTypes.STRING,
  topTrack1AlbumImage: DataTypes.STRING,
  topTrack2Name: DataTypes.STRING,
  topTrack2AlbumImage: DataTypes.STRING,
  topTrack3Name: DataTypes.STRING,
  topTrack3AlbumImage: DataTypes.STRING,
  topTrack4Name: DataTypes.STRING,
  topTrack4AlbumImage: DataTypes.STRING,
});

// Define the self-referencing many-to-many relationship
User.belongsToMany(User, { as: 'Friends', through: 'Friend', foreignKey: 'userId', otherKey: 'friendId' });

export default User;
