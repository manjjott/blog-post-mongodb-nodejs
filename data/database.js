const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoDbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGODB_DATABASE || "blog";

let database;

async function connect() {
  const client = await MongoClient.connect(mongoDbUrl);
  database = client.db(databaseName);
}

// Function to get the database
function getDb() {
  if (!database) {
    throw {
      message: "Database connection not established!",
    };
  }
  return database;
}

// Way to expose these functions to other files
module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
};
