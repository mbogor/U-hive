// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
console.log("hello");
require('./user');
require('./cart');
require('./college');
require('./location');
require('./reviews');
require('./tasks');
