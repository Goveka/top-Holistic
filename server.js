 const express = require('express');
 const app=express();
 const fs = require('fs');
 const paypal=require("@paypal/checkout-server-sdk")
 const fetch = require('node-fetch');
 require('dotenv').config()

//middleware
app.use(express.static('public'))
app.use(express.json());
app.set("view engine", "ejs");

const storeItems = new Map([
  [1, { price:100, name: 'learn javascript with me'}],
  [2, { price: 200, name: "learn nodejs with me"}],
])

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/home.html')
})

app.get('/shop', (req,res)=>{

fs.readFile('products.json',(error, data)=>{

    res.render('shop', {
      items:JSON.parse(data),
      paypalClientId: 'AQ_fVMf7V711fi1PebB-yuvmquXNdibSSiPIWXACkGXtvZxgYscG5YlCgOlInzdQBa4x7SpD8Aosxsvq'
    })

})
})

//paypal Client
const Environment = process.env.NODE_ENV === 'production'
 ? paypal.core.LiveEnvironment
 : paypal.core.SandboxEnvironment

const paypalClient=new paypal.core.PayPalHttpClient(new Environment(process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET))

app.post('/createOrder', async (req,res)=>{
  const request = await new paypal.orders.OrdersCreateRequest()
  const total= req.body.items.reduce((a, b) => {
    return a + storeItems.get(b.id).price * b.quantity
  }, 0)
  request.prefer("return-representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount:{
          currency_code: 'USD',
          value: total,
          breakdown: {
            item_total:{
              currency_code: 'USD',
              value: total
            }
          }
        },
        items: req.body.items.map(item =>{
          const storeItem =storeItems.get(item.id)
          return{
            name: storeItem.name,
            unit_amount: {
              currency_code: "USD",
              value:storeItem.price
            },
            quantity: item.quantity
          }
        })
      }
    ]
  })

  try {
    const order = await paypalClient.execute(request)
    res.json({ id: order.result.id})
    console.log(order);
  } catch (e) {
    res.status(500).json({error: e.message})
  }

})


 app.listen(3011, ()=>{
   console.log('server is up on port 3011');
 })
