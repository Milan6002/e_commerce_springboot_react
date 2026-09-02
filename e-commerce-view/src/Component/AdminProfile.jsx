import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(localStorage.getItem("avtar"));
    const email = localStorage.getItem("email") || "admin@bombayluggage.com";

    const events = [
        { status: 'System Update', date: 'Today 10:30 AM', icon: 'pi pi-cog', color: '#9C27B0' },
        { status: 'Bulk Order Approved', date: 'Yesterday 14:00 PM', icon: 'pi pi-check', color: '#673AB7' },
        { status: 'New Product Added', date: 'Yesterday 09:15 AM', icon: 'pi pi-box', color: '#FF9800' },
        { status: 'Admin Login', date: '2 days ago', icon: 'pi pi-sign-in', color: '#607D8B' }
    ];

    const customizedMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" style={{ backgroundColor: item.color }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card className="shadow-1 mb-3" style={{ padding: '0.5rem' }}>
                <span className="font-bold text-700">{item.status}</span>
                <div className="text-500 text-sm mt-1">{item.date}</div>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-8">
            <Toast ref={toast} />
            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="max-w-screen-xl mx-auto"
            >
                {/* Header Banner */}
                <div className="relative border-round-2xl overflow-hidden shadow-4 mb-6" style={{ height: '200px', background: 'linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)' }}>
                    <div className="absolute top-0 right-0 p-4">
                        <Button label="Edit Profile" icon="pi pi-pencil" className="p-button-rounded p-button-outlined text-white border-white hover:bg-white hover:text-blue-500 transition-colors" onClick={() => toast.current.show({ severity: 'info', summary: 'Coming Soon', detail: 'Edit functionality will be available soon.' })} />
                    </div>
                </div>

                <div className="grid mt-[-80px] px-3 md:px-5">
                    {/* Left Column - Profile Card */}
                    <div className="col-12 lg:col-4">
                        <Card className="shadow-6 border-round-xl border-none text-center relative pt-6 mb-4 lg:mb-0">
                            <div className="absolute flex justify-content-center w-full" style={{ top: '-60px', left: '0' }}>
                                <motion.div whileHover={{ scale: 1.05 }} className="p-1 bg-white border-circle shadow-4">
                                    <Avatar 
                                        image={avatar ? `data:image/jpeg;base64,${avatar}` : null} 
                                        icon={!avatar ? "pi pi-user" : null}
                                        shape="circle" 
                                        className="bg-blue-100 text-blue-600 text-6xl"
                                        style={{ width: '120px', height: '120px' }}
                                    />
                                </motion.div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-900 mt-4 mb-1">Super Admin</h2>
                            <p className="text-500 mb-3">{email}</p>
                            
                            <div className="flex justify-content-center gap-2 mb-4">
                                <Tag severity="success" value="Active" rounded className="px-3" />
                                <Tag severity="info" value="Master Access" rounded className="px-3" />
                            </div>

                            <Divider />

                            <div className="text-left px-3 py-2">
                                <div className="flex align-items-center mb-3">
                                    <i className="pi pi-calendar text-blue-500 mr-3 text-xl"></i>
                                    <div>
                                        <span className="block text-500 text-sm">Joined</span>
                                        <span className="font-semibold text-700">January 2024</span>
                                    </div>
                                </div>
                                <div className="flex align-items-center mb-3">
                                    <i className="pi pi-globe text-blue-500 mr-3 text-xl"></i>
                                    <div>
                                        <span className="block text-500 text-sm">Location</span>
                                        <span className="font-semibold text-700">Ahmedabad, Gujarat</span>
                                    </div>
                                </div>
                                <div className="flex align-items-center">
                                    <i className="pi pi-shield text-blue-500 mr-3 text-xl"></i>
                                    <div>
                                        <span className="block text-500 text-sm">Security Level</span>
                                        <span className="font-semibold text-700">Level 5 (Highest)</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Stats & Activity */}
                    <div className="col-12 lg:col-8">
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <Card className="shadow-2 border-round-xl border-left-3 border-teal-500 hover:shadow-4 transition-all">
                                    <div className="flex justify-content-between align-items-center">
                                        <div>
                                            <span className="text-500 block mb-2">Total System Uptime</span>
                                            <span className="text-900 font-bold text-2xl">99.9%</span>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-teal-100 border-round w-3rem h-3rem">
                                            <i className="pi pi-server text-teal-500 text-xl"></i>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            <div className="col-12 md:col-6">
                                <Card className="shadow-2 border-round-xl border-left-3 border-pink-500 hover:shadow-4 transition-all">
                                    <div className="flex justify-content-between align-items-center">
                                        <div>
                                            <span className="text-500 block mb-2">Actions Today</span>
                                            <span className="text-900 font-bold text-2xl">24</span>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-pink-100 border-round w-3rem h-3rem">
                                            <i className="pi pi-bolt text-pink-500 text-xl"></i>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <Card className="shadow-2 border-round-xl mt-4">
                            <div className="flex align-items-center justify-content-between mb-4">
                                <h3 className="m-0 text-xl font-bold text-800">Recent Admin Activity</h3>
                                <Button icon="pi pi-refresh" className="p-button-rounded p-button-text p-button-plain" />
                            </div>
                            <Timeline value={events} align="left" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default AdminProfile;
