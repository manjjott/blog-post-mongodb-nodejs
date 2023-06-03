const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("blog");
}

// Function to get the database
function getDb() {
  if (!database) {
    throw {
      message: "Databse connection not established !",
    };
  }
  return database;
}

// Way to expose these functions to other files
module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
};
