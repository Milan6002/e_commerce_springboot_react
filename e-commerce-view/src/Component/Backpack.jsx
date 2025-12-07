import React, { useEffect, useState } from 'react'
import AdminService from '../Services/AdminServices'; // Make sure this is correctly imported
import { useNavigate } from 'react-router-dom'; // Adjust path if necessary

function Backpack() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await AdminService.getAllProducts()
        const productList = response.data

        const updatedProducts = await Promise.all(
          productList.map(async (product) => {
            const categoryResponse = await AdminService.getCategoryById(product.category_id)
            return {
              ...product,
              category_name: categoryResponse.data.category_name,
            }
          })
        )

        // Filter products where category name is 'Backpack'
        const backpackProducts = updatedProducts.filter(
          (product) => product.category_name.toLowerCase() === 'backpack'
        )

        setProducts(backpackProducts)
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    }

    fetchData()
  }, [])
    const handleViewProduct = (e, id) => {
    e.preventDefault();
    navigate(`/viewproduct/${id}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Backpack Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} className="border p-4 rounded shadow">
                <img
                  src={`data:image/jpeg;base64,${product.product_images[0]}`}
                  alt={product.product_name}
                  className="rounded-lg h-[50vh] w-[30vw] mb-3"
                />
                <h3 className="text-lg font-semibold h-15 overflow-hidden">{product.product_name}</h3>
                <p className="text-sm font-bold mt-2">Brand : {product.product_brand}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <p className="text-2xl font-semibold text-green-600">
                    ₹{Math.round(product.price)}
                  </p>
                  <p className="text-gray-400 line-through">
                    ₹
                    {parseInt((product.price * product.discount) / 100) +
                      product.price}
                  </p>
                  <p className="text-green-600 font-medium">
                    {product.discount}% off
                  </p>
                </div>
                <button
                  onClick={(e) => handleViewProduct(e, product.product_id)}
                  className="mt-3 bg-blue-600 p-2 px-4  text-white rounded hover:bg-blue-500 transition"
                >
                  View Product
                </button>
              </div>
            ))
          ) : (
            <p>No backpack products found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Backpack
