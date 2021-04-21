  // functionality
var currentProduct; // product code (String):  keep track on the current product that is added to cart
var totalCart = []; // product list (Array): keep track on all products in cart

// get product with a specific code
function getProduct(code){
  currentProduct = code;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        // display product details
	 	document.getElementById("product-details").innerHTML = xhttp.responseText
	 	// remove prompt
	 	document.getElementById("product-details-notice").innerHTML = ""
	 	// allow user to modify product's quantity
	 	document.getElementById("product-quantity").innerHTML = "<input type='number' id='quantity' style='width: 60px;' min='0'>"
	 	// allow user to add products to shopping cart
	 	document.getElementById("add-button").innerHTML = "<button onclick='addCart()'>Add</button>"
    }
  };
  // call php code to get a specific product with the product code given
  xhttp.open("GET", "getProduct.php?code=" + code, true);
  xhttp.send();
}

// add product to shopping cart
function addCart(){
    const productQuantity = document.getElementById(`quantity`).value; // get the quantity of the current product user adds
    const validQuantity = validateQuantity(productQuantity) // validate if the quantity is valid
    // calculate subtotal of the current product
    let subtotal = parseFloat((parseInt(productQuantity) * parseFloat(document.getElementById(`product-unit-price-${currentProduct}`).innerHTML)).toFixed(2));
    if(validQuantity){
        // check if it is previously in the cart
        const inCart = totalCart.some(obj => obj.hasOwnProperty(currentProduct))
        if(!inCart){ // if it's never in the cart before
            // put product details to shopping cart
            // allow user to edit product's quantity
            document.getElementById("shopping-cart").innerHTML += "<div class='shopping-cart-grid'><div>" + document.getElementById("product-details").innerHTML + "</div><div><input type='number' min='0' onChange='updateTotal(event, this.value)' onInput='updateTotal(event, this.value)' id='quantity-" + currentProduct + "'style='width: 60px; margin: 50px 0px 0px 80px' value=" + productQuantity + "></div><div style='width: 60px; margin: 50px 0px 0px 80px' id='subtotal-" + currentProduct + "'>" + subtotal +"</div></div><br />"
            // push current product to shopping cart
            totalCart.push({ [currentProduct] : productQuantity})
        } else { // if it's in cart before
            // add the value from previous quantity
            let prevQuantity = document.getElementById(`quantity-${currentProduct}`).value
            // replace old quantity value to new one
            // https://www.reddit.com/r/javascript/comments/180g2a/innerhtml_not_being_updated_after_changing_value/
            document.getElementById(`quantity-${currentProduct}`).value = parseInt(document.getElementById(`quantity-${currentProduct}`).value) + parseInt(productQuantity)
            document.getElementById(`quantity-${currentProduct}`).setAttribute('value', document.getElementById(`quantity-${currentProduct}`).value)
            // replace old subtotal (old subtotal + new subtotal)
            document.getElementById(`subtotal-${currentProduct}`).innerHTML = ((parseInt(prevQuantity) * parseFloat(document.getElementById(`product-unit-price-${currentProduct}`).innerHTML)) + parseFloat(subtotal)).toFixed(2);
            // find current product and replace the object in  shopping cart
            for(let i=0; i < totalCart.length; i++){
                let key = Object.keys(totalCart[i])[0]
                if(key == currentProduct){ // if current product code same with the array
                    // replace the old quantity e.g {2001 : 5}
                    totalCart[i][currentProduct] = parseInt(document.getElementById(`quantity-${currentProduct}`).value)
                }
            }
        }
        
        // display total
        document.getElementById("total-text").innerHTML = "Total";
        document.getElementById("total-num").innerHTML = ((parseFloat(document.getElementById("total-num").innerHTML) || 0) + parseFloat(subtotal)).toFixed(2)
    } else {
        alert("Please insert valid product quantity")
    }
}

// validate product quantity
function validateQuantity(q){
    // if <= 0 and > 20 and decimal: not valid
    if(q <= 0 || q > 20 || q % 1 != 0){
        return false;
    }
    return true;
}

// clear all products in cart
function clearAllCart(){
    // clear shopping carts
    document.getElementById("shopping-cart").innerHTML = "";
    // clear total cost of all products
    document.getElementById("total-text").innerHTML = "";
    document.getElementById("total-num").innerHTML = "";
    // reinitialise array to empty
    totalCart = [];
    // reload page
    window.location.reload();
}

// update subtotal and total when quantity change in shopping cart to make it dynamic
function updateTotal(e, val){
    if(!validateQuantity(val)){ // not valid quantity
        alert("Please insert valid product quantity")
    } else { //valid
        // get the id name
        var t = e.target;
        // some browsers consider text nodes to be a target
        while(t && !t.id) t = t.parentNode;
        if(t) {
          // only get the code of the specific product
          // currentId[1] : product code
          let currentId = t.id.split("-")
           // https://www.reddit.com/r/javascript/comments/180g2a/innerhtml_not_being_updated_after_changing_value/
           // replace the old quantity to the new value
           document.getElementById(`quantity-${currentId[1]}`).setAttribute('value', val)
           // recalculate subtotal (new quantity * price of current product)
           document.getElementById(`subtotal-${currentId[1]}`).innerHTML = (val * parseFloat(document.getElementById(`product-unit-price-${currentId[1]}`).innerHTML)).toFixed(2);
           // find current product and replace the old quantity to new ones in shopping cart array
            for(let i=0; i < totalCart.length; i++){
                let key = Object.keys(totalCart[i])[0]
                if(key == currentId[1]){ // if current product code same with the array
                    // replace the old quantity e.g {2001 : 5}
                    totalCart[i][currentId[1]] = parseInt(val);
                }
            }
        }
        // recalculate the total cost of all products
        let total = 0;
        for(let i=0; i < totalCart.length; i++){
            let key = Object.keys(totalCart[i])[0]
            total += parseFloat(document.getElementById(`subtotal-${key}`).innerHTML)
        }
        // update total cost of all products
        document.getElementById("total-num").innerHTML = (total).toFixed(2)
    }
}

// checkout
function checkout(){
    console.log("totalCart", totalCart)
    let xhttp = new XMLHttpRequest();
    // not valid: if there is nothing in cart
    if (totalCart.length == 0){
      alert("There is nothing in shopping cart!")
    } else { // valid: > 0 items in cart
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let result = JSON.parse(xhttp.responseText);
            for (const [key, value] of Object.entries(result)) {
              console.log(`${key}: ${value}`);
              // alert user if ran out of stock
              if(!value){
                  alert(`item with ID ${key} is not in stock!`)
                  return false;
              }
            }
            // there is stock: direct to checkout.html
            document.getElementById('checkout').innerHTML = "<br /><iframe id='checkout-form' src='checkout.html' style='width:600px; height:800px;'></iframe>";
        }
      }
      // check if the products in shopping cart are in stock
      xhttp.open("POST", "checkProduct.php");
      xhttp.setRequestHeader( "Content-Type", "application/json" );
      // send the { product code : quantity } objects to PHP server
      xhttp.send(JSON.stringify(totalCart)); 
  };
}