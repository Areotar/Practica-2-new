import './App.css';
import { useState } from 'react';
import Login from './components/Login';
import Mensaje from './components/Mensaje';
import WebList from './components/WebList';
import ComerceMenu from './components/Comercio';


function App() {
  const [mensaje, setMessage] = useState('');
  const [isComercioMode, setIsComercioMode] = useState(false);

  const handleAccederComercio = () => {
    setIsComercioMode(true)
  };

  const handleAccederUsuario = () => {
    setIsComercioMode(false)
  };

  return (
    <div className="App">
      {!isComercioMode && (
        <>
          <button onClick={handleAccederComercio}>
            Acceder como Comercio
          </button>
          <Login setMessage={setMessage} />
          <Mensaje mensaje={mensaje} />
          <WebList />
        </>
      )}

      {isComercioMode && (
        <>
          <button onClick={handleAccederUsuario}>
            Acceder como Usuario
          </button>
          <ComerceMenu/>
          </>
      )}
    </div>
  );
}

export default App;
