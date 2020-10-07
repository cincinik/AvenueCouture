
class CartProduct {
    constructor(id,qty) {
      this.id = id;
      this.qty = qty;
    }
}

class DetailedProduct {
    constructor(qty,img,name,details,price) {
      this.qty = qty;
      this.img = img;
      this.name = name;
      this.details = details;
      this.price = price;
    }
}

const baseUrl = "https://bigfatcart.firebaseio.com/";
const dbUrl = "https://bigfatcart.firebaseio.com/.json";
var products = [];
var cartProducts = [];
var detailedProduct;

// Extract products from the DB in an array
function updateDataModel(response) {
    products = [];
    for (id in response) {
        products.push({
            productId: id,
            productData : response[id]
        });
    }
}


// POST - add new product
function createProduct(newProduct) {   
        return fetch(dbUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
        body: JSON.stringify(newProduct)
    })
    .then(response => console.log(response.json()))
    .catch(error => console.log("Produsul nu a fost adaugat" + error));
}

// GET - return list of products
function getProducts() {   
    products = [];
    return fetch(dbUrl)
    .then(response => response.json())
    .then(responseBody => {
        updateDataModel(responseBody)
    })
    .catch(error => console.log(error));
}

// GET - return detailed game object based on product ID
function getProductDetails(productId) {
    return fetch(baseUrl + productId + ".json")
    .then(response => response.json())
    .then(responseBody => {
        var obj = responseBody;
        detailedProduct = new DetailedProduct(obj.qty, obj.img, obj.name, obj.details, obj.price);
    })
}

// PUT - update game object based on product ID
function updateProduct(alteredProduct, productId) {
    return fetch(baseUrl + productId + ".json", {
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
        body: JSON.stringify(alteredProduct)
    })
    .then(response => response.json())
    .catch(error => console.log(error));
}

// DELETE - delete a product
function deleteProduct(productID) {   
    return fetch(baseUrl + productID + ".json", {
        method: 'DELETE',
    })
    .then(response => console.log(response.json()))
    .catch(error => console.log(error));
}





