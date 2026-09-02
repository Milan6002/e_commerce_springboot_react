import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

function AdminRecentOrders() {
    const [recentOrders, setRecentOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://e-commerce-springboot-react-8i4i.onrender.com/api/sales")
            .then(res => {
                // Get the last 5 orders (assuming the array might not be strictly sorted, we reverse it to get latest)
                const data = res.data || [];
                const sorted = data.reverse().slice(0, 5);
                setRecentOrders(sorted);
            })
            .catch(err => console.error(err));
    }, []);

    const statusBodyTemplate = (rowData) => {
        const status = rowData.status ? rowData.status.toUpperCase() : 'PENDING';
        let severity = 'info';
        if (status === 'DELIVERED') severity = 'success';
        else if (status === 'CANCELLED') severity = 'danger';
        else if (status === 'SHIPPED') severity = 'warning';
        return <Tag value={status} severity={severity} />;
    };

    const paymentBodyTemplate = (rowData) => {
        const method = rowData.paymentMethod ? rowData.paymentMethod.toUpperCase() : 'PENDING';
        let severity = 'info';
        if (method.includes('CARD') || method.includes('ONLINE')) severity = 'success';
        else if (method.includes('CASH')) severity = 'warning';
        return <Tag value={method} severity={severity} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button icon="pi pi-eye" className="p-button-rounded p-button-text p-button-sm p-button-secondary" onClick={() => navigate('/sales')} />
        );
    };

    return (
        <Card className="h-full shadow-2 hover:shadow-4 transition-all transition-duration-300 border-round-xl border-none">
            <div className="flex justify-content-between align-items-center mb-4">
                <h3 className="m-0 text-xl font-bold text-700">Recent Orders</h3>
                <Button label="View All" className="p-button-text p-button-sm" onClick={() => navigate('/sales')} />
            </div>
            
            <DataTable value={recentOrders} size="small" responsiveLayout="scroll" emptyMessage="No recent orders found.">
                <Column field="id" header="Order ID" style={{ width: '15%' }}></Column>
                <Column field="totalAmount" header="Amount" body={(rowData) => `₹${rowData.totalAmount?.toLocaleString() || 0}`} style={{ width: '20%' }}></Column>
                <Column field="status" header="Order" body={statusBodyTemplate} style={{ width: '25%' }}></Column>
                <Column field="paymentMethod" header="Payment" body={paymentBodyTemplate} style={{ width: '25%' }}></Column>
                <Column header="View" body={actionBodyTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
            </DataTable>
        </Card>
    );
}

export default AdminRecentOrders;
