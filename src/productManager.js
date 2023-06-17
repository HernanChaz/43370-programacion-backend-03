import fs from 'fs';

export default class ProductManager {
    
    static #contadorProductos = 0;

    constructor(path){
        this.path = path
    }

    async addProduct( product ) {

        product.id = this.#getMaxId();
        const products = await this.getProducts();
        products.push( product );

        try {
            await fs.promises.writeFile( this.path, JSON.stringify( products ) );
            return product;
        } catch ( error ) {
            console.log( error );
        }

    }

    async getProducts() {
        
        try {
            if( fs.existsSync( this.path ) ) {
                const products = await fs.promises.readFile( this.path, 'utf-8' );
                const productsJs = JSON.parse( products );
                return productsJs;
            } else {
                return [];
            }
        } catch ( error ) {
            console.log( error );
        }

    }

    async getProductById( id ) {

        const products = await this.getProducts();

        let encontrado;
        if( id ) {
            encontrado = products.find( prod => prod.id == id );
            return encontrado || `Error, no existe producto con id = ${id}`;
        }
        return "Debe proporcionar un id para la búsqueda";
    }

    async deleteProduct( id ) {

        try {
            if( fs.existsSync( this.path ) ) {
                const products = await this.getProducts();
                const productsUpdate = products.filter( prod => prod.id != id );
                if( products.length == productsUpdate.length ) {
                    console.log( `Error, no existe producto con id = ${id}` )
                } else {
                    await fs.promises.writeFile( this.path, JSON.stringify( productsUpdate ) );
                }
            }
        } catch ( error ) {
            console.log( error );
        }

    }

    async updateProduct( id = -1, fields ) {

        try{

            const products = await this.getProducts();
    
            let idx = products.findIndex( prod => prod.id == id );
            if( idx >= 0 ) {
                const modificado =  { ...products[idx], ...fields };
                products[idx] = modificado;
                await fs.promises.writeFile( this.path, JSON.stringify( products ) );
            } else {
                return `Error, no existe producto con id = ${id}`;
            }

        } catch ( error ){
            console.log( error );
        }

    }

    #getMaxId() {
        return ++ProductManager.#contadorProductos;
    }
}


// // TESTING
// console.log("<--- Inciando Testing --->\n");

// // Creo instancia de ProductManager
// const productManager = new ProductManager("./products.json");

// // Creo producto de prueba
// const prod1 = {
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25
// }
// const prod2 = {
//     title: "producto prueba2",
//     description: "Este es un producto prueba2",
//     price: 100,
//     thumbnail: "Sin imagen2",
//     code: "abc456",
//     stock: 50
// }
// const fields = {
//     title: "producto actualizado",
//     description: "Descripcion actualizada",
//     price: 456
// }

// const test = async ()=> {
    
//     const products = await productManager.getProducts();
//     console.log( "primera consulta", products );
    
//     await productManager.addProduct( prod1 );
//     const products2 = await productManager.getProducts();
//     console.log( "segunda consulta", products2 );
    
//     await productManager.addProduct( prod2 );
//     const products3 = await productManager.getProducts();
//     console.log( "tercera consulta", products3 );

//     const prodById = await productManager.getProductById(2);
//     console.log("getProductById(2)", prodById);

//     const prodById2 = await productManager.getProductById(5);
//     console.log("getProductById(5)", prodById2);

//     await productManager.updateProduct(1, fields);
//     const products4 = await productManager.getProducts();
//     console.log( "cuarta consulta", products4 );

//     await productManager.deleteProduct(12);

//     await productManager.deleteProduct(1);
//     const products5 = await productManager.getProducts();
//     console.log( "quinta consulta", products5 );
// }

// test();