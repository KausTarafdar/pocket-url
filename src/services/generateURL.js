const {nanoid} = require('nanoid');

function ShortUrlGenerator(url, length) {
    const shortId = nanoid(length);
    return shortId;
}

module.exports = {
    ShortUrlGenerator
}