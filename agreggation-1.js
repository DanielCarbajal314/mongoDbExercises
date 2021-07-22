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
