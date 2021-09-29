import { Request, Response } from 'express';
import Bill from '../model/billsModel';



export const getBills = async (userId: string) => {
  const bill = await Bill.find({ userId });
  return { data: bill };
};

export const uploadBill = async (userId: string, details: string, amount: number) => {
  try {
    const newBill = await Bill.create({ userId, details, amount });
    return { data: { ...newBill } };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const editBill = async (userId: string, billId: string, details: string, amount: number) => {
  const bill = await Bill.findById(billId);
  if (!bill) return { error: 'Bill not found' };
  if (bill.userId !== userId) return { error: 'Unauthorized access' };
  if (details) {
    bill.details = details;
  }
  if (amount) {
    bill.amount = amount;
  }
  const updatedBill = await bill.save();
  return { data: { ...updatedBill } };
};

export const deleteBill = async (userId: string, billId: string) => {
  const bill = await Bill.findById(billId);
  if (!bill) {
    return { error: 'Bill not found' };
  }
  if (bill.userId !== userId) {
    return { error: 'Unauthorized access' };
  }
  await bill.remove();
  return { success: 'Bill deleted successfully' };
};


