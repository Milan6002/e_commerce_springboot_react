import { useState } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate } from "react-router-dom";

function AddCategory() {
  const navigate = useNavigate();

  const [categorydata, setCategoryData] = useState({
    category_id:"",
    category_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categorydata, [name]: value });
  };

  const addCategory = (e) => {
    e.preventDefault();
    console.log(categorydata);
    AdminServices.addCategory(categorydata)
      .then((response) => {
        console.log(response.data);
        navigate("/Categories");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form
        action=""
        method="post"
        className="bg-gray-800 rounded-xl w-96 mx-auto mt-5 p-5 text-white"
      >
        <div className="flex flex-col mb-3">
          <label className="mb-3" htmlFor="category_name">
            Category Name :{" "}
          </label>
          <input
            required
            type="text"
            name="category_name"
            id="category_name"
            onChange={handleChange}
            value={categorydata.category_name}
            className="bg-white text-gray-900 p-1 text-lg"
          />
        </div>
        <button
          type="submit"
          onClick={addCategory}
          className="bg-white text-gray-900 p-2 px-7 rounded-2xl mt-3 hover:cursor-pointer"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AddCategory;
