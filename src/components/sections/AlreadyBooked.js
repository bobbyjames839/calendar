import { useState } from 'react'
import '../styles/AlreadyBooked.css'
import { Login } from './Login'
import { BookingDashboard } from './BookingDashboard'
import { CancelConfirm } from './CancelConfirm'

export const AlreadyBooked = () => {
    const [login, setLogin] = useState(true)
    const [bookingDashboard, setBookingDashboard] = useState(false)
    const [booking, setBooking] = useState(null);
    const [cancelConfirm, setCancelConfirm] = useState(false)

    return (
        <div className="already_booked">
            {login && <Login setLogin={setLogin} setBooking={setBooking} setBookingDashboard={setBookingDashboard}/>}

            {bookingDashboard && <BookingDashboard booking={booking} setBookingDashboard={setBookingDashboard} setCancelConfirm={setCancelConfirm}/>}

            {cancelConfirm && <CancelConfirm/>}
        </div>
    )
}