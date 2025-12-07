import { useEffect, useState } from 'react';
import AdminService from '../Services/AdminServices';
import "../assets/shop.css";
import { useNavigate } from "react-router-dom";

function Brands() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [openBrand, setOpenBrand] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await AdminService.getAllProducts();
                const productList = response.data;

                const updatedProducts = await Promise.all(
                    productList.map(async (product) => {
                        const categoryResponse = await AdminService.getCategoryById(product.category_id);
                        return {
                            ...product,
                            category_name: categoryResponse.data.category_name,
                        };
                    })
                );

                setProducts(updatedProducts);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };

        const fetchCategory = async () => {
            try {
                const response = await AdminService.getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategory();
        fetchData();
    }, []);

    const handleViewProduct = (e, id) => {
        e.preventDefault();
        navigate(`/viewproduct/${id}`);
    };

    const toggleBrand = (brand) => {
        setOpenBrand(openBrand === brand ? null : brand);
    };

    const filteredProducts = products.filter((product) =>
        product.product_brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedProducts = filteredProducts.reduce((groups, product) => {
        const brand = product.product_brand;
        if (!groups[brand]) {
            groups[brand] = [];
        }
        groups[brand].push(product);
        return groups;
    }, {});

    const sortedBrandNames = Object.keys(groupedProducts).sort((a, b) => {
        const compare = a.localeCompare(b);
        return sortOrder === 'asc' ? compare : -compare;
    });

    return (
        <div  className="px-4 py-6 max-w-7xl mx-auto">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by brand name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:max-w-md border px-4 py-2 rounded shadow-sm"
                />
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full sm:w-48 border px-4 py-2 rounded shadow-sm"
                >
                    <option value="asc">Sort: A-Z</option>
                    <option value="desc">Sort: Z-A</option>
                </select>
            </div>

            {/* Loading and Results */}
            {loading ? (
                <p className="text-center text-gray-600">Loading products...</p>
            ) : sortedBrandNames.length === 0 ? (
                <p className="text-center text-gray-600">No products found.</p>
            ) : (
                <div className="space-y-4">
                    {sortedBrandNames.map((brand) => (
                        <div key={brand} className="border rounded shadow-sm">
                            <button
                                onClick={() => toggleBrand(brand)}
                                className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
                            >
                                <span className="font-semibold text-lg">{brand}</span>
                                <span className="text-xl">{openBrand === brand ? '▲' : '▼'}</span>
                            </button>

                            {openBrand === brand && (
                                <div className="p-4 bg-white border-t grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {groupedProducts[brand].map((product) => (
                                        <div
                                            key={product.product_id}
                                            className="border rounded-lg p-4 shadow flex flex-col bg-white"
                                        >
                                            <img
                                                src={`data:image/jpeg;base64,${product.product_images[0]}`}
                                                alt={product.product_name}
                                                className=" rounded-md mb-3"
                                            />
                                            <h3 className="text-lg font-semibold mb-1">{product.product_name}</h3>
                                            <p className="text-sm text-gray-500 mb-1">Category: {product.category_name}</p>
                                            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{product.description}</p>
                                            <p className="text-base font-bold text-blue-600 mb-3">₹{product.price}</p>
                                            <button
                                                onClick={(e) => handleViewProduct(e, product.product_id)}
                                                className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition"
                                            >
                                                View Product
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Brands;
