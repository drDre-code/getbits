import mongoose, { Schema, Document } from 'mongoose';
// import { Info } from '../utils';

interface Info {
  userId: string;
  details: string;
  amount: number;
}

const removeDecimal = (val: number) => {
  return val * 100 | 0;
};

const setDecimal = (val: number) => {
  return (val / 100).toFixed(2);
};

const billSchema = new Schema<Info>({
  userId: { type: String, required: true },
  details: { type: String, required: true },
  amount: { type: Number, required: true, set: removeDecimal, get: setDecimal },
}, {
  timestamps: true,
});

billSchema.index({ userId: 1 });

const Bill = mongoose.model('Bill', billSchema);


export = Bill;
