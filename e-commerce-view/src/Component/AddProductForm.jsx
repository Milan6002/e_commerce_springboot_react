import { useEffect, useState } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

function AddProductForm() {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
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
    product_images: [null], // Array to store multiple images
    category_id: "",
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChanges = async (e) => {
    const files = Array.from(e.target.files); // Get multiple selected files
    const compressedImages = [];

    for (const file of files) {
      const options = {
        maxSizeMB: 0.5, // Max size 500KB
        maxWidthOrHeight: 500, // Resize to 500px
        useWebWorker: true,
      };

      try {
        const compressedImage = await imageCompression(file, options);
        compressedImages.push(compressedImage);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    }

    setProductData({
      ...productData,
      product_images: [...productData.product_images, ...compressedImages],
    });
    setSelectedImages([...selectedImages, ...compressedImages]); // Update preview images
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

    // Append multiple images
    productData.product_images.forEach((file) => {
      formData.append("image", file);
    });

    try {
      await AdminServices.addProduct(formData);
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

  return (
    <div>
      <form
        className="bg-amber-400 w-96 mx-auto mt-5 p-4"
        onSubmit={handleSubmitForm}
      >
        <div className="flex flex-col mb-4">
          <label>Product Brand</label>
          <input
            type="text"
            name="product_brand"
            className="bg-white p-1"
            value={productData.product_brand}
            onChange={handleChanges}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label>Product Name</label>
          <input
            type="text"
            name="product_name"
            className="bg-white p-1"
            value={productData.product_name}
            onChange={handleChanges}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label>Description</label>
          <textarea
            name="description"
            className="bg-white p-1"
            value={productData.description}
            onChange={handleChanges}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label>Product Color</label>
          <input
            type="text"
            name="product_color"
            className="bg-white p-1"
            value={productData.product_color}
            onChange={handleChanges}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label>Quantity</label>
          <input
            type="text"
            name="quantity"
            className="bg-white p-1"
            value={productData.quantity}
            onChange={handleChanges}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label>Category</label>
          {!loading && (
            <select
              name="category_id"
              className="bg-white p-1"
              value={productData.category_id}
              onChange={handleChanges}
            >
              <option value="">Select Category</option>
              {category.map((categoryData) => (
                <option
                  key={categoryData.category_id}
                  value={categoryData.category_id}
                >
                  {categoryData.category_name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label>Price</label>
          <input
            type="text"
            name="price"
            className="bg-white p-1"
            value={productData.price}
            onChange={handleChanges}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label>Discount</label>
          <input
            type="text"
            name="discount"
            className="bg-white p-1"
            value={productData.discount}
            onChange={handleChanges}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label>Images (Max 5)</label>
          <input
            type="file"
            name="product_images"
            id="product_images"
            accept="image/*"
            className="bg-white p-1"
            multiple // Allow multiple images
            onChange={handleFileChanges}
          />
        </div>

        {/* Preview Selected Images */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Preview ${index}`}
              className="w-20 h-20 object-cover rounded-md"
            />
          ))}
        </div>

        <div>
          <button
            className="m-2 bg-pink-600 p-2 px-10 hover:bg-pink-500"
            type="submit"
          >
            Submit
          </button>
          <button
            className="m-2 bg-pink-600 p-2 px-10 hover:bg-pink-500"
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
