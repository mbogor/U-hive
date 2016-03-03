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

// sballan I think you should calculate it on the back end too for validation purposes
cartSchema.methods.processCheckout = function(cartTotal) {
  var cart = this;

  // sballan by this point buyer should probably be available to you, either via the session object or previous population
  mongoose.model('User').findById(this.buyer)
  .then(function(buyer){
    if (buyer.uComb < cartTotal) { throw  new Error('You do not have enough credit.');}
    else{
      // sballan Dont you also have to decrement their credit?
      cart.processed = true;
      cart.save();
      return checkoutTasks();
    }
  })
  .then(null, next);
  // sballan maybe this function is a good place to decrement Buyer credit.
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

  // sballan This functions should take money away from one and give money to the other; Both halves!
  function processPayment(task){
    return mongoose.model('User').findById(task.seller)
    .then(function(seller){
      seller.uComb += task.price
      return seller.save();
    });
  }
}



mongoose.model('Cart', cartSchema);


