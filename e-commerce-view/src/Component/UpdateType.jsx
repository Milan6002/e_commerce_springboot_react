import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";

function UpdateType() {
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = React.useRef(null);

    const [loading, setLoading] = useState(true);
    const [typeData, setTypeData] = useState({
        type_id: id,
        type_name: ""
    });

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setTypeData({ ...typeData, [name]: value });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AdminServices.getTypeById(id);
                setTypeData(response.data);
            } catch (error) {
                console.log(error);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to load type data",
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();

        AdminServices.updateType(typeData.type_id, typeData)
            .then(() => {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Type Updated Successfully",
                    life: 3000
                });

                setTimeout(() => {
                    navigate("/Type");
                }, 1500);
            })
            .catch((error) => {
                console.log(error);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Update Failed",
                    life: 3000
                });
            });
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Toast ref={toast} />

            <Card
                title="Update Type"
                className="shadow-4"
                style={{ width: "400px" }}
            >
                <form onSubmit={handleUpdate} className="p-fluid">

                    <div className="field mb-3">
                        <label htmlFor="type_id" className="font-bold">
                            Type ID
                        </label>
                        <InputText
                            id="type_id"
                            name="type_id"
                            value={typeData.type_id}
                            disabled
                            className="p-inputtext-sm"
                        />
                    </div>

                    <div className="field mb-4">
                        <label htmlFor="type_name" className="font-bold">
                            Type Name
                        </label>
                        <InputText
                            id="type_name"
                            name="type_name"
                            value={typeData.type_name}
                            onChange={handleChanges}
                            required
                            className="p-inputtext-sm"
                        />
                    </div>

                    <Button
                        label="Update"
                        icon="pi pi-check"
                        type="submit"
                        className="w-full"
                    />
                </form>
            </Card>
        </div>
    );
}

export default UpdateType;