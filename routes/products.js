var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');

const storage = multer.diskStorage({ destination: function(req, file, cb) { cb (null, './public/uploads/'); }, 
                                        filename: function(req, file, cb) { cb (null, file.originalname); } });
const fileFilter = (req, file, cb) => { if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {cb(null, true);} else { cb(null, false); } };

const upload = multer({storage: storage, limits: { fileSize: 1024 * 1024 * 5}, fileFilter: fileFilter });
const Product = require('../models/product');

// OBTENER LISTA COMPLETA DE JUEGOS
router.get('/', (req, res, next) => { Product.find()
                                        .select('name price _id productImage category subcategory console videoLink')
                                        .exec()
                                        .then(docs => {const response = { count: docs.length, products: docs.map(doc => { return { _id: doc._id, name: doc.name, price: doc.price, productImage: doc.productImage, category: doc.category, subcategory: doc.subcategory, console: doc.console, videoLink: doc.videoLink } }) }; 
                                        res.status(200).json(response); })
                                        .catch(err => {console.log(err); res.status(500).json(err); }); });

//AGREGAR NUEVO PRODUCTO
router.post('/', upload.single('productImage'), (req, res, next) => { 
                                                const product = new Product({ _id: new mongoose.Types.ObjectId(), 
                                                                              name: req.body.name, 
                                                                              price: req.body.price, 
                                                                              category: req.body.category, 
                                                                              subcategory: req.body.subcategory, 
                                                                              console: req.body.console,
                                                                              videoLink: req.body.videoLink, 
                                                                              productImage: req.file.path  })
                                                product.save()
                                                .then(result => { console.log(result); 
                                                res.status(201).json({ message: 'Registro Exitoso', 
                                                createdPrduct: {name: result.name, 
                                                                price: result.price, 
                                                                category: result.category, 
                                                                subcategory: result.subcategory,
                                                                console: result.console,
                                                                 _id: result._id, request: { type: 'GET', url: 'http://localhost:3000/products/' + result._id }} });}) 
                                                .catch(err => {console.log(err); res.status(500).json(err); }); });

// OBTENER PRECIO POR ID
router.get('/:productId', (req, res, next) => { const id = req.params.productId; Product.findById(id)
                                                .select('name price _id category subcategory console productImage videoLink')
                                                .exec()
                                                .then(doc => {console.log(doc); if (doc) {res.status(200).json({ product: doc, request: { type: 'GET', description: 'Lista de Prodcutos', url: 'http://localhost/3000/products' } });} })
                                                .catch(err => {console.log(err); res.status(500).json({ message: "Producto Inexistente" }); }); });
// OBTENER PRECIO POR NOMBRE
router.get('/category/game/:productName', (req, res, next) => { const name_gm = req.params.productName; 
                                                Product.find({"name": name_gm})
                                                .then(doc => {console.log(doc); if (doc) {res.status(200).json({ product: doc, request: { type: 'GET', description: 'Detalle del Producto', url: 'http://localhost/3000/products' } });} })
                                                .catch(err => {console.log(err); res.status(500).json({ message: "Producto Inexistente" }); });
                                              });


// OBTENER CATEGORIA  POR NOMBRE                                             
router.get('/category/:categoryName', (req, res, next) => { 
  
      const n_category = req.params.categoryName; 
      let respon;
      Product.find({"category": n_category})
      .then(docs => { dataFinal = docs.map(result => data = result.name + ` $` + result.price)
      respon = dataFinal; res.status(200).json(respon);
                                                          })
                                                //Product.find({"category": name_cat})
                                                //.then(doc => {console.log(doc); if (doc) {res.status(200).json({ category: doc, request: { type: 'GET', description: 'Categorias', url: 'http://localhost/3000/products/category' } });} })
      .catch(err => {console.log(err); res.status(500).json({ message: "Categoria Inexistente" }); });
                                              });
// ELIMINAR PRODUCTO POR ID
router.delete('/:productId', (req, res, next) => { const id = req.params.productId; Product.remove({ _id: id })
                                                    .exec()
                                                    .then(result => { res.status(200).json({ eliminados: result.deletedCount}); })
                                                    .catch(err => {console.log(err); res.status(500).json(err); });
                                                     });

// MODIFICAR PRODUCTO POR ID
router.patch('/:productId', (req, res, next) => { const id = req.params.productId; 
                                                        const updateOps = {}; 
                                                        for (const ops of req.body) { updateOps[ops.propName] = ops.value; } 
                                                        Product.update({ _id: id }, { $set: updateOps })
                                                          .exec()
                                                          .then(result => { res.status(200).json(result); })
                                                          .catch(err => {console.log(err); res.status(500).json(err); });
                                                        });

module.exports = router;
