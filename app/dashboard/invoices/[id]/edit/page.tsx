import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    // const customers = await fetchCustomers();
    // const invoice = await fetchInvoiceById(id);
    const [customers, invoice] = await Promise.all([
        fetchCustomers(),
        fetchInvoiceById(id)
    ]);

    if (!invoice) {
        notFound();
    }

    const breadcrumb = [
        { 
            label: 'Invoices',
            href: '/dashboard/invoices',
            active: false,
        },
        {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
        }
    ];
   
    return (
        <main>
        <Breadcrumbs breadcrumbs={breadcrumb} />
        <Form invoice={invoice} customers={customers} />
        </main>
    );
}
