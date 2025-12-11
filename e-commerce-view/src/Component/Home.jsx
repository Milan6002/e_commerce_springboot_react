// HomePremiumGlass.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
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
import { Link } from "react-router-dom";

export default function HomePremiumGlass() {

  const brands = [
    { name: "ARISTOCRAT", img: Aristocrat_logo },
    { name: "City Bag", img: CityBag_logo },
    { name: "VIP", img: VIP_logo },
    { name: "HP", img: HP_logo },
    { name: "HRX", img: HRX_logo },
    { name: "SAFARI", img: Safari_logo },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">

      {/* HERO SECTION */}
      <div className="relative h-[56vh] md:h-[72vh] overflow-hidden">
        <video
          src={Home_Video}
          muted
          loop
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-sm flex items-center">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto px-6 text-white"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
              Elevate Your Carry
            </h1>
            <p className="mt-3 text-lg md:text-xl max-w-2xl">
              Premium backpacks & travel gear designed for comfort, durability and style.
            </p>
            <div className="mt-6 flex gap-4">
              <Link to="/shop" className="px-6 py-3 rounded-xl bg-white/20 border border-white/30 hover:bg-white/30">
                Shop Collections
              </Link>
              <Link to="/best-seller" className="px-6 py-3 rounded-xl bg-white text-black font-semibold">
                Best Sellers
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* GLASS FEATURE CARDS */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[Card_Img1, Card_Img2, Card_Img3].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 flex flex-col items-center shadow-lg"
            >
              <img src={src} alt={`card-${i}`} className="h-64 w-auto object-contain" />
              <h3 className="mt-4 text-xl font-semibold">Featured</h3>
              <p className="text-sm text-gray-200 mt-1">Comfort • Quality • Warranty</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MAIN SLIDER */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold mb-6">Top Picks</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
        >
          <SwiperSlide><img src={Slider_Img1} alt="s1" className="w-full h-64 object-cover rounded-xl" /></SwiperSlide>
          <SwiperSlide><img src={Slider_Img2} alt="s2" className="w-full h-64 object-cover rounded-xl" /></SwiperSlide>
          <SwiperSlide><img src={Slider_Img3} alt="s3" className="w-full h-64 object-cover rounded-xl" /></SwiperSlide>
        </Swiper>
      </section>

      {/* BEST SELLER CAROUSEL */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <h3 className="text-xl font-semibold mb-4">BEST SELLER COLLECTIONS</h3>
        <Swiper
          modules={[Navigation]}
          slidesPerView={4}
          spaceBetween={12}
          navigation
          loop
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SwiperSlide key={i}>
              <div className="bg-white shadow rounded-lg p-4">
                <img
                  src={`https://vipbags.com/cdn/shop/files/front_${i}.png`}
                  alt={`p-${i}`}
                  className="w-full h-48 object-cover rounded"
                />
                <div className="mt-3">
                  <p className="font-semibold text-sm">Product {i}</p>
                  <p className="text-indigo-600 font-bold">₹{4000 + i * 500}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* BRAND LOGOS FIXED */}
      <section className="max-w-6xl mx-auto px-6 mt-12 mb-20">
        <h4 className="text-lg font-semibold mb-4">Brands</h4>

        <div className="flex flex-wrap gap-6 items-center">
          {brands.map((brand, idx) => (
            <Link key={idx} to={`/Shop?Brand=${encodeURIComponent(brand.name)}`}>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 hover:scale-105 transition">
                <img src={brand.img} alt={brand.name} className="h-14 object-contain" />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
