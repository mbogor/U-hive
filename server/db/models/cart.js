'use strict';

var mongoose = require('mongoose');


//user on cart is the buyer and user on a task is a seller
var cartSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
  timeCreated: { type: Date, default: Date.now }, 
  paid: { type: Boolean, default: false },
  processed: { type: Boolean, default: false }
})


											//cartTotal will be passed in from the front end so that we don't need to calculate the cart total here
cartSchema.methods.processCheckout = function(cartTotal) {

	var buyer = mongoose.model('User').findById(this.user);
	var sellers = this.tasks.forEach(function(task){
		mongoose.model('Task').findById(task._id)
	})

	if(buyer.uComb < cartTotal) throw new Error('You do not have enough credit.');

	Promise.all([findBook, findChapter])
  .spread(function (book, chapter) {
    return book.removeChapter(chapter);
  })
  .then(function () {
    res.sendStatus(204);
  })
   .then(null, notFound(next));





	//2. update the buyers credit --remove money
	mongoose.model('User').findById(this.user)
	.then(function(user) {
		if(user.uComb < cartTotal) throw new Error('You do not have enough credit.');
		user.uComb = user.uComb - cartTotal;
	})
	

	//1. update the sellers credit ++add money





	//3. changed the cart status to true
	this.processed = true;
}

mongoose.model('Cart', cartSchema);


