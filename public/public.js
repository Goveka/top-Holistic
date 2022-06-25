
// getting all the elements

const bars=document.getElementById('bars');
const nav=document.getElementById('nav');
const xx=document.getElementById('x');
const itemImg=document.querySelectorAll('.item-img')[0];
const itemPrice=document.querySelectorAll('.item-price')[0];
const itemDiscription=document.querySelectorAll('.item-discripion')[0];


// the quantity of the cart function



//funtions for displaying the navigation and hiding the navigation

bars.addEventListener('click',()=>{
  nav.style.display="flex";
})

xx.addEventListener('click', ()=>{
  nav.style.display="none";
})

// Adding items to chat
const addButtons=document.querySelectorAll('.button').forEach((button, i) => {
button.addEventListener('click', function addTocart(event) {
  let shopImg=event.target.previousElementSibling.previousElementSibling.previousElementSibling.src;
  let shopDiscription=event.target.previousElementSibling.previousElementSibling.innerText
  let shopPrice=event.target.previousElementSibling.innerText;;

let newRow=document.createElement('div');
newRow.classList.add('newRow')
let cartItems=document.getElementById('cart-items');
let cartRowContents=`
<div class="item">
  <img class="cart-image" src="${shopImg}" alt="hello">
  <span class="cart-title">hello</span>
</div>
<span class="price" id="price">${shopPrice}</span>
<div class="quantity">
  <input type="number" class="item-quantity" value="1">
  <button type="button" class="danger">REMOVE</button>
</div>
`
newRow.innerHTML=cartRowContents
cartItems.appendChild(newRow);


let quantityElement=document.querySelectorAll('.item-quantity').forEach((item, i) => {
  item.addEventListener('change', function changed (event){
    let input=event.target;
    if(isNaN(input.value) || input.value <=0){
      input.value=1
    }
    let cartItemsContainer=document.querySelectorAll('.cart-items')[0];
    let cartRows=cartItemsContainer.querySelectorAll('.newRow');
    let total=0;
    for (var i = 0; i < cartRows.length; i++) {
      let cartR=cartRows[i]
      let priceElement=cartR.querySelectorAll('.price')[0];
      let quantityElement=cartR.querySelectorAll('.item-quantity')[0];
      let price=parseFloat(priceElement.innerText);
      let qauntity=quantityElement.value;
      total=total+(price*qauntity)
    }
    total=Math.round(total *100)/100
    document.getElementById('total').innerText='R'+ total;
  })
});

//cart total
let cartItemsContainer=document.querySelectorAll('.cart-items')[0];
let cartRows=cartItemsContainer.querySelectorAll('.newRow');
let total=0;
for (var i = 0; i < cartRows.length; i++) {
  let cartR=cartRows[i]
  let priceElement=cartR.querySelectorAll('.price')[0];
  let quantityElement=cartR.querySelectorAll('.item-quantity')[0];
  let price=parseFloat(priceElement.innerText);
  let qauntity=quantityElement.value;
  total=total+(price*qauntity)
}
total=Math.round(total *100)/100
document.getElementById('total').innerText='price'+ ':'+ 'R'+ total;

// number of elements in cart
let numberOfProducts=document.getElementById('numberOfProducts');
numberOfProducts.innerText= 'Number of products'+ ':' +cartItems.childElementCount

// removing items from the cart;
let removeFrmCart=document.querySelectorAll('.danger').forEach((item, i) => {
  item.addEventListener('click', function removetoCart(event){


    // number of elements in cart
    let numberOfProducts=document.getElementById('numberOfProducts');
    numberOfProducts.innerText='Number of products'+ ':' + cartItems.childElementCount-1

  let cartItemsContainer=document.querySelectorAll('.cart-items')[0];
  let cartRows=cartItemsContainer.querySelectorAll('.newRow');
  let total=0;
  for (var i = 0; i < cartRows.length; i++) {
    let cartR=cartRows[i]
    let priceElement=cartR.querySelectorAll('.price')[0];
    let quantityElement=cartR.querySelectorAll('.item-quantity')[0];
    let price=parseFloat(priceElement.innerText);
    let qauntity=quantityElement.value;
    total=total+(price*qauntity)
  }
  total=Math.round(total *100)/100
  document.getElementById('total').innerText='Price'+ ':'+ 'R'+ total;
    return event.target.parentElement.parentElement.remove();
      });
     });
})
});

// the viewing of the cartItems

function viewcart(){
  let cart=document.getElementById('shopping-cart');
  cart.style.display="block";

  let shop=document.getElementById('shop');
  shop.style.display="none";

  let closeCart=document.getElementById('closeCart');
  closeCart.style.display="block";

  let carticon=document.getElementById('cart');
  carticon.style.display="none";
}

function closeCart() {
  let cart=document.getElementById('shopping-cart');
  cart.style.display="none";

  let shop=document.getElementById('shop');
  shop.style.display="flex";

  let closeCart=document.getElementById('closeCart');
  closeCart.style.display="none";

  let carticon=document.getElementById('cart');
  carticon.style.display="block";
}

//paypal Buttons
paypal.Buttons({


      // Sets up the transaction when a payment button is clicked

      createOrder: function(data, actions) {

        return fetch('/createOrder',{
          method: "POST",
          headers: {
            "Content-Type": 'application/json'
          },
          body:JSON.stringify({
            items: [{
              id: 1,
              qauntity: 2
            },
            {
              id: 2,
              quantity:3
            }
          ]
          })
        }).then(res => {
          if (res.ok) return res.json()
          return res.json().then(json => Promise.reject(json))
        }).then(({ id})=> {
          return id
        }).catch(err => {
          console.error(err.error);
        })

      },


      // Finalize the transaction after payer approval

      onApprove: function(data, actions) {

        return fetch(`/createOrder`,{
          method: "post"
        }).then(res => res.json()).then(function(orderData) {

          // Successful capture! For dev/demo purposes:

              console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

              var transaction = orderData.purchase_units[0].payments.captures[0];

              alert('Transaction '+ transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');


          // When ready to go live, remove the alert and show a success message within this page. For example:

          // var element = document.getElementById('paypal-button-container');

          // element.innerHTML = '';

          // element.innerHTML = '<h3>Thank you for your payment!</h3>';

          // Or go to another URL:  actions.redirect('thank_you.html');

        });

      }

    }).render('#paypal-button-container')
