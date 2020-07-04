const mongo = require('mongoose');
const visitorSchema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    ip: {type: String, required: true, unique: true},
    visits: {type: Number, required: true},
    visit: {type: Array, "visited" : [
        {
            date: Date,
            page: Array
        }
    ]},
    banned: Boolean,
    overhaul: Number
});
module.exports = mongo.model('Visitor', visitorSchema);