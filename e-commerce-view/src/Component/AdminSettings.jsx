import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { motion } from 'framer-motion';

function AdminSettings() {
    const toast = useRef(null);
    const [storeName, setStoreName] = useState("Bombay Luggage");
    const [email, setEmail] = useState(localStorage.getItem("email") || "admin@example.com");
    const [phone, setPhone] = useState("+91 9876543210");
    const [password, setPassword] = useState("");

    const handleSave = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Settings Saved Successfully', life: 3000 });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-8">
            <Toast ref={toast} />
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="max-w-screen-lg mx-auto"
            >
                <div className="flex align-items-center gap-3 mb-5">
                    <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-teal-600">
                        <i className="pi pi-cog text-2xl"></i>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-900 m-0">Settings</h1>
                        <p className="text-500 m-0 mt-1">Manage your store and account preferences</p>
                    </div>
                </div>

                <div className="grid">
                    <div className="col-12 md:col-4">
                        <Card className="shadow-2 border-round-xl border-none mb-4 md:mb-0">
                            <ul className="list-none p-0 m-0">
                                <li className="p-3 bg-teal-50 text-teal-700 font-bold border-round-md cursor-pointer mb-2 flex align-items-center gap-2">
                                    <i className="pi pi-building"></i> Store Profile
                                </li>
                                <li className="p-3 text-700 hover:surface-hover border-round-md cursor-pointer mb-2 flex align-items-center gap-2 transition-colors">
                                    <i className="pi pi-lock"></i> Security
                                </li>
                                <li className="p-3 text-700 hover:surface-hover border-round-md cursor-pointer mb-2 flex align-items-center gap-2 transition-colors">
                                    <i className="pi pi-bell"></i> Notifications
                                </li>
                            </ul>
                        </Card>
                    </div>

                    <div className="col-12 md:col-8">
                        <Card className="shadow-2 border-round-xl border-none">
                            <h2 className="text-xl font-bold text-800 m-0 mb-4">Store Profile</h2>
                            
                            <div className="flex flex-column gap-2 mb-4">
                                <label className="font-semibold text-700">Store Name</label>
                                <InputText value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full border-round-lg" />
                            </div>

                            <div className="flex flex-column gap-2 mb-4">
                                <label className="font-semibold text-700">Admin Email</label>
                                <InputText value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-round-lg" />
                            </div>

                            <div className="flex flex-column gap-2 mb-4">
                                <label className="font-semibold text-700">Contact Phone</label>
                                <InputText value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-round-lg" />
                            </div>

                            <Divider className="my-5" />

                            <h2 className="text-xl font-bold text-800 m-0 mb-4">Security</h2>

                            <div className="flex flex-column gap-2 mb-4">
                                <label className="font-semibold text-700">Change Password</label>
                                <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask className="w-full" inputClassName="w-full border-round-lg" promptLabel="Choose a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" feedback={false} />
                            </div>

                            <div className="flex justify-content-end mt-5">
                                <Button label="Save Changes" icon="pi pi-check" className="p-button-primary border-round-lg font-bold px-4" onClick={handleSave} />
                            </div>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default AdminSettings;
