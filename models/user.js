const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({_id: mongoose.Schema.Types.ObjectId, 
                                    email: {type: String, required: true}, 
                                    password: {type: String, required: true}});

module.exports = mongoose.model('User', userSchema);
