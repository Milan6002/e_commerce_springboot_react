import React, { useState } from "react";

function BulkOrder() {
    const [formData, setFormData] = useState({
        name: "",
        companyName: "",
        address: "",
        email: "",
        phone: "",
        items: [{ description: "", qty: 1, price: 0, total: 0 }]
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e, index = null, field = null) => {
        if (index !== null) {
            const newItems = [...formData.items];
            newItems[index][field] = e.target.value;

            if (field === "qty" || field === "price") {
                newItems[index].total = (newItems[index].qty * newItems[index].price).toFixed(2);
            }

            setFormData({ ...formData, items: newItems });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.companyName) tempErrors.companyName = "Company Name is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (!formData.email) tempErrors.email = "E-mail is required";
        if (!formData.phone) tempErrors.phone = "Phone number is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            alert("Order Submitted Successfully!");
            console.log(formData);
        }
    };

    const grandTotal = formData.items.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 p-6">
            <div className="bg-gray-50 p-8 rounded-xl shadow-xl w-full max-w-3xl">
                <h2 className="text-3xl font-bold text-center text-gray-900">Wholesale Order Form</h2>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["name", "companyName", "address", "email", "phone"].map(field => (
                            <div key={field}>
                                <input 
                                    type={field === "email" ? "email" : "text"}
                                    name={field}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 bg-white"
                                    onChange={handleChange}
                                />
                                {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full border bg-white rounded-lg overflow-hidden">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="p-3">#</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Qty</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index} className="even:bg-gray-100">
                                        <td className="p-3 text-center">{index + 1}</td>
                                        <td className="p-3"><input type="text" className="w-full border p-2 rounded-lg bg-white" value={item.description} onChange={(e) => handleChange(e, index, "description")} /></td>
                                        <td className="p-3"><input type="number" className="w-full border p-2 rounded-lg text-center bg-white" value={item.qty} min="1" onChange={(e) => handleChange(e, index, "qty")} /></td>
                                        <td className="p-3"><input type="number" className="w-full border p-2 rounded-lg text-center bg-white" value={item.price} min="0" step="0.01" onChange={(e) => handleChange(e, index, "price")} /></td>
                                        <td className="p-3 font-semibold">₹{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between text-lg font-bold text-gray-700 mt-4">
                        <span>Total:</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                    </div>

                    <button className="w-full bg-blue-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md">
                        Submit Order
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BulkOrder;