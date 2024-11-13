import './App.css';
import { useState } from 'react';
import Login from './components/Login';
import Mensaje from './components/Mensaje';
import WebList from './components/WebList';


function App() {
  const [mensaje, setMessage] = useState('');

  return (
    <div className="App">
      <Login setMessage={setMessage} />
      <Mensaje mensaje={mensaje} />
      <WebList/>
    </div>
  );
}

export default App;
