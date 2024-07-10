const Custom_URL = require('../../models/custom.db');
const Short_URL = require('../../models/url.db');
const { checkValidURL } = require('../../services/validURL');

async function handleSingleAccessCount(req, res) {
    try {

        if(!req.body.type) {
            return res.status(400).json({error: "Type not specified"});
        }

        reqType = req.body.type;
        reqURL = req.body.payload;

        switch(reqType.toLowerCase()) {
            case 'short':
                var existingEntry = await Short_URL.findOne({"shortid" : reqURL});
                if(!existingEntry){
                    return res.status(404).json({error: "Entry does not exist"});
                }
                return res.status(200)
                .json({
                    redirect: existingEntry.redirectUrl,
                    access: existingEntry.accessed,
                    RecentUse: existingEntry.updatedAt,
                    Created: existingEntry.createdAt
                })
            case 'custom':
                var existingEntry = await Custom_URL.findOne({"customid" : reqURL});
                if(!existingEntry){
                    return res.status(404).json({error: "Entry does not exist"});
                }
                return res.status(200)
                .json({
                    redirect: existingEntry.redirectUrl,
                    access: existingEntry.accessed,
                    RecentUse: existingEntry.updatedAt,
                    Created: existingEntry.createdAt
                })
            case 'url':
                if(!checkValidURL(reqURL)){
                    return res.status(400).json({error: "Invalid URL passed"});
                }

                var shortEntry = await Short_URL.findOne({"redirectUrl" : reqURL});
                var customEntry = await Custom_URL.find({"redirectUrl" : reqURL});

                if(!shortEntry && customEntry.length === 0) {
                    return res.status(404).json({error: "Entry does not exist"});
                }

                var response = {
                    redirect: "",
                    accessed: 0,
                    RecentUse: "",
                    Created: "",
                }

                if(shortEntry) {
                    response = {
                        redirect: shortEntry.redirectUrl,
                        accessed: shortEntry.accessed,
                        RecentUse: shortEntry.updatedAt,
                        Created: shortEntry.createdAt,
                    }

                    if(customEntry.length != 0) {
                        const {access, created, updated} = getAnalytics(customEntry);
                        response.accessed = response.accessed + access;
                        response.RecentUse = (response.RecentUse < updated) ? updated : response.RecentUse;
                        response.Created = (response.Created > created) ? created : response.Created;
                    }
                }
                else {
                    const {access, created, updated} = getAnalytics(customEntry);
                    response = {
                        redirect: customEntry.redirectUrl,
                        accessed: access,
                        RecentUse: updated,
                        Created: created,
                    }
                }

                return res.status(200).json(response);
            default:
                return res.status(400).json({error: "Invalid Type requested"});
        }


    } catch (error) {
        console.log(error.message);
        return res.status(400).json({error: "Internal Server Error"});
    }
}

function getAnalytics(items) {
    var _accessed = 0;
    var _created = items[0].createdAt;
    var _updated = items[0].updatedAt;

    items.forEach(item => {
        console.log(item.accessed);
        _accessed += item.accessed;
        if(_updated < item.updatedAt) _updated = item.updatedAt;
        if(_created > item.createdAt) _created = item.createdAt;
    });

    return {
        access : _accessed,
        created : _created,
        updated : _updated,
    }
}

module.exports = {
    handleSingleAccessCount,
}