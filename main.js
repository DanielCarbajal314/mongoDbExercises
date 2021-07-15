const {getConnectedDatabase} = require('./database-builder')

getConnectedDatabase('sample_weatherdata')
.then(db => 
    db.collection('clase2')
        .find( {$or: [{ isAdmin: true }, {user:'Daniel'}]})
        .project({ user: true, _id: false })
)
.then(x => x.toArray())
.then(console.log)
.then(process.exit)