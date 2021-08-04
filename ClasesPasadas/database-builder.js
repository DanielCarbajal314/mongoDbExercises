const { MongoClient } = require('mongodb');

const connectionString = 'mongodb+srv://daniel:macedonio@cluster0.axvxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

async function getConnectedDatabase(databaseName) {
    const mongoClient = new MongoClient(connectionString, {
        connectTimeoutMS: 10000
    });
    const connectedClient = await mongoClient.connect();
    return connectedClient.db(databaseName)
}

module.exports = { getConnectedDatabase }