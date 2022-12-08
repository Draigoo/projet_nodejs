const { MongoClient, ObjectId} = require('mongodb');

const args = process.argv.slice(2);
const url = args[0] ?? process.env.MONGODB_URI;
const dbName = args[1] ?? process.env.DB_NAME;
const client = new MongoClient(url);

const User = {

    getAll : async function() {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('Utilisateurs');
        let users = await usersCollection.find().toArray();

        return users;
    },

}

module.exports = User;
