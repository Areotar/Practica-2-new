import { useState } from "react";
import React from "react";
import Mensaje from "./Mensaje";

export default function AdminMenu({ role }) {



    const [mensajeCreate, setMensajeCreate] = useState("")
    const [mensajeUpdate, setMensajeUpdate] = useState("")
    const [mensajeGet, setMensajeGet] = useState("")
    const [mensajeDelete, setMensajeDelete] = useState("")

    const [cif, setCif] = useState("")
    const [cifGet, setCifGet] = useState("")
    const [cifDelete, setCifDelete] = useState("")
    const [getComerce, setGetComerce] = useState("")

    const [create, setCreate] = useState({
        name: "",
        cif: "",
        direccion: "",
        email: "",
        telefono: "",
        id_web: "",
    });

    const [update, setUpdate] = useState({
        name: "",
        direccion: "",
        email: "",
        telefono: "",
        id_web: "",
    });

    const handleChangeCreate = (event, field) => {
        setCreate({
            ...create,
            [field]: event.target.value,
        });
    };

    const handleChangeUpdate = (event, field) => {
        setUpdate({
            ...update,
            [field]: event.target.value,
        });
    };

    const handleCreate = () => {
        fetch("http://localhost:3000/api/comerce", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("response.token")}`,
            },
            body: JSON.stringify(create),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al crear el comercio");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Comercio creado:", data);

                if (data.token) {
                    console.log("Token del comercio:", data.token);
                }
                setMensajeCreate(`Creacion de comercio exitosa.`);
            })
            .catch((error) => {
                console.error("Error al crear el comercio:", error);

            });
    };

    const handleUpdate = () => {
        // console.log(update)
        fetch(`http://localhost:3000/api/comerce/${cif}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("response.token")}`,
            },
            body: JSON.stringify(update),
        })
            .then((data) => {
                console.log("Comercio actualizado:", data);
                setMensajeUpdate("Comercio actualizado exitosamente.");
            })
            .catch((error) => {
                console.error("Error al actualizar el comercio:", error);
                setMensajeUpdate("Error al actualizar el comercio.");
            });
    }

    const handleGet = () => {
        fetch(`http://localhost:3000/api/comerce/${cifGet}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("response.token")}`,
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setGetComerce(data);
                setMensajeGet("Comercio encontrado.")
                console.log("Comercio encontrado:", data)
            })
            .catch((error) => {
                console.error("Error al obtener el comercio:", error);
                setGetComerce(null);
                setMensajeGet("No se pudo encontrar el comercio.");
            });
    };

    const handleDelete = () => {
        fetch(`http://localhost:3000/api/comerce/${cifDelete}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("response.token")}`,
            },
        })
            .then(() => {
                console.log("Comercio eliminado.")
                setMensajeDelete("Comercio eliminado con éxito.");
            })
            .catch((error) => {
                console.error("Error al eliminar el comercio:", error);
                setMensajeDelete("Error al eliminar el comercio.");
            });
    };

    if (!role) return null;
    return (

        <div>
            <hr></hr>
            <h3>Menu de Administrador</h3>

            <div>
                <h3>Crear Comercio</h3>
                <div>
                    <label>Nombre: </label>
                    <input
                        type="text"
                        value={create.name}
                        onChange={(e) => handleChangeCreate(e, "name")}
                    />
                </div>
                <div>
                    <label>CIF: </label>
                    <input
                        type="text"
                        value={create.cif}
                        onChange={(e) => handleChangeCreate(e, "cif")}
                    />
                </div>
                <div>
                    <label>Dirección: </label>
                    <input
                        type="text"
                        value={create.direccion}
                        onChange={(e) => handleChangeCreate(e, "direccion")}
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={create.email}
                        onChange={(e) => handleChangeCreate(e, "email")}
                    />
                </div>
                <div>
                    <label>Teléfono: </label>
                    <input
                        type="text"
                        value={create.telefono}
                        onChange={(e) => handleChangeCreate(e, "telefono")}
                    />
                </div>
                <div>
                    <label>ID Web: </label>
                    <input
                        type="text"
                        value={create.id_web}
                        onChange={(e) => handleChangeCreate(e, "id_web")}
                    />
                </div>
                <button onClick={handleCreate}>Crear Comercio</button>
                <Mensaje mensaje={mensajeCreate} />
            </div>

            <div>
                <h3>Actualizar Comercio</h3>
                <div>
                    <label>CIF del Comercio: </label>
                    <input
                        type="text"
                        value={cif}
                        onChange={(e) => setCif(e.target.value)}
                    />
                </div>
                <div>
                    <label>Nombre: </label>
                    <input
                        type="text"
                        value={update.name}
                        onChange={(e) => handleChangeUpdate(e, "name")}
                    />
                </div>
                <div>
                    <label>Dirección: </label>
                    <input
                        type="text"
                        value={update.direccion}
                        onChange={(e) => handleChangeUpdate(e, "direccion")}
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={update.email}
                        onChange={(e) => handleChangeUpdate(e, "email")}
                    />
                </div>
                <div>
                    <label>Teléfono: </label>
                    <input
                        type="text"
                        value={update.telefono}
                        onChange={(e) => handleChangeUpdate(e, "telefono")}
                    />
                </div>
                <div>
                    <label>ID Web: </label>
                    <input
                        type="text"
                        value={update.id_web}
                        onChange={(e) => handleChangeUpdate(e, "id_web")}
                    />
                </div>
                <button onClick={handleUpdate}>Actualizar Comercio</button>
                <Mensaje mensaje={mensajeUpdate} />
            </div>

            <div>
                <h3>Obtener Comercio</h3>
                <div>
                    <label>CIF del Comercio: </label>
                    <input
                        type="text"
                        value={cifGet}
                        onChange={(e) => setCifGet(e.target.value)}
                    />
                </div>
                <button onClick={handleGet}>Buscar Comercio</button>
                <Mensaje mensaje={mensajeGet} />
                {getComerce && (
                    <div>
                        <h4>Detalles del Comercio:</h4>
                        <p>Nombre: {getComerce.name}</p>
                        <p>Dirección: {getComerce.direccion}</p>
                        <p>Email: {getComerce.email}</p>
                        <p>Teléfono: {getComerce.telefono}</p>
                        <p>ID Web: {getComerce.id_web}</p>
                    </div>
                )}
            </div>

            <div>
                <h3>Eliminar Comercio</h3>
                <div>
                    <label>CIF del Comercio: </label>
                    <input
                        type="text"
                        value={cifDelete}
                        onChange={(e) => setCifDelete(e.target.value)}
                    />
                </div>
                <button onClick={handleDelete}>Eliminar Comercio</button>
                <Mensaje mensaje={mensajeDelete} />
            </div>

        </div>
    );
}
