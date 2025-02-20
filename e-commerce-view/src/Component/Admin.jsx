import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-500 p-10">
        <h1 className="text-3xl md:text-5xl text-center text-white font-bold">
          Welcome Back Admin
        </h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {/* Categories Section */}
        <div className="border-4 border-gray-300 bg-white shadow-lg rounded-2xl text-center p-5 transition-transform transform hover:scale-105">
          <h1 className="text-xl md:text-3xl uppercase font-semibold text-gray-800">
            Categories
          </h1>
          <p className="mt-3 text-sm md:text-lg text-gray-600">
            Manage the categories section here
          </p>
          <button
            onClick={() => navigate("/ecommerce/Categories")}
            className="mt-5 bg-blue-600 p-3 px-8 rounded-3xl text-sm md:text-xl font-extrabold text-white uppercase hover:cursor-grab hover:bg-blue-500"
          >
            Manage
          </button>
        </div>

        {/* Products Section */}
        <div className="border-4 border-gray-300 bg-white shadow-lg rounded-2xl text-center p-5 transition-transform transform hover:scale-105">
          <h1 className="text-xl md:text-3xl uppercase font-semibold text-gray-800">
            Products
          </h1>
          <p className="mt-3 text-sm md:text-lg text-gray-600">
            Manage the products section here
          </p>
          <button
            onClick={() => navigate("/ecommerce/Products")}
            className="mt-5 bg-blue-600 p-3 px-8 rounded-3xl text-sm md:text-xl font-extrabold text-white uppercase hover:cursor-grab hover:bg-blue-500"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
