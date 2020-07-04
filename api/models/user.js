const mongo = require('mongoose');
// add any additional user properties to the user schema
const userSchema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    username: {type: String, required: false, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    topics: {type: Array, require: false},
    superuser: {type: Boolean, required: false},
    ips: {type: Array, require: false}
});
module.exports = mongo.model('User', userSchema);