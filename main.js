const {getConnectedDatabase} = require('./database-builder')

getConnectedDatabase('sample_weatherdata')
.then(db => db.collection('clase2').find().toArray())
.then(console.log)
.then(process.exit)