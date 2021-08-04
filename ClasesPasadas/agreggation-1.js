db.listingsAndReviews.aggregate([
    { $project : { price: 1, "address.country":1, "address.market":1} },
    { $match : { "address.country" : "United States"}},
    { $group: { _id: "$address.market", precioMedio : { $avg: "$price" }} },
    { $merge: { into: "PromediosUSA", on: "_id" } }
])


db.listingsAndReviews.aggregate([
    { $project : { "address.country":1, "address.market":1, amenities: 1 } },
    { $match : { "address.country" : "United States"}},
    { $unwind : "$amenities" },
    { $group: { _id: "$amenities", cantidad : { $sum: 1 }} },
    { $sort: { cantidad : -1 }}
])


db.listingsAndReviews.aggregate([
    { $project : { "address.country":1, "address.market":1, reviews: 1 } },
    { $match : { "address.country" : "United States"}},
    { $unwind : "$reviews" },
    { $project : { "reviews.reviewer_name":1 } },
    { $group: { _id: "$reviews.reviewer_name", cantidad : { $sum: 1 }} },
    { $sort: { cantidad : -1 }}
])

db.listingsAndReviews.aggregate([
    { $project : { "address.country":1, property_type: 1 } },
    { $group: { _id: { pais: "$address.country", tipoAlquiler: "$property_type"}, cantidad : { $sum: 1 }} },
    { $sort: { "_id.pais" : 1, cantidad: -1 }}
])

db.listingsAndReviews.aggregate([
    { $project : { "address.country":1, property_type: 1 } },
    { $group: { _id: { pais: "$address.country", tipoAlquiler: "$property_type"}, cantidad : { $sum: 1 }} },
    { $project : { "pais": "$_id.pais", "tipoAlquiler": "$_id.tipoAlquiler" , "informacion.cantidad":"$cantidad" } }
])


db.listingsAndReviews.aggregate([
    { $project : { "address.country": 1, property_type: 1 } },
    { $match : { property_type : "Apartment"} },
    { $group: { _id: "$address.country", cantidad : { $sum: 1 }} }
])

db.listingsAndReviews.aggregate([
    { $project : { "address.country": 1, property_type: 1, amenities: 1 } },
    { $match : { property_type : "House", amenities: "Heating"} },
    { $group: { _id: "$address.country", cantidad : { $sum: 1 }} }
])

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
])