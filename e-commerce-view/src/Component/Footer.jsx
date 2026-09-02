import Logo from "../assets/Img/BL_Favicon_removebg.png";
import Genuine from "../assets/Img/genuine.png";
import Wallet from "../assets/Img/e_wallet.png";
import Shipping from "../assets/Img/free_shipping.png";
import Warranty from "../assets/Img/warranty.png";
import '../assets/Footer.css';

// PrimeReact Imports
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

function Footer() {
  return (
    <div className="bg-black pt-8 pb-2 text-white">
      <div className="w-24 mx-auto mb-4 hover:scale-105 transition-transform transition-duration-300">
        <img src={Logo} alt="Bombay Luggage Logo" className="w-full h-auto" />
      </div>
      <div>
        <div className="mx-auto mt-2 text-lg font-bold w-full max-w-md text-center px-4">
          <h1 className="pb-2 text-center text-xl md:text-2xl font-extrabold tracking-wide">
            Why To Buy From Bombay Luggage
          </h1>
          <Divider align="center">
            <span className="p-tag p-component text-white shadow-2" style={{ backgroundColor: "#29186D", padding: '0.4rem 1rem', fontSize: '1rem' }}>Quality</span>
          </Divider>
        </div>
        <div className="flex flex-row justify-between items-start gap-4 text-center mt-8 px-2 md:px-8 max-w-7xl mx-auto w-full">
          <div className="flex-1 mb-4 hover:-translate-y-2 transition-transform transition-duration-300">
            <img
              src={Shipping}
              alt="Shipping"
              className="w-12 h-12 md:w-16 md:h-16 object-contain text-white mx-auto mb-3"
            />
            <h1 className="font-extrabold text-sm md:text-xl tracking-widest mt-2">
              Free Shipping
            </h1>
            <p className="text-gray-400 text-xs md:text-base mt-2 px-1">Prompt shipping across India.</p>
          </div>
          <div className="flex-1 mb-4 hover:-translate-y-2 transition-transform transition-duration-300">
            <img
              src={Wallet}
              alt="Wallet"
              className="w-12 h-12 md:w-16 md:h-16 object-contain text-white mx-auto mb-3"
            />
            <h1 className="font-extrabold text-sm md:text-xl tracking-widest mt-2">
              Secure Payment
            </h1>
            <p className="text-gray-400 text-xs md:text-base mt-2 px-1">Ensuring top-tier payment security.</p>
          </div>
          <div className="flex-1 mb-4 hover:-translate-y-2 transition-transform transition-duration-300">
            <img
              src={Warranty}
              alt="Warranty"
              className="w-12 h-12 md:w-16 md:h-16 object-contain text-white mx-auto mb-3"
            />
            <h1 className="font-extrabold text-sm md:text-xl tracking-widest mt-2">
              Brand Warranty
            </h1>
            <p className="text-gray-400 text-xs md:text-base mt-2 px-1">Backed by international warranty.</p>
          </div>
          <div className="flex-1 mb-4 hover:-translate-y-2 transition-transform transition-duration-300">
            <img
              src={Genuine}
              alt="Genuine"
              className="w-12 h-12 md:w-16 md:h-16 object-contain text-white mx-auto mb-3"
            />
            <h1 className="font-extrabold text-sm md:text-xl tracking-widest mt-2">
              Genuine Products
            </h1>
            <p className="text-gray-400 text-xs md:text-base mt-2 px-1">Subjected to rigorous testing.</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center justify-center mt-6">
        <Button icon="pi pi-facebook" rounded text aria-label="Facebook" style={{ color: 'white' }} />
        <Button icon="pi pi-instagram" rounded text aria-label="Instagram" style={{ color: 'white' }} />
        <Button icon="pi pi-whatsapp" rounded text aria-label="WhatsApp" style={{ color: 'white' }} />
      </div>
      <div
        className="text-white mt-8 text-center p-3"
        style={{ backgroundColor: "#29186D" }}
      >
        <p className="mb-1 text-sm">
          © 2025 BOMBAY LUGGAGE. All Right Reserved | Terms & Condition | Privacy & Policy
        </p>
        <p className="text-xs text-gray-300">(Monday to Sunday. 09:00 AM to 11:00 PM)</p>
      </div>
    </div>
  );
}

export default Footer;
