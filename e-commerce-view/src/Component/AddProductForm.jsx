import { useEffect, useState } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate } from "react-router-dom";

function AddProductForm() {
  const naviagte = useNavigate();

  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(true);

  const [productData, setProductData] = useState({
    product_id: "",
    product_name: "",
    description: "",
    quantity: "",
    price: "",
    product_image: null,
    category_id: "",
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChanges = (e) => {
    const file = e.target.files[0];
    setProductData({ ...productData, image: file });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    console.log(productData);
    AdminServices.addProduct(productData)
      .then((response) => {
        console.log(response);
        naviagte("/Products");
      })
      .catch((error) => {
        console.log(error);
      });
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
        action=""
        method="post"
        className="bg-amber-400 w-96 mx-auto mt-5 p-4"
      >
        <div className="flex flex-col mb-4">
          <label htmlFor="productname">Product Name</label>
          <input
            type="text"
            name="product_name"
            id="product_name"
            className="bg-white p-1"
            value={productData.product_name}
            onChange={handleChanges}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            className="bg-white p-1"
            value={productData.description}
            onChange={handleChanges}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="text"
            name="quantity"
            id="quantity"
            className="bg-white p-1"
            value={productData.quantity}
            onChange={handleChanges}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="category">Category</label>
          {!loading && (
            <select
              name="category_id"
              id="category_id"
              className="bg-white p-1"
              value={productData.category_id}
              onChange={handleChanges}
            >
              <option value="Select Category of the Product" >
                {" "}
                Select Category of the Product
              </option>
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
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            id="price"
            className="bg-white p-1"
            value={productData.price}
            onChange={handleChanges}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="product_image"
            id="product_image"
            accept="image/*"
            className="bg-white p-1"
            onChange={handleFileChanges}
          />
        </div>
        <div>
          <button
            className="m-2 bg-pink-600 p-2 px-10 hover:cursor-pointer hover:bg-pink-500-"
            type="submit"
            onClick={handleSubmitForm}
          >
            Submit
          </button>
          <button className="m-2 bg-pink-600 p-2 px-10 hover:cursor-pointer hover:bg-pink-500" type="reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;
