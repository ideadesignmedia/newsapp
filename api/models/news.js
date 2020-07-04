const mongo = require('mongoose');
const newsSchema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    user: String,
    topics: Array,
    date: String,
    news: Array
});
module.exports = mongo.model('News', newsSchema);