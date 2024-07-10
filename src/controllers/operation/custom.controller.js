const { ShortUrlGenerator } = require("../../services/generateURL");
const Custom_URL = require('../../models/custom.db');
const { checkValidURL } = require("../../services/validURL");

async function handleCustomGeneration(req, res) {
    try {

        if(!req.body.url){
            return res.status(400).json({error: "URL field cannot be empty"});
        }

        const url = req.body.url;

        if(!checkValidURL(url)){
            return res.status(400).json({error: "Invalid URL passed"});
        }

        const customString = processString(req.body.custom)

        const shortID = ShortUrlGenerator(url, 8);

        const customID = shortID + '-' + customString;

        const newEntry = new Custom_URL({
            customid: customID,
            redirectUrl: url,
        });

        await newEntry.save();

        return res.status(201).json({
            short : customID, 
            redirect : url
        });

    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"});
    }
}

async function handleCustomAccess(req, res) {
    try {
        const customId = req.params.customId;
        //Search for existing entry
        const existingEntry = await Custom_URL.findOneAndUpdate(
            { customid: customId }, 
            { $inc: {accessed: 1}, }
        );

        if(!existingEntry){
            return res.status(404).json({message: "Requested URL not found"});
        }
        redirectUrl = existingEntry.redirectUrl;
        return res.redirect(redirectUrl);
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"});
    }
}

function processString(inString) {
    var outString = ''
    inString = inString.split(" ");
    inString.forEach((word) => {
        outString = outString + '_' + word;
    });
    return outString.slice(1,);
}

module.exports = {
    handleCustomAccess,
    handleCustomGeneration,
}