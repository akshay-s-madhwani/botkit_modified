const axios = require('axios');
module.exports = class Shopify {
  constructor(access_token) {
    this.access_token = access_token;
    this.templates = {
      fb: {
        button: {
          "template_type": "button",
          "buttons": []
        },
        buttons: {
          "type": "postback",
          "title": "Products",
          "payload": "payload"
        },
        url_buttons: {
          "type": "web_url",
          "title": "Open Link",
          "url": "http://botkit.ai",
          "webview_height_ratio": "full"
        },
        generic: {
          "template_type": "generic",
          "elements": []
        },
        receipt: {
          "type": "template",
          "payload": {
            "template_type": "receipt",
            "recipient_name": "Stephane Crozatier",
            "order_number": "12345678902",
            "currency": "USD",
            "payment_method": "Visa 2345",
            "order_url": "http://originalcoastclothing.com/order?order_id=123456",
            "timestamp": "1428444852",
            "address": {
              "street_1": "1 Hacker Way",
              "street_2": "",
              "city": "Menlo Park",
              "postal_code": "94025",
              "state": "CA",
              "country": "US"
            },
            "summary": {
              "subtotal": 75,
              "shipping_cost": 4.95,
              "total_tax": 6.19,
              "total_cost": 56.14
            },
            "adjustments": [
              {
                "name": "New Customer Discount",
                "amount": 20
              }
            ],
            "elements": [
              {
                "title": "Classic White T-Shirt",
                "subtitle": "100% Soft and Luxurious Cotton",
                "quantity": 2,
                "price": 50,
                "currency": "USD",
                "image_url": "http://originalcoastclothing.com/img/whiteshirt.png"
              }
            ]
          }
        },
        generic_elements: {
          title: "",
          buttons: [],
          subtitle: "",
          item_url: "",
          image_url: ""
        },
      },
      teams: {}
    },
      this.default = function() {
        return {
          title: "",
          subtitle: "",
          payload: "",
          url: "",
          image_url: "",
          item_url: "",
          type: "",
          template_type: "",
          buttons: [],
          elements: []
        };
      };
  }

  async fetchProducts( type , limit) {
    const headers = {
      'X-Shopify-Access-Token': this.access_token
    }
    const response = await axios(`https://quckie-4545.myshopify.com/admin/api/2023-04/products.json?limit=${limit}`, { headers } );
    let {data} = await response;
    
    
    
    let parsed_data = data.products.map(item => {
      let default_data = this.default();
      default_data['title'] = item.title;
      default_data['subtitle'] = item.description || item.tags;
      default_data['images'] = item.images.map(i=>{ return { url : i.src }});
      default_data['type'] = type;
      default_data['price'] = !isNaN(item.variants[0].title) ? item.variants[0].title: item.variants[0].price;
      return default_data;
    });
    return parsed_data;
  }

  getMethod(methodName){
    return typeof this[methodName] === 'function' ? this[methodName].bind(this) : null
  }

  convertIntoTemplate(platform, template, data, extras) {
    if (!['fb', 'slack', 'team'].includes(platform)) {
      return { success: false, error: "unsupported platform" };
    }
    if (!['buttons', 'text', 'generic', 'receipt', 'product', 'coupon'].includes(template)) {
      return { success: false, error: "unsupported template" };
    }

    if(platform == 'fb'){
      if(template == 'generic'){
        return data.map(item=>{
            return {
              "title":item.title,
              "subtitle":item.subtitle,
              "text":item.subtitle,
              "images":item.images,
              ...extras
            }
        })
      }
    }


  }

};


// Function to create an order
// export async function createOrder(orderData) {
//     const response = await fetch(`https://${shopifyDomain}/admin/api/2021-04/orders.json`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(orderData)
//     });
//     const data = await response.json();
//     console.log(data);
// }

// // Function to fetch all collections
// export async function fetchCollections() {
//     const response = await fetch(`https://${shopifyDomain}/admin/api/2021-04/custom_collections.json`, { headers });
//     const data = await response.json();
//     console.log(data);
// }

// // Function to fetch products from a collection
// export async function fetchProductsFromCollection(collectionId) {
//     const response = await fetch(`https://${shopifyDomain}/admin/api/2021-04/collections/${collectionId}/products.json`, { headers });
//     const data = await response.json();
//     console.log(data);
// }

// // Function to fetch a single product
// export async function fetchSingleProduct(productId) {
//     const response = await fetch(`https://${shopifyDomain}/admin/api/2021-04/products/${productId}.json`, { headers });
//     const data = await response.json();
//     console.log(data);
// }

// // Call the functions
// fetchProducts();
// createOrder({
//     "order": {
//         "line_items": [
//             {
//                 "variant_id": 447654529,
//                 "quantity": 1
//             }
//         ]
//     }
// });
// fetchCollections();
// fetchProductsFromCollection(841564295);
// fetchSingleProduct(632910392);
