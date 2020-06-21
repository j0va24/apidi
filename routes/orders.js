var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => { Order.find().select('product quantity _id').exec()
                                        .then(docs => {res.status(200).json({ count: docs.length, orders: docs.map(doc => 
                                        { return { _id: doc._id, product: doc.product, quantity: doc.quantity, request: { type: 'GET', url: 'http://localhost:3000/orders/' + doc._id } } } ) }) })
                                        .catch(err => {console.log(err); res.status(500).json(err); }); 
                                        });

router.post('/', (req, res, next) => { Product.findById(req.body.productId)
                                        .then(product =>  { if (!product) {return res.status(404).json({ message: 'Producto Inexistente' })}const order = new Order ({ _id: mongoose.Types.ObjectId(), quantity: req.body.quantity, product: req.body.productId });
                                        return order.save()
                                        .then(result => { console.log(result); res.status(201).json({ message:  "Orden Exitosa",  createdOrder: { _id: result._id, product: result.product, quantity: result.quantity, request: { type: 'GET', url: 'http://localhost:3000/orders/' + result._id } }}) }) })
                                        .catch(err => { res.status(500).json({ message: 'Producto Inexistente', error: err }) });
                                        });

router.get('/:orderId', (req, res, next) => { Order.findById(req.params.orderId).exec()
                                                .then(order => { if (!order) { return res.status(404).json({ message: 'Orden Inexistente' }) } res.status(200).json({ order: order, request: { type: 'GET', url: 'http://localhost:3000/orders/' } }) })
                                                .catch(err => {console.log(err); res.status(500).json(err); });
                                                 });

router.patch('/:orderId', (req, res, next) => { res.status(200).json({ message: 'Actualizado', orderId: req.params.orderId }); });

router.delete('/:orderId', (req, res, next) => { Order.remove({ _id: req.params.orderId })
                                                    .exec()
                                                    .then(result => { res.status(200).json({ messagge: 'Orden Eliminada', request: { type: 'POST', url: 'http://localhost:3000/orders/', body: { productId: "ID", quantity: "Number" } } }); })
                                                    .catch(err => {console.log(err); res.status(500).json(err); }); });


module.exports = router;
