'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('./db');

class Userlog extends Model { }

Userlog.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  log: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'userlogs',
  tableName: 'Userlogs',
  createdAt: "created_at",
  updatedAt: false,
  timestamps: true
})
module.exports = Userlog;