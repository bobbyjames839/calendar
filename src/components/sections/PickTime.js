import '../styles/PickTime.css';
import { useState, useEffect } from 'react';
import { Calendar } from './Calendar';
import { db } from '../config/Firebase.js';
import { collection, query, where, getDocs } from "firebase/firestore";

export const PickTime = ({ selectedService, setSelectedTime }) => {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(today);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState({ day: null, slot: null });
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(false); // New loading state
    const appointmentDuration = parseInt(selectedService.desc.match(/(\d+)\s*minutes/)[1]) || 30;

    useEffect(() => {
        const fetchBookedSlots = async () => {
            setLoading(true);
            const bookingsRef = collection(db, 'bookings');
            const q = query(bookingsRef, where("date", "==", selectedDay.toDateString()));
            const querySnapshot = await getDocs(q);
            const bookedTimes = querySnapshot.docs.map(doc => doc.data().time);
            setBookedSlots(bookedTimes);            
            setLoading(false); 
        };

        fetchBookedSlots();
    }, [selectedDay]);

    const generateTimeSlots = (duration) => {
        const startHour = 9;
        const endHour = 17;
        const noonHour = 12;
        const morningSlots = [];
        const afternoonSlots = [];
    
        let currentTime = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), startHour, 0, 0, 0);
    
        while (true) {
            const startHours = currentTime.getHours();
            const startMinutes = currentTime.getMinutes();
            const startTimeString = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
    
            const endTime = new Date(currentTime);
            endTime.setMinutes(currentTime.getMinutes() + duration);
            endTime.setSeconds(0, 0);
    
            if (endTime.getHours() >= endHour && endTime.getMinutes() > 0) {
                break;
            }
    
            const slot = startTimeString;
    
            const isBooked = bookedSlots.some(bookedTime => {
                const [bookedStart, bookedEnd] = bookedTime.split(' - ');
                
                const bookedStartTime = new Date(selectedDay);
                const [bookedStartHours, bookedStartMinutes] = bookedStart.split(':').map(Number);
                bookedStartTime.setHours(bookedStartHours, bookedStartMinutes, 0, 0);
    
                const bookedEndTime = new Date(selectedDay);
                const [bookedEndHours, bookedEndMinutes] = bookedEnd.split(':').map(Number);
                bookedEndTime.setHours(bookedEndHours, bookedEndMinutes, 0, 0); 
    
                return (
                    (currentTime < bookedEndTime && currentTime >= bookedStartTime) ||
                    (endTime > bookedStartTime && endTime <= bookedEndTime) ||
                    (currentTime <= bookedStartTime && endTime >= bookedEndTime)
                );
            });
    
            if (!isBooked) {
                if (startHours < noonHour) {
                    morningSlots.push(slot);
                } else {
                    afternoonSlots.push(slot);
                }
            }
    
            currentTime.setMinutes(currentTime.getMinutes() + duration);
            currentTime.setSeconds(0, 0); 
        }
    
        return { morningSlots, afternoonSlots };
    };
    
    const { morningSlots, afternoonSlots } = generateTimeSlots(appointmentDuration);

    const handleSlotClick = (slot) => {
        setSelectedSlotInfo({ day: selectedDay.toDateString(), slot });

        const appointmentDateTime = new Date(selectedDay);
        const [hours, minutes] = slot.split(':');
        appointmentDateTime.setHours(parseInt(hours));
        appointmentDateTime.setMinutes(parseInt(minutes));
        
        const endTime = new Date(appointmentDateTime);
        endTime.setMinutes(appointmentDateTime.getMinutes() + appointmentDuration);
        
        const formattedDate = appointmentDateTime.toDateString();
        const formattedTime = `${slot} - ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
        
        setSelectedTime({ date: formattedDate, time: formattedTime });
    };

    return (
        <div className="pick_time">
            <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

            <div className='selected_day_details'>
                <h1 className='selected_day_title'>{selectedDay.toDateString()}</h1>

                {loading ? (
                    <div className="loading_div">
                        <h2 className='booking_slots_title'>Morning</h2>
                        <span className='loading_span loading_span_1'></span>
                        <span className='loading_span loading_span_2'></span>
                        <h2 className='booking_slots_title'>Afternoon</h2>
                        <span className='loading_span loading_span_3'></span>
                        <span className='loading_span loading_span_4'></span>
                        <span className='loading_span loading_span_5'></span>
                    </div>
                ) : (
                    <>
                        <h2 className='booking_slots_title'>Morning</h2>
                        <div className='booking_slots'>
                            {morningSlots.map((slot, index) => (
                                <div
                                    key={index}
                                    className={`time_slot ${selectedSlotInfo.day === selectedDay.toDateString() && selectedSlotInfo.slot === slot ? 'selected_time_slot' : ''}`}
                                    onClick={() => handleSlotClick(slot)}
                                >
                                    {slot}
                                </div>
                            ))}
                        </div>

                        <h2 className='booking_slots_title'>Afternoon</h2>
                        <div className='booking_slots'>
                            {afternoonSlots.map((slot, index) => (
                                <div
                                    key={index}
                                    className={`time_slot ${selectedSlotInfo.day === selectedDay.toDateString() && selectedSlotInfo.slot === slot ? 'selected_time_slot' : ''}`}
                                    onClick={() => handleSlotClick(slot)}
                                >
                                    {slot}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
