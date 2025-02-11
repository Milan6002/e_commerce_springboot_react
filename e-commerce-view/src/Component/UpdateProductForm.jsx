import { useEffect, useState } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate, useParams } from "react-router-dom";

function UpdateProductForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const [productData, setProductData] = useState({
    product_id: id,
    product_name: "",
    product_brand:"",
    description: "",
    product_color:"",
    quantity: "",
    price: "",
    discount:"",
    product_image: null,
    category_id: "",
  });

  const [previewImage, setPreviewImage] = useState(null); // For previewing uploaded images

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response_category = await AdminServices.getAllCategories();
        setCategories(response_category.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response_productData = await AdminServices.getProductById(
          productData.product_id
        );
        setProductData(response_productData.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchCategories();

    fetchProductData();
  }, [productData.product_id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
    setProductData({ ...productData, image: file });
  };

  const handleUpdateProductData = (e, product_id) => {
    e.preventDefault();
    AdminServices.updateProduct(productData, product_id)
      .then(() => {
        navigate("/Products");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Update Product Detail
        </h1>
        <form action="" method="post" className="space-y-6">
          {/* Product Brand */}
          <div>
            <label
              htmlFor="product_brand"
              className="block text-sm font-medium text-gray-700"
            >
              Product Brand
            </label>
            <input
              onChange={handleChanges}
              value={productData.product_brand}
              type="text"
              name="product_brand"
              id="product_brand"
              placeholder="Enter product Brand"
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Product Name */}
          <div>
            <label
              htmlFor="product_name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              onChange={handleChanges}
              value={productData.product_name}
              type="text"
              name="product_name"
              id="product_name"
              placeholder="Enter product name"
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              onChange={handleChanges}
              value={productData.description}
              name="description"
              id="description"
              placeholder="Enter product description"
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={4}
            ></textarea>
          </div>

          {/* Product Color */}
          <div>
            <label
              htmlFor="product_color"
              className="block text-sm font-medium text-gray-700"
            >
              Product Color
            </label>
            <input
              onChange={handleChanges}
              value={productData.product_color}
              type="text"
              name="product_color"
              id="product_color"
              placeholder="Enter product Color"
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              onChange={handleChanges}
              value={productData.quantity}
              type="number"
              name="quantity"
              id="quantity"
              placeholder="Enter quantity"
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            {!loading && (
              <select
                name="category"
                id="category"
                value={productData.category_id}
                onChange={handleChanges}
                className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              onChange={handleChanges}
              value={productData.price}
              type="text"
              name="price"
              id="price"
              placeholder="Enter price"
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700"
            >
              Discount
            </label>
            <input
              onChange={handleChanges}
              value={productData.discount}
              type="text"
              name="discount"
              id="discount"
              placeholder="Enter Discount"
              className="p-1.5 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Product Image */}
          <div>
            <label
              htmlFor="product_image"
              className="block text-sm font-medium text-gray-700"
            >
              Product Image
            </label>
            <input
              type="file"
              name="product_image"
              id="product_image"
              accept="image/*"
              onChange={handleImageChange}
              className="p-1.5 mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
            <div className="flex gap-10">
              {/* Old Image Preview */}
              {productData.product_image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">Current Image:</p>
                  <img
                    src={`data:image/jpeg;base64,${productData.product_image}`}
                    alt="Old Product"
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              {/* New Image Preview */}
              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">New Image Preview:</p>
                  <img
                    src={previewImage}
                    alt="New Product Preview"
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={(e) =>
                handleUpdateProductData(e, productData.product_id)
              }
              type="submit"
              className="inline-flex justify-center rounded-lg bg-indigo-600 py-2 px-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update
            </button>
            <button
              type="reset"
              className="inline-flex justify-center rounded-lg bg-gray-200 py-2 px-4 text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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
