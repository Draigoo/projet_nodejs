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

    getByUser : async function(user) {
        await client.connect();
        const db = client.db(dbName);
        const reservationCollection = db.collection('Reservation');
        let reservation = await reservationCollection.find({title: user}).toArray();
        return reservation;
    },

    insert : async function(start_date, end_date, type, user) {
        await client.connect();
        const db = client.db(dbName);
        const reservationCollection = db.collection('Reservation');
        const ressourcesCollection = db.collection('Ressources');
        let ressources = await ressourcesCollection.find().toArray();

        let reservations = await reservationCollection.find().toArray();
        let reservationAdded = false;
        let resourceUsed = false;

        //On parcours toutes les ressources
        ressources.map(async (element) => {
            resourceUsed = false;
            //Si la ressource correspond à la ressource désirée
            if(element.type === type && reservationAdded === false)
            {
                console.log("Ressource du bon type trouvé")
                //On regarde parmis les réservations
                if(reservations.map(async () => {}).length > 0)
                {
                    console.log("La bdd reservation n'est pas vide")
                    //On check si la ressource est déjà utilisé
                    reservations.map(async (el) => {
                        if(element._id === el.resource_id)
                        {
                            resourceUsed = true;
                        }
                    });
                    //La ressource n'est pas utilisé, on ajoute la réservation
                    if(resourceUsed === false)
                    {
                        console.log("la ressource n'est pas utilisé donc on l'ajoute")
                        reservationAdded = true;

                        //ajout en bdd de la réservation
                        const doc = {
                            title: user.firstname,
                            start: start_date,
                            end: end_date,
                            resource_id: element._id,
                            type: element.type
                        }
                        await reservationCollection.insertOne(doc);
                    }


                    reservations.map(async (el) => {
                        //Si la ressource désirée est déjà réservé, on compare les dates pour voir si on peut
                        //quand même la réserver sur un créneau de libre
                        if(el.end < start_date && el.resource_id === element._id && reservationAdded === false)
                        {
                            reservationAdded = true;

                            //ajout en bdd de la réservation
                            const doc = {
                                title: user.firstname,
                                start: start_date,
                                end: end_date,
                                resource_id: element._id,
                                type: element.type
                            }
                            await reservationCollection.insertOne(doc);
                        }
                    });
                }
                else    //pas de réservation dans la bdd donc aucun risque d'ajouter la donnée
                {
                    console.log("pas de résa donc on ajoute la donnée")
                    reservationAdded = true;

                    //ajout en bdd de la réservation
                    const doc = {
                        title: user.firstname,
                        start: start_date,
                        end: end_date,
                        resource_id: element._id,
                        type: element.type
                    }
                    await reservationCollection.insertOne(doc);
                }
            }
        });
    },


    }

module.exports = Reservation;
