import React, { useEffect, useState } from 'react'
import AdminService from '../Services/AdminServices'; // Make sure this is correctly imported
import { useNavigate } from 'react-router-dom';
function Luggage() {
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

        // Filter products where category name is 'Luggage'
        const luggageProducts = updatedProducts.filter(
          (product) => product.category_name.toLowerCase() === 'luggage'
        )

        setProducts(luggageProducts)
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

  function parseToJSON(data) {
    const lines = data.trim().split('\n');
    const json = {};

    for (let i = 0; i < lines.length; i += 2) {
      const key = lines[i].trim();
      const value = lines[i + 1] ? lines[i + 1].trim() : '';
      json[key] = value;
    }

    return json;
  }

  const productDetails = parseToJSON("Style code HK3 (2) 11 003 Pattern Solid Locking mechanism Number Lock Ideal for Men & Women Number of wheels 4 Water resistant Yes Season EOSS-1-2023 Closure Zipper Number of pockets 2 Other body features 3 digit combi lock Sales package 1 Body type, material Hard Body, Polypropylene Capacity 111 L Color Blue Weight 4 kg Net Quantity 1 External Width 54.5 cm External Height 78 cm External Depth 32 cm Service Type 3 year International warranty valid for 3 years from the original date of purchase Warranty Summary 3 Years International Domestic Warranty 3 Year International Warranty 3 Year");


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Luggage Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} className="border p-4  rounded shadow flex  mb-3 gap-4">
                <div className=''>

                  <img
                    src={`data:image/jpeg;base64,${product.product_images[0]}`}
                    alt={product.product_name}
                    className="rounded-lg "
                    style={{ minHeight: '200px', minWidth: '150px', maxHeight: '200px', maxWidth: '150px' }} // Adjust the size as needed
                  />
                </div>
                <div>

                  <h3 className="text-lg font-semibold ">{product.product_name}</h3>
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
              </div>
            ))
          ) : (
            <p>No luggage products found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Luggage
