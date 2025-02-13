import Logo from "../assets/Img/BL_Favicon_removebg.png";
import Genuine from "../assets/Img/genuine.png";
import Wallet from "../assets/Img/e_wallet.png";
import Shipping from "../assets/Img/free_shipping.png";
import Warranty from "../assets/Img/warranty.png";
import Facebook from "../assets/Img/facebook_color.png";
import Instagram from "../assets/Img/instagram_color.png";
import Whatsapp from "../assets/Img/whatsapp_color.png";
function Footer() {
  return (
    <div className="bg-black pt-8 text-white">
      <div className="w-24 mx-auto">
        <img src={Logo} alt="" />
      </div>
      <div>
        <div className="mx-auto mt-2 text-lg font-bold w-80">
          <h1
            className="pb-2 border-b-8 text-center"
            style={{ borderColor: "#29186D" }}
          >
            Why To Buy From Bombay Luggage
          </h1>
        </div>
        <div className="grid grid-cols-4 text-center mt-14">
          <div>
            <img
              src={Shipping}
              alt="Genuine"
              className="w-14 text-white mx-auto"
            />
            <h1 className="font-extrabold text-lg tracking-widest font-">
              Free Shipping
            </h1>
            <p>Prompt shipping across India.</p>
          </div>
          <div>
            <img
              src={Wallet}
              alt="Genuine"
              className="w-14 text-white mx-auto"
            />
            <h1 className="font-extrabold text-lg tracking-widest font-">
              Secure Payment
            </h1>
            <p>Ensuring top-tier payment security.</p>
          </div>
          <div>
            <img
              src={Warranty}
              alt="Genuine"
              className="w-14 text-white mx-auto"
            />
            <h1 className="font-extrabold text-lg tracking-widest font-">
              Brand Warranty
            </h1>
            <p>All products are backed by international warranty.</p>
          </div>
          <div>
            <img
              src={Genuine}
              alt="Genuine"
              className="w-14 text-white mx-auto"
            />
            <h1 className="font-extrabold text-lg tracking-widest font-">
              Genuine Products
            </h1>
            <p>Subjected to rigorous 8-level testing.</p>
          </div>
        </div>
      </div>
      <div className="flex gap-10 items-center justify-center mt-8">
        <a href="">
          <img src={Facebook} alt="Genuine" className="w-10 text-white" />
        </a>
        <a href="">
          <img src={Instagram} alt="Genuine" className="w-10 text-white" />
        </a>
        <a href="">
          <img src={Whatsapp} alt="Genuine" className="w-10 text-white" />
        </a>
      </div>
      <div
        className="text-white mt-8 text-center p-2"
        style={{ backgroundColor: "#29186D" }}
      >
        <p className="mb-1">
          © 2025 BOMBAY LUGGAGE. All Right Reserved | Terms & Condition |
          Privacy & Policy
        </p>
        <p>(Monday to Sunday. 09:00 to 11:00)</p>
      </div>
    </div>
  );
}

export default Footer;
