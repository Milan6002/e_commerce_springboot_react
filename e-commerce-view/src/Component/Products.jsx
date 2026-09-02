import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminService from "../Services/AdminServices";
import "../assets/Shop.css";
import { motion } from "framer-motion";
import { calculateDiscountPrice } from "../Utils/priceUtils";
import CartService from "../Services/CartService";
import { jwtDecode } from "jwt-decode";

// PrimeReact Imports
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Tag } from "primereact/tag";

function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedBrand = queryParams.get("Brand");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState('grid');
  const toast = useRef(null);

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

        const updated = productRes.data.map((p) => ({
          ...p,
          category_name: categoryMap[p.category_id],
          product_brand: p.product_brand || "",
          price: Number(p.price || 0),
          discount: Number(p.discount || 0)
        }));

        setProducts(updated);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBrand) setSelectedCategory("");
  }, [selectedBrand]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(
        (p) => String(p.category_id) === String(selectedCategory)
      );
    }

    if (selectedBrand) {
      result = result.filter(
        (p) =>
          p.product_brand &&
          p.product_brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (searchText.trim() !== "") {
      const query = searchText.toLowerCase();
      result = result.filter(
        (p) =>
          p.product_name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.product_brand?.toLowerCase().includes(query) ||
          p.category_name?.toLowerCase().includes(query)
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    return result;
  }, [products, selectedCategory, selectedBrand, searchText, priceRange]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      await AdminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully', life: 3000 });
    } catch (err) {
      console.error(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
    }
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    navigate(`/UpdateProduct/${id}`);
  };

  const handleView = (e, id) => {
    e.preventDefault();
    navigate(`/viewproduct/${id}`);
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please login first', life: 3000 });
      navigate("/login");
      return;
    }
    const item = { ...product, quantity: 1 };
    navigate("/checkout", { state: [item] });
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please login first', life: 3000 });
        return;
      }

      const decoded = jwtDecode(token);
      const email = decoded.sub; // ✅ correct email

      console.log("EMAIL:", email);

      await CartService.addToCart(email, productId, 1);

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product Added to Cart', life: 3000 });
    } catch (err) {
      console.error(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error adding to cart', life: 3000 });
    }
  };

  
  const itemTemplate = (product, layout) => {
    if (!product) return null;
    const sellingPrice = calculateDiscountPrice(product.price, product.discount);

    if (layout === 'list') {
      return (
        <div className="col-12 p-3">
          <div className="flex flex-column md:flex-row align-items-center p-4 gap-4 bg-white border-round-2xl shadow-1 hover:shadow-4 transition-all transition-duration-300 h-full">
            <div className="w-full md:w-15rem text-center relative border-round-xl overflow-hidden bg-gray-50 flex align-items-center justify-center p-2 h-15rem">
               {product.quantity === 0 && <Tag value="OUT OF STOCK" severity="danger" className="absolute z-1" style={{ top: '0.5rem', left: '0.5rem' }} />}
               <img src={`data:image/jpeg;base64,${product.product_images[0]}`} alt={product.product_name} className="w-full h-full object-contain" />
            </div>
            
            <div className="flex flex-column md:flex-row justify-content-between flex-1 gap-4 w-full h-full">
              <div className="flex flex-column gap-2 w-full">
                <div className="flex align-items-center gap-2 mb-2">
                   <Rating value={4} readOnly cancel={false} />
                   {product.product_brand && <Tag value={product.product_brand} severity="success" />}
                   {product.category_name && <Tag value={product.category_name} severity="info" />}
                </div>
                <div className="text-2xl font-bold text-900 mb-2">{product.product_name}</div>
                <div className="text-600 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</div>
              </div>
              <div className="flex flex-row md:flex-column align-items-center md:align-items-end justify-content-between md:justify-content-center gap-3 w-full md:w-auto">
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-primary mb-1">₹{sellingPrice}</div>
                  {product.discount > 0 && (
                     <div className="flex gap-2 justify-content-end">
                       <span className="line-through text-500">₹{product.price}</span>
                       <span className="text-green-500 font-bold">{product.discount}% OFF</span>
                     </div>
                  )}
                </div>
                
                <div className="flex flex-column gap-2 mt-3 w-full">
                  {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                     <div className="flex gap-2">
                       <Button icon="pi pi-pencil" label="Edit" className="p-button-outlined w-full" onClick={(e) => { e.stopPropagation(); handleUpdate(e, product.product_id); }} />
                       <Button icon="pi pi-trash" label="Delete" className="p-button-danger p-button-outlined w-full" onClick={(e) => { e.stopPropagation(); handleDelete(e, product.product_id); }} />
                     </div>
                  ) : (
                     <div className="flex gap-2">
                       <Button icon="pi pi-bolt" className="w-full border-none" style={{ background: '#f97316' }} label="Buy Now" disabled={product.quantity === 0} onClick={(e) => handleBuyNow(e, product)} />
                       <Button icon="pi pi-shopping-cart" className="p-button-primary w-full" label="Cart" disabled={product.quantity === 0} onClick={(e) => { e.stopPropagation(); handleAddToCart(product.product_id); }} />
                     </div>
                  )}
                  {localStorage.getItem("role") !== "ROLE_ADMIN" && (
                     <Button label="View Details" className="p-button-text w-full" onClick={(e) => { e.stopPropagation(); handleView(e, product.product_id); }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid layout
    return (
      <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-3">
        <div className="bg-white border-round-2xl shadow-2 hover:shadow-6 transition-all transition-duration-300 p-3 h-full flex flex-column cursor-pointer" onClick={(e) => {
           if(localStorage.getItem("role") !== "ROLE_ADMIN") handleView(e, product.product_id)
        }}>
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
               {product.category_name && <Tag value={product.category_name} severity="info" />}
               {product.product_brand && <Tag value={product.product_brand} severity="success" />}
             </div>
             
             <p className="text-sm text-600 m-0 mb-3 flex-1 w-full" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
             
             <div className="flex align-items-center justify-content-between mt-auto pt-3 border-top-1 surface-border w-full">
                <div className="flex flex-column">
                   <span className="text-2xl font-bold text-primary">₹{sellingPrice}</span>
                   {product.discount > 0 && <span className="text-sm text-500 line-through">₹{product.price} ({product.discount}% OFF)</span>}
                </div>
                
                {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                   <div className="flex gap-2">
                     <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-sm" onClick={(e) => {e.stopPropagation(); handleUpdate(e, product.product_id)}} />
                     <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined p-button-sm" onClick={(e) => {e.stopPropagation(); handleDelete(e, product.product_id)}} />
                   </div>
                ) : (
                   <div className="flex gap-2">
                     <Button icon="pi pi-bolt" className="p-button-rounded border-none" style={{ background: '#f97316' }} disabled={product.quantity === 0} onClick={(e) => handleBuyNow(e, product)} tooltip="Buy Now" tooltipOptions={{ position: 'top' }} />
                     <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.quantity === 0} onClick={(e) => {e.stopPropagation(); handleAddToCart(product.product_id)}} tooltip="Add to Cart" tooltipOptions={{ position: 'top' }} />
                   </div>
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
          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categories.map((c) => ({ label: c.category_name, value: c.category_id }))}
            placeholder="All Categories"
            className="w-full md:w-15rem border-round-xl"
            showClear
          />
          <span className="p-input-icon-left w-full md:w-15rem">
            <i className="pi pi-search" />
            <InputText type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search products..." className="w-full border-round-xl" />
          </span>
          <div className="flex flex-column w-full md:w-15rem justify-content-center">
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
      <Toast ref={toast} />

      {localStorage.getItem("role") === "ROLE_ADMIN" && (
        <Button
          label="Add Product"
          icon="pi pi-plus"
          onClick={() => navigate("/AddProduct")}
          className="mb-5 p-button-primary border-round-xl p-button-raised shadow-2"
        />
      )}

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
                 <p className="text-600 m-0">Try adjusting your category, search, or price filters.</p>
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

export default Products;
