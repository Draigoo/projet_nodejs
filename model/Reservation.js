const { MongoClient, ObjectId} = require('mongodb');

const args = process.argv.slice(2);
const url = args[0] ?? process.env.MONGODB_URI;
const dbName = args[1] ?? process.env.DB_NAME;
const client = new MongoClient(url);

const Reservation = {

    getAll : async function() {
        await client.connect();
        const db = client.db(dbName);
        const reservationCollection = db.collection('Reservation');
        let reservation = await reservationCollection.find().toArray();
        return reservation;
    },

    insert : async function(start_date, end_date, type) {
        await client.connect();
        const db = client.db(dbName);
        const reservationCollection = db.collection('Reservation');
        const ressourcesCollection = db.collection('Ressources');
        let ressources = await ressourcesCollection.find().toArray();

        let reservations = await reservationCollection.find().toArray();

        //On parcours toutes les ressources disponible actuellement
        ressources.map(async (element) => {
            if(element.type === type && element.isReserved === false)
            {
                //ajout en bdd de la réservation
                const doc = {
                    title: element.type,
                    start: start_date,
                    end: end_date,
                    resource_id: element._id
                }
                await reservationCollection.insertOne(doc);
                await ressourcesCollection.updateOne({_id:element._id}, {$set: {isReserved: true}})
                return 0;
            }
            //La ressource n'est pas disponible directement, vérifier la dispo avec les dates
            reservations.map(async (el) => {
                if(element.type === type && el.end_date < start_date && el.resource_id === element._id)
                {
                    //ajout en bdd de la réservation
                    const doc = {
                        title: element.type,
                        start: start_date,
                        end: end_date,
                        resource_id: element._id
                    }
                    await reservationCollection.insertOne(doc);
                    await ressourcesCollection.updateOne({_id:element._id}, {$set: {isReserved: true}})
                    return 0;
                }
            });
        });
    },


    }

module.exports = Reservation;
