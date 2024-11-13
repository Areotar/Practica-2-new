import { useEffect, useState } from "react";
import WebDetail from "./WebDetail";

export default function PeopleList() {
    const [web, setPeople] = useState([])
    const [filteredWeb, setFilteredWeb] = useState([])
    const [urlSelected, setUrlSelected] = useState("")
    const [error, setError] = useState(false)
    const [cityFilter, setCityFilter] = useState("")
    const [activityFilter, setActivityFilter] = useState("")

    useEffect(() => {
        fetch("http://localhost:3000/api/web/buscador") // Cambia esta URL para provocar un error
            .then(response => response.json())
            .then(data => {
                setPeople(data);
                setFilteredWeb(data);
            })
            .catch(error => {
                console.error("Error fetching data", error);
                setError(true);
            });
    }, []);

    useEffect(() => {
        const filtrado = web.filter(person => {
            return (
                (cityFilter === "" || person.ciudad.toLowerCase().includes(cityFilter.toLowerCase())) &&
                (activityFilter === "" || person.actividad.toLowerCase().includes(activityFilter.toLowerCase()))
            );
        });
        setFilteredWeb(filtrado)
    }, [cityFilter, activityFilter, web]);

    // Función para ordenar los datos por "Scoring" de manera descendente
    const sortWeb = () => {
        fetch("http://localhost:3000/api/web/buscador?ordenar=desc")
            .then(response => response.json())
            .then(data => {
                setPeople(data)
                setFilteredWeb(data)
            })
            .catch(error => {
                console.error("Error fetching sorted data", error);
                setError(true);
            });
    };

    // Condicional basado en error
    let listPeople = error ? (
        <p style={{ textAlign: "center" }}>Ha ocurrido un error</p>
    ) : (
        filteredWeb.map(person => (
            <div>
                <h3 onClick={() => setUrlSelected(`http://localhost:3000/api/web/${person._id}`)}>{person.titulo}</h3>
                <p>Actividad: {person.actividad}</p>
                <p>Ciudad: {person.ciudad}</p>
            </div>
        ))
    );

    return (
        <div>
            <h2>Lista de Webs</h2>
            <div>
                <button onClick={sortWeb}>Ordenar por Scoring</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Filtrar por ciudad"
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filtrar por actividad"
                    value={activityFilter}
                    onChange={e => setActivityFilter(e.target.value)}
                />
            </div>
            <div>{listPeople}</div>
            <div>
                <WebDetail url={urlSelected} />
            </div>
        </div>
    );
}
