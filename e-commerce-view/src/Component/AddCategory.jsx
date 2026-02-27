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

  const [categorydata, setCategoryData] = useState({
    category_name: "",
  });

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await AdminServices.addCategory(categorydata);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Category Added Successfully",
        life: 3000,
      });

      setTimeout(() => navigate("/admin/categories"), 1500);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to Add Category",
      });
    }
  };

  return (
    <div className="flex justify-content-center mt-6">
      <Toast ref={toast} />
      <Card title="Add Category" style={{ width: "400px" }}>
        <form onSubmit={addCategory} className="p-fluid">
          <div className="field mb-3">
            <label>Category Name</label>
            <InputText
              required
              value={categorydata.category_name}
              onChange={(e) =>
                setCategoryData({ category_name: e.target.value })
              }
            />
          </div>

          <Button label="Add Category" icon="pi pi-plus" />
        </form>
      </Card>
    </div>
  );
}

export default AddCategory;