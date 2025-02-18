import mongoose from 'mongoose';

const bondDataSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Add other user fields if necessary, like email, password, etc.
  bonds: [
    {
      bond_id: {
        type: String, // or Number, depending on how you define bond_id
        required: true,
      },
      bond_name: {
        type: String,
        required: true,
      },
      bond_type: {
        type: String,
        required: true,
      },
      coupon_rate: {
        type: Number,
        required: true,
      },
      maturity: {
        type: Date,
        required: true,
      },
      face_value: {
        type: Number,
        required: true,
      },
    }
  ]
});

// Export the bond data model
const BondData = mongoose.model('BondData', bondDataSchema);
export default BondData;
