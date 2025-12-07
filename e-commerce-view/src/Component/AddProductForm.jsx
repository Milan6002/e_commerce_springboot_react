import { useEffect, useState } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

function AddProductForm() {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]); // Stores selected images for preview

  const [productData, setProductData] = useState({
    product_id: "",
    product_name: "",
    product_brand: "",
    description: "",
    product_color: "",
    quantity: "",
    price: "",
    discount: "",
    product_images: [null],
    category_id: "",
    type_id: "",
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChanges = async (e) => {
    const files = Array.from(e.target.files); // Get multiple selected files
    const compressedImages = [];
    const previewImage = [];

    for (const file of files) {
      const options = {
        maxSizeMB: 0.5, // Max size 500KB
        maxWidthOrHeight: 500, // Resize to 500px
        useWebWorker: true,
      };

      try {
        const compressedImage = await imageCompression(file, options);
        const imageData = await convertToBase64(compressedImage);
        previewImage.push(imageData);
        compressedImages.push(compressedImage);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    }

    setProductData({
      ...productData,
      product_images: [...productData.product_images, ...compressedImages],
    });
    setSelectedImages([...selectedImages, ...previewImage]); // Update preview images
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("product_id", productData.product_id);
    formData.append("product_name", productData.product_name);
    formData.append("product_brand", productData.product_brand);
    formData.append("description", productData.description);
    formData.append("product_color", productData.product_color);
    formData.append("quantity", productData.quantity);
    formData.append("price", productData.price);
    formData.append("discount", productData.discount);
    formData.append("category_id", productData.category_id);
    formData.append("type_id", productData.type_id);

    // Append multiple images
    productData.product_images.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const res = await AdminServices.addProduct(formData);
      navigate("/Products");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AdminServices.getAllCategories();
        setCategory(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AdminServices.getAllTypes();
        setType(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className=" min-h-screen pt-8 text-white">
      <form
        className=" w-full max-w-4xl mx-auto p-7 mb-6 bg-gray-800 shadow-2xl shadow-gray-900 rounded-3xl animate-fade-in"
        onSubmit={handleSubmitForm}
      >
        <div className=" ">

          <div className="flex gap-18 mb-4">
            {/* Product Brand */}

            <div className="flex flex-col">
              <label className=" font-medium">Product Brand</label>
              <input
                type="text"
                name="product_brand"
                className=" p-2 w-96 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={productData.product_brand}
                onChange={handleChanges}
              />
            </div>

            {/* Product Name */}
            <div className="flex flex-col">
              <label className="font-medium">Product Name</label>
              <input
                type="text"
                name="product_name"
                className=" p-2 rounded-lg w-96 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={productData.product_name}
                onChange={handleChanges}
              />
            </div>
          </div>

          <div className="flex gap-18 mb-4">

            {/* Product Color */}
            <div className="flex flex-col">
              <label className="font-medium">Product Color</label>
              <input
                type="text"
                name="product_color"
                className=" p-2 rounded-lg w-96 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={productData.product_color}
                onChange={handleChanges}
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col">
              <label className="font-medium">Quantity</label>
              <input
                type="text"
                name="quantity"
                className=" p-2 w-96 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={productData.quantity}
                onChange={handleChanges}
              />
            </div>
          </div>
          <div className="flex gap-18 mb-4">
            {/* Category */}
            <div className="flex flex-col">
              <label className="font-medium">Category</label>
              {!loading && (
                <select
                  name="category_id"
                  className=" p-2 w-96  rounded-lg border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={productData.category_id}
                  onChange={handleChanges}
                >
                  <option value="" className="bg-black">Select Category</option>
                  {category.map((categoryData) => (
                    <option className="bg-black"
                      key={categoryData.category_id}
                      value={categoryData.category_id}
                    >
                      {categoryData.category_name}
                    </option>
                  ))}
                </select>
              )}
            </div>


            {/* Type */}
            <div className="flex flex-col">
              <label className="font-medium">Type</label>
              {!loading && (
                <select
                  name="type_id"
                  className=" p-2 w-96 rounded-lg border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={productData.type_id}
                  onChange={handleChanges}
                >
                  <option value=""className="bg-black">Select Type</option>
                  {type.map((typeData) => (
                    <option className="bg-black"
                      key={typeData.type_id}
                      value={typeData.type_id}
                    >
                      {typeData.type_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="flex gap-18 mb-4">
            {/* Price */}
            <div className="flex flex-col">
              <label className="font-medium">Price</label>
              <input
                type="text"
                name="price"
                className=" p-2 w-96 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={productData.price}
                onChange={handleChanges}
              />
            </div>

            {/* Discount */}
            <div className="flex flex-col">
              <label className="font-medium">Discount</label>
              <input
                type="text"
                name="discount"
                className=" p-2 w-96 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={productData.discount}
                onChange={handleChanges}
              />
            </div>
          </div>
          <div>
            {/* Product Image */}
            <div className="flex flex-col mb-4">
              <label className="font-medium">Images (Max 5)</label>
              <input
                type="file"
                name="product_images"
                id="product_images"
                accept="image/*"
                className=" p-2 w-96 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                multiple // Allow multiple images
                onChange={handleFileChanges}
              />
            </div>

            {/* Preview Selected Images */}
            <div className="flex gap-2">
              {selectedImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </div>
          <div>
            {/* Description */}
            <div className="flex flex-col">
              <label className="font-medium">Description</label>
              <textarea
                name="description"
                className=" p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={productData.description}
                onChange={handleChanges}
              />
            </div>

          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-6">
          <button
            className="bg-blue-600 text-white p-2 px-6 rounded-lg hover:bg-blue-500 transition-all hover:scale-105"
            type="submit"
            onClick={handleSubmitForm}
          >
            Submit
          </button>
          <button
            className="bg-gray-600 text-white p-2 px-6 rounded-lg hover:bg-gray-500 transition-all hover:scale-105"
            type="reset"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;