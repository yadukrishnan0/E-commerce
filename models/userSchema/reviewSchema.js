
const mongoose = require('mongoose')
  const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    review:[{UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'usersignups' }, comment: { type: String}}]
    
 });
const reviewModel = mongoose.model('review',reviewSchema)
module.exports = reviewModel;