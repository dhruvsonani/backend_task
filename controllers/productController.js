const express = require('express');
const router = express.Router();
const axios = require('axios');
const Product = require('../models/Product');

const saveProductstoDB = async(req,res,next) => {
        try{
            const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
            const responseData = await response.data;
            const savedDocuments = await Product.insertMany(responseData);
            console.log(savedDocuments);
            res.send({status:200, dataSaved: savedDocuments})
        }
        catch(error){
            console.log(error);
            res.send({status:500, data: error})
        }
}

const getAllProducts = async (req,res,next) => {
    let page = parseInt(req.query.page) || 1;
    const limit = 10;
    if (page< 1) page = 1;
    const skip = (page - 1) * limit;


    const products = await Product.find().skip(skip).limit(limit);
    if(!products){
        return res.json({error: 'No products found!', products: []})
    }
    else{
        return res.json({status: 200, products: products})
    }
}

const getAllProductsWithoutPagination = async (req,res,next) => {
    const products = await Product.find()
    if(!products){
        return res.json({error: 'No products found!', products: []})
    }
    else{
        return res.json({status: 200, products: products})
    }
}

const getProductsByMonth = async (req,res,next) => {
    const enteredMonth = req.query.month;
    let page = parseInt(req.query.page) || 1;
    const limit = 10;
    if (page< 1) page = 1;
    const skip = (page - 1) * limit;

    const products = await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, enteredMonth] } }).skip(skip).limit(limit);
    if(!products){
        res.json({message: "No products found"})
    }
    else{
        res.json({status: 200, data: products})
    }
}

const getSearchedProduct = async (req,res,next) => {
    const searchTerm = req.query.term;
    let page = parseInt(req.query.page) || 1;
    const limit = 10;
    if (page< 1) page = 1;
    const skip = (page - 1) * limit;

    const isNumber = !isNaN(parseFloat(searchTerm)) && isFinite(searchTerm);
    const regex = new RegExp(searchTerm, 'i');
    let searchConditions = {
        $or: [
            { title: regex },
            { description: regex }
        ]
    };
    if (isNumber) {
        searchConditions.$or.push({ price: parseFloat(searchTerm) });
    }
    const results = await Product.find(searchConditions).skip(skip).limit(limit);
    if(!results){
        console.log("No results found")
    }
    else{
        res.json({status: 200, results})
    }
}

const getStatistics = async (req,res,next) => {
    const enteredMonth = req.query.month;
    const products = await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, enteredMonth] } })
    
    totalProducts = products.length;
    totalSales = 0
    sold = 0
    notSold = 0
    for (let i = 0; i < totalProducts; i++){
        if(products[i]['sold'] == true){
            totalSales += parseFloat(products[i]['price'])
            sold += 1
        }
        else{
            notSold +=1
        }
    }

    res.json({status: 200, totalSales: totalSales, ProductsSold: sold, ProductsNotSold: notSold})
}

const getBarChartData = async (req,res,next) => {
    const enteredMonth = req.query.month;

    const products = await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, enteredMonth] } });
    const ranges = {
        '0-100': 0,
        '101-200': 0,
        '201-300': 0,
        '301-400': 0,
        '401-500': 0,
        '501-600': 0,
        '601-700': 0,
        '701-800': 0,
        '801-900': 0,
        '901-above': 0
    };
    products.forEach(product => {
        const price = product['price'];
        if (price >= 0 && price <= 100) ranges['0-100']++;
        else if (price >= 101 && price <= 200) ranges['101-200']++;
        else if (price >= 201 && price <= 300) ranges['201-300']++;
        else if (price >= 301 && price <= 400) ranges['301-400']++;
        else if (price >= 401 && price <= 500) ranges['401-500']++;
        else if (price >= 501 && price <= 600) ranges['501-600']++;
        else if (price >= 601 && price <= 700) ranges['601-700']++;
        else if (price >= 701 && price <= 800) ranges['701-800']++;
        else if (price >= 801 && price <= 900) ranges['801-900']++;
        else if (price >= 901) ranges['901-above']++;
    });
    res.json({status: 200, priceRange_and_NumberofProducts: ranges});
    
}

const getPieChartData = async(req,res,next) => {
    const enteredMonth = req.query.month;
    const allProducts = await Product.find();
    const products = await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, enteredMonth] } })
    const categories = allProducts.map(product => product.category);
    const uniqueCategories_DB = [...new Set(categories)];
    const uniqueCategories = uniqueCategories_DB.reduce((acc, category) => {
        acc[category] = 0;
        return acc;
    }, {});
    products.forEach(product => {
        const category = product['category'];
        if (category == 'electronics') uniqueCategories['electronics']++;
        else if (category == "men's clothing") uniqueCategories["men's clothing"]++
        else if (category == "women's clothing") uniqueCategories["women's clothing"]++
        else if (category == 'jewelery:') uniqueCategories['jewelery:']++
    });
    res.json({status: 200, categories_and_NumberOfProducts: uniqueCategories});
}

const combinedResults = async(req,res,next) => {
    const enteredMonth = req.query.month;
    console.log(enteredMonth);
    statistics_API = await axios.get(`http://localhost:3000/api/statistics?month=${enteredMonth}`)
    responseData1 = await statistics_API.data
    pieChartAPI = await axios.get(`http://localhost:3000/api/get-data-for-pieChart?month=${enteredMonth}`)
    responseData2 = await pieChartAPI.data
    barChartAPI = await axios.get(`http://localhost:3000/api/get-data-for-barChart?month=${enteredMonth}`)
    responseData3 = await barChartAPI.data

    res.json({status: 200, statistics_API: responseData1, pieChartAPI: responseData2, barChartAPI: responseData3})
}


exports.saveProductstoDB = saveProductstoDB;
exports.getAllProducts = getAllProducts;
exports.getSearchedProduct = getSearchedProduct;
exports.getProductsByMonth = getProductsByMonth;
exports.getStatistics = getStatistics;
exports.getBarChartData = getBarChartData;
exports.getPieChartData = getPieChartData;
exports.combinedResults = combinedResults;
exports.getAllProductsWithoutPagination = getAllProductsWithoutPagination;
