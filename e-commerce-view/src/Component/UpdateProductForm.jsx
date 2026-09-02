import { useEffect, useState, useRef } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

function UpdateProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useRef(null);

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [productData, setProductData] = useState({
    product_id: id,
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
      try {
        const [responseCategory, responseProduct, responseType] = await Promise.all([
          AdminServices.getAllCategories(),
          AdminServices.getProductById(id),
          AdminServices.getAllTypes(),
        ]);

        setCategories(responseCategory.data);
        
        // Ensure numbers are properly set
        const prod = responseProduct.data;
        setProductData({
          ...prod,
          quantity: Number(prod.quantity) || null,
          price: Number(prod.price) || null,
          discount: Number(prod.discount) || null,
        });

        setTypes(responseType.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch product data', life: 3000 });
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (name, value) => {
    setProductData({ ...productData, [name]: value });
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleFileUpload = async (event) => {
    const files = event.files;
    
    const options = {
      maxSizeMB: 0.5, // Max 500KB
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };

    try {
      const compressedImages = await Promise.all(
        files.map((file) => imageCompression(file, options))
      );

      const previewImages = await Promise.all(
        compressedImages.map((img) => convertToBase64(img))
      );

      setProductData((prevData) => ({
        ...prevData,
        product_images: [...prevData.product_images, ...compressedImages],
      }));

      setSelectedImages((prev) => [...prev, ...previewImages]);
    } catch (error) {
      console.error("Image compression error:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to process images', life: 3000 });
    }
  };

  const handleGenerateDescription = async () => {
    if (!productData.product_name) {
      toast.current.show({ severity: "warn", summary: "Name Required", detail: "Please enter a product name first before generating a description.", life: 3000 });
      return;
    }

    setIsGenerating(true);
    try {
      const selectedCategory = categories.find(c => c.category_id === productData.category_id);
      
      const aiRequestData = {
        name: productData.product_name,
        brand: productData.product_brand,
        category: selectedCategory ? selectedCategory.category_name : ""
      };

      const response = await AdminServices.generateAiDescription(aiRequestData);
      
      handleChange("description", response.data.description);
      
      toast.current.show({ severity: "success", summary: "AI Success", detail: "Product description generated successfully!", life: 3000 });
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.current.show({ severity: "error", summary: "AI Error", detail: "Failed to generate description. Please try again.", life: 3000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateProductData = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (key !== "product_images" && value !== null) formData.append(key, value);
      });

      productData.product_images.forEach((file) => {
        formData.append("images", file); // Ensure backend expects "images" and not "image" based on original code
      });

      await AdminServices.updateProduct(formData, id);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product updated successfully', life: 3000 });
      setTimeout(() => navigate("/Products"), 1500);
    } catch (error) {
      console.error("Update failed:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update product', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setProductData((prevData) => ({
      ...prevData,
      product_images: prevData.product_images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="">
      <Toast ref={toast} />
      <Card title="Update Product" className="shadow-4">
        <div className="grid p-fluid formgrid">

          <div className="field col-12 md:col-6">
            <label>Product Brand</label>
            <InputText
              value={productData.product_brand || ""}
              onChange={(e) => handleChange("product_brand", e.target.value)}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Product Name</label>
            <InputText
              value={productData.product_name || ""}
              onChange={(e) => handleChange("product_name", e.target.value)}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Product Color</label>
            <InputText
              value={productData.product_color || ""}
              onChange={(e) => handleChange("product_color", e.target.value)}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Quantity</label>
            <InputNumber
              value={productData.quantity}
              onValueChange={(e) => handleChange("quantity", e.value)}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Price</label>
            <InputNumber
              value={productData.price}
              onValueChange={(e) => handleChange("price", e.value)}
              mode="currency"
              currency="INR"
              locale="en-IN"
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Discount (%)</label>
            <InputNumber
              value={productData.discount}
              onValueChange={(e) => handleChange("discount", e.value)}
              suffix="%"
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Category</label>
            <Dropdown
              value={productData.category_id}
              options={categories}
              optionLabel="category_name"
              optionValue="category_id"
              placeholder="Select Category"
              onChange={(e) => handleChange("category_id", e.value)}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Type</label>
            <Dropdown
              value={productData.type_id}
              options={types}
              optionLabel="type_name"
              optionValue="type_id"
              placeholder="Select Type"
              onChange={(e) => handleChange("type_id", e.value)}
            />
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
            <InputTextarea
              rows={4}
              value={productData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="border-round-lg"
              autoResize
            />
          </div>

          <div className="field col-12">
            <label>Add New Images</label>
            <FileUpload
              mode="basic"
              multiple
              customUpload
              uploadHandler={handleFileUpload}
              accept="image/*"
              chooseLabel="Choose Images"
            />
            
            {selectedImages.length > 0 && (
              <div className="mt-4">
                <label className="block mb-2">New Images to Upload:</label>
                <div className="flex flex-wrap gap-4">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${index}`}
                        className="w-8rem h-8rem object-cover border-round shadow-2"
                      />
                      <Button
                        icon="pi pi-times"
                        className="p-button-rounded p-button-danger p-button-sm absolute"
                        style={{ top: '-0.5rem', right: '-0.5rem' }}
                        onClick={() => handleRemoveImage(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-12 flex justify-content-end gap-2 mt-3">
            <Button
              label="Update"
              icon="pi pi-check"
              loading={loading}
              onClick={handleUpdateProductData}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => navigate("/Products")}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UpdateProductForm;
