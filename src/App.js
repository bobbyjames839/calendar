import { useState } from 'react';
import './App.css';
import { Nav } from './components/sections/Nav';
import { Sidebar } from './components/sections/Sidebar';
import { Main } from './components/sections/Main';
import { BookingComplete } from './components/sections/BookingComplete';
import { AlreadyBooked } from './components/sections/AlreadyBooked';

function App() {
  const [sidebar, setSidebar] = useState(false)
  const [main, setMain] = useState(true)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [alreadyBooked, setAlreadyBooked] = useState(false)

  return (
    <div className="App">

      <Nav setSidebar={setSidebar} setAlreadyBooked={setAlreadyBooked} setMain={setMain} setBookingComplete={setBookingComplete} alreadyBooked={alreadyBooked}/>
      {sidebar && <Sidebar setSidebar={setSidebar}/>}

      {main && <Main setMain={setMain} setBookingComplete={setBookingComplete}/>}
      {bookingComplete && <BookingComplete setMain={setMain} setBookingComplete={setBookingComplete}/>}
      {alreadyBooked && <AlreadyBooked/>}
    </div>
  );
}

export default App;
