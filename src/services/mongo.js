const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function mongoConnect() {
    mongoose.connect(MONGO_URI);
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}