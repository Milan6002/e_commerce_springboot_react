import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

function UpdateType() {
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = React.useRef(null);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
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
                toast.current?.show({
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
        setUpdating(true);

        AdminServices.updateType(typeData.type_id, typeData)
            .then(() => {
                toast.current?.show({
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
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Update Failed",
                    life: 3000
                });
            })
            .finally(() => {
                setUpdating(false);
            });
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen bg-gray-50">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="flex justify-content-center align-items-center min-h-screen bg-gray-50 p-4">
            <Toast ref={toast} />

            <Card className="w-full max-w-28rem shadow-4 border-round-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 m-0 mb-4">
                    Update Type
                </h2>
                <form onSubmit={handleUpdate} className="flex flex-column gap-4">

                    <div className="flex flex-column gap-2">
                        <label htmlFor="type_id" className="font-semibold text-gray-700">
                            Type ID
                        </label>
                        <InputText
                            id="type_id"
                            name="type_id"
                            value={typeData.type_id}
                            disabled
                            className="w-full bg-gray-100"
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="type_name" className="font-semibold text-gray-700">
                            Type Name
                        </label>
                        <InputText
                            id="type_name"
                            name="type_name"
                            value={typeData.type_name}
                            onChange={handleChanges}
                            required
                            className="w-full"
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
                            label="Update"
                            icon="pi pi-check"
                            type="submit"
                            className="w-full border-round-lg"
                            loading={updating}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default UpdateType;