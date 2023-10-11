require('dotenv').config();
const express = require('express');
const {shopifyApi, ApiVersion, BillingInterval, Session} = require('@shopify/shopify-api');
const {restResources} = require('@shopify/shopify-api/rest/admin/2023-04');

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  adminApiAccessToken:process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  scopes: ['read_products'],
  hostName: 'quckie-4545.myshopify.com/',
  hostScheme: 'http',
  apiVersion: ApiVersion.April23,
  isEmbeddedApp: false,
  isCustomStoreApp: true,
  isPrivateApp:true,
  restResources,
});

const app = express();

// app.get('/all', async (req, res) => {
    (async ()=>{
        console.log(shopify)
        const sessionId = shopify.session.getOfflineId('quckie-4545.myshopify.com/')
        const session = new Session({
          id: sessionId,
          shop: 'quckie-4545.myshopify.com/',
          state: 'state',
          isOnline: true
        });
        // const session = shopify.session.customAppSession('quckie-4545.myshopify.com')
        
  console.log(session)
  const products = await shopify.rest.Product.all({session,limit:10});
  

  console.log(products);
})();


