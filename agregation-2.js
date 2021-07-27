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