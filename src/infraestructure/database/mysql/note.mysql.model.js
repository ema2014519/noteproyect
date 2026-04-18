import { DataTypes } from 'sequelize';
import sequelize from './mysql.connection.js';

const NoteModel = sequelize.define(
  'Note',
  {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    isPrivate: { type: DataTypes.BOOLEAN, defaultValue: false },
    password: { type: DataTypes.STRING, allowNull: true },
    userid: { type: DataTypes.STRING, allowNull: false }
  },
  {
    timestamps: true
  }
);

export default NoteModel;