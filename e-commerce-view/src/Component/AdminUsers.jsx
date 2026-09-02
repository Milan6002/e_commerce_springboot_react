import { useEffect, useState, useRef } from "react";
import { getAllUsers } from "../Services/authService";
import axios from "axios";
import { motion } from "framer-motion";

// PrimeReact Imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load users', life: 3000 });
      })
      .finally(() => setLoading(false));
  };

  const updateStatus = (id, active) => {
    axios.put(`https://e-commerce-springboot-react-8i4i.onrender.com/api/auth/admin/user/status/${id}?active=${active}`)
      .then(() => {
        toast.current?.show({ 
            severity: 'success', 
            summary: active ? 'Activated' : 'Deactivated', 
            detail: `User account has been ${active ? 'activated' : 'deactivated'}`, 
            life: 3000 
        });
        loadUsers();
      })
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update user status', life: 3000 });
      });
  };

  // --- Templates ---

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag 
        value={rowData.active ? 'ACTIVE' : 'INACTIVE'} 
        severity={rowData.active ? 'success' : 'danger'} 
        icon={rowData.active ? 'pi pi-check-circle' : 'pi pi-ban'}
        className="px-3 py-1 text-sm font-bold border-round-xl"
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-content-center">
        {rowData.active ? (
          <Button
            label="Suspend"
            icon="pi pi-lock"
            severity="danger"
            outlined
            rounded
            size="small"
            onClick={() => updateStatus(rowData.id, false)}
            className="shadow-1 transition-colors transition-duration-200 hover:bg-red-50"
          />
        ) : (
          <Button
            label="Activate"
            icon="pi pi-unlock"
            severity="success"
            outlined
            rounded
            size="small"
            onClick={() => updateStatus(rowData.id, true)}
            className="shadow-1 transition-colors transition-duration-200 hover:bg-green-50"
          />
        )}
      </div>
    );
  };

  const profileImageTemplate = (rowData) => {
    return rowData.img ? (
      <div className="p-1 border-circle bg-white shadow-2 inline-block">
        <img
            src={`data:image/jpeg;base64,${rowData.img}`}
            alt="Profile"
            className="w-3rem h-3rem border-circle object-cover block"
        />
      </div>
    ) : (
      <div className="w-3rem h-3rem border-circle bg-blue-100 flex align-items-center justify-content-center shadow-2 border-1 border-blue-200">
        <i className="pi pi-user text-blue-500 text-xl"></i>
      </div>
    );
  };

  const roleBodyTemplate = (rowData) => {
      const isAdmin = rowData.role === 'ROLE_ADMIN';
      return (
          <Tag 
            value={isAdmin ? 'ADMIN' : 'USER'} 
            severity={isAdmin ? 'info' : 'secondary'} 
            className="border-round-xl"
          />
      );
  }

  const nameBodyTemplate = (rowData) => {
      return (
          <div>
              <div className="font-bold text-800">{rowData.firstname} {rowData.lastname}</div>
              <div className="text-sm text-500">{rowData.email}</div>
          </div>
      );
  }

  const addressBodyTemplate = (rowData) => {
      if (!rowData.addressLine1 && !rowData.city) return <span className="text-400 italic">Not provided</span>;
      return (
          <div className="text-sm">
              <div>{rowData.addressLine1} {rowData.addressLine2}</div>
              <div className="font-semibold text-600">{rowData.city}</div>
          </div>
      );
  }

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0 text-xl font-bold text-800">Registered Accounts</h4>
        <div className="flex align-items-center gap-2">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText 
                    type="search" 
                    onInput={(e) => setGlobalFilter(e.target.value)} 
                    placeholder="Search users..." 
                    className="p-inputtext-sm border-round-3xl w-15rem" 
                />
            </IconField>
            <Button icon="pi pi-refresh" rounded text severity="secondary" onClick={loadUsers} loading={loading} />
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Toast ref={toast} />

      {/* Decorative background blur */}
      <div className="absolute border-circle bg-teal-400 opacity-10" style={{ width: '400px', height: '400px', top: '-100px', right: '-100px', filter: 'blur(80px)' }}></div>
      <div className="absolute border-circle bg-blue-400 opacity-10" style={{ width: '300px', height: '300px', bottom: '-50px', left: '-50px', filter: 'blur(60px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto relative z-1"
      >
        <div className="flex align-items-center gap-3 mb-5">
            <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-teal-600">
                <i className="pi pi-users text-2xl"></i>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-900 m-0">User Management</h1>
                <p className="text-500 m-0 mt-1">View, manage, and secure customer accounts</p>
            </div>
        </div>
        
        <Card className="shadow-4 border-round-2xl overflow-hidden p-0 border-none">
          {loading ? (
            <div className="p-4">
              <Skeleton height="3rem" className="mb-2 border-round-xl"></Skeleton>
              <Skeleton height="3rem" className="mb-2 border-round-xl"></Skeleton>
              <Skeleton height="3rem" className="mb-2 border-round-xl"></Skeleton>
              <Skeleton height="3rem" className="border-round-xl"></Skeleton>
            </div>
          ) : (
            <DataTable 
              value={users} 
              dataKey="id" 
              paginator 
              rows={10} 
              rowsPerPageOptions={[5, 10, 25, 50]}
              responsiveLayout="scroll"
              emptyMessage="No users found."
              stripedRows
              hoverableRows
              className="p-datatable-sm"
              globalFilter={globalFilter}
              header={header}
              showGridlines={false}
            >
              <Column field="id" header="ID" sortable className="font-bold text-700" style={{ width: '5%' }} />
              <Column header="Profile" body={profileImageTemplate} align="center" />
              <Column header="User Identity" body={nameBodyTemplate} sortable field="firstname" />
              <Column field="mobile" header="Phone" />
              <Column header="Location" body={addressBodyTemplate} />
              <Column field="role" header="Role" body={roleBodyTemplate} sortable align="center" />
              <Column header="Status" body={statusBodyTemplate} sortable field="active" align="center" />
              <Column header="Security Action" body={actionBodyTemplate} align="center" style={{ minWidth: '10rem' }} />
            </DataTable>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminUsers;