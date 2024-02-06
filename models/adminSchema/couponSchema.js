const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        
    },
    upTo: {
        type: Number,
    
    },
    validFrom: {
        type: Date
    },
    validTo: {
        type: Date
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
