import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import imageCompression from "browser-image-compression";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

function AddProductForm() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

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

      const compressed = await imageCompression(file, options);
      compressedImages.push(compressed);

      const reader = new FileReader();
      reader.readAsDataURL(compressed);
      reader.onload = () => previewImages.push(reader.result);
    }

    setProductData({
      ...productData,
      product_images: compressedImages,
    });

    setSelectedImages(previewImages);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        if (key !== "product_images") {
          formData.append(key, productData[key]);
        }
      });

      productData.product_images.forEach((file) => {
        formData.append("image", file);
      });

      await AdminServices.addProduct(formData);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Product Added Successfully",
        life: 3000,
      });

      setTimeout(() => navigate("/Products"), 1500);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to Add Product",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await AdminServices.getAllCategories();
      const typeRes = await AdminServices.getAllTypes();

      setCategory(catRes.data);
      setType(typeRes.data);
    };

    fetchData(); 
  }, []);

  return (
    <div className="">
      <Toast ref={toast} />
      <Card title="Add Product" className=" shadow-4">
        <div className="grid p-fluid formgrid ">

          <div className="field col-12 md:col-6">
            <label>Product Brand</label>
            <InputText
              value={productData.product_brand}
              onChange={(e) => handleChange("product_brand", e.target.value)}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Product Name</label>
            <InputText
              value={productData.product_name}
              onChange={(e) => handleChange("product_name", e.target.value)}
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Product Color</label>
            <InputText
              value={productData.product_color}
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
              options={category}
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
              options={type}
              optionLabel="type_name"
              optionValue="type_id"
              placeholder="Select Type"
              onChange={(e) => handleChange("type_id", e.value)}
            />
          </div>

          <div className="field col-12">
            <label>Description</label>
            <InputTextarea
              rows={4}
              value={productData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="field col-12">
            <label>Images (Max 5)</label>
            <FileUpload
              mode="basic"
              multiple
              customUpload
              uploadHandler={handleFileUpload}
              accept="image/*"
              chooseLabel="Choose Images"
            />
          </div>

          <div className="col-12 flex justify-content-end gap-2 mt-3">
            <Button
              label="Submit"
              icon="pi pi-check"
              loading={loading}
              onClick={handleSubmit}
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

export default AddProductForm;