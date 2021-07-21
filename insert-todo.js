const {getConnectedDatabase} = require('./database-builder')
const fetch = require('node-fetch');


function uploadToMongo(pastList) {
    return getConnectedDatabase('sample_weatherdata')
    .then(db => {
        const collection = db.collection('ejercicioFinalSemana2');
        const bulk = collection.initializeUnorderedBulkOp();
        pastList.forEach(post => {
            bulk.find( { id: post.id}).upsert().updateOne( { $set: post })
        });
        return bulk.execute();
    });
}

fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(postArray => postArray.map(post => ({ 
        ...post, 
        cantidadDePalabras: post.body.split(' ').length 
    })))
    .then(uploadToMongo)
    .then(console.log)
    .then(process.exit);