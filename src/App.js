import { useState } from 'react';
import './App.css';
import { Nav } from './components/sections/Nav';
import { Sidebar } from './components/sections/Sidebar';
import { Main } from './components/sections/Main';

function App() {
  const [sidebar, setSidebar] = useState(false)

  return (
    <div className="App">

      <Nav setSidebar={setSidebar}/>
      {sidebar && <Sidebar setSidebar={setSidebar}/>}

      <Main/>
    </div>
  );
}

export default App;
