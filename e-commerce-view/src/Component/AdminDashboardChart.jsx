import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { motion } from 'framer-motion';

function AdminDashboardChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        // Dummy data for the past 7 days - ideally this would be fetched from backend
        const data = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [
                {
                    label: 'Revenue (₹)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    data: [12500, 15000, 9500, 22000, 18000, 25000, 29000]
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: { color: '#495057' }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#6c757d' },
                    grid: { color: '#ebedef' }
                },
                y: {
                    ticks: { color: '#6c757d' },
                    grid: { color: '#ebedef' }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <Card className="h-full shadow-2 hover:shadow-4 transition-all transition-duration-300 border-round-xl border-none">
            <div className="flex justify-content-between align-items-center mb-4">
                <h3 className="m-0 text-xl font-bold text-700">Weekly Revenue</h3>
                <i className="pi pi-chart-line text-blue-500 text-xl"></i>
            </div>
            <div style={{ height: '300px' }}>
                <Chart type="line" data={chartData} options={chartOptions} style={{ height: '100%' }} />
            </div>
        </Card>
    );
}

export default AdminDashboardChart;
