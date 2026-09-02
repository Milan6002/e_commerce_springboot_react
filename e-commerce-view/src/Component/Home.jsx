import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Home_Video from "../assets/Img/bag.mp4";
import Slider_Img1 from "../assets/Img/aer_height_600.png";
import Slider_Img2 from "../assets/Img/vapour_height_600.png";
import Slider_Img3 from "../assets/Img/height600_2.png";
import Card_Img1 from "../assets/Img/vip4.png";
import Card_Img2 from "../assets/Img/vip3.png";
import Card_Img3 from "../assets/Img/vip1.png";
import Aristocrat_logo from "../assets/Img/Aristocrat_logo.jpg";
import CityBag_logo from "../assets/Img/CityBag_logo.jpg";
import VIP_logo from "../assets/Img/VIP_logo.png";
import HP_logo from "../assets/Img/HP_logo.png";
import HRX_logo from "../assets/Img/HRX_logo.jpg";
import Safari_logo from "../assets/Img/Safari_logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import AdminService from "../Services/AdminServices";
// PrimeReact Imports
import { Carousel } from 'primereact/carousel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function HomePremiumGlass() {
  const navigate = useNavigate();

  const brands = [
    { name: "ARISTOCRAT", img: Aristocrat_logo },
    { name: "City Bag", img: CityBag_logo },
    { name: "VIP", img: VIP_logo },
    { name: "HP", img: HP_logo },
    { name: "HRX", img: HRX_logo },
    { name: "SAFARI", img: Safari_logo },
  ];

  const mainSliderImages = [Slider_Img1, Slider_Img2, Slider_Img3];
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoadingBestSellers(true);
      const response = await AdminService.getAllProducts();
      if (response.data && response.data.length > 0) {
        setBestSellers(response.data.slice(0, 8));
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoadingBestSellers(false);
    }
  };
  const carouselResponsiveOptions = [
    { breakpoint: '1024px', numVisible: 4, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  const mainSliderTemplate = (img) => {
    return (
      <div className="px-2">
        <img src={img} alt="slider" className="w-full h-20rem md:h-30rem object-cover border-round-xl shadow-2" />
      </div>
    );
  };

  const productTemplate = (product) => {
    // Fallback if product is not yet loaded correctly
    if (!product) return null;

    const discountPrice = product.discount > 0 
      ? Math.round(product.price - (product.price * product.discount) / 100) 
      : product.price;

    return (
      <div className="p-2 md:p-3">
        <Card className="shadow-2 hover:shadow-6 transition-all transition-duration-300 border-round-2xl overflow-hidden h-full cursor-pointer">
          <div className="overflow-hidden border-round-top-2xl text-center">
            <img
              src={product.product_images && product.product_images.length > 0 ? `data:image/jpeg;base64,${product.product_images[0]}` : "/no-image.png"}
              alt={product.product_name}
              className="w-full h-15rem md:h-18rem object-contain transition-transform transition-duration-500 hover:scale-110"
            />
          </div>
          <div className="mt-3 px-2 text-center w-full">
            <h4 
              className="m-0 font-bold text-lg md:text-xl text-gray-800 line-clamp-2" 
              title={product.product_name}
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal', height: '3.5rem' }}
            >
              {product.product_name}
            </h4>
            <div className="mt-2 flex align-items-center justify-content-center gap-2">
              <h5 className="m-0 text-primary font-bold text-xl md:text-2xl">₹{discountPrice}</h5>
              {product.discount > 0 && (
                <span className="text-500 line-through text-sm">₹{product.price}</span>
              )}
            </div>
            <Button 
              label="View Details" 
              icon="pi pi-search" 
              onClick={() => navigate(`/viewproduct/${product.product_id}`)}
              className="p-button-outlined p-button-sm w-full mt-3 border-round-xl hover:bg-primary hover:text-white transition-colors transition-duration-200" 
            />
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen surface-ground">
      {/* HERO SECTION */}
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <video
          src={Home_Video}
          muted
          loop
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent flex align-items-center">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto px-5 text-white w-full"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg m-0 line-height-2">
              Elevate <br className="hidden md:block"/>Your Carry
            </h1>
            <p className="mt-4 text-lg md:text-2xl max-w-xl text-gray-200 line-height-3 drop-shadow-md">
              Discover premium backpacks & travel gear designed for comfort, durability and undeniable style.
            </p>
            <div className="mt-6 flex gap-4 flex-wrap">
              <Button 
                label="Shop Collections" 
                icon="pi pi-shopping-bag" 
                onClick={() => navigate('/shop')} 
                className="p-button-outlined text-white border-white border-2 hover:bg-white hover:text-black border-round-3xl px-5 py-3 font-bold transition-all transition-duration-300" 
              />
              <Button 
                label="Best Sellers" 
                icon="pi pi-star-fill" 
                onClick={() => navigate('/best-seller')} 
                className="bg-white text-black-alpha-90 border-none hover:bg-gray-200 shadow-3 hover:shadow-6 border-round-3xl px-5 py-3 font-bold transition-all transition-duration-300" 
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* GLASS FEATURE CARDS */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-1">
        <div className="grid">
          {[Card_Img1, Card_Img2, Card_Img3].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="col-12 md:col-4"
            >
              <Card className="h-full flex flex-column align-items-center justify-content-center text-center shadow-4 border-round-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                <img src={src} alt={`card-${i}`} className="h-10rem w-auto object-contain" />
                <h3 className="mt-4 mb-1 text-xl font-bold text-gray-800">Featured</h3>
                <p className="text-sm text-gray-500 m-0">Comfort • Quality • Warranty</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MAIN SLIDER */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Top Picks</h2>
        <Carousel 
          value={mainSliderImages} 
          numVisible={1} 
          numScroll={1} 
          circular 
          autoplayInterval={3000} 
          itemTemplate={mainSliderTemplate} 
          showNavigators={false}
          showIndicators={true}
        />
      </section>

      {/* BEST SELLER CAROUSEL */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Best Selling Products</h3>
        {loadingBestSellers ? (
          <div className="grid">
            {[...Array(4)].map((_, i) => (
              <div className="col-12 md:col-3 p-2" key={i}>
                <Card className="h-full border-round-2xl overflow-hidden shadow-2">
                  <div className="w-full h-15rem surface-300 animate-pulse"></div>
                  <div className="p-3">
                    <div className="h-2rem surface-300 w-8 mb-3 animate-pulse"></div>
                    <div className="h-2rem surface-300 w-4 mb-3 animate-pulse"></div>
                    <div className="h-3rem surface-300 w-full animate-pulse border-round"></div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : bestSellers && bestSellers.length > 0 ? (
          <Carousel 
            value={bestSellers} 
            numVisible={4} 
            numScroll={1} 
            responsiveOptions={carouselResponsiveOptions} 
            itemTemplate={productTemplate} 
          />
        ) : (
          <div className="p-4 text-center surface-100 border-round-xl">
            <h4 className="text-xl text-gray-600 m-0">No best selling products available at the moment.</h4>
          </div>
        )}
      </section>

      {/* BRAND LOGOS */}
      <section className="max-w-6xl mx-auto px-4 mt-6 mb-8">
        <h4 className="text-2xl font-bold mb-4 text-gray-800">Brands</h4>
        <div className="flex flex-wrap gap-4 align-items-center">
          {brands.map((brand, idx) => (
            <Link key={idx} to={`/Shop?Brand=${encodeURIComponent(brand.name)}`} className="no-underline">
              <div className="bg-white p-3 border-round-xl shadow-2 hover:shadow-4 transition-all transition-duration-200 cursor-pointer">
                <img src={brand.img} alt={brand.name} className="h-4rem object-contain" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
