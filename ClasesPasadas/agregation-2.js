db.listingsAndReviews.aggregate([
    { 
        $project : { 
            "address.country": 1, 
            property_type: 1, 
            "caracteristicaInteres": {
            $filter: {
                input: "$amenities",
                as: "num",
                cond: { $eq: [ "$$num", "Heating" ] } }
            }  
        // [ "Heating", "Air Condioner"] => [ "Heating"]
        // [ "Air Condioner", "asasdadas"] => []
        }
    },
    {
       $match : { property_type : "House"}
    },
    { 
        $project : {  "pais":  "$address.country", "tieneCaracteristicaDeInteres" : {
           $cond : { 
               if : { $eq: [ { $size: "$caracteristicaInteres"} , 1 ] },
               then:1, 
               else:0 
           } 
        } }
    },
    { $group: { _id: "$pais", promedioDeCalentadores : { $avg: "$tieneCaracteristicaDeInteres" }} },
    { $sort: { promedioDeCalentadores : -1 }}
]);

//EJERCICIOS SORT $sortByCount: 

db.listingsAndReviews.aggregate([
    { $sortByCount : "$property_type"}
])

db.listingsAndReviews.aggregate([
    { $sortByCount : "$address.country"}
])

db.listingsAndReviews.aggregate([
    { $unwind : "$reviews"},
    { $sortByCount : "$reviews.reviewer_name"}
])

// BUCKET  { _id: 'Wifi', count: 5303 },
db.listingsAndReviews.aggregate([ 
    { $unwind: "$amenities"},
    { $sortByCount: "$amenities"},
    {
        $bucket: {
            groupBy : "$count",
            boundaries: [ 1000,2000,3000,4000,5000],
            default : "FueraDeRango",
            output : {
                total : { $sum: "$count" },
                cantidad : { $sum: 1 },
                amenities : {
                    $push: {
                        name: "$_id",
                        quantity: "$count"
                    }
                }
            }
        }
    }
])


 // EJERCICIOS BUCKET
db.listingsAndReviews.aggregate([
    {
        $bucket: {
            groupBy : "$price",
            boundaries: [ 50,100,150,200],
            default : "FueraDeRango",
            output : {
                cantidad : { $sum: 1 },
                amenities : {
                    $addToSet: "$price"
                }
            }
        }
    }
])

db.listingsAndReviews.aggregate([
    { $project : { numeroDeAmenities : { $size: "$amenities"}} },
    {
        $bucket: {
            groupBy : "$numeroDeAmenities",
            boundaries: [ 5,10,15,20,30],
            default : "FueraDeRango",
            output : {
                cantidad : { $sum: 1 },
                amenities : {
                    $addToSet: "$numeroDeAmenities"
                }
            }
        }
    }
])

// UNION ALL

db.neighborhoods.aggregate([
    { $project : { _id: 0, name:1, type: "neighborhood" } },
    { $unionWith: { coll: "restaurants", pipeline: [ { $project : { _id: 0, name:1, type: "restaurant" }}  ] }},
    { sort : { type : 1 }}
])

// Aggregacion tipo JOIN

db.transactions.aggregate([
    { $project : { transactions : 0 }},
    {  
        $lookup: {
            from : 'accounts',
            localField: "account_id",
            foreignField: "account_id",
            as: "account"
        }
    }
])

// EJECICIOS UNION y Lookup

db.inspections.aggregate([
    { $project : { city : "$address.city", _id:0 }},
    { $match: { city : { "$exists":true, "$ne" : '' }}},
    { $unionWith: {
        coll: 'zips',
        pipeline: [
            { $project : { city : 1 , _id:0 } }
        ]
     }
    },
    { $sortByCount : "$city"}
])

db.inspections.aggregate([
    { $project : { zip : "$address.zip", _id:0 }},
    { $project : { zip : { $toString: "$zip" }}},   
    { 
        $lookup: {
            from : 'zips',
            localField: "zip",
            foreignField: "zip",
            as: "location"
        }
    }
])

db.shipwrecks.find({
    coordinates: {
        $geoWithin: { 
            $geometry: { 
                type: 'Polygon',
                coordinates: [ 
                    [ 
                        [ -77.8584823314926, 30.307398975445526 ],
                        [ -84.75548373025704, 29.851011366489722 ],
                        [ -85.67801257977328, 24.45728659501252 ],
                        [ -79.04459085229922, 23.815550947215 ],
                        [ -75.57412518030948, 24.8567236926757 ],
                        [ -77.8584823314926, 30.307398975445526 ] 
                    ] 
                ] 
            }
        }
    }
})


db.shipwrecks.find({
    coordinates: {
        $geoWithin: { 
            $geometry: { 
                type: 'Polygon',
                coordinates: [ 
                    [
                        [ -74.74252183449299, 24.110730221501704 ],
                        [ -74.55993799969289, 23.83337446686628 ],
                        [ -74.25929243712733, 23.938865060813672 ],
                        [ -74.31008643628223, 24.18843295693198 ],
                        [ -74.74252183449299, 24.110730221501704 ]
                    ] 
                ] 
            }
        }
    }
})

// Naufragios cerca a otro

db.shipwrecks.find({
    coordinates: {
        $near: { 
            $geometry: { 
                type: 'Point',
                coordinates:  [ -74.460358, 24.126199 ]
            },
            $maxDistance: 10
        }
    }
})