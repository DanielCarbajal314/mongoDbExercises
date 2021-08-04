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