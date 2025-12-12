'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(formData: FormData) {
    // Validate form using Zod
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // console.log({customerId, amountInCents, status, date})

    try {
       await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      console.error(error);
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }

    // 清除此缓存并向服务器发出新的请求，以获取更新的数据
    revalidatePath('/dashboard/invoices');
    // 重定向到 /dashboard/invoices 页面
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    // Validate form using Zod
    const {customerId, amount, status} = UpdateInvoice.parse({
        id: formData.get('id'),
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    try {
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
      // We'll also log the error to the console for now
      console.error(error);
      return { message: 'Database Error: Failed to Update Invoice.' };
    }

    // 清除此缓存并向服务器发出新的请求，以获取更新的数据
    revalidatePath('/dashboard/invoices');
    // 重定向到 /dashboard/invoices 页面
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
      // We'll also log the error to the console for now
      console.error(error);
      return { message: 'Database Error: Failed to Delete Invoice.' };
    }
  
    revalidatePath('/dashboard/invoices');
}