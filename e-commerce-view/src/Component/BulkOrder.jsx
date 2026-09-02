import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { motion } from "framer-motion";

import AdminServices from '../Services/AdminServices';

function BulkOrder() {
    const toast = useRef(null);
    const location = useLocation();
    
    // Product passed from ViewProduct
    const prefillProduct = location.state?.product;
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phone: "",
        category: null,
        quantity: null,
        requirements: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (prefillProduct) {
            setFormData(prev => ({
                ...prev,
                requirements: `I am interested in bulk ordering the product: ${prefillProduct.product_name}.\nPrice: ₹${prefillProduct.price}\n\nPlease let me know the bulk pricing.\n\n`
            }));
        }
    }, [prefillProduct]);

    const categories = [
        { name: 'Luggage', code: 'LUG' },
        { name: 'Backpacks', code: 'BP' },
        { name: 'Duffle Bags', code: 'DB' },
        { name: 'Mixed/Other', code: 'OTH' }
    ];

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.firstName) tempErrors.firstName = "First Name is required";
        if (!formData.lastName) tempErrors.lastName = "Last Name is required";
        if (!formData.companyName) tempErrors.companyName = "Company Name is required";
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Invalid email format";
        }

        if (!formData.phone) tempErrors.phone = "Phone number is required";
        if (!formData.category) tempErrors.category = "Please select a category";
        if (!formData.quantity || formData.quantity < 10) tempErrors.quantity = "Minimum bulk quantity is 10";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                // Prepare data for backend (extract string from category object)
                const submissionData = {
                    ...formData,
                    category: formData.category ? formData.category.name : null
                };

                await AdminServices.submitBulkOrderInquiry(submissionData);

                // Show success toast
                toast.current?.show({ 
                    severity: 'success', 
                    summary: 'Inquiry Submitted!', 
                    detail: 'Our wholesale team will contact you within 24 hours.', 
                    life: 5000 
                });
                
                // Reset form
                setFormData({
                    firstName: "",
                    lastName: "",
                    companyName: "",
                    email: "",
                    phone: "",
                    category: null,
                    quantity: null,
                    requirements: ""
                });
            } catch (error) {
                console.error("Error submitting inquiry:", error);
                toast.current?.show({ 
                    severity: 'error', 
                    summary: 'Submission Failed', 
                    detail: 'There was a problem submitting your inquiry. Please try again.', 
                    life: 4000 
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Form Incomplete', 
                detail: 'Please fix the errors in the form before submitting.', 
                life: 3000 
            });
        }
    };

    return (
        <div className="min-h-screen surface-ground p-4 md:p-6 lg:p-8">
            <Toast ref={toast} />
            
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-nogutter gap-5 lg:gap-8">
                    
                    {/* Left Column: Information & Benefits */}
                    <div className="col-12 lg:col-5 flex flex-column justify-content-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Business & Corporate</span>
                            <h1 className="text-900 font-bold text-5xl mb-4 leading-tight">Wholesale & Bulk Orders</h1>
                            <p className="text-600 text-lg line-height-3 mb-5">
                                Whether you're looking for corporate gifts, retail distribution, or equipping your team, our premium bags are available at exclusive wholesale rates.
                            </p>

                            <div className="flex flex-column gap-4">
                                <div className="flex align-items-center gap-4">
                                    <div className="bg-blue-100 border-circle flex align-items-center justify-content-center" style={{ width: '4rem', height: '4rem' }}>
                                        <i className="pi pi-tag text-blue-600 text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-900 font-bold m-0 mb-1">Exclusive Pricing</h3>
                                        <p className="text-600 m-0">Unlock significant discounts based on your order volume.</p>
                                    </div>
                                </div>

                                <div className="flex align-items-center gap-4">
                                    <div className="bg-green-100 border-circle flex align-items-center justify-content-center" style={{ width: '4rem', height: '4rem' }}>
                                        <i className="pi pi-headphones text-green-600 text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-900 font-bold m-0 mb-1">Dedicated Support</h3>
                                        <p className="text-600 m-0">A dedicated account manager to handle your requirements.</p>
                                    </div>
                                </div>

                                <div className="flex align-items-center gap-4">
                                    <div className="bg-orange-100 border-circle flex align-items-center justify-content-center" style={{ width: '4rem', height: '4rem' }}>
                                        <i className="pi pi-box text-orange-600 text-2xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-900 font-bold m-0 mb-1">Custom Orders</h3>
                                        <p className="text-600 m-0">Options for customized branding and specific colorways.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: The Form */}
                    <div className="col-12 lg:col flex">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full"
                        >
                            <Card className="w-full shadow-4 border-round-2xl surface-0 p-3 md:p-5 h-full">
                                <h2 className="text-2xl font-bold text-900 mb-2 mt-0">Request a Quote</h2>
                                <p className="text-500 mb-5">Fill out the details below and we'll get back to you shortly.</p>
                                
                                <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                                    <div className="grid">
                                        <div className="col-12 md:col-6 flex flex-column gap-2 mb-3">
                                            <label htmlFor="firstName" className="font-semibold text-700">First Name *</label>
                                            <InputText id="firstName" name="firstName" value={formData.firstName} onChange={handleFieldChange} className={errors.firstName ? 'p-invalid w-full' : 'w-full'} />
                                            {errors.firstName && <small className="p-error">{errors.firstName}</small>}
                                        </div>
                                        <div className="col-12 md:col-6 flex flex-column gap-2 mb-3">
                                            <label htmlFor="lastName" className="font-semibold text-700">Last Name *</label>
                                            <InputText id="lastName" name="lastName" value={formData.lastName} onChange={handleFieldChange} className={errors.lastName ? 'p-invalid w-full' : 'w-full'} />
                                            {errors.lastName && <small className="p-error">{errors.lastName}</small>}
                                        </div>
                                    </div>

                                    <div className="flex flex-column gap-2 mb-1">
                                        <label htmlFor="companyName" className="font-semibold text-700">Company / Organization *</label>
                                        <InputText id="companyName" name="companyName" value={formData.companyName} onChange={handleFieldChange} className={errors.companyName ? 'p-invalid w-full' : 'w-full'} />
                                        {errors.companyName && <small className="p-error">{errors.companyName}</small>}
                                    </div>

                                    <div className="grid">
                                        <div className="col-12 md:col-6 flex flex-column gap-2 mb-3">
                                            <label htmlFor="email" className="font-semibold text-700">Business Email *</label>
                                            <InputText id="email" name="email" value={formData.email} onChange={handleFieldChange} className={errors.email ? 'p-invalid w-full' : 'w-full'} />
                                            {errors.email && <small className="p-error">{errors.email}</small>}
                                        </div>
                                        <div className="col-12 md:col-6 flex flex-column gap-2 mb-3">
                                            <label htmlFor="phone" className="font-semibold text-700">Phone Number *</label>
                                            <InputText id="phone" name="phone" value={formData.phone} onChange={handleFieldChange} className={errors.phone ? 'p-invalid w-full' : 'w-full'} />
                                            {errors.phone && <small className="p-error">{errors.phone}</small>}
                                        </div>
                                    </div>

                                    <div className="grid">
                                        <div className="col-12 md:col-6 flex flex-column gap-2 mb-3">
                                            <label htmlFor="category" className="font-semibold text-700">Product Category *</label>
                                            <Dropdown 
                                                id="category" 
                                                name="category" 
                                                value={formData.category} 
                                                onChange={handleFieldChange} 
                                                options={categories} 
                                                optionLabel="name" 
                                                placeholder="Select a Category" 
                                                className={errors.category ? 'p-invalid w-full' : 'w-full'} 
                                            />
                                            {errors.category && <small className="p-error">{errors.category}</small>}
                                        </div>
                                        <div className="col-12 md:col-6 flex flex-column gap-2 mb-3">
                                            <label htmlFor="quantity" className="font-semibold text-700">Estimated Quantity *</label>
                                            <InputNumber 
                                                id="quantity" 
                                                name="quantity" 
                                                value={formData.quantity} 
                                                onValueChange={(e) => handleFieldChange({ target: { name: 'quantity', value: e.value }})} 
                                                className={errors.quantity ? 'p-invalid w-full' : 'w-full'} 
                                                min={1}
                                                placeholder="Min. 10 items"
                                            />
                                            {errors.quantity && <small className="p-error">{errors.quantity}</small>}
                                        </div>
                                    </div>

                                    <div className="flex flex-column gap-2 mb-4">
                                        <label htmlFor="requirements" className="font-semibold text-700">Additional Requirements</label>
                                        <InputTextarea 
                                            id="requirements" 
                                            name="requirements" 
                                            value={formData.requirements} 
                                            onChange={handleFieldChange} 
                                            rows={4} 
                                            className="w-full"
                                            placeholder="Tell us about your specific needs, deadlines, or customization requests..."
                                        />
                                    </div>

                                    <Button type="submit" label="Submit Inquiry" icon="pi pi-send" className="w-full p-3 text-lg border-round-lg font-bold" />
                                </form>
                            </Card>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default BulkOrder;
