import mongoose, { Schema } from 'mongoose';

interface User {
  [key: string]: string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: { createdAt: true },
});

const User = mongoose.model('User', userSchema);

export = User;
