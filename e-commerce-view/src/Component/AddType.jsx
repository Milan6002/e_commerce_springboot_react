import React, { useState } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate } from "react-router-dom";

function AddType() {
  const navigate = useNavigate();

  const [typedata, setTypeData] = useState({
    type_id: "",
    type_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTypeData({ ...typedata, [name]: value });
  };

  const AddType = (e) => {
    e.preventDefault();
 
    AdminServices.addtype(typedata)
      .then((response) => {
        console.log(response.data);
        navigate("/Type");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form
        onSubmit={AddType}
        className="bg-gray-800 rounded-xl w-full max-w-md p-6 sm:p-8 text-white shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Add Type</h2>
        <div className="flex flex-col mb-4">
          <label className="mb-2" htmlFor="type_name">
            Type Name:
          </label>
          <input
            required
            type="text"
            name="type_name"
            id="type_name"
            onChange={handleChange}
            value={typedata.type_name}
            className="bg-white text-gray-900 p-2 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-gray-900 p-2 rounded-xl mt-4 hover:bg-gray-200 transition"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AddType;
