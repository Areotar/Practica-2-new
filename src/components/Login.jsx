import { useState } from "react";
import Mensaje from "./Mensaje";

export default function Login({ setMessage }) {

    const [mensaje, setMensaje] = useState("")
    const [creacion, setCreacion] = useState("")

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const [reg, setReg] = useState({
        nombre: "",
        email: "",
        password: "",
        edad: 0,
        ciudad: "",
        intereses: [],
        ofertas: false,
    });

    const [patch, setPatch] = useState({
        nombre: "",
        email: "",
        password: "",
        edad: 0,
        ciudad: "",
        intereses: [],
        ofertas: false,
    });

    const handleChange = (event, field) => {
        setData({
            ...data,
            [field]: event.target.value
        });
    }

    const handleR = (event, field) => {
        setReg({
            ...reg,
            [field]: event.target.value
        });
    }

    const handleP = (event, field) => {
        setPatch({
            ...patch,
            [field]: event.target.value
        });
    }

    const handleCheckBox = (event) => {
        const val = event.target.value === "on" ? true : false;
        setReg({
            ...reg,
            "ofertas": val
        });
    };

    const handleCheckBoxPatch = (event) => {
        const val = event.target.value === "on" ? true : false;
        setPatch({
            ...patch,
            "ofertas": val
        });
    };

    const handleLogin = () => {
        fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(responseData => {
                console.log(responseData)
                if (responseData.token) {
                    localStorage.setItem('response.token', responseData.token);
                    localStorage.setItem("response.id", responseData.user._id)
                    setMensaje(`¡Inicio de sesión exitoso! Bienvenido.`);
                }
            })
            .catch(error => {
                setMessage("Error: usuario o contraseña incorrectos.");
                console.log(error)
            });
    };

    const handleDelete = () => {
        const userToken = localStorage.getItem("response.token")
        const userId = localStorage.getItem("response.id")

        fetch(`http://localhost:3000/api/auth/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    setMessage("Error al eliminar el usuario")
                }
                return response.text();
            })
            .then(responseData => {
                console.log(responseData);
                setMensaje("Usuario eliminado con éxito.")
                localStorage.removeItem("response.token")
                localStorage.removeItem("response.id")
            })

    }

    const handleReg = () => {
        fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reg)
        })
            .then(response => response.json())
            .then(responseData => {
                console.log(responseData)
                if (responseData.token) {
                    localStorage.setItem('response.token', responseData.token);
                    setCreacion(`¡Creacion de usuario exitosa! Bienvenido.`);
                }
            })
            .catch(error => {
                setMessage("Error, datos incorrectos.");
                console.log(error)
            });
    };

    const handlePatch = () => {
        const userToken = localStorage.getItem("response.token")
        const userId = localStorage.getItem("response.id")

        const filteredPatch = Object.entries(patch).reduce((acc, [key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});

        fetch(`http://localhost:3000/api/auth/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify(filteredPatch)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la modificación del usuario");
                }
                return response.json();
            })
            .then(responseData => {
                console.log(responseData)
                setMessage("¡Modificación de usuario exitosa!")
            })
            .catch(error => {
                setMessage("Error, datos incorrectos.");
                console.log(error)
            });
    };

    return (
        <>

            <div>
                <h3>Inicio de Sesion</h3>
            </div>

            <div>
                <label>Correo: </label>
                <input type="text" onChange={(event) => handleChange(event, "email")} />
            </div>
            <div>
                <label>Contrseña: </label>
                <input type="password" onChange={(event) => handleChange(event, "password")} />
            </div>
            <div>
                <button onClick={handleLogin}>Iniciar Sesion</button>
                <button onClick={handleDelete}>Eliminar Sesion</button>
                <Mensaje mensaje={mensaje}/>
            </div>

            <hr></hr>

            <div>
                <h3>Creacion de Usuario</h3>
            </div>
            <div>
                <label>Nombre: </label>
                <input
                    type="text"
                    value={reg.nombre}
                    onChange={(event) => handleR(event, "nombre")}
                />
            </div>
            <div>
                <label>Correo: </label>
                <input
                    type="email"
                    value={reg.email}
                    onChange={(event) => handleR(event, "email")}
                />
            </div>
            <div>
                <label>Contraseña: </label>
                <input
                    type="password"
                    value={reg.password}
                    onChange={(event) => handleR(event, "password")}
                />
            </div>
            <div>
                <label>Edad: </label>
                <input
                    type="number"
                    value={reg.edad}
                    onChange={(event) => handleR(event, "edad")}
                />
            </div>
            <div>
                <label>Ciudad: </label>
                <input
                    type="text"
                    value={reg.ciudad}
                    onChange={(event) => handleR(event, "ciudad")}
                />
            </div>
            <div>
                <label>Intereses: </label>
                <input
                    type="text"
                    value={reg.intereses}
                    onChange={(event) => handleR(event, "intereses")}
                />
            </div>
            <div>
                <label>¿Te gustaría recibir ofertas?: </label>
                <input
                    type="checkbox"
                    onChange={(event) => handleCheckBox(event)}
                />
                <button onClick={handleReg}>Crear usuario</button>
                <Mensaje mensaje={creacion}/>
            </div>

            <hr></hr>

            <div>
                <h2>Modificar Usuario</h2>
                <h3>Para modificar tu usario primero debes iniciar sesion</h3>
            </div>

            <div>
                <label>Nombre: </label>
                <input
                    type="text"
                    value={patch.nombre}
                    onChange={(event) => handleP(event, "nombre")}
                />
            </div>
            <div>
                <label>Correo: </label>
                <input
                    type="email"
                    value={patch.email}
                    onChange={(event) => handleP(event, "email")}
                />
            </div>
            <div>
                <label>Contraseña: </label>
                <input
                    type="password"
                    value={patch.password}
                    onChange={(event) => handleP(event, "password")}
                />
            </div>
            <div>
                <label>Edad: </label>
                <input
                    type="number"
                    value={patch.edad}
                    onChange={(event) => handleP(event, "edad")}
                />
            </div>
            <div>
                <label>Ciudad: </label>
                <input
                    type="text"
                    value={patch.ciudad}
                    onChange={(event) => handleP(event, "ciudad")}
                />
            </div>
            <div>
                <label>Intereses: </label>
                <input
                    type="text"
                    value={patch.intereses}
                    onChange={(event) => handleP(event, "intereses")}
                />
            </div>
            <div>
                <label>¿Te gustaría recibir ofertas?: </label>
                <input
                    type="checkbox"
                    onChange={(event) => handleCheckBoxPatch(event)}
                />
                <button onClick={handlePatch}>Modificar usuario</button>
            </div>

        </>
    )
}
