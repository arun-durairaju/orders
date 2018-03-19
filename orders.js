var fs = require("fs");

var orders = {};
var orderNode = null;

var nodes = 0;

var addOrderNode = (node, order) => {
  if(!node) {
    node = {
      time: order.updateTime,
      list: {},
      left: null,
      right: null
    };
    node.list[order.product] = order.qty;
    nodes++;
  } else if(order.updateTime < node.time) {
    node.left = addOrderNode(node.left, order);
  } else if(order.updateTime > node.time) {
    node.right = addOrderNode(node.right, order);
  } else {
    if(!node.list[order.product]) {
      node.list[order.product] = 0;
    }
    node.list[order.product] += order.qty;
  }
  return node;
};

var addOrder = (order) => {
  orderNode = addOrderNode(orderNode, order);
  orders[order.id] = order;
}

var getOrder = (orderId) => {
  return orders[orderId];
}

var topProducts = (start, end, n) => {
  var result = getList({list: {}, visit: 0}, orderNode, start, end);
  var prodArray = [];
  for(var prod in result.list) {
    prodArray.push({"product": prod, "quantity": result.list[prod]});
  }
  prodArray.sort((a, b) => {
    return b.quantity - a.quantity;
  });
  console.log("Got Top products from total nodes " + nodes + " by visiting " + result.visit + " nodes." );
  return prodArray.slice(0, n);
}

var getList = (result, node, start, end) => {
  if (node == null) {
    return result;;
  }
  result.visit++;
  if (start < node.time) {
    result =  getList(result, node.left, start, end);
  }
  if (start <= node.time && end >= node.time) {
    result.list = addToList(result.list, node.list);
  }
  if (end > node.time) {
    result =  getList(result, node.right, start, end);
  }
  return result;
}

var addToList = (list, nodeList) => {
    for(var prod in nodeList) {
      if(!list[prod]) {
        list[prod] = 0;
      }
      list[prod] += nodeList[prod];
    }
  return list;
}

module.exports = {
  addOrder,
  topProducts,
  getOrder
};

fs.readFile("orders.csv", "utf8", (err, contents) => {
  var lines = contents.split("\n");
  while(lines.length > 1) {
    var line = lines.pop();
    var props = line.split(",");
    if(props.length < 5) continue;
    var order = {
      id: parseInt(props[0]),
      product: props[1],
      qty: parseInt(props[2]),
      createTime: Date.parse(props[3].replace(/"/g, '')),
      updateTime: Date.parse(props[4].replace(/"/g, ''))
    }
    addOrder(order);
  }
  var topList = topProducts(Date.parse('1998-01-29 18:08:00'), Date.parse('2019-07-23 15:38:00'), 5);
  console.log(topList);
});
