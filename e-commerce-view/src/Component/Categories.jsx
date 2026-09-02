import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import { motion } from "framer-motion";

// PrimeReact Imports
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { InputText } from 'primereact/inputtext';

function Categories() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminServices.getAllCategories();
        setCategoryData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCategory = async (e, id) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      await AdminServices.deleteCategory(id);
      setCategoryData((prev) => prev.filter((category) => category.category_id !== id));
      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Category deleted successfully",
        life: 3000
      });
    } catch (err) {
      console.error("Failed to delete category:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete category",
        life: 3000
      });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          className="p-button-rounded p-button-warning p-button-text" 
          aria-label="Update" 
          onClick={(e) => { e.preventDefault(); navigate(`/UpdateCategory/${rowData.category_id}`) }} 
          tooltip="Edit Category"
          tooltipOptions={{ position: 'top' }}
        />
        <Button 
          icon="pi pi-trash" 
          className="p-button-rounded p-button-danger p-button-text" 
          aria-label="Delete" 
          onClick={(e) => handleDeleteCategory(e, rowData.category_id)} 
          tooltip="Delete Category"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-xl text-900 font-bold">Category List</span>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="border-round-xl w-full sm:w-auto" />
        </span>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <Toast ref={toast} />

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center mb-5 gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 m-0 mb-2">Manage Categories</h1>
            <p className="text-600 m-0">View, edit, or remove product categories in your store.</p>
          </div>
          <Button
            label="Add Category"
            icon="pi pi-plus"
            onClick={() => navigate("/AddCategory")}
            className="p-button-primary border-round-full shadow-2 hover:shadow-4 transition-all"
          />
        </div>

        <Card className="shadow-3 border-round-2xl surface-0 overflow-hidden">
          {loading ? (
            <div className="p-4">
              <Skeleton height="3rem" className="mb-2 border-round"></Skeleton>
              <Skeleton height="3rem" className="mb-2 border-round"></Skeleton>
              <Skeleton height="3rem" className="mb-2 border-round"></Skeleton>
              <Skeleton height="3rem" className="border-round"></Skeleton>
            </div>
          ) : error ? (
            <div className="flex align-items-center justify-content-center p-6 text-red-500 font-semibold text-lg">
                <i className="pi pi-exclamation-triangle mr-2 text-2xl"></i> {error}
            </div>
          ) : (
            <DataTable 
              value={categoryData} 
              paginator 
              rows={10} 
              rowsPerPageOptions={[5, 10, 25, 50]} 
              emptyMessage="No categories found."
              globalFilter={globalFilter}
              header={header}
              stripedRows
              className="p-datatable-sm"
              responsiveLayout="stack"
              breakpoint="960px"
            >
              <Column header="Sr No." body={(data, options) => options.rowIndex + 1} style={{ width: '10%' }}></Column>
              <Column field="category_name" header="Category Name" sortable style={{ width: '70%' }}></Column>
              <Column header="Actions" body={actionBodyTemplate} style={{ width: '20%' }}></Column>
            </DataTable>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default Categories;
