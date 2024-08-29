import '../styles/BookingComplete.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons'; 

export const BookingComplete = ({ setMain, setBookingComplete }) => {

    const handleMakeAnother = () => {
        setBookingComplete(false)
        setMain(true)
    }

    return (
        <div className="booking_complete">
            <FontAwesomeIcon icon={faCheck} className='booking_complete_icon'/>
            <h1 className='booking_complete_title'>Your booking has been placed!</h1>
            <p className='booking_complete_desc'>You will recieve an email confirmation shortly.</p>
            <p className='make_another_booking' onClick={handleMakeAnother}>Make another booking</p>
        </div>
    )
}