const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', (req,res,next) => {
    res.json({message: 'This is products API', getAllProducts: 'Go to /get-all-products to get all products'})
})

router.get('/get-all',productController.getAllProductsWithoutPagination);
router.get('/get-all-products', productController.getAllProducts);
router.get('/save-products-to-DB',productController.saveProductstoDB);
router.get('/search',productController.getSearchedProduct);
router.get('/get-products-by-month',productController.getProductsByMonth);
router.get('/statistics',productController.getStatistics);
router.get('/get-data-for-barChart', productController.getBarChartData);
router.get('/get-data-for-pieChart',productController.getPieChartData);
router.get('/combined-results', productController.combinedResults);

module.exports = router;
