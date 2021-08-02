db.shipwrecks.aggregate([
    { 
        $match : {  
            coordinates: {   
                $geoWithin: {    
                    $center : [[ -75.4806715, 35.6656032 ], 1000/6378.1 ]         
                }     
            } 
        } 
    },
    {
        $merge : { into : "washintong" }
    }
])