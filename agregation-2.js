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


