import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";

function Home() {
  return (
    <div>
      <div>
        <video src="/src/assets/Img/bag.mp4" muted loop autoPlay className="w-full h-full"></video>
      </div >
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        loop={true}
        className="w-full"
      >
        <SwiperSlide>
          <img src="/src/assets/Img/aer_height_600.png" alt="Aer" className="w-full h-auto object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/Img/vapour_height_600.png" alt="Vapour" className="w-full h-auto object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/src/assets/Img/height600_2.png" alt="Height 600" className="w-full h-auto object-cover" />
        </SwiperSlide>
      </Swiper>
      <div className="flex gap-2 p-4" >
        <div className="bg-gray-200 rounded-full hover:bg-amber-300 hover:rounded-none">
          <img src="/src/assets/Img/vip4.png" className="h-96 w-96" alt="" />
        </div>
        <div className=" bg-gray-200 rounded-full  hover:bg-green-500 hover:rounded-none" >
          <img src="/src/assets/Img/vip3.png" className="h-96 w-96" alt="" />
        </div>
        <div className="bg-gray-200 rounded-full  hover:bg-blue-600 hover:rounded-none">
          <img src=" /src/assets/Img/vip1.png " className="h-96 w-96 " alt="" />
        </div>
      </div>
      <div className=" mt-16 w-80 mx-auto ">
        <p className=" border-b-4 font-bold text-2xl border-b-red-500  text-center">BEST SELLER COLLECTIONS </p>
      </div>
      <div className="flex mt-5">
        <Swiper
          modules={[Navigation]}
          slidesPerView={4}
          spaceBetween={10}
          slidesPerGroup={4}
          loop={true}
          navigation={true}
          loopFillGroupWithBlank={true} // ✅ This ensures all slides appear
        >
          <SwiperSlide>
            <img src="https://vipbags.com/cdn/shop/files/maestro01.png?v=1696486267&width=1100" alt="Aer" className="w-96" />
            <p className="ml-8">VIP MAESTRO NXT</p>
            <p className="ml-8">₹ 9000</p>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://vipbags.com/cdn/shop/files/01_4693df23-dff9-4709-87d3-1111e521dfe6.png?v=1696486288&width=1946" alt="" className="w-96" />
            <p className="ml-8">VIP HIGHLANDER</p>
            <p className="ml-8">₹ 5000</p>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://vipbags.com/cdn/shop/files/front_2.png?v=1696486249&width=1100" alt="" className="w-96" />
            <p className="ml-8">VIP HAVELOCK</p>
            <p className="ml-8">₹ 8000</p>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://vipbags.com/cdn/shop/files/front_d958033a-e11a-42fd-a2cc-7dd842079422.png?v=1696486233&width=1100" alt="" className="w-96" />
            <p className="ml-8">VIP EXPERIA </p>
            <p className="ml-8">₹ 6000</p>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://vipbags.com/cdn/shop/files/01_1.png?v=1710330269&width=1100" alt="" className="w-96" />
            <p className="ml-8">VIP MOLECULE</p>
            <p className="ml-8">₹ 5200</p>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://vipbags.com/cdn/shop/files/AerBlue.png?v=1714391993&width=1100" alt="" className="w-96" />
            <p className="ml-8">VIP AER 8W STROLLY</p>
            <p className="ml-8">₹ 5090</p>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://vipbags.com/cdn/shop/files/AERGrey.png?v=1714391993&width=1100" alt="" className="w-96" />
            <p className="ml-8">VIP AER 8W STROLLY</p>
            <p className="ml-8">₹ 8000</p>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://vipbags.com/cdn/shop/files/1_a020e0bf-fc8d-4ca8-9d4d-9bb5c11ea372.jpg?v=1720611511&width=1100" alt="" className="w-96 " />
            <p className="ml-8">VIP BENISON 8W STROLLY</p>
            <p className="ml-8">₹ 6000</p>
          </SwiperSlide>
        </Swiper>
      </div>
    </div >
  );
}

export default Home;
