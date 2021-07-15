const {getConnectedDatabase} = require('./database-builder')

getConnectedDatabase('sample_weatherdata')
.then(db => 
    db.collection('usuarios').find( { name: /^E/ }).project( {username: true, _id: false }).toArray()
)
.then(console.log)
.then(process.exit)