import React, { useState } from 'react';
import { db } from '../config/Firebase.js';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

import '../styles/BookingDashboard.css';
import timeMapping from '../other/timeMapping.js'

export const BookingDashboard = ({ booking, setBookingDashboard, setCancelConfirm }) => {
    const [cancelling, setCancelling] = useState(false)
    const [pendingCancel, setPendingCancel] = useState(false)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleCancel = async () => {
        try {
            setPendingCancel(true);
            const bookingsRef = collection(db, 'bookings');
            
            const q = query(
                bookingsRef,
                where('id', '==', booking.id),
                where('email', '==', booking.email)
            );
    
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;  
                await deleteDoc(docRef);  
            } else {
                console.log("Booking not found.");
                alert('Oops, there was an error, please contact us for support.')
            }
        } catch (error) {
            console.error("Error canceling booking:", error);
            alert('Oops, there was an error, please contact us for support.')
        } finally {
            setPendingCancel(false);
            setBookingDashboard(false)
            setCancelConfirm(true)
        }
    };


    
    const BookingInfo = ({title, desc}) => {
        return (
            <div className='booking_info'>
                <p className='booking_info_type'>{title}</p>
                <p className='booking_info_info'>{desc}</p>
            </div>
        )
    }

    const handleConvertTime = (start, end) => {
        const newStart = Object.keys(timeMapping).find(key => timeMapping[key] === start);
        const newEnd = Object.keys(timeMapping).find(key => timeMapping[key] === end);
        const ans = newStart + ' - ' + newEnd
        return ans
    }

    return (
        <>
        {booking && <div className="booking_dashboard">

            <div className='booking_dashboard_left'>
                <h1 className='booking_dashboard_title'>{capitalizeFirstLetter(booking.firstName)}, here is your booking.</h1>

                <div className='booking_dashboard_section'>
                    <BookingInfo title='Date' desc={booking.date} />
                    <BookingInfo title='Time' desc={handleConvertTime(booking.startTime, booking.endTime)} />
                </div>

                <div className='booking_dashboard_section'>
                    <BookingInfo title='Price' desc={booking.price} />
                    <BookingInfo title='Service' desc={booking.service} />
                    <BookingInfo title='Employee' desc={booking.employee} />
                    <BookingInfo title='Duration' desc={`${booking.duration} minutes`} />
                </div>
            </div>

            <div className='booking_dashboard_right'>
                
                <div className='booking_dashboard_section booking_dashboard_section_right'>
                    <BookingInfo title='Phone Number' desc={booking.phoneNumber} />
                    <BookingInfo title='Email' desc={booking.email} />
                </div>
                {cancelling ? 
                    (pendingCancel ? 
                    <div className='pending_booking_dashboard'>
                        <span className='loading_icon_dashboard'></span>
                    </div>
                    :
                    
                    <div className='cancelling_appointment'>
                        <p className='cancelling_text'>Are you sure you want to cancel your appointment?</p>
                        <div className='cancelling_buttons'>
                            <button className='cancelling_confirm' onClick={handleCancel}>Yes, confirm</button>
                            <button className='cancelling_confirm' onClick={() => (setCancelling(false))}>No, go back</button>
                        </div>
                    </div>)
                :
                <>
                <button className='cancel_appointment' onClick={() => (setCancelling(true))}>Cancel</button>
                <p className='reschedule'>If you would like to reschedule your appointment, please cancel it here and then make a new booking.</p>
                </>}
            </div>

        </div>}
        </>
    );
};
