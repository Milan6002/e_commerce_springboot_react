import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

function AddCategory() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const [categorydata, setCategoryData] = useState({
    category_name: "",
  });

  const addCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AdminServices.addCategory(categorydata);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Category Added Successfully",
        life: 3000,
      });

      setTimeout(() => navigate("/categories"), 1500);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to Add Category",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-gray-50 p-4">
      <Toast ref={toast} />
      <Card className="w-full max-w-28rem shadow-4 border-round-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 m-0 mb-4">
          Add Category
        </h2>
        <form onSubmit={addCategory} className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="category_name" className="font-semibold text-gray-700">Category Name</label>
            <InputText
              id="category_name"
              required
              value={categorydata.category_name}
              onChange={(e) =>
                setCategoryData({ category_name: e.target.value })
              }
              className="w-full"
              placeholder="Enter category name"
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
              label="Add Category" 
              icon="pi pi-plus" 
              className="w-full border-round-lg" 
              loading={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddCategory;