import { v1 as uuid } from 'uuid';
import { uploadData, findData, deleteData, findUsersBill } from '../db/dynamo';




export const getBills = async (userId: string) => {
  const bill = await findUsersBill(userId);
  const { error } = bill as { [key: string]: string; };
  if (error) {
    return { error: error };
  }
  return { bills: bill };
};

export const uploadBill = async (userId: string, description: string, amount: string) => {
  try {
    const num = Number(amount)
    if(typeof num !== "number") return { error: "Invalid amount" }
    amount = num.toFixed(2);
    const bill = await uploadData('getbits-bills', { id: uuid(), userId, description, amount });
    const { error } = bill as { [key: string]: string; };
    if (error) {
      return { error };
    }
    return { bills: [bill] };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const editBill = async (userId: string, billId: string, description: string, amount: string) => {
  const bill = await findData('getbits-bills', { id: billId });
  if (!bill) return { error: 'Bill not found' };
  if (bill.error) return { error: bill.error };
  if (bill.userId !== userId) return { error: 'Unauthorized access' };
  if (description) {
    bill.description = description;
  }
  if (amount) {
    bill.amount = amount;
  }
  const data = await uploadData('getbits-bills', bill);
  const { error } = data as { [key: string]: string; };
    if (error) {
      return { error };
    }
  return { bills: [bill] };
};

export const deleteBill = async (userId: string, billId: string) => {
  const bill = await findData('getbits-bills', { id: billId });
  if (!bill) {
    return { error: 'Bill not found' };
  }
  if (bill.error) return { error: bill.error };
  if (bill.userId !== userId) {
    return { error: 'Unauthorized access' };
  }
  await deleteData('getbits-bills', { id: billId });
  return { success: 'Bill deleted successfully' };
};


