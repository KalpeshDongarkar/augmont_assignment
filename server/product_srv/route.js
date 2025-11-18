const express = require('express');
const router = express.Router();

const category_modal = require('./categories/category_modal');
const product_modal = require('./product/product_modal');

//---------------------Categories---------------------//
router.post('/add-category', category_modal.insert_catModal);
router.post('/upd-category', category_modal.update_catModal);
router.get('/get-category', category_modal.getdata_catModal);
router.post('/del-category', category_modal.delete_catModal);
router.get('/get-dropdown-category', category_modal.getCatDrop_catModal);


// //---------------------Product---------------------//
router.post('/add-product', product_modal.insert_prodModal);
router.post('/upd-product', product_modal.update_prodModal);
router.get('/get-product', product_modal.getdata_prodModal);
router.post('/del-product', product_modal.delete_prodModal);

router.post('/del-product-img', product_modal.delete_prdimage);

router.get('/get-product-sheet', product_modal.sheet_prodModal);
router.post('/bulk-Upld-product', product_modal.readproduct_sheet);


router.get('/report-download', product_modal.downloadReport_sheet);




module.exports = router;
