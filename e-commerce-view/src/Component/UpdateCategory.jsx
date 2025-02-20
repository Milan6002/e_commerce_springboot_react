import { useEffect, useState } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate, useParams } from "react-router-dom";

function UpdateCategory() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [categoryData, setCategoryData] = useState({
    category_id: id,
    category_name: "",
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminServices.getCategoryById(
          categoryData.category_id
        );
        setCategoryData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [categoryData.category_id]);

  const handleUpdate = (e, id) => {
    e.preventDefault();
    AdminServices.updateCategory(id, categoryData)
      .then((response) => {
        console.log(response.data);
        navigate("/ecommerce/Categories");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mt-4">
      <h1 className="text-center text-3xl uppercase font-mono font-extrabold text-blue-300 ">
        Update Category Form
      </h1>
      <form
        action=""
        method="post"
        className="bg-blue-300 w-96 mx-auto p-5 rounded-xl"
      >
        <div className="flex flex-col mb-3">
          <label htmlFor="category_id">Category ID </label>
          <input
            value={categoryData.category_id}
            onChange={(e) => handleChanges(e)}
            type="text"
            name="category_id"
            id="category_id"
            className="bg-white p-1 hover:cursor-not-allowed"
            disabled
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="category_name">Category Name </label>
          <input
            className="bg-white p-1"
            value={categoryData.category_name}
            onChange={(e) => handleChanges(e)}
            type="text"
            name="category_name"
            id="category_name"
          />
        </div>
        <button
          onClick={(e) => handleUpdate(e,categoryData.category_id)}
          type="submit"
          className="bg-gray-900 text-white p-2 px-4 rounded-3xl hover:cursor-pointer  hover:bg-gray-800"
        >
          UPDATE
        </button>
      </form>
    </div>
  );
}

export default UpdateCategory;
