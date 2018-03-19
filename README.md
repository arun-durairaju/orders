# orders

The implementation can be accessed in the site: http://54.166.76.213/

The apis can also be accessed directly: 
  Save order (POST): http://54.166.76.213/api/orders
  
  Get Order (GET): http://54.166.76.213/api/orders/<order_id> eg. - http://54.166.76.213/api/orders/646138264
  
  Top Products (GET) : http://54.166.76.213/api/orders/top?start=<start datetime>&end=<end datetime>&n=<count>
      eg. - http://54.166.76.213/api/orders/top?start=2000-01-29T18:08&end=2012-07-23T15:38&n=5
  
- The orders are stored in memory and the implementation of the same is in orders.js
- When an order is stored, it is stored in a hashmap like Object with order Id as the key.
- The order is also added to a BST with the updateTime as key and the products and their quantity are aggregated at each node.
- When asked for top products in a time range, the BST is traversed in in-order and visits only the nodes within the time range. While visiting a node, the list of products and their quantity are aggregate in a temporary list.
- Finally, the list is ordered and returns the top 'n' count of the list in JSON format.
  
  Save order expects JSON order object in the body of the POST request:
      {
       "id": 646138264,
       "product": "Reebox Shorts",
        "qty": 8,
        "createTime": 1264227109000,
        "updateTime": 1437675037000
      }
