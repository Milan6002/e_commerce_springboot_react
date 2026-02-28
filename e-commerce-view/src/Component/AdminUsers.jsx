import { useEffect, useState } from "react";
import { getAllUsers } from "../Services/authService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";

function AdminUsers() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));

  }, []);

  return (
    <div className="p-4">

      <Card title="Registered Users">

        <DataTable value={users} paginator rows={10} responsiveLayout="scroll">

          <Column field="id" header="ID" />

          <Column field="name" header="Name" />

          <Column field="email" header="Email" />

          <Column field="role" header="Role" />

        </DataTable>

      </Card>

    </div>
  );
}

export default AdminUsers;