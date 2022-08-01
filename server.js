 const express = require("express")
 const app=express();
 const fs = require("fs")
 const paypal =require("./paypal.js");
 const port=process.env.PORT || 3011
 //const paypal=require("@paypal/checkout-server-sdk")
 //
 //const pay = require("./paypal.js");
 //require('dotenv').config()


 //const {PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET} = process.env;
//  const base="https://api-m.sandbox.paypal.com";


//middleware
app.use(express.static('public'));
app.use(express.json());
app.set("view engine", "ejs");


app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/home.html')
})

app.get('/shop', (req,res)=>{

  readFile('products.json',(error, data)=>{

    res.render('shop', {
      items:JSON.parse(data),
      paypalClientId: PAYPAL_CLIENT_ID
    })
})
})


app.post("/api/orders", async (req,res)=>{
const order = await paypal.createOrder();
res.json(order);
});

app.post("/api/orders/:orderID/capture", async (req,res)=>{
  const { orderID}= req.params;
  const captureData = await paypal.capturePayments(orderID);
  res.json(captureData);
})

 app.listen(port, ()=>{
   console.log('server is up on port 3011');
 })
