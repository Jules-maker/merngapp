const { model, Schema } = require('mongoose');
// c'est sur graphQL que l'on précisera que les string sont required
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
})

module.exports = model('User', userSchema);