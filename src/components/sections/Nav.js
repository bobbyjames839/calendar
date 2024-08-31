import '../styles/Nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 

export const Nav = ({ setSidebar, setAlreadyBooked, setMain, setBookingComplete, alreadyBooked }) => {


    const handleEdit = () => {
        setMain(false)
        setBookingComplete(false)
        setAlreadyBooked(true)
    }

    const handleMain = () => {
        setMain(true)
        setAlreadyBooked(false)
    }

    return (
        <div className="nav">
            <span className="nav_logo">Logo</span>
            <div className="nav_right">
                <button className='edit_booking' onClick={alreadyBooked ? handleMain : handleEdit}>{alreadyBooked ? 'Make a booking' : 'Ive booked'}</button>
                <FontAwesomeIcon className='nav_icon' icon={faBars} onClick={() => setSidebar(true)} />
            </div>
        </div>
    );
};
