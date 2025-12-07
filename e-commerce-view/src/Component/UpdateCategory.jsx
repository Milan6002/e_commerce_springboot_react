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
        navigate("/Categories");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-3xl border-2 w-96 mx-auto  uppercase font-mono font-extrabold text-gray-900 ">
        Update Category Form
      </h1>
      <form
        action=""
        method="post"
        className="bg-gray-300 w-96 mx-auto border-2 p-5 "
      >
        <div className="flex flex-col mb-3">
          <label htmlFor="category_id">Category ID </label>
          <input
            value={categoryData.category_id}
            onChange={(e) => handleChanges(e)}
            type="text"
            name="category_id"
            id="category_id"
            className="bg-white p-1 hover:cursor-not-allowed rounded-lg"
            disabled
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="category_name">Category Name </label>
          <input
            className="bg-white p-1 rounded-lg"
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
          className="bg-gray-900 items-center text-white p-2 px-4 rounded-3xl hover:cursor-pointer  hover:bg-gray-800"
        >
          UPDATE
        </button>
      </form>
    </div>
  );
}

export default UpdateCategory;
