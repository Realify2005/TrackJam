import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log, // Disable detailed SQL logging
});

export const syncDatabase = async () => {
  try {
    console.log('Starting database sync...'); // Log the start of the sync

    await sequelize.sync({ alter: true }); // Sync the database schema, adding missing columns

    console.log('Database schema synchronized successfully.'); // Log success
  } catch (error) {
    console.error('Error synchronizing database:', error); // Log any errors
  }
};

export default sequelize;
