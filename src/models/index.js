const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: "localhost",
    dialect: "mysql",
    logging:false
  });
}

async function init() {
  try {
    // Create a connection to the MySQL server (without specifying a database)
    const tempSequelize = new Sequelize({
      host: config.host,
      username: config.username,
      password: config.password,
      dialect: "mysql",
      logging: false
    });

    // Create the database if it doesn't exist
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

    // Close the temporary connection
    await tempSequelize.close();

    // Now, create the Sequelize instance with the database specified
    sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: "mysql",
      logging: false
    });
    fs.readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      db[model.name] = model;
    });
   
  Object.keys(db).forEach((modelName) => {
    console.log(modelName);
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

 init();

module.exports = db;
