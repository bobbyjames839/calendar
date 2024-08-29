import { useState } from 'react';
import './App.css';
import { Nav } from './components/sections/Nav';
import { Sidebar } from './components/sections/Sidebar';
import { Main } from './components/sections/Main';
import { BookingComplete } from './components/sections/BookingComplete';

function App() {
  const [sidebar, setSidebar] = useState(false)
  const [main, setMain] = useState(true)
  const [bookingComplete, setBookingComplete] = useState(false)

  return (
    <div className="App">

      <Nav setSidebar={setSidebar}/>
      {sidebar && <Sidebar setSidebar={setSidebar}/>}

      {main && <Main setMain={setMain} setBookingComplete={setBookingComplete}/>}
      {bookingComplete && <BookingComplete setMain={setMain} setBookingComplete={setBookingComplete}/>}
    </div>
  );
}

export default App;
