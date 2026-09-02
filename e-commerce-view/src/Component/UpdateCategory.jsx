import { useEffect, useState, useRef } from "react";
import AdminServices from "../Services/AdminServices";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function UpdateCategory() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const { id } = useParams();

  const [categoryData, setCategoryData] = useState({
    category_id: id,
    category_name: "",
  });

  const [loading, setLoading] = useState(false);

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
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch category details",
          life: 3000,
        });
      }
    };
    fetchData();
  }, [categoryData.category_id]);

  const handleUpdate = (e, id) => {
    e.preventDefault();
    setLoading(true);

    AdminServices.updateCategory(id, categoryData)
      .then((response) => {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Category Updated Successfully",
          life: 3000,
        });

        setTimeout(() => {
          navigate("/Categories");
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to Update Category",
          life: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-gray-50 p-4">
      <Toast ref={toast} />

      <Card className="w-full max-w-28rem shadow-4 border-round-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 m-0 mb-4">
          Update Category
        </h2>

        <form onSubmit={(e) => handleUpdate(e, categoryData.category_id)} className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="category_id" className="font-semibold text-gray-700">Category ID</label>
            <InputText
              value={categoryData.category_id}
              name="category_id"
              id="category_id"
              className="w-full bg-gray-100"
              disabled
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="category_name" className="font-semibold text-gray-700">Category Name</label>
            <InputText
              value={categoryData.category_name}
              onChange={handleChanges}
              name="category_name"
              id="category_name"
              className="w-full"
              required
            />
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              outlined
              className="w-full border-round-lg"
              onClick={() => navigate('/Categories')}
            />
            <Button
              type="submit"
              label="Update"
              icon="pi pi-check"
              className="w-full border-round-lg"
              loading={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
}

export default UpdateCategory;