import { Request, Response } from 'express';
import { v1 as uuid } from 'uuid';
import { uploadData, findData, deleteData, findUsersBill } from '../dynamo';




export const getBills = async (userId: string) => {
  const bill = await findUsersBill(userId);
  const { error } = bill as { [key: string]: string; };
  if (error) {
    return { error: error };
  }
  return { data: bill };
};

export const uploadBill = async (userId: string, description: string, amount: string) => {
  try {
    const bill = { id: uuid(), userId, description, amount };
    await uploadData('getbits-bills', bill);
    return { data: [bill] };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const editBill = async (userId: string, billId: string, description: string, amount: string) => {
  const bill = await findData('getbits-bills', { id: billId });
  if (!bill) return { error: 'Bill not found' };
  if (bill.userId !== userId) return { error: 'Unauthorized access' };
  if (description) {
    bill.description = description;
  }
  if (amount) {
    bill.amount = amount;
  }
  await uploadData('getbits-bills', bill);
  return { data: [bill] };
};

export const deleteBill = async (userId: string, billId: string) => {
  const bill = await findData('getbits-bills', { id: billId });
  if (!bill) {
    return { error: 'Bill not found' };
  }
  if (bill.userId !== userId) {
    return { error: 'Unauthorized access' };
  }
  await deleteData('getbits-bills', { id: billId });
  return { success: 'Bill deleted successfully' };
};


