import React, { useState } from 'react';
import { db } from '../config/Firebase.js'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/Login.css';

export const Login = ({ setLogin, setBooking, setBookingDashboard }) => {
    const [referenceNumber, setReferenceNumber] = useState('');
    const [email, setEmail] = useState('');
    const [loginError, setLoginError] = useState(false);

    const handleLogin = async () => {
        try {
            const referenceNumberInt = parseInt(referenceNumber, 10);
            const bookingsRef = collection(db, 'bookings');
            
            const q = query(
                bookingsRef,
                where('bookingId', '==', referenceNumberInt),
                where('email', '==', email)
            );
    
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                console.log('wjnr')
                const docSnapshot = querySnapshot.docs[0]; // Get the first matching document
                const bookingData = docSnapshot.data();
                const bookingId = docSnapshot.id; // Get the Firebase document ID
    
                // Add the Firebase document ID to the booking data
                const bookingWithId = { ...bookingData, id: bookingId };
    
                setBooking(bookingWithId); // Set booking with the Firebase ID
                setLogin(false);
                setBookingDashboard(true);
            } else {
                setLoginError(true);
                setTimeout(() => {
                    setLoginError(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
        }
    };
    
    return (
        <div className="login">
            <div className='login_inner'>
                <h1 className='login_title'>Enter Booking Credentials</h1>
                <p className='login_subtitle'>Reference Number</p>
                <input
                    className='login_input'
                    placeholder='Enter reference number...'
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                />
                <p className='login_subtitle'>Email</p>
                <input
                    className='login_input'
                    placeholder='Enter email...'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className='view_booking' onClick={handleLogin}>View Booking</button>
                {loginError && <p className='login_error'>You have entered the wrong credentials.</p>}
            </div>
        </div>
    );
};
