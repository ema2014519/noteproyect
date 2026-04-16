import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  }
);

export const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connected to MySQL');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
};

export default sequelize;