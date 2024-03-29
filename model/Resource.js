const { MongoClient, ObjectId} = require('mongodb');

const args = process.argv.slice(2);
const url = args[0] ?? process.env.MONGODB_URI;
const dbName = args[1] ?? process.env.DB_NAME;
const client = new MongoClient(url);

const Resource = {

    getAll : async function() {
        await client.connect();
        const db = client.db(dbName);
        const ressourcesCollection = db.collection('Ressources');
        let ressources = await ressourcesCollection.find().toArray();
        return ressources;
    },

    getType : async function() {
        let ressources = await this.getAll();
        let ressources_available = [];
        let isAlreadyAdded = 0;

        //Permet d'avoir un tableau contenant uniquement une ressource de chaque type
        //afin d'éviter une redondance dans l'affichage
        ressources.map(async (element) => {
            isAlreadyAdded = 0;

            ressources_available.map(async (el) => {
                if(el.type === element.type)
                {
                    isAlreadyAdded = 1;
                }
            });

            if(isAlreadyAdded === 0)
            {
                ressources_available.push(element);
            }
        });

        return ressources_available;
    },

    insert : async function(type) {
        await client.connect();
        const db = client.db(dbName);
        const ressourcesCollection = db.collection('Ressources');

        const doc = {
            type: type
        }
        await ressourcesCollection.insertOne(doc);
    },

}

module.exports = Resource;
