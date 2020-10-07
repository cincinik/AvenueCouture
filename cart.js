
var detailedProductsCart = [];
var alteredProduct;
var total;

window.onload = () => {
    initInterface();
}


// After products are bought, update the stock in the firebase DB and delete all products from the local storage array(set empty array)
document.getElementById("buy_now_btn").addEventListener("click", () => {
    addClass("list_of_products","hidden");
    removeClass("order_confirmation","hidden");
    cartProducts.forEach(element=>updateStock(element.id, element.qty));
    cartProducts = [];
    localStorage.setItem("boughtProducts", JSON.stringify(cartProducts));
    updateBadge();
});

// Returns array of products from the local storage, or empty array if "boughtProducts" isn't set yet(no product has been aded to cart yet)
function getCartProducts(){
    cartProducts = JSON.parse(localStorage.getItem("boughtProducts") || "[]");
    return cartProducts;
}

// Fill one row with specific product details
function fillTableRow(rowID, product){
    
    var cell_img =  document.createElement("td");
    cell_img.id = rowID +"_img";
    var prod_img = document.createElement("img");
    prod_img.src = findDetailedProduct(product.id).productData.img[0];
    prod_img.id = rowID +"_theimgc";  

    var cell_name =  document.createElement("td");
    cell_name.id = rowID +"_name";
    cell_name.innerHTML = `<a id = '${rowID}_cart_product_link' href='details.html?id=${product.id}'>${findDetailedProduct(product.id).productData.name}</a>`;
    
    var cell_price =  document.createElement("td");
    cell_price.id = rowID +"_price";
    cell_price.innerHTML = findDetailedProduct(product.id).productData.price; 

    var cell_qty =  document.createElement("td");
    cell_qty.id = rowID +"_qty";
    var minus = document.createElement("span");
    minus.id = rowID +"_plus";
    minus.innerHTML = `<input id = '${rowID}_minus_btn' type='button' value='-'>`;
    var qty = document.createElement("span");
    qty.id = rowID +"_cart_qty";
    qty.innerHTML = product.qty;
    var plus = document.createElement("span");
    plus.id = rowID +"_plus";
    plus.innerHTML = `<input id = '${rowID}_plus_btn' type='button' value='+'>`;

    var cell_subtotal =  document.createElement("td");
    cell_subtotal.id = rowID +"_subtotal";
    cell_subtotal.innerHTML = parseInt(findDetailedProduct(product.id).productData.price) * parseInt(product.qty);

    var cell_btn =  document.createElement("td");
    cell_btn.id = rowID +"_btn";
    cell_btn.innerHTML = `<input id = '${rowID}_remove_btn' type='button' value='STERGE'>`;
    
    document.getElementById(rowID).appendChild(cell_img);
    document.getElementById(cell_img.id).appendChild(prod_img);
    document.getElementById(rowID).appendChild(cell_name);
    document.getElementById(rowID).appendChild(cell_price);
    document.getElementById(rowID).appendChild(cell_qty);
    document.getElementById(cell_qty.id).appendChild(minus);
    document.getElementById(cell_qty.id).appendChild(qty);
    document.getElementById(cell_qty.id).appendChild(plus);
    document.getElementById(rowID).appendChild(cell_subtotal);
    document.getElementById(rowID).appendChild(cell_btn);

    if((parseInt(findDetailedProduct(product.id).productData.price) * parseInt(product.qty))>0){
        total+=parseInt(findDetailedProduct(product.id).productData.price) * parseInt(product.qty);
    }
    
    //Logic for minus button
    document.getElementById(rowID + "_minus_btn").addEventListener("click", () => {
        if(product.qty>1){
            product.qty-=1;
            getCartProducts();
            var i = findProductIndex(product.id);
            if(i>=0){
                cartProducts[i].qty = product.qty;
            } 
            localStorage.setItem("boughtProducts", JSON.stringify(cartProducts)); 
            qty.innerHTML = product.qty;
            cell_subtotal.innerHTML = parseInt(findDetailedProduct(product.id).productData.price) * parseInt(product.qty);
            total-=parseInt(findDetailedProduct(product.id).productData.price);
            updateBadge();
            fillTotalList();
        } else {
            alert("Daca te-ai razgandit, sterge produsul din cos!");
        }
    });


    // Logic for plus button
    document.getElementById(rowID + "_plus_btn").addEventListener("click", () => {
        if(product.qty < findDetailedProduct(product.id).productData.qty){
            product.qty+=1;
            getCartProducts();
            var i = findProductIndex(product.id);
            if(i>=0){
                cartProducts[i].qty = product.qty;
            } 
            localStorage.setItem("boughtProducts", JSON.stringify(cartProducts)); 
            qty.innerHTML = product.qty;          
            cell_subtotal.innerHTML = findDetailedProduct(product.id).productData.price * (product.qty);
            total+=parseInt(findDetailedProduct(product.id).productData.price);
            updateBadge();
            fillTotalList();
        }else{
            alert("Ai atins numarul maxim de bucati pe care le poti comanda!")  
        }  
    });

    document.getElementById(rowID + "_remove_btn").addEventListener("click", () => {
        var index = findProductIndex(product.id);
        cartProducts.splice(index,1);
        localStorage.setItem("boughtProducts", JSON.stringify(cartProducts)); 
        initInterface();
    });
}


// Fill totals. Transport is 0, from 200 RON, 15 RON under.
function fillTotalList(){
    document.getElementById("prod_no").innerHTML="Nr produse: " + updateBadge();
    document.getElementById("vat").innerHTML="TVA 19% inclus";
    if(cartProducts.length===0){
        total = 0;
    }
    if(total>199 || cartProducts.length===0){
        document.getElementById("transport").innerHTML="Transport: 0 RON";
    }
    else{
        document.getElementById("transport").innerHTML="Transport: 15 RON";
        total+=15;
    }
    document.getElementById("total").innerHTML="" ;
    document.getElementById("total").innerHTML="TOTAL: " + total + " RON" ;
}

// Fill each row from products array with products details
function fillRows(products){
    for (var i = 0; i < products.length; i++){
        fillTableRow("cart_row_" + i, products[i])
    }
}

// Render cart page with table of products
function initInterface(){
    total=0;
    document.getElementById("cart_tbody").innerHTML="";
    var cartProd = getCartProducts();
    if(cartProd.length>0){
        document.getElementById("buy_now_btn").removeAttribute("disabled");
        getProducts()
        .then(()=>{
            createRows(cartProd,"cart_tbody","cart_row_");
            fillRows(cartProd)
            updateBadge();
            fillTotalList();
        })
        .catch(function(error) {
            alert(error);
    });
    } else {
        document.getElementById("buy_now_btn").setAttribute("disabled","true");
        updateBadge();
        fillTotalList();
    }
}
//Update product stock in the firebase DB, deducting the bought quantity
function updateStock(productID, qty){
    alteredProduct = findDetailedProduct(productID).productData;
    alteredProduct.qty -=qty;
    updateProduct(alteredProduct, productID);
}