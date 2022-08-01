const fetch = require("node-fetch")
require ("dotenv").config()

const {PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET} = process.env;
 const base="https://api-m.sandbox.paypal.com";


exports.createOrder= async function () {

// body...
const accessToken = await generateAcessTokenFetch();
const url=`${base}/v2/checkout/orders`;
const response= await fetch(url, {
 method: "post",
 headers: {
   "Content-Type": "application/json",
   "Authorizarion": `Bearer ${accessToken}`,
 },
 body: JSON.stringify({
   intent: "CAPTURE",
   purchase_units: [
     {
       amount: {
         currency_code: "USD",
         value: "100.00",
       }
     }
   ]
 })
})
const data = await response.json();
console.log(data);
return data;
}

exports.capturePayments= async function(orderId) {
// body...
const accessToken = await generateAcessTokenFetch();
const url=`${base}/v2/checkout/orders/${orderId}/capture`;
const response = await fetch(url, {
 method: "post",
 headers: {
   "Content-Type": "application/json",
   "Authorization": `Bearer ${accessToken}`
 }
})
const data = await response.json();
console.log(data);
return data;
};

async function generateAcessTokenFetch() {
const response= await fetch(base + "/v1/oauth2/token", {
 method: "post",
 body: "grant_type=client_credentials",
 headers: {
   Authorization:
   "Basic" + Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64"),
 },
});
const data = await response.json();
return data;
}
