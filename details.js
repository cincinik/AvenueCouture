var detailedProduct;
var newQty;


window.onload = () => {
    var product_id =  getParamfromURL("id");
    renderPage(product_id);
};

function renderPage(product_id) {
    getProductDetails(product_id)
    .then(()=> {
        fillDetails(detailedProduct);
    })
    .catch(function(error) {
        alert(error);
    });
}

document.getElementById("add_to_cart_btn").addEventListener("click", ()=> {
    getProducts()
    .then(()=>
        addProductToCart())
    .catch(function(error) {
    alert("Cannot add product. " + error);
    });
});

//Fill the product details in the predefined html elements
function fillDetails(product){
    document.getElementById("det_img1").src = product.img[0];
    document.getElementById("det_img2").src = product.img[1];
    document.getElementById("det_img3").src = product.img[2];
    document.getElementById("det_img4").src = product.img[3];
    document.getElementById("det_prod_name").innerHTML = product.name;
    document.getElementById("det_prod_price").innerHTML = product.price + " RON";
    generateDetailsList("det_prod_details",product);
    document.getElementById("qty_info").innerHTML = "Disponibile: " + product.qty + " produse";
    document.getElementById("qty").setAttribute("max", product.qty);
    if(parseInt(product.qty)===0){
        document.getElementById("add_to_cart_btn").setAttribute("disabled","true");
    }
    updateBadge();
}

//Split details string by * and create a bullet list of details
function generateDetailsList(listID,product){
    var detArray = product.details.split("*");
    for(var i=0; i<detArray.length; i++){
        var li = document.createElement("li");
        li.id = "det_li_" + i;
        li.innerHTML = detArray[i];
        document.getElementById(listID).appendChild(li);
    }
}

//Show a toast if product is added to the cart
function showToast() {
    addClass("added_to_cart_toast","show");
    setTimeout(hideToast, 1500);
}

//Hide the toast message - function without parameters, to be passed as argument in an async setTimeout function
function hideToast(){
    removeClass("added_to_cart_toast","show");
}

//Add product to cart. Check if product is already in the cart. If so, only add the qty. If new product,push it in the cartProducts array
function addProductToCart(){
    var boughtQty = parseInt(document.getElementById("qty").value,10);
    var stock = document.getElementById("qty").getAttribute("max");
    if(boughtQty<1){
        alert("Adauga minim 1 produs!");
    }
    else if(boughtQty > stock){
        alert("Numarul maxim de bucati pe care il poti adauga este: " + stock);
    }else{
        var productId = getParamfromURL("id");
        var cartProduct = new CartProduct(productId,boughtQty);
        getCartProducts();
        var i = findProductIndex(productId);
        if(i>=0){
            if((boughtQty + parseInt(cartProducts[i].qty))<= stock){
                cartProducts[i].qty += boughtQty;
            }else{
                cartProducts[i].qty = stock;
                alert("Ai deja in cos numarul maxim de produse");
            }
        } else {
            cartProducts.push(cartProduct);
        }
        localStorage.setItem("boughtProducts", JSON.stringify(cartProducts));
        updateDisplayStock(productId);
        updateBadge();
        showToast();
        document.getElementById("qty").innerHTML = "" ;
    }
}

//Update just the qty from the info about the stock
function updateDisplayStock(productID){
    detailedProduct = (findDetailedProduct(productID)).productData;
    var displayQty = parseInt(detailedProduct.qty);
    getCartProducts();
    var i = findProductIndex(productID);
    displayQty -= cartProducts[i].qty;
    document.getElementById("qty_info").innerHTML = "Disponibile: " + displayQty + " produse";
    if(displayQty===0){
        document.getElementById("add_to_cart_btn").setAttribute("disabled","true");
    }
}

