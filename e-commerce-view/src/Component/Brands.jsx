import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../Services/AdminServices";
import { calculateDiscountPrice } from "../Utils/priceUtils";
import { motion } from "framer-motion";
import { Tag } from "primereact/tag";


import { Accordion, AccordionTab } from "primereact/accordion";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Paginator } from "primereact/paginator";
import { Rating } from "primereact/rating";
import { Slider } from "primereact/slider";
import { Avatar } from "primereact/avatar";

function Brands() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [first, setFirst] = useState({});
    const rows = 8;

    const onPageChange = (brand, event) => {
        setFirst(prev => ({ ...prev, [brand]: event.first }));
    };


    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {

        setLoading(true);

        try {

            const response = await AdminService.getAllProducts();
            setProducts(response.data);

        } catch (error) {

            console.error(error);

        }

        setLoading(false);
    };

    const fetchCategories = async () => {

        try {

            const response = await AdminService.getAllCategories();
            setCategories(response.data);

        } catch (error) {

            console.error(error);

        }
    };

    const getCategoryName = (id) => {

        const category = categories.find(c => c.category_id === id);
        return category ? category.category_name : "Unknown";

    };

    const handleViewProduct = (id) => {
        navigate(`/viewproduct/${id}`);
    };

    const filtered = products
        .filter(p =>
            p.product_brand?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    const grouped = filtered.reduce((acc, product) => {

        const brand = product.product_brand || "Unknown";

        if (!acc[brand]) acc[brand] = [];

        acc[brand].push(product);

        return acc;

    }, {});

    const sortedBrands = Object.keys(grouped).sort((a, b) => {

        return sortOrder === "asc"
            ? a.localeCompare(b)
            : b.localeCompare(a);

    });

    
    return (
        <div className="min-h-screen surface-ground p-4 md:p-6">
            
            {/* FILTERS */}
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
            >
              <Card className="mb-5 shadow-3 border-round-2xl surface-0 p-0 overflow-hidden">
                  <div className="flex flex-column md:flex-row justify-content-between align-items-center gap-4 w-full p-4">
                      <span className="p-input-icon-left w-full md:flex-1">
                          <i className="pi pi-search" />
                          <InputText
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search brand..."
                              className="w-full border-round-xl"
                          />
                      </span>

                      <Dropdown
                          value={sortOrder}
                          options={[
                              { label: "A-Z", value: "asc" },
                              { label: "Z-A", value: "desc" }
                          ]}
                          onChange={(e) => setSortOrder(e.value)}
                          className="w-full md:w-15rem border-round-xl"
                      />

                      <div className="flex flex-column w-full md:w-20rem justify-content-center">
                          <div className="flex justify-content-between align-items-center mb-2">
                              <span className="text-xs font-semibold text-600">Price Range</span>
                              <span className="text-xs font-bold text-primary">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                          </div>
                          <Slider
                              value={priceRange}
                              onChange={(e) => setPriceRange(e.value)}
                              range
                              min={0}
                              max={100000}
                              className="w-full"
                          />
                      </div>
                  </div>
              </Card>
            </motion.div>

            {loading ? (
                <div className="grid">
                    {[...Array(4)].map((_, i) => (
                        <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-3" key={i}>
                           <div className="bg-white border-round-2xl shadow-2 p-3 flex flex-column h-full">
                              <Skeleton width="100%" height="15rem" className="mb-3 border-round-xl"></Skeleton>
                              <Skeleton width="60%" className="mb-2"></Skeleton>
                              <Skeleton width="100%" className="mb-2"></Skeleton>
                              <Skeleton width="40%" height="2rem" className="mt-auto pt-3"></Skeleton>
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                    <Accordion multiple activeIndex={[0]}>
                        {sortedBrands.map((brand) => {
                            const brandProducts = grouped[brand];
                            const currentFirst = first[brand] || 0;
                            const displayedProducts = brandProducts.slice(currentFirst, currentFirst + rows);
                            
                            return (
                                <AccordionTab
                                    key={brand}
                                    header={
                                        <div className="flex align-items-center gap-3">
                                            <Avatar
                                                label={brand.charAt(0).toUpperCase()}
                                                shape="circle"
                                                size="large"
                                                className="bg-primary text-white font-bold"
                                            />
                                            <span className="font-bold text-xl text-900">
                                                {brand} 
                                            </span>
                                            <Tag value={brandProducts.length + " Products"} severity="info" rounded className="ml-2" />
                                        </div>
                                    }
                                >
                                    <div className="grid">
                                        {displayedProducts.map((product) => {
                                            const discountPrice = calculateDiscountPrice(
                                                product.price,
                                                product.discount
                                            );

                                            return (
                                                <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-3" key={product.product_id}>
                                                    <div className="bg-white border-round-2xl shadow-2 hover:shadow-6 transition-all transition-duration-300 p-3 h-full flex flex-column cursor-pointer" onClick={() => handleViewProduct(product.product_id)}>
                                                        <div className="w-full h-15rem relative border-round-xl overflow-hidden bg-gray-50 flex align-items-center justify-center p-3 mb-3">
                                                            {product.quantity === 0 && <Tag value="OUT OF STOCK" severity="danger" className="absolute z-1" style={{ top: '0.5rem', left: '0.5rem' }} />}
                                                            <img
                                                                src={`data:image/jpeg;base64,${product.product_images[0]}`}
                                                                alt={product.product_name}
                                                                className="w-full h-full object-contain transition-transform transition-duration-500 hover:scale-110"
                                                            />
                                                        </div>

                                                        <div className="flex flex-column gap-2 flex-1 w-full">
                                                            <div className="flex justify-content-between align-items-center mb-1 w-full">
                                                                <Rating value={4} readOnly cancel={false} />
                                                            </div>
                                                            
                                                            <h3 className="font-bold text-xl text-900 m-0 w-full" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={product.product_name}>
                                                                {product.product_name}
                                                            </h3>
                                                            
                                                            <div className="flex flex-wrap gap-2 mb-2 w-full">
                                                                {product.category_id && <Tag value={getCategoryName(product.category_id)} severity="info" />}
                                                                {product.product_color && <Tag value={product.product_color} style={{ background: '#f8f9fa', color: '#495057', border: '1px solid #ced4da' }} />}
                                                            </div>

                                                            <p className="text-sm text-600 m-0 mb-3 flex-1 w-full" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {product.description}
                                                            </p>

                                                            <div className="flex align-items-center justify-content-between mt-auto pt-3 border-top-1 surface-border w-full">
                                                                <div className="flex flex-column">
                                                                    <span className="text-2xl font-bold text-primary">₹{discountPrice}</span>
                                                                    {product.discount > 0 && <span className="text-sm text-500 line-through">₹{product.price} ({product.discount}% OFF)</span>}
                                                                </div>
                                                                <Button icon="pi pi-eye" className="p-button-rounded p-button-outlined" onClick={(e) => { e.stopPropagation(); handleViewProduct(product.product_id); }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {brandProducts.length > rows && (
                                        <Paginator
                                            first={currentFirst}
                                            rows={rows}
                                            totalRecords={brandProducts.length}
                                            onPageChange={(e) => onPageChange(brand, e)}
                                            className="mt-4 border-round-xl"
                                        />
                                    )}
                                </AccordionTab>
                            );
                        })}
                    </Accordion>
                </motion.div>
            )}
        </div>
    );
}

export default Brands;
