import { useState } from "react";
import React from "react";
import Mensaje from "./Mensaje";

export default function ComerceMenu() {

    const [mensajeToken, setMensajeToken] = useState("");
    const [mensajeCreate, setMensajeCreate] = useState("");
    const [mensajeUpdate, setMensajeUpdate] = useState("");
    const [mensajeDelete, setMensajeDelete] = useState("");
    const [mensajeImagen, setMensajeImagen] = useState("")
    const [mensajeInteresados, setMensajeInteresados] = useState("");

    const [updateCif, setUpdateCif] = useState("")
    const [deleteCif, setDeleteCif] = useState("")
    const [imageCif, setimageCif] = useState("")
    const [getUsersCif, setGetUsersCif] = useState("")


    const [interesados, setInteresados] = useState([])
    const [token, setToken] = useState("")
    const [tipoDelete, setTipoDelete] = useState(true)
    const [imagen, setImagen] = useState(null)

    const [create, setCreate] = useState({
        cif: "",
        ciudad: "",
        actividad: "",
        titulo: "",
        resumen: "",
        textos: [],
        imagenes: [],
    });

    const [update, setUpdate] = useState({
        ciudad: "",
        actividad: "",
        titulo: "",
        resumen: "",
        textos: [],
        imagenes: [],
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

    const handleTokenChange = (event) => {
        setToken(event.target.value);
    };

    const handleArrayChange = (event, field, isCreate) => {
        const value = event.target.value.trim();
        if (value === "") return;
        // Cuando se pulse enter se añade un nuevo objeto al array
        if (event.key === "Enter") {
            const currentState = isCreate ? create : update;
            const updatedArray = [...currentState[field], value];

            if (isCreate) {
                setCreate({ ...currentState, [field]: updatedArray });
            } else {
                setUpdate({ ...currentState, [field]: updatedArray });
            }

            // Limpiar el campo
            event.target.value = "";
        }
    };

    const validateCreateData = () => {
        if (!create.cif || !create.ciudad || !create.actividad || !create.titulo || !create.resumen) {
            setMensajeCreate("Por favor, completa todos los campos requeridos.");
            return false;
        }
        return true;
    };

    const handleSaveToken = () => {
        if (token) {
            localStorage.setItem("comerceToken", token)
            setMensajeToken("Token guardado exitosamente.");
            console.log("Token del comercio almacenado:", token)
        } else {
            setMensajeToken("Por favor, ingresa un token válido.");
        }
    };

    const handleCreateWeb = () => {

        if (!validateCreateData()) {
            setMensajeCreate("Completa todos los campos");
            return;
        }

        fetch("http://localhost:3000/api/web", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("comerceToken")}`,
            },
            body: JSON.stringify(create),
        })

            .then((response) => {
                if (!response.ok) {
                    setMensajeCreate("Error al crear la página web");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Web creada:", data);
                setMensajeCreate("Página web creada exitosamente.");
            })
            .catch((error) => {
                console.error("Error al crear la página web:", error);
                setMensajeCreate("Error al crear la página web.");
            });
    }


    const handleUpdateWeb = () => {

        if (!token) {
            setMensajeUpdate("Por favor, ingresa y guarda un token para continuar.");
            return;
        }

        if (!updateCif) {
            setMensajeUpdate("Por favor, ingrese el ID de la web a actualizar.");
            return;
        }

        fetch(`http://localhost:3000/api/web/${updateCif}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("comerceToken")}`,
            },
            body: JSON.stringify(update),
        })
            .then((response) => {
                console.log("Response status:", response.status);
                console.log("Response object:", response);
                if (!response.ok) {
                    throw new Error("Error al actualizar la página web. Response");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Web actualizada:", data);
                setMensajeUpdate("Página web actualizada exitosamente.");
            })
            .catch((error) => {
                console.error("Error al actualizar la página web:", error);
                setMensajeUpdate("Error al actualizar la página web.");
            });
    };

    const handleDeleteWeb = async () => {
        if (!deleteCif) {
            setMensajeDelete("Por favor, ingrese un CIF válido.");
            return;
        }

        try {
            // Construye la URL de la API con el parámetro de eliminación lógica
            const url = `http://localhost:3000/api/web/${deleteCif}?logic=${tipoDelete}`;

            const token = localStorage.getItem("comerceToken")

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Autenticación con token
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la página web.");
            }

            // Maneja la respuesta según el tipo de borrado
            const data = await response.text();
            if (tipoDelete) {
                setMensajeDelete("Página web eliminada lógicamente.");
                console.log(data)
            } else {
                setMensajeDelete("Página web eliminada físicamente.");
                console.log(data)
            }
        } catch (error) {
            console.error("Error:", error);
            setMensajeDelete("Hubo un problema al intentar eliminar la web.");
        }
    };

    const handleImage = () => {
        if (!imagen || !imageCif) {
            setMensajeImagen("Selecciona una imagen y proporciona el CIF.");
            return;
        }

        const formData = new FormData();
        formData.append("image", imagen)

        fetch(`http://localhost:3000/api/web/${imageCif}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("comerceToken")}`
            },
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    console.error("Error al subir la imagen:");
                    setMensajeImagen("Error al subir la imagen.");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Imagen añadida con exito:", data);
                setMensajeImagen("Imagen añadida con exito.");
            })
            .catch((error) => {
                console.error("Error al subir la imagen:", error);
                setMensajeImagen("Error al subir la imagen.");
            });
    };

    const handleGetUsers = async () => {
        if (!getUsersCif) {
            setMensajeInteresados("Por favor, ingresa un CIF válido.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/web/interes/${getUsersCif}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("comerceToken")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener los interesados.");
            }

            const data = await response.json();
            setInteresados(data);
            setMensajeInteresados("Usuarios interesados obtenidos con éxito.");
        } catch (error) {
            console.error("Error al obtener los interesados:", error);
            setMensajeInteresados("Error al obtener los interesados.");
        }
    };

    return (
        <div>

            <div>
                <h4>Ingresa tu Token</h4>
                <input
                    type="text"
                    value={token}
                    onChange={handleTokenChange}
                    placeholder="Introduce el token"
                />
                <button onClick={handleSaveToken}>Guardar Token</button>
                <Mensaje mensaje={mensajeToken} />
            </div>

            <div>
                <h4>Crear Página Web</h4>
                <div>
                    <label>CIF: </label>
                    <input
                        type="text"
                        value={create.cif}
                        onChange={(e) => handleChangeCreate(e, "cif")}
                    />
                </div>
                <div>
                    <label>Ciudad: </label>
                    <input
                        type="text"
                        value={create.ciudad}
                        onChange={(e) => handleChangeCreate(e, "ciudad")}
                    />
                </div>
                <div>
                    <label>Actividad: </label>
                    <input
                        type="text"
                        value={create.actividad}
                        onChange={(e) => handleChangeCreate(e, "actividad")}
                    />
                </div>
                <div>
                    <label>Título: </label>
                    <input
                        type="text"
                        value={create.titulo}
                        onChange={(e) => handleChangeCreate(e, "titulo")}
                    />
                </div>
                <div>
                    <label>Resumen: </label>
                    <textarea
                        value={create.resumen}
                        onChange={(e) => handleChangeCreate(e, "resumen")}
                    />
                </div>

                <div>
                    <label>Textos: </label>
                    <input
                        type="text"
                        placeholder="Pulsa Enter para añadir texto"
                        onKeyDown={(e) => handleArrayChange(e, "textos", true)}
                    />
                    <ul>
                        {create.textos.map((texto, index) => (
                            <p key={index}>{texto}</p>
                        ))}
                    </ul>
                </div>
                <div>
                    <label>Imágenes: </label>
                    <input
                        type="text"
                        placeholder="Pulsa Enter para añadir una URL de imagen"
                        onKeyDown={(e) => handleArrayChange(e, "imagenes", true)}
                    />
                    <ul>
                        {create.imagenes.map((imagen, index) => (
                            <p key={index}>{imagen}</p>
                        ))}
                    </ul>
                </div>

                <button onClick={handleCreateWeb}>Crear Web</button>
                <Mensaje mensaje={mensajeCreate} />
            </div>

            <div>
                <h4>Actualizar Página Web</h4>
                <div>
                    <label>Cif: </label>
                    <input
                        type="text"
                        value={updateCif}
                        onChange={(e) => setUpdateCif(e.target.value)}
                    />
                </div>
                <div>
                    <label>Ciudad: </label>
                    <input
                        type="text"
                        value={update.ciudad}
                        onChange={(e) => handleChangeUpdate(e, "ciudad")}
                    />
                </div>
                <div>
                    <label>Actividad: </label>
                    <input
                        type="text"
                        value={update.actividad}
                        onChange={(e) => handleChangeUpdate(e, "actividad")}
                    />
                </div>
                <div>
                    <label>Título: </label>
                    <input
                        type="text"
                        value={update.titulo}
                        onChange={(e) => handleChangeUpdate(e, "titulo")}
                    />
                </div>
                <div>
                    <label>Resumen: </label>
                    <textarea
                        value={update.resumen}
                        onChange={(e) => handleChangeUpdate(e, "resumen")}
                    />
                </div>

                <div>
                    <label>Textos: </label>
                    <input
                        type="text"
                        placeholder="Pulsa Enter para añadir texto"
                        onKeyDown={(e) => handleArrayChange(e, "textos", false)}
                    />
                    <ul>
                        {update.textos.map((texto, index) => (
                            <p key={index}>{texto}</p>
                        ))}
                    </ul>
                </div>
                <div>
                    <label>Imágenes: </label>
                    <input
                        type="text"
                        placeholder="Pulsa Enter para añadir una URL de imagen"
                        onKeyDown={(e) => handleArrayChange(e, "imagenes", false)}
                    />
                    <ul>
                        {update.imagenes.map((imagen, index) => (
                            <p key={index}>{imagen}</p>
                        ))}
                    </ul>
                </div>
                <button onClick={handleUpdateWeb}>Actualizar Web</button>
                <Mensaje mensaje={mensajeUpdate} />
            </div>

            <div>
                <h4>Eliminar Página Web</h4>
                <div>
                    <label>Cif de la web: </label>
                    <input
                        type="text"
                        value={deleteCif}
                        onChange={(e) => setDeleteCif(e.target.value)}
                    />
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            // Si está marcado, es borrado lógico
                            checked={tipoDelete}
                            onChange={(event) => setTipoDelete(event.target.checked)}
                        />
                        Borrado logico:
                    </label>
                </div>

                <button onClick={handleDeleteWeb}>Eliminar Web</button>
                <Mensaje mensaje={mensajeDelete} />
            </div>

            <div>
                <h4>Añadir Imagen a la Web</h4>
                <div>
                    <label>CIF de la web: </label>
                    <input
                        type="text"
                        value={imageCif}
                        onChange={(e) => setimageCif(e.target.value)}
                        placeholder="Introduce el CIF de la web"
                    />
                </div>
                <div>
                    <label>Selecciona una imagen: </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                </div>
                <button onClick={handleImage}>Añadir Imagen</button>
                <Mensaje mensaje={mensajeImagen} />
            </div>

            <div>
                <h4>Usuarios Interesados</h4>
                <div>
                    <label>CIF de la web: </label>
                    <input
                        type="text"
                        value={getUsersCif}
                        onChange={(e) => setGetUsersCif(e.target.value)}
                        placeholder="Introduce el CIF de la web"
                    />
                </div>
                <button onClick={handleGetUsers}>Obtener Interesados</button>
                <Mensaje mensaje={mensajeInteresados} />
                {interesados.length > 0 && (
                    <div>
                        <h5>Lista de Interesados</h5>
                            {interesados.map((usuario, index) => (
                                <p key={index}>{usuario.email}</p>
                            ))}
                    </div>
                )}
            </div>

        </div>
    );
}
