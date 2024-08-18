import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';
import User from './User';

const Friend = sequelize.define('Friend', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  friendId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
});

export default Friend;
