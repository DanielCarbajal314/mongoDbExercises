db.listingsAndReviews.aggregate([
    { $project : { price: 1, "address.country":1, "address.market":1} },
    { $match : { "address.country" : "United States"}},
    { $group: { _id: "$address.market", precioMedio : { $avg: "$price" }} },
    { $merge: { into: "PromediosUSA", on: "_id" } }
])