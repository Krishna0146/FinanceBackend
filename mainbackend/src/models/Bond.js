import mongoose from 'mongoose';

const bondSchema = new mongoose.Schema({
    bond_id: { type: String, required: true, unique: true }, // Unique Bond ID
    bond_name: { type: String, required: true }, // Name of the Bond
    bond_type: { 
        type: String, 
        enum: ['SGB', 'Government', 'Corporate'], 
        required: true 
    }, // Type of Bond
    coupon_rate: { type: Number, required: true }, // Coupon Rate (in %)
    maturity: { type: Date, required: true }, // Maturity Date
    face_value: { type: Number, required: true } // Face Value of the Bond
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const Bond = mongoose.model('Bond', bondSchema);

export default Bond;