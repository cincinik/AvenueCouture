// window.onload = () => {
//     initInterface();
// }



var loader = document.getElementById('loader');

//Show the animation 
document.addEventListener("DOMContentLoaded", function() {
    loadNow(1);
});

function loadNow(opacity) {
    if (opacity <= 0) {
        hideLoader();
        initInterface();
    } else {
        loader.style.opacity = opacity;
        window.setTimeout(function() {
            loadNow(opacity - 0.025);
        }, 50);
    }
}

//Hide preload animation
function hideLoader() {
    loader.style.display = 'none';
}


// Click on "ADAUGA PRODUS NOU" button will hide the products table and show a form to fill in new product
document.getElementById("admin-add-btn").addEventListener("click",()=>{
    addClass("list_of_products", "d-none");
    removeClass("add_form", "d-none");
});

// Click on "CANCEL" button will hide the new product form and display the table of products
document.getElementById("admin-cancel-btn").addEventListener("click",()=>{
    addClass("add_form", "d-none");
    removeClass("list_of_products", "d-none");
});

// Click on "SAVE" button will hide the new product form and rerender the table of products, containing the newly added product
document.getElementById("admin-save-btn").addEventListener("click",()=>{
    addClass("add_form", "d-none");
    removeClass("admin-products", "d-none");
    var newProduct = getInputProduct("add_form");
    createProduct(newProduct)
    .then(()=>{
        initInterface();
    })
    .catch(function(error) {
        alert("Cannot add product. " + error);
    });
});


// Get form inputs' values and return a DetailedProduct object
function getInputProduct(formID){
    var productImg = document.getElementById(formID + "_imgURL").value;
    var imageArray = productImg.split(",");
    var productName = document.getElementById(formID + "_name").value;
    var productDetails = document.getElementById(formID + "_details").value;
    var productPrice = document.getElementById(formID + "_price").value;
    var productQty = document.getElementById(formID + "_qty").value;
    var newProduct = new DetailedProduct(productQty,imageArray,productName,productDetails, productPrice);
    return newProduct;
}

// Click on "CANCEL" button will hide the new product form and display the table of products
document.getElementById("upd-cancel-btn").addEventListener("click",()=>{
    addClass("upd_form", "d-none");
    removeClass("list_of_products", "d-none");
});

// Click on "SAVE" button will hide the updated product form and rerender the table of products
document.getElementById("upd-save-btn").addEventListener("click",()=>{ 
    var updProduct = getInputProduct("upd_form");
    var productId = getParamfromURL("id");
    updateProduct(updProduct,productId)
    .then(()=>{
        initInterface();                        
    })
    .catch(function(error) {
        alert("Cannot update product. " + error);
    });
    addClass("upd_form", "d-none");
    removeClass("list_of_products", "d-none"); 
});


// Fill one row with specific product details
function fillTableRow(rowID, product){
    
    var cell_img =  document.createElement("td");
    cell_img.id = rowID +"_img";
    var prod_img = document.createElement("img");
    prod_img.src = product.productData.img[0];
    prod_img.id = rowID +"_theimg";  

    var cell_name =  document.createElement("td");
    cell_name.id = rowID +"_name";
    cell_name.innerHTML = `<a id = '${rowID}_product_link' href=''>${product.productData.name}</a>`;
    var cell_price =  document.createElement("td");
    cell_price.id = rowID +"_price";
    cell_price.innerHTML = product.productData.price; 

    var cell_qty =  document.createElement("td");
    cell_qty.id = rowID +"_qty";
    cell_qty.innerHTML = product.productData.qty;

    var cell_btn =  document.createElement("td");
    cell_btn.id = rowID +"_btn";
    cell_btn.innerHTML = `<input id = '${rowID}_remove_btn' type='button' value='REMOVE'>`;
    
    document.getElementById(rowID).appendChild(cell_img);
    document.getElementById(cell_img.id).appendChild(prod_img);
    document.getElementById(rowID).appendChild(cell_name);
    document.getElementById(rowID).appendChild(cell_price);
    document.getElementById(rowID).appendChild(cell_qty);
    document.getElementById(rowID).appendChild(cell_btn);

    document.getElementById(rowID + "_remove_btn").addEventListener("click", () => {
        deleteProduct(product.productId)
        .then(()=>initInterface())
        .catch(function(error) {
        alert("Cannot delete product. " + error);
        });
    });

    document.getElementById(rowID + "_product_link").addEventListener("click",()=>{
        event.preventDefault();
        let stateObj = { id: "100" }; 
        window.history.replaceState(stateObj, "Page 1", "admin.html?id="+ product.productId); 
        getProductDetails(product.productId)
        .then(()=> {
            prefillForm(detailedProduct);  
            addClass("list_of_products", "d-none");
            removeClass("upd_form", "d-none");
        })
        .catch(function(error) {
            alert("Cannot fill form" + error);
        });

    });
}

// Fill each row from products array with products details
function fillRows(products){
    for (var i = 0; i < products.length; i++){
        fillTableRow("table_row_" + i, products[i])
    }
}

// Render admin page with table of products
function initInterface(){
    products = [];
    document.getElementById("products_tbody").innerHTML="";
    getProducts()
    .then(()=>{
        createRows(products,"products_tbody","table_row_");
        fillRows(products);})
    .catch(function(error) {
        alert(error);
    });
}

// Prefill form with product details
function prefillForm(detailedProduct){
    document.getElementById("upd_form_imgURL").value = detailedProduct.img;
    document.getElementById("upd_form_name").value = detailedProduct.name;
    document.getElementById("upd_form_details").innerHTML = detailedProduct.details;
    document.getElementById("upd_form_price").value = detailedProduct.price;
    document.getElementById("upd_form_qty").value = detailedProduct.qty;
}

