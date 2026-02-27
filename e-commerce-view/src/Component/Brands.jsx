import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../Services/AdminServices";

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
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [first, setFirst] = useState(0);
    const rows = 8;

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
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

    const handleViewProduct = (id) => {
        navigate(`/viewproduct/${id}`);
    };

    // 🔍 Filtering
    const filtered = products
        .filter(p =>
            p.product_brand.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // 🔤 Sort Brands
    const grouped = filtered.reduce((acc, product) => {
        const brand = product.product_brand;
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
        <div className="p-4 max-w-7xl mx-auto">

            {/* Filters Section */}
            <div className="grid md:grid-cols-4 gap-4 mb-5">

                <span className="p-input-icon-left col-span-2">
                    <i className="pi pi-search" />
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search brand..."
                        className="w-full"
                    />
                </span>

                <Dropdown
                    value={sortOrder}
                    options={[
                        { label: "A-Z", value: "asc" },
                        { label: "Z-A", value: "desc" }
                    ]}
                    onChange={(e) => setSortOrder(e.value)}
                    className="w-full"
                />

                <div>
                    <label className="text-sm font-semibold">
                        Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <Slider
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.value)}
                        range
                        min={0}
                        max={100000}
                    />
                </div>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} height="250px" />
                    ))}
                </div>
            ) : (
                <Accordion multiple>
                    {sortedBrands.map((brand) => (
                        <AccordionTab
                            key={brand}
                            header={
                                <div className="flex align-items-center gap-3">
                                    <Avatar
                                        label={brand.charAt(0)}
                                        shape="circle"
                                        size="large"
                                    />
                                    <span className="font-bold">
                                        {brand} ({grouped[brand].length})
                                    </span>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {grouped[brand]
                                    .slice(first, first + rows)
                                    .map((product) => (
                                        <Card
                                            key={product.product_id}
                                            className="shadow-3 hover:shadow-6 transition-duration-300"
                                            header={
                                                <img
                                                    src={`data:image/jpeg;base64,${product.product_images[0]}`}
                                                    alt={product.product_name}
                                                    className="w-full h-40 object-cover"
                                                />
                                            }
                                        >
                                            <h3 className="text-lg font-semibold">
                                                {product.product_name}
                                            </h3>

                                            <p className="text-sm text-gray-500 mb-2">
                                                {product.category_name}
                                            </p>

                                            <Rating value={4} readOnly cancel={false} />

                                            <div className="flex gap-3 mt-2 mb-3">
                                                <span className="text-xl font-bold text-primary">
                                                    ₹{product.price}
                                                </span>

                                                {product.discount > 0 && (
                                                    <span className="text-green-600 text-sm">
                                                        {product.discount}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            <Button
                                                label="View"
                                                icon="pi pi-eye"
                                                className="w-full"
                                                onClick={() =>
                                                    handleViewProduct(product.product_id)
                                                }
                                            />
                                        </Card>
                                    ))}
                            </div>

                            <Paginator
                                first={first}
                                rows={rows}
                                totalRecords={grouped[brand].length}
                                onPageChange={(e) => setFirst(e.first)}
                                className="mt-4"
                            />
                        </AccordionTab>
                    ))}
                </Accordion>
            )}
        </div>
    );
}

export default Brands;
