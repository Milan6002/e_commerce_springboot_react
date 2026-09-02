import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";

// PrimeReact Imports
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

function AddProductForm() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [productData, setProductData] = useState({
    product_name: "",
    product_brand: "",
    description: "",
    product_color: "",
    quantity: null,
    price: null,
    discount: null,
    product_images: [],
    category_id: null,
    type_id: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await AdminServices.getAllCategories();
      const typeRes = await AdminServices.getAllTypes();

      setCategory(catRes.data);
      setType(typeRes.data);
    };
    fetchData(); 
  }, []);

  const handleChange = (name, value) => {
    setProductData({ ...productData, [name]: value });
  };

  const handleFileUpload = async (event) => {
    const files = event.files;
    const compressedImages = [];
    const previewImages = [];

    for (const file of files) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      try {
        const compressed = await imageCompression(file, options);
        compressedImages.push(compressed);

        const reader = new FileReader();
        reader.readAsDataURL(compressed);
        reader.onload = () => previewImages.push(reader.result);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    }

    setProductData({ ...productData, product_images: compressedImages });
    setSelectedImages(previewImages);
  };

  const handleGenerateDescription = async () => {
    if (!productData.product_name) {
      toast.current.show({ severity: "warn", summary: "Name Required", detail: "Please enter a product name first before generating a description.", life: 3000 });
      return;
    }

    setIsGenerating(true);
    try {
      // Get category name for better AI context
      const selectedCategory = category.find(c => c.category_id === productData.category_id);
      
      const aiRequestData = {
        name: productData.product_name,
        brand: productData.product_brand,
        category: selectedCategory ? selectedCategory.category_name : ""
      };

      const response = await AdminServices.generateAiDescription(aiRequestData);
      
      // Update description field with AI generated text
      handleChange("description", response.data.description);
      
      toast.current.show({ severity: "success", summary: "AI Success", detail: "Product description generated successfully!", life: 3000 });
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.current.show({ severity: "error", summary: "AI Error", detail: "Failed to generate description. Please try again.", life: 3000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!productData.product_name || !productData.price || !productData.category_id || productData.product_images.length === 0) {
        toast.current.show({ severity: "warn", summary: "Incomplete", detail: "Please fill required fields and add at least 1 image.", life: 3000 });
        return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        if (key !== "product_images" && productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      });

      productData.product_images.forEach((file) => {
        formData.append("image", file);
      });

      await AdminServices.addProduct(formData);

      toast.current.show({ severity: "success", summary: "Success", detail: "Product Added Successfully", life: 3000 });
      setTimeout(() => navigate("/Products"), 1500);
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: "Failed to Add Product", life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex justify-content-center">
      <Toast ref={toast} />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl"
      >
        <Card className="shadow-4 border-round-2xl surface-0 overflow-hidden p-0">
          
          {/* Header */}
          <div className="bg-primary p-4 md:p-5 text-white flex align-items-center justify-content-between">
             <div>
                <h2 className="text-3xl font-bold m-0 mb-2">Create New Product</h2>
                <p className="m-0 opacity-80">Fill in the details to add a new product to your catalog.</p>
             </div>
             <i className="pi pi-box text-5xl opacity-50"></i>
          </div>

          <div className="p-4 md:p-5">
              <div className="grid p-fluid">
                  
                  {/* Basic Information Section */}
                  <div className="col-12 mb-2">
                     <h3 className="text-xl font-semibold text-800 m-0"><i className="pi pi-info-circle mr-2 text-primary"></i>Basic Information</h3>
                     <Divider />
                  </div>

                  <div className="field col-12 md:col-6">
                    <label className="font-medium text-700">Product Name *</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-tag" />
                        <InputText value={productData.product_name} onChange={(e) => handleChange("product_name", e.target.value)} placeholder="E.g. Travel Backpack Pro" className="p-inputtext-lg border-round-lg w-full" />
                    </span>
                  </div>

                  <div className="field col-12 md:col-6">
                    <label className="font-medium text-700">Brand Name</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-star" />
                        <InputText value={productData.product_brand} onChange={(e) => handleChange("product_brand", e.target.value)} placeholder="E.g. Samsonite" className="p-inputtext-lg border-round-lg w-full" />
                    </span>
                  </div>

                  <div className="field col-12 md:col-6">
                    <label className="font-medium text-700">Category *</label>
                    <Dropdown value={productData.category_id} options={category} optionLabel="category_name" optionValue="category_id" placeholder="Select Category" onChange={(e) => handleChange("category_id", e.value)} className="p-inputtext-lg border-round-lg" />
                  </div>

                  <div className="field col-12 md:col-6">
                    <label className="font-medium text-700">Product Type</label>
                    <Dropdown value={productData.type_id} options={type} optionLabel="type_name" optionValue="type_id" placeholder="Select Type" onChange={(e) => handleChange("type_id", e.value)} className="p-inputtext-lg border-round-lg" />
                  </div>

                  <div className="field col-12">
                    <div className="flex justify-content-between align-items-end mb-2">
                      <label className="font-medium text-700 m-0">Description</label>
                      <Button 
                        type="button" 
                        label="Generate with AI ✨" 
                        className="p-button-sm p-button-outlined p-button-help border-round-full" 
                        loading={isGenerating} 
                        onClick={handleGenerateDescription} 
                      />
                    </div>
                    <InputTextarea rows={6} value={productData.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Enter a detailed description of the product or generate one using AI..." className="border-round-lg" autoResize />
                  </div>

                  {/* Pricing & Inventory Section */}
                  <div className="col-12 mt-4 mb-2">
                     <h3 className="text-xl font-semibold text-800 m-0"><i className="pi pi-wallet mr-2 text-primary"></i>Pricing & Inventory</h3>
                     <Divider />
                  </div>

                  <div className="field col-12 md:col-4">
                    <label className="font-medium text-700">Price (₹) *</label>
                    <InputNumber value={productData.price} onValueChange={(e) => handleChange("price", e.value)} mode="currency" currency="INR" locale="en-IN" className="p-inputtext-lg border-round-lg" placeholder="0.00" />
                  </div>

                  <div className="field col-12 md:col-4">
                    <label className="font-medium text-700">Discount (%)</label>
                    <InputNumber value={productData.discount} onValueChange={(e) => handleChange("discount", e.value)} suffix="%" className="p-inputtext-lg border-round-lg" placeholder="0" />
                  </div>

                  <div className="field col-12 md:col-4">
                    <label className="font-medium text-700">Stock Quantity</label>
                    <InputNumber value={productData.quantity} onValueChange={(e) => handleChange("quantity", e.value)} showButtons min={0} className="p-inputtext-lg border-round-lg" />
                  </div>

                  <div className="field col-12 md:col-4">
                    <label className="font-medium text-700">Color</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-palette" />
                        <InputText value={productData.product_color} onChange={(e) => handleChange("product_color", e.target.value)} placeholder="E.g. Matte Black" className="p-inputtext-lg border-round-lg w-full" />
                    </span>
                  </div>

                  {/* Media Section */}
                  <div className="col-12 mt-4 mb-2">
                     <h3 className="text-xl font-semibold text-800 m-0"><i className="pi pi-image mr-2 text-primary"></i>Media</h3>
                     <Divider />
                  </div>

                  <div className="field col-12">
                    <label className="font-medium text-700">Product Images (Max 5) *</label>
                    <FileUpload mode="advanced" multiple customUpload uploadHandler={handleFileUpload} accept="image/*" maxFileSize={5000000} chooseLabel="Select Images" className="border-round-lg" emptyTemplate={<p className="m-0 text-500">Drag and drop images here to upload.</p>} />
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12 flex flex-column sm:flex-row justify-content-end gap-3 mt-5 pt-4 border-top-1 surface-border">
                    <Button label="Cancel" icon="pi pi-times" severity="secondary" outlined className="border-round-xl px-5" onClick={() => navigate("/Products")} />
                    <Button label="Save Product" icon="pi pi-check" loading={loading} className="p-button-primary border-round-xl px-5 shadow-2" onClick={handleSubmit} />
                  </div>
              </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default AddProductForm;
