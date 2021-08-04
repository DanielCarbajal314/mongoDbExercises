const {getConnectedDatabase} = require('./database-builder')
const fetch = require('node-fetch');


function uploadToMongo(todosList) {
    return getConnectedDatabase('sample_weatherdata')
    .then(db => {
        const collection = db.collection('todos');
        const bulk = collection.initializeUnorderedBulkOp();
        todosList.forEach(todo => {
            todo.userId += 1000;
            bulk.find( { id: todo.id}).upsert().updateOne( { $set: todo })
        });
        return bulk.execute();
    });
}

fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(uploadToMongo)
    .then(console.log)
    .then(process.exit);