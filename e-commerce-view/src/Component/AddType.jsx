import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

function AddType() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [typedata, setTypeData] = useState({
    type_name: "",
    category_id: null,
  });

  useEffect(() => {
    AdminServices.getAllCategories().then((res) =>
      setCategories(res.data)
    );
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AdminServices.addtype(typedata);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Type Added Successfully",
        life: 3000,
      });

      setTimeout(() => navigate("/Type"), 1500);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to Add Type",
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
          Add Type
        </h2>
        <form onSubmit={submit} className="flex flex-column gap-4">
          
          <div className="flex flex-column gap-2">
            <label htmlFor="type_name" className="font-semibold text-gray-700">Type Name</label>
            <InputText
              id="type_name"
              value={typedata.type_name}
              onChange={(e) =>
                setTypeData({ ...typedata, type_name: e.target.value })
              }
              className="w-full"
              placeholder="Enter type name"
              required
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="category" className="font-semibold text-gray-700">Select Category</label>
            <Dropdown
              id="category"
              value={typedata.category_id}
              options={categories}
              optionLabel="category_name"
              optionValue="category_id"
              placeholder="Select Category"
              onChange={(e) =>
                setTypeData({ ...typedata, category_id: e.value })
              }
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
              onClick={() => navigate('/Type')}
            />
            <Button 
              type="submit" 
              label="Add Type" 
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

export default AddType;