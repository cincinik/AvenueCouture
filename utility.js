// Add specified class from specified emement
function addClass(elementID,className){
    let classes = document.getElementById(elementID).classList;
    classes.add(className);
}

// Remove specified class from specified emement
function removeClass(elementID,className){
    let classes = document.getElementById(elementID).classList;
    classes.remove(className);
}

// Get any param value from an URL - used to get the ID in admin list of prod
function getParamfromURL(queryParam) {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    return urlParams.get(queryParam);
}

// Create row for every element in an array
function createRows(products,tableID,rowID){
    for(var i = 0; i < products.length; i++){
        var table_row =  document.createElement("tr");
        table_row.id = rowID + i;
        document.getElementById(tableID).appendChild(table_row);
    }
}

// Return array containing the products in the local storage(obj with id and qty)
function getCartProducts(){
    cartProducts = JSON.parse(localStorage.getItem("boughtProducts") || "[]");
    return cartProducts;
}

// Updates the badge display of the no of products from the cart
function updateBadge(){
    let badgeQty = 0;
    let cartProd = getCartProducts();
    cartProd.forEach(element => {
        if(element.qty>0){
            badgeQty+=parseInt(element.qty);
        }
    });
    if(badgeQty>0){
        document.getElementById("cart_badge").innerHTML = badgeQty;
        removeClass("cart_badge","hidden");
    }
    else{
        document.getElementById("cart_badge").innerHTML = "";
    }
    return badgeQty;
}

//Finds a specific product based on productID, in the products array that contains all products from the firebase DB
function findDetailedProduct(productID){
    var foundProduct = products.find(element => element.productId==productID);
    return foundProduct;
}

//Finds the index of a specific product based on productID, in the cartProducts array from the local storage
function findProductIndex(productID){
    var i = cartProducts.findIndex(element => element.id==productID);
    return i;
}


// var preloader = document.getElementById("loader");
// function preLoaderHandler(){
//     preloader.style.display = "none";
// }