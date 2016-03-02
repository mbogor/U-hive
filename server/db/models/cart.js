'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

//user on cart is the buyer and user on a task is a seller
var cartSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
  timeCreated: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false }
})


//cartTotal will be passed in from the front end so that we don't need to calculate the cart total here
cartSchema.methods.processCheckout = function(cartTotal) {
  var cart = this;

  mongoose.model('User').findById(this.buyer)
  .then(function(buyer){
    if (buyer.uComb < cartTotal) { throw  new Error('You do not have enough credit.');}
    else{
      cart.processed = true;
      cart.save();
      return checkoutTasks();
    }
  })
  .then(null, next);

  function checkoutTasks (){
    return Promise.map(cart.tasks, function(taskId){
      return mongoose.model('Task').findById(taskId)
    })
    .then(function(taskArr){
      return Promise.map(taskArr, function(task){
        task.purchased = true;
        return processPayment(task);
      });
    });
  }

  //returns a promise for the updated seller
  function processPayment(task){
    return mongoose.model('User').findById(task.seller)
    .then(function(seller){
      seller.uComb += task.price
      return seller.save();
    });
  }
}



mongoose.model('Cart', cartSchema);


