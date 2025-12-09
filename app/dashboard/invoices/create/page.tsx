import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
    const customers = await fetchCustomers();

    // Breadcrumb
    const breadcrumb = [
        { 
            label: 'Invoices',
            href: '/dashboard/invoices',
            active: false,
        },
        {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
        }
     ];
 
    return (
        <main>
        <Breadcrumbs breadcrumbs={breadcrumb} />
        <Form customers={customers} />
        </main>
    );
}