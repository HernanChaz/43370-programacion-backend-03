import express from 'express';
import ProductManager from './productManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager('./products.json');

app.get('/products', async(req, res)=>{
    try {
        const products = await productManager.getProducts();
        const { limit } = req.query;
        if( limit > 0 ){
            const productsSlice = products.slice(0, limit);
            res.status(200).json(productsSlice); 
        } else {
            res.status(200).json(products); 
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/products/:idProduct', async(req, res)=>{
    try {
        const { idProduct } = req.params;
        const product = await productManager.getProductById(Number(idProduct));
        if(product){
            res.json(product)
        } else {
            res.status(400).json({message: 'Product not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.listen(8080, ()=>{
    console.log('Server ok on port 8080');
})