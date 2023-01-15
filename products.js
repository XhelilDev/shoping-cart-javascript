/* app.js */



const productsEl=document.querySelector(".products");
const cartItemsEl=document.querySelector(".cart-items");
const subTotal=document.querySelector(".subtotal");
const totalItemsInCartEl=document.querySelector(".total-items-in-cart");


//Renderimi i produkteve

let products=[];

    
function renderProducts(){
   
    fetch('https://dummyjson.com/products')
.then(response => response.json())
.then(data =>{
    
    let products=data.products
    console.log(products)
     
    products.forEach((product)=>{

        
        productsEl.innerHTML+=`

        <div class="item">
        <div class="item-container">
            <div class="item-img">
                <img src="${product.thumbnail}" alt="${product.title}">
            </div>
            <div class="desc">
                <h2>${product.title}</h2>
                <h2><small></small>$${product.price}</h2>
                <p>
                ${product.description.substring(0,30)}...
                </p>
            </div>
            <div class="add-to-wishlist">
                <img src="./assets/img/heart.png" alt="add to wish list">
            </div>
            <div class="add-to-cart" onclick="addToCart(${product.id})">
                <img src="./assets/img/bag-plus.png" alt="add to cart">
            </div>
        </div>
        </div> 
        
        `;

        
    
    })

    })

}


renderProducts();


//Kart Array
let cart=JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

//Vendo ne Kart

// function addToCart(id){
    
//    const item=products.find((product)=>product.id===id);
//    console.log(item);
// }


function addToCart(id){
   
fetch('https://dummyjson.com/products')
.then(response => response.json())
.then(data =>{
    
    let products=data.products
    
     
 if(cart.some((item)=>item.id===id)){
   changeNumberofUnits('plus',id)
 }else{
    const item=products.find((product)=>product.id===id);
    cart.push({
        ...item,
    numberOfUnits:1});
    console.log(cart)
}
        
updateCart();
    
    })

   

}

function updateCart(){
    renderCartItems();
    renderSubtotal();

    //Ruajtja e artikujve ne LocalStorage

    localStorage.setItem("CART",JSON.stringify(cart))
}

//Kalkulimi dhe paraqitja e totalit ne faqe

function renderSubtotal(){
    let totalPrice=0,totalItems=0;

    cart.forEach((item)=>{
        totalPrice+=item.price*item.numberOfUnits;
        //totalItems+=item.numberOfUnits;
    });

    subTotal.innerHTML=`Subtotal (${totalItems} items): Eur${totalPrice.toFixed(2)}`;
    //totalItemsInCartEl.innerHTML=totalItems;
}

function renderCartItems(){
    cartItemsEl.innerHTML="";// Fshirja e elementeve
    cart.forEach((item)=>{
        
       
        cartItemsEl.innerHTML+= `  
        <div class="cart-item">
        <div class="item-info" onclick="removeItemfromCart(${item.id})" title="Kliko nëse dëshironi ta fshini artikullin">
            <img src="${item.thumbnail}" alt="${item.title}">
            <h4>${item.title}</h4>
        </div>
        <div class="unit-price">
            <small>$</small>${item.price}
        </div>
        <div class="units">
            <div class="btn minus" onclick="changeNumberofUnits('minus',${item.id})">-</div>
            <div class="number">${item.numberOfUnits}</div>
            <div class="btn plus" onclick="changeNumberofUnits('plus',${item.id})">+</div>           
        </div>
    </div>
    `;
    console.log(cartItemsEl)
    });
   
}

//Funksion per fshirjen e te dhenave nga karta

function removeItemfromCart(id){
    cart=cart.filter((item)=>(item.id!==id));
    updateCart();

}


//Funksion per ndryshimin e sasise se artikujve

function changeNumberofUnits(action,id){

    cart=cart.map((item)=>{

        let numberOfUnits=item.numberOfUnits
        
        if(item.id===id){
            if(action==="minus" && numberOfUnits>1){
                numberOfUnits--;
            } 
            
            else if(action==="plus"&&numberOfUnits<item.stock){

                numberOfUnits++;
            }
        }
        return {
            ...item,
            numberOfUnits,
        };

    });

    updateCart();

}


// Funksion per te bere kerkim te te dhenave

 function searchProducts(query){
    const url=`https://dummyjson.com/products/search?q=${query}`
    fetch(url)
    .then(response => response.json())
    .then(data =>{
        
        let products=data.products
        const results=products.map(product=>product.title)
        if(results.length>0){ renderSearchResults(products)}
        else
        productsEl.innerHTML="<p>---Nuk u gjeten produkte nga kerkimi!</p>"
       
        console.log(renderProducts)

        
        
        })    
}

  function renderSearchResults(products){
productsEl.innerHTML="";
    products.forEach((product)=>{

        
        productsEl.innerHTML+=`

        <div class="item">
        <div class="item-container">
            <div class="item-img">
                <img src="${product.thumbnail}" alt="${product.title}">
            </div>
            <div class="desc">
                <h2>${product.title}</h2>
                <h2><small></small>$${product.price}</h2>
                <p>
                ${product.description.substring(0,30)}...
                </p>
            </div>
            <div class="add-to-wishlist">
                <img src="./assets/img/heart.png" alt="add to wish list">
            </div>
            <div class="add-to-cart" onclick="addToCart(${product.id})">
                <img src="./assets/img/bag-plus.png" alt="add to cart">
            </div>
        </div>
        </div> 
        
        `;

        
    
    })

  }





  let searchTimeoutToken=0;
  const searchBarEl=document.getElementById("kerko");
window.addEventListener('load', document.getElementById("kerko").onkeyup=(event)=>{
    clearTimeout(searchTimeoutToken);{
   
   
        if(searchBarEl.value.trim().length===0){
            return;
        }
        searchTimeoutToken=setTimeout(()=>{
            searchProducts(searchBarEl.value);
        },250);
       


};
   
})


//-----------------------------------------------
 function searchByCategory(item1){

    
    fetch(`https://dummyjson.com/products/category/${item1}`)
.then(response => response.json())
.then(data =>{
    
    let products=data.products
    

    const catProd = products.map(product => product.category)
         if(catProd.length>0){ renderProdBySearchCategory(products)}
       else
        productsEl.innerHTML="<p>---Nuk u gjeten produkte nga kerkimi!</p>"
       
       console.log(renderProducts)

     console.log(catProd)

   


})
}

 function renderProdBySearchCategory(products){

    productsEl.innerHTML="";
    products.forEach((product)=>{

        
        productsEl.innerHTML+=`

        <div class="item">
        <div class="item-container">
            <div class="item-img">
                <img src="${product.thumbnail}" alt="${product.title}">
            </div>
            <div class="desc">
                <h2>${product.title}</h2>
                <h2><small></small>$${product.price}</h2>
                <p>
                ${product.description.substring(0,30)}...
                </p>
            </div>
            <div class="add-to-wishlist">
                <img src="./assets/img/heart.png" alt="add to wish list">
            </div>
            <div class="add-to-cart" onclick="addToCart(${product.id})">
                <img src="./assets/img/bag-plus.png" alt="add to cart">
            </div>
        </div>
        </div> 
        
        `;

          //const selectElement = document.querySelector('.ice-cream');

    
    })

 

  }


 

//   let searchTimeoutTokenS=0;
// window.addEventListener('load', document.getElementById("kerko-c").onkeyup=(event)=>{
//     clearTimeout(searchTimeoutTokenS);{
//     const searchBarElS=document.getElementById("kerko-c");
   
//         if(searchBarElS.value.trim().length===0){
//             return;
//         }
//         searchTimeoutTokenS=setTimeout(()=>{
//             searchByCategory(searchBarElS.value);
//         },250);
       


// };
   
// })



//  window.onload=()=>{
     
    
//     document.querySelector('.filtro').addEventListener('change', (event) => {
//     // const productCategory=document.querySelector('.filtro');
//     searchByCategory(event.target.value);
//  });

//  }

// window.addEventListener('load',
// document.getElementById("#filter-select").addEventListener('change', (event) => {
  
//     searchByCategory(event.target.value);
    


// }));



   









