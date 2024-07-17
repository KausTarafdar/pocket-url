const { ShortUrlGenerator } = require("../../services/generateURL");
const Short_URL = require("../../models/url.db");
const { checkValidURL } = require("../../services/validURL");

async function handleShortGeneration(req, res) {
  try {
    const body = req.body;

    if (!body.url) {
      return res.status(400).json({ error: "URL field cannot be empty" });
    }

    const url = req.body.url;

    if (!checkValidURL(url)) {
      return res.status(400).json({ error: "Invalid URL passed" });
    }

    //Checking if exact url already has been generated
    const existingEntry = await Short_URL.findOne({ redirectUrl: url });
    //If url doesn't exists, create entry
    if (!existingEntry) {
      //Set minimum length of short URL
      const url_length = 8;

      const shortID = ShortUrlGenerator(url, url_length);

      const newEntry = new Short_URL({
        shortid: shortID,
        redirectUrl: url,
      });

      await newEntry.save();

      return res.status(201).json({
        short: shortID,
        redirect: url,
      });
    }
    //If url exists return the existing short
    return res.status(201).json({
      short: existingEntry.shortid,
      redirect: existingEntry.redirectUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleShortAccess(req, res) {
  try {
    const shortId = req.params.shortId;
    //Search for existing entry
    const existingEntry = await Short_URL.findOneAndUpdate(
      { shortid: shortId },
      { $inc: { accessed: 1 } },
    );

    if (!existingEntry) {
      return res.status(404).json({ message: "Requested URL not found" });
    }

    redirectUrl = existingEntry.redirectUrl;

    return res.redirect(redirectUrl);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleShortGeneration,
  handleShortAccess,
};
