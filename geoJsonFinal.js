db.listingsAndReviews.aggregate([
    {
        $geoNear : {
            near: { type: "Point", coordinates:[-8.723547, -43.743544]},
            distanceField : "distanceToSerra",
            maxDistance: 1500000,
            key: "address.location"
        },
    },
    {
        $project: {
            distanceToSerra: 1,
            country: "$address.country"
        }
    }
])

//db.collection.createIndex({field: "2dsphere" } )

// EJERCICIO 1 CLase 4-2

db.data.aggregate([
    {
        $geoNear : {
            near: { type: "Point", coordinates:[21.851463, -78.215034]},
            distanceField : "distanciaACuba",
            maxDistance: 150000,
            key: "position"
        },
    },
    {
        $project: {
            distanciaACuba: 1,
            type: 1,
            _id:0
        }
    }
])

db.data.createIndex({position: "2dsphere" } )