import { useEffect, useState } from "react";

export default function WebDetail({ url }) {

    const [web, setPerson] = useState(null);
    const [comentario, setComentario] = useState("")
    const [mensaje, setMensaje] = useState("")

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data, response);
                setPerson(data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        if (url) fetchData()
    }, [url]);

    const handleComentarioChange = (event) => {
        setComentario(event.target.value)
    };

    const handleEnviarComentario = async () => {
        const userToken = localStorage.getItem("response.token");
        if (!userToken) {
            setMensaje("Por favor ingrese un comentario.");
            return;
        }

        const comentarioData = {
            comentario: comentario,
        };

        const comentarioId = web._id

        try {
            // Enviar el comentario con PATCH a la API
            const response = await fetch(`http://localhost:3000/api/web/comentarios/${comentarioId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify(comentarioData),
            });
            const responseData = await response.json();
            console.log(responseData);
            setMensaje("¡Gracias por tu reseña!");
            setComentario("")
        } catch (error) {
            setMensaje("Hubo un error al enviar tu reseña.");
            console.error(error);
        }
    };


    if (!web) {
        return <h2>Ninguna web seleccionada</h2>;
    } else {
        return (<div>
            <h2>web seleccionada:</h2>
            <h3>{web.titulo}</h3>
            <p>Ciudad: {web.ciudad}</p>
            <p>Actividad: {web.actividad}</p>
            <p>Resumen: {web.resumen}</p>
            <p>Info:</p>
            <div>
                {web.textos.map((texto, index) => (
                    <p key={index}>{texto}</p>
                ))}
            </div>
            <div>
                {web.imagenes.map((imagen, index) => (
                    <p key={index}>
                        <img src={imagen} alt={`Imagen ${index + 1} del comercio`} style={{ width: '200px', height: '200px' }}/>
                    </p>
                ))}
            </div>
            <h4>Reseñas:</h4>
            <p>Scoring: {web.reseñas.scoring}</p>
            <p>Total de reseñas: {web.reseñas.total}</p>
            <h5>Comentarios:</h5>
            <div>
                {web.reseñas.cuerpo.map((comentario, index) => (
                    <p key={index}>{comentario}</p>
                ))}
            </div>

            <div>
                <div>

                    <hr></hr>

                    <h2>Deja tu reseña</h2>
                    <h4>Para dejar una reseña has de estar registrado</h4>

                    <div>
                        <label>Comentario:</label>
                        <input
                            type="text"
                            value={comentario}
                            onChange={handleComentarioChange}
                            placeholder="Deja aquí tu comentario"
                        />
                    </div>
                    <button onClick={handleEnviarComentario}>Enviar reseña</button>
                    <p>{mensaje}</p>
                </div>
            </div>
        </div>
        )
    };
}