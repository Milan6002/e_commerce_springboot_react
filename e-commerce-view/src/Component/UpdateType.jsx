import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminServices from "../Services/AdminServices";

function UpdateType() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [typeData, setTypeData] = useState({
        type_id: id,
        type_name: "",
    });

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setTypeData({ ...typeData, [name]: value });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AdminServices.getTypeById(
                    typeData.type_id
                );
                setTypeData(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [typeData.type_id]);

    const handleUpdate = (e, id) => {
        e.preventDefault();
        AdminServices.updateType(id, typeData)
            .then((response) => {
               
                navigate("/Type");
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className="p-4">
            <h1 className="text-center text-3xl border-2 w-96 mx-auto  uppercase font-mono font-extrabold text-gray-900 ">
                Update Type Form
            </h1>
            <form
                action=""
                method="post"
                className="bg-gray-300 w-96 mx-auto border-2 p-5 "
            >
                <div className="flex flex-col mb-3">
                    <label htmlFor="category_id">Type ID </label>
                    <input
                        value={typeData.type_id}
                        onChange={(e) => handleChanges(e)}
                        type="text"
                        name="type_id"
                        id="type_id"
                        className="bg-white p-1 hover:cursor-not-allowed rounded-lg"
                        disabled
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <label htmlFor="category_name">Type Name </label>
                    <input
                        className="bg-white p-1 rounded-lg"
                        value={typeData.type_name}
                        onChange={(e) => handleChanges(e)}
                        type="text"
                        name="type_name"
                        id="type_name"
                    />
                </div>
                <button
                    onClick={(e) => handleUpdate(e, typeData.type_id)}
                    type="submit"
                    className="bg-gray-900 items-center text-white p-2 px-4 rounded-3xl hover:cursor-pointer  hover:bg-gray-800"
                >
                    UPDATE
                </button>
            </form>
        </div>
    )
}
export default UpdateType;