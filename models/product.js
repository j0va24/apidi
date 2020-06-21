const mongoose = require('mongoose');

const productSchema = mongoose.Schema({ _id: mongoose.Schema.Types.ObjectId, 
                                        name: {type: String, required: true}, 
                                        price: {type: Number, required: true},
                                        category: {type: String, required: true},
                                        subcategory: {type: String, required: false},
                                        console: {type: String, required: false},
                                        productImage: {type: String, required: true},
                                        videoLink: {type: String, required: false}
                                    });

module.exports = mongoose.model('Product', productSchema);
