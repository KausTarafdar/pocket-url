const Custom_URL = require("../../models/custom.db");
const Short_URL = require("../../models/url.db");

async function handleUsageFrequency(req, res) {
    query = req.query.type;
    limit = req.query.limit || 5;
    
    if(query.toLowerCase() === "access") {
        try {
            const shortEntries = await Short_URL.find({},{redirectUrl: 1, accessed: 1, _id: 0}).sort({accessed: -1});
            const customEntries = await Custom_URL.find({},{redirectUrl: 1, accessed: 1, _id: 0});

            valueMap = new Map();
            
            shortEntries.forEach(entry => {
                valueMap.set(entry.redirectUrl, entry.accessed);
            })

            customEntries.forEach(entry => {
                if(valueMap.has(entry.redirectUrl)){
                    previousVal = valueMap.get(entry.redirectUrl);
                    valueMap.set(entry.redirectUrl, (previousVal + entry.accessed));
                }

                else {
                    valueMap.set(entry.redirectUrl, entry.accessed);
                }
            })

            valArr = Array.from(valueMap, ([redirectUrl, accessed]) => ({ redirectUrl, accessed}));
            valArr.sort((a,b)=>{
                return b.accessed - a.accessed;
            })

            return res.status(200).json({access: valArr.slice(0, limit)});

        } catch (error) {
            console.log(error.message)
            return res.status(500).json({error: 'Internal server error'});
        }
    }
    else if(query.toLowerCase() === "recent") {
        try {
            const shortEntries = await Short_URL.find({},{redirectUrl: 1, updatedAt: 1, _id: 0}).sort({updatedAt: -1});
            const customEntries = await Custom_URL.find({},{redirectUrl: 1, updatedAt: 1, _id: 0}).sort({updatedAt: -1});

            var valueMap = new Map();

            shortEntries.forEach(entry => {
                valueMap.set(entry.redirectUrl, entry.updatedAt);
            })

            customEntries.forEach(entry => {
                if(valueMap.has(entry.redirectUrl) && valueMap.get(entry.redirectUrl) < entry.updatedAt) {
                    valueMap.set(entry.redirectUrl, entry.updatedAt);
                }
                else if (!valueMap.has(entry.redirectUrl)){
                    valueMap.set(entry.redirectUrl, entry.updatedAt);
                }
            })

            valArr = Array.from(valueMap, ([redirectUrl, updatedAt]) => ({ redirectUrl, updatedAt}));
            valArr.sort((a,b)=>{
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            })

            return res.status(200).json({ferqeuncy: valArr.slice(0,limit)});
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({error: 'Internal server error'});
        }
    }
    else {
        return res.status(400).json({error: "Filter does not exist"});
    }
}

module.exports = {
    handleUsageFrequency,
}