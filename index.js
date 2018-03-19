var express = require("express");
var path = require('path');
var app = express();
var bodyParser = require("body-parser");
var orders = require("./orders.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(port, function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

var router = express.Router();
app.use('/api', router);

router.use(function(req, res, next) {
    next(); 
});

router.route("/orders/top").get((req, res) => {
  var n = 5;
  if(req.query.n) {
    n = parseInt(req.query.n);
  };
  var topProds = orders.topProducts(Date.parse(req.query.start), Date.parse(req.query.end), n);
  res.json(topProds);
});

router.route("/orders/:orderId").get((req, res) => {
  console.log("Getting order: " + req.params.orderId);
  var order = orders.getOrder(parseInt(req.params.orderId));
  res.json(order);
});

router.route("/orders").post((req, res) => {
console.log(req.body);
  console.log("Posting a new order");
  var order = {
    id: parseInt(req.body.id),
    product: req.body.product,
    qty: parseInt(req.body.qty),
    createTime: new Date(),
    updateTime: new Date()
  };
  if(req.body.createTime) {
    order.createTime = Date.parse(req.body.createTime);
  }
  if(req.body.updateTime) {
    order.updateTime = Date.parse(req.body.updateTime);
  }
  console.log("Saving order");
  console.log(order);
  orders.addOrder(order);
  res.send("Saved order");
});

