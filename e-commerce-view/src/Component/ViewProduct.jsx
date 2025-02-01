import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import { useCart } from "../Context/CartContext";
import { toast, ToastContainer } from "react-toastify";

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await AdminServices.getProductById(id);
        const productData = response.data;

        const category = await AdminServices.getCategoryById(
          productData.category_id
        );

        setProduct({
          ...productData,
          category_name: category.data.category_name,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  const { addToCart } = useCart();

  const handleAddToCart = (e, userId, productId, quantity) => {
    e.preventDefault();
    addToCart(userId, productId, quantity);
    toast.success("Item added To The Cart Successfully");
  };

  if (!product) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div
      className="bg-gray-100 flex justify-center p-4"
      style={{ height: "91.2vh" }}
    >
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl w-full flex">
        {/* Left - Image Section */}
        <div className="w-96 h-96 flex flex-col items-center">
          <img
            src={`data:image/jpeg;base64,${product.product_image}`}
            alt={product.product_name}
            className="w-full   object-cover rounded-md"
          />
          <div className="flex mt-2 space-x-2">
            {/* Placeholder for additional images */}
            <img
              src={`data:image/jpeg;base64,${product.product_image}`}
              alt="Thumbnail"
              className="w-16 h-16 object-cover rounded border"
            />
            <img
              src="https://m.media-amazon.com/images/I/71m+dNHzoGL.jpg"
              alt="Thumbnail"
              className="w-16 h-16 object-cover rounded border"
            />
            <img
              src="https://motorolain.vtexassets.com/arquivos/ids/159186/2024_CUSCO-PLUS_FOREST-GREEN_PDP-HERO.png?v=638618115763230000"
              alt="Thumbnail"
              className="w-16 h-16 object-cover rounded border"
            />
            <img
              src="https://dakauf.eu/wp-content/uploads/2024/05/Motorola-XT2429-2-Moto-Edge-50-Fusion-5G-12GB-RAM-512GB-Marshmallow-Blue.png"
              alt="Thumbnail"
              className="w-16 h-16 object-cover rounded border"
            />
            <img
              src="https://doctorje.com/wp-content/uploads/2024/12/Motorola-Edge-50-Fusion-5G.jpg"
              alt="Thumbnail"
              className="w-16 h-16 object-cover rounded border"
            />
          </div>
        </div>

        {/* Right - Product Details */}
        <div className="w-2/3 pl-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {product.product_name}
          </h1>
          <p className="text-gray-500 mt-2">{product.category_name}</p>

          {/* Price and Discount */}
          <div className="flex items-center space-x-3 mt-2">
            <p className="text-2xl font-semibold text-green-600">
              ₹{product.price}
            </p>
            <p className="text-gray-400 line-through">
              ₹{parseInt(product.price) + 500}
            </p>
            <p className="text-green-600 font-medium">20% off</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
              4.5 ★
            </span>
            <p className="text-gray-500">(11,846 ratings & 1,245 reviews)</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 mt-4">{product.description}</p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={(e) => handleAddToCart(e, 1, product.product_id, 1)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Add to Cart
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg">
              Buy Now
            </button>
          </div>

          {/* Offers Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Available Offers</h3>
            <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1">
              <li>
                Bank Offer: 5% Unlimited Cashback on Flipkart Axis Bank Credit
                Card
              </li>
              <li>Bank Offer: 10% off up to ₹1,500 on BOB Card Transactions</li>
              <li>Combo Offer: Buy 2 or more items and save ₹20</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProduct;
