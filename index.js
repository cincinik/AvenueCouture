window.onload = () => {
    initInterface();
}

function initInterface(){
    getProducts()
    .then(()=>{
        displayProducts()})
    .catch(function(error) {
        alert(error);
    });
}

//Creates necessary number of rows and 4 cards on each row, based on the number of products in the database. Cards will be invisible.
function createRowsandCards(products){
    var divNumber = Math.ceil(products.length/4);
    for(var i = 0; i < divNumber; i++){
        var product_row = document.createElement("div");
        product_row.id = "product_row_" + i;
        product_row.classList.add("card-deck","container");
        document.getElementById("products").appendChild(product_row);
        for(var j=0; j<=3; j++){
            var prod_card = document.createElement("div");
            prod_card.id = "prod_card_" + ((4*i)+j);
            prod_card.classList.add("card", "shadow-none","mb-5","bg-light","text-center");
            document.getElementById(product_row.id).appendChild(prod_card);
            addClass(prod_card.id,"invisible");
        }
    }
}

//Fill one product card with the details of the product and remove the invisible class
function fillProductCard(cardId, product){
    var prod_img = document.createElement("img");
    prod_img.id = cardId + "_img";
    prod_img.classList.add("card-img-top");
    prod_img.src = product.productData.img[0];

    var card_body = document.createElement("div");
    card_body.id = cardId + "_card_body";
    card_body.classList.add("card-body");

    var prod_name = document.createElement("h5");
    prod_name.id = cardId + "_prod_name";
    prod_name.classList.add("card-title");
    prod_name.innerHTML = product.productData.name;

    var prod_price = document.createElement("p");
    prod_price.id = cardId + "_prod_price";
    prod_price.classList.add("card-text");
    prod_price.innerHTML = product.productData.price + " RON";

    var det_btn = document.createElement("a");
    det_btn.id = cardId + "_det_btn";
    det_btn.classList.add("btn", "btn-primary", "stretched-link");
    det_btn.href = "details.html?id=" + product.productId;
    det_btn.innerHTML = "Detalii";
    
    document.getElementById(cardId).appendChild(prod_img);
    document.getElementById(cardId).appendChild(card_body);
    document.getElementById(card_body.id).appendChild(prod_name);
    document.getElementById(card_body.id).appendChild(prod_price);
    document.getElementById(card_body.id).appendChild(det_btn);
    removeClass(cardId,"invisible");
}

//Fill as many cards as products in the DB
function fillCards(products){
    for (var i = 0; i < products.length; i++){
        fillProductCard("prod_card_" + i, products[i])
    }
}

//Render interface
function displayProducts() {
    createRowsandCards(products);  
    fillCards(products);
    updateBadge();
}