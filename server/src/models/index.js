import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

fs
  .readdirSync(__dirname)
  .filter(file =>
    file !== basename &&
    file.endsWith('.js')
  )
  .forEach(async (file) => {
    const { default: modelFn } = await import(path.join(__dirname, file));
    const model = modelFn(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
