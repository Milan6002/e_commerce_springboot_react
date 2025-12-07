import { useEffect, useState } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";

function UpdateProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [Type, setTypes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [productData, setProductData] = useState({
    product_id: id,
    product_name: "",
    product_brand: "",
    description: "",
    product_color: "",
    quantity: "",
    price: "",
    discount: "",
    product_images: [],
    category_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseCategory, responseProduct,responseType] = await Promise.all([
          AdminServices.getAllCategories(),
          AdminServices.getProductById(id),
          AdminServices.getAllTypes(),
        ]);

        setCategories(responseCategory.data);
        setProductData(responseProduct.data);
        setTypes(responseType.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

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
    }
  };

  const handleUpdateProductData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "product_images") formData.append(key, value);
    });

    productData.product_images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await AdminServices.updateProduct(formData, id);
      navigate("/Products");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]:
        name === "quantity" || name === "price" || name === "discount"
          ? Number(value) || ""
          : value,
    }));
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setProductData((prevData) => ({
      ...prevData,
      product_images: prevData.product_images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Update Product Detail
        </h1>
        <form onSubmit={handleUpdateProductData} className="space-y-6">
          {[
            { label: "Product Brand", name: "product_brand", type: "text" },
            { label: "Product Name", name: "product_name", type: "text" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Product Color", name: "product_color", type: "text" },
            { label: "Quantity", name: "quantity", type: "number" },
            { label: "Price", name: "price", type: "text" },
            { label: "Discount", name: "discount", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              {type === "textarea" ? (
                <textarea
                  id={name}
                  name={name}
                  value={productData[name]}
                  onChange={handleChanges}
                  className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={4}
                />
              ) : (
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={productData[name]}
                  onChange={handleChanges}
                  className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              )}
            </div>
          ))}

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={productData.category_id}
              onChange={handleChanges}
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {categories.map(({ category_id, category_name }) => (
                <option key={category_id} value={category_id}>
                  {category_name}
                </option>
              ))}
            </select>
          </div>
             {/* Type Dropdown */}
          <div>
            <label
              htmlFor="type_id"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type_id"
              name="type_id"
              value={productData.type_id}
              onChange={handleChanges}
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {Type.map(({ type_id, type_name }) => (
                <option key={type_id} value={type_id}>
                  {type_name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="product_images"
              className="block text-sm font-medium text-gray-700"
            >
              Product Image
            </label>
            <input
              id="product_images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="p-1.5 mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-lg shadow-sm"
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Update
            </button>
            <button
              type="reset"
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProductForm;
