import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../Services/AdminServices";
import CartService from "../Services/CartService";
import { jwtDecode } from "jwt-decode";
import "../assets/Shop.css";
import { motion } from "framer-motion";

// PrimeReact Imports
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { Skeleton } from "primereact/skeleton";
import { Card } from "primereact/card";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Tag } from "primereact/tag";

function Backpack() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState('grid');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productRes = await AdminService.getAllProducts();
        const categoryRes = await AdminService.getAllCategories();

        const categoryMap = {};
        categoryRes.data.forEach(
          (c) => (categoryMap[c.category_id] = c.category_name)
        );

        const updated = productRes.data
          .map((p) => {
            const price = Number(p.price || 0);
            const discount = Number(p.discount || 0);
            const finalPrice = discount > 0 ? Math.round(price - (price * discount) / 100) : price;

            return {
              ...p,
              category_name: categoryMap[p.category_id] || "",
              product_brand: p.product_brand || "",
              price: price,
              discount: discount,
              finalPrice: finalPrice,
            };
          })
          .filter((p) => p.category_name.toLowerCase() === "backpack");

        setProducts(updated);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.product_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.product_brand?.toLowerCase().includes(searchText.toLowerCase());

      const matchesPrice =
        p.finalPrice >= priceRange[0] && p.finalPrice <= priceRange[1];

      return matchesSearch && matchesPrice;
    });
  }, [products, searchText, priceRange]);

  const handleView = (id) => {
    navigate(`/viewproduct/${id}`);
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }
      const decoded = jwtDecode(token);
      await CartService.addToCart(decoded.sub, productId, 1);
      alert("Product Added to Cart");
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    }
  };

  const itemTemplate = (product, layout) => {
    if (!product) return null;

    if (layout === 'list') {
      return (
        <div className="col-12 p-3">
          <div className="flex flex-column md:flex-row align-items-center p-4 gap-4 bg-white border-round-2xl shadow-1 hover:shadow-4 transition-all transition-duration-300 h-full cursor-pointer" onClick={() => handleView(product.product_id)}>
            <div className="w-full md:w-15rem text-center relative border-round-xl overflow-hidden bg-gray-50 flex align-items-center justify-center p-2 h-15rem">
               {product.quantity === 0 && <Tag value="OUT OF STOCK" severity="danger" className="absolute z-1" style={{ top: '0.5rem', left: '0.5rem' }} />}
               <img src={`data:image/jpeg;base64,${product.product_images[0]}`} alt={product.product_name} className="w-full h-full object-contain" />
            </div>
            
            <div className="flex flex-column md:flex-row justify-content-between flex-1 gap-4 w-full h-full">
              <div className="flex flex-column gap-2 w-full">
                <div className="flex align-items-center gap-2 mb-2">
                   <Rating value={4} readOnly cancel={false} />
                   {product.product_brand && <Tag value={product.product_brand} severity="success" />}
                </div>
                <div className="text-2xl font-bold text-900 mb-2">{product.product_name}</div>
                <div className="text-600 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</div>
              </div>
              <div className="flex flex-row md:flex-column align-items-center md:align-items-end justify-content-between md:justify-content-center gap-3 w-full md:w-auto">
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-primary mb-1">₹{product.finalPrice}</div>
                  {product.discount > 0 && (
                     <div className="flex gap-2 justify-content-end">
                       <span className="line-through text-500">₹{product.price}</span>
                       <span className="text-green-500 font-bold">{product.discount}% OFF</span>
                     </div>
                  )}
                </div>
                
                <div className="flex flex-column gap-2 mt-3 w-full">
                  {localStorage.getItem("role") !== "ROLE_ADMIN" && (
                     <>
                        <Button icon="pi pi-shopping-cart" className="p-button-primary w-full" label={product.quantity === 0 ? "Out of Stock" : "Add to Cart"} disabled={product.quantity === 0} onClick={(e) => handleAddToCart(product.product_id, e)} />
                        <Button label="View Details" className="p-button-text w-full" onClick={(e) => { e.stopPropagation(); handleView(product.product_id); }} />
                     </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-3">
        <div className="bg-white border-round-2xl shadow-2 hover:shadow-6 transition-all transition-duration-300 p-3 h-full flex flex-column cursor-pointer" onClick={() => handleView(product.product_id)}>
          <div className="w-full h-15rem relative border-round-xl overflow-hidden bg-gray-50 flex align-items-center justify-center p-3 mb-3">
             {product.quantity === 0 && <Tag value="OUT OF STOCK" severity="danger" className="absolute z-1" style={{ top: '0.5rem', left: '0.5rem' }} />}
             <img src={`data:image/jpeg;base64,${product.product_images[0]}`} alt={product.product_name} className="w-full h-full object-contain transition-transform transition-duration-500 hover:scale-110" />
          </div>
          
          <div className="flex flex-column gap-2 flex-1 w-full">
             <div className="flex justify-content-between align-items-center mb-1 w-full">
                <Rating value={4} readOnly cancel={false} />
             </div>
             <h3 className="font-bold text-xl text-900 m-0 w-full" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={product.product_name}>
                {product.product_name}
             </h3>
             
             <div className="flex gap-2 mb-2 w-full overflow-hidden">
               {product.product_brand && <Tag value={product.product_brand} severity="success" />}
             </div>
             
             <p className="text-sm text-600 m-0 mb-3 flex-1 w-full" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
             
             <div className="flex align-items-center justify-content-between mt-auto pt-3 border-top-1 surface-border w-full">
                <div className="flex flex-column">
                   <span className="text-2xl font-bold text-primary">₹{product.finalPrice}</span>
                   {product.discount > 0 && <span className="text-sm text-500 line-through">₹{product.price} ({product.discount}% OFF)</span>}
                </div>
                
                {localStorage.getItem("role") !== "ROLE_ADMIN" && (
                   <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.quantity === 0} onClick={(e) => handleAddToCart(product.product_id, e)} />
                )}
             </div>
          </div>
        </div>
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex flex-column md:flex-row justify-content-between align-items-center gap-4 w-full">
        <div className="flex flex-column md:flex-row gap-3 flex-1 w-full">
          <span className="p-input-icon-left w-full md:w-20rem">
            <i className="pi pi-search" />
            <InputText type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search backpack..." className="w-full border-round-xl" />
          </span>
          <div className="flex flex-column w-full md:w-20rem justify-content-center">
             <div className="flex justify-content-between align-items-center mb-2">
                <span className="text-xs font-semibold text-600">Price Range</span>
                <span className="text-xs font-bold text-primary">₹{priceRange[0]} - ₹{priceRange[1]}</span>
             </div>
             <Slider value={priceRange} onChange={(e) => setPriceRange(e.value)} range min={0} max={20000} className="w-full" />
          </div>
        </div>
        <div className="flex align-items-center justify-content-end w-full md:w-auto mt-3 md:mt-0">
          <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen surface-ground p-4 md:p-6">
      
      <div className="flex align-items-center gap-3 mb-5 pl-2">
         <div className="bg-primary border-circle flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
            <i className="pi pi-briefcase text-xl text-white"></i>
         </div>
         <h2 className="text-4xl font-bold text-900 m-0">Backpack Collection</h2>
      </div>

      <motion.div
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
      >
        <Card className="mb-5 shadow-3 border-round-2xl surface-0 p-0 overflow-hidden">
           {header()}
        </Card>
      </motion.div>

      {!loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <DataView 
            value={filteredProducts} 
            itemTemplate={(item) => itemTemplate(item, layout)} 
            layout={layout} 
            paginator 
            rows={12} 
            emptyMessage={
              <div className="flex flex-column align-items-center justify-content-center p-6 text-center">
                 <i className="pi pi-search text-600 text-6xl mb-4"></i>
                 <h2 className="text-900 font-bold text-2xl mb-2">No Products Found</h2>
                 <p className="text-600 m-0">Try adjusting your search or price filters.</p>
              </div>
            }
          />
        </motion.div>
      ) : (
        <div className="grid">
           {[...Array(8)].map((_, i) => (
             <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-3" key={i}>
                <div className="bg-white border-round-2xl shadow-2 p-3 flex flex-column">
                   <Skeleton width="100%" height="15rem" className="mb-3 border-round-xl"></Skeleton>
                   <Skeleton width="60%" className="mb-2"></Skeleton>
                   <Skeleton width="100%" className="mb-2"></Skeleton>
                   <Skeleton width="40%" height="2rem" className="mt-auto pt-3"></Skeleton>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}

export default Backpack;
