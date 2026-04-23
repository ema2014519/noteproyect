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

const migrateLegacyNotesSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();

  try {
    const columns = await queryInterface.describeTable('Notes');

    if (columns.userid && !columns.userId) {
      await sequelize.query(
        'ALTER TABLE `Notes` CHANGE `userid` `userId` VARCHAR(255) NOT NULL;'
      );
    }
  } catch (error) {
    const isMissingTable =
      error?.name === 'SequelizeUnknownTableError' ||
      error?.original?.code === 'ER_NO_SUCH_TABLE';

    if (!isMissingTable) {
      throw error;
    }
  }
};

export const connectMysql = async () => {
  try {
    await sequelize.authenticate();
    await migrateLegacyNotesSchema();
    await sequelize.sync({ alter: true });
    console.log('Connected to MySQL');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    process.exit(1);
  }
};

export default sequelize;