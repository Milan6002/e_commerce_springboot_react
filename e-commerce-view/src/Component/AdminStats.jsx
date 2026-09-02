import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { motion } from 'framer-motion';

function AdminStats() {
    const [stats, setStats] = useState({
        pendingPayments: 0,
        successPayments: 0,
        deliveredOrders: 0,
        totalOrders: 0
    });

    useEffect(() => {
        axios.get("https://e-commerce-springboot-react-8i4i.onrender.com/api/sales")
            .then(res => {
                const orders = res.data || [];
                const pending = orders.filter(o => o.paymentStatus && o.paymentStatus.toUpperCase() === "PENDING").length;
                const success = orders.filter(o => o.paymentStatus && o.paymentStatus.toUpperCase() === "SUCCESS").length;
                const delivered = orders.filter(o => o.status && o.status.toUpperCase() === "DELIVERED").length;
                
                setStats({
                    pendingPayments: pending,
                    successPayments: success,
                    deliveredOrders: delivered,
                    totalOrders: orders.length
                });
            })
            .catch(err => console.error(err));
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemAnim = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="grid px-4 md:px-6 max-w-screen-2xl mx-auto mb-6">
            <motion.div variants={itemAnim} className="col-12 sm:col-6 lg:col-3 p-2">
                <Card className="h-full shadow-2 hover:shadow-4 transition-all transition-duration-300 border-round-xl border-left-3 border-blue-500 surface-0 flex flex-column">
                    <div className="flex justify-content-between mb-3 flex-grow-1">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Orders</span>
                            <div className="text-900 font-bold text-4xl">{stats.totalOrders}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-2xl"></i>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div variants={itemAnim} className="col-12 sm:col-6 lg:col-3 p-2">
                <Card className="h-full shadow-2 hover:shadow-4 transition-all transition-duration-300 border-round-xl border-left-3 border-orange-500 surface-0 flex flex-column">
                    <div className="flex justify-content-between mb-3 flex-grow-1">
                        <div>
                            <span className="block text-500 font-medium mb-3">Pending Payments</span>
                            <div className="text-900 font-bold text-4xl">{stats.pendingPayments}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-clock text-orange-500 text-2xl"></i>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div variants={itemAnim} className="col-12 sm:col-6 lg:col-3 p-2">
                <Card className="h-full shadow-2 hover:shadow-4 transition-all transition-duration-300 border-round-xl border-left-3 border-green-500 surface-0 flex flex-column">
                    <div className="flex justify-content-between mb-3 flex-grow-1">
                        <div>
                            <span className="block text-500 font-medium mb-3">Successful Payments</span>
                            <div className="text-900 font-bold text-4xl">{stats.successPayments}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-check-circle text-green-500 text-2xl"></i>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div variants={itemAnim} className="col-12 sm:col-6 lg:col-3 p-2">
                <Card className="h-full shadow-2 hover:shadow-4 transition-all transition-duration-300 border-round-xl border-left-3 border-purple-500 surface-0 flex flex-column">
                    <div className="flex justify-content-between mb-3 flex-grow-1">
                        <div>
                            <span className="block text-500 font-medium mb-3">Delivered Orders</span>
                            <div className="text-900 font-bold text-4xl">{stats.deliveredOrders}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-box text-purple-500 text-2xl"></i>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}

export default AdminStats;
