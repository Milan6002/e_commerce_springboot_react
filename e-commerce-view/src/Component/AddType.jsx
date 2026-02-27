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
    try {
      await AdminServices.addtype(typedata);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Type Added Successfully",
      });

      setTimeout(() => navigate("/Type"), 1500);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to Add Type",
      });
    }
  };

  return (
    <div className="flex justify-content-center mt-6">
      <Toast ref={toast} />
      <Card title="Add Type" style={{ width: "400px" }}>
        <form onSubmit={submit} className="p-fluid">
          <div className="field mb-3">
            <label>Type Name</label>
            <InputText
              value={typedata.type_name}
              onChange={(e) =>
                setTypeData({ ...typedata, type_name: e.target.value })
              }
              required
            />
          </div>

          <div className="field mb-3">
            <label>Select Category</label>
            <Dropdown
              value={typedata.category_id}
              options={categories}
              optionLabel="category_name"
              optionValue="category_id"
              placeholder="Select Category"
              onChange={(e) =>
                setTypeData({ ...typedata, category_id: e.value })
              }
            />
          </div>

          <Button label="Add Type" icon="pi pi-check" />
        </form>
      </Card>
    </div>
  );
}

export default AddType;