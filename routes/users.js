var express = require('express');
var axios = require('axios');
var router = express.Router();
const moment = require('moment');


/* POST webhook endpoint */
router.post('/', function (req, res, next) {
  let orderid = req.body.queryResult.parameters.orderid;
  let intent = req.body.queryResult.intent.displayName;

  if (orderid === '31313') {
    // Print the order ID in the terminal
    console.log('Order ID:', orderid);

    // Make a POST request to the Order Status API
    axios
      .post('https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus', {
        orderId: orderid
      })
      .then(function (response) {
        // Extract the shipment date from the API response
        let shipmentDate = response.data.shipmentDate;
        let formattedDate = moment(shipmentDate).format('dddd, DD MMM YYYY');
        console.log(formattedDate); // Output: Thursday, 18 Aug 2022

        // Construct the response to be sent to Dialogflow
        let responseJson = {
          fulfillmentMessages: [
            {
              text: {
                text: [`Your order with ID ${orderid} will be shipped on ${formattedDate}.`]
              }
            }
          ]
        };

        // Send the response back to Dialogflow
        res.send(responseJson);
      })
      .catch(function (error) {
        console.log(error);
        // Handle any errors that occurred during the API request

        // Construct the response for error case
        let responseJson = {
          fulfillmentMessages: [
            {
              text: {
                text: ['Sorry, there was an error retrieving the shipment date.']
              }
            }
          ]
        };

        // Send the response back to Dialogflow
        res.send(responseJson);
      });
  } else {
    // Construct the response for invalid order ID
    let responseJson = {
      fulfillmentMessages: [
        {
          text: {
            text: ['Invalid order ID. Please try again.']
          }
        }
      ]
    };

    // Send the response back to Dialogflow
    res.send(responseJson);
  }
});

module.exports = router;
