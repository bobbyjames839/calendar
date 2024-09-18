import '../styles/BookingComplete.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons'; 

export const BookingComplete = ({ setMain, setBookingComplete, bookingReference }) => {

    const handleMakeAnother = () => {
        setBookingComplete(false)
        setMain(true)
    }

    return (
        <div className="booking_complete">
            <FontAwesomeIcon icon={faCheck} className='booking_complete_icon'/>
            <h1 className='booking_complete_title'>Your booking has been placed!</h1>
            {bookingReference && <p className='booking_complete_desc'>Your booking reference number is {bookingReference}. You can use this to view your booking from the 'Ive booked' button. You will recieve a confirmation email shortly.</p>}
            <p className='make_another_booking' onClick={handleMakeAnother}>Make another booking</p>
        </div>
    )
}