import '../styles/PickTime.css';
import { useState, useEffect } from 'react';
import { Calendar } from './Calendar';
import { fetchAndProcessBookedSlots } from '../other/fetchAndProcessBookingSlots.js';

export const PickTime = ({ setSelectedTime, selectedEmployee, appointmentDuration }) => {
    const [selectedSlotInfo, setSelectedSlotInfo] = useState({ day: null, slot: null });
    const [morningSlots, setMorningSlots] = useState([]);
    const [afternoonSlots, setAfternoonSlots] = useState([]);
    const [loading, setLoading] = useState(false); 

    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        const today = new Date();

        const adjustForWeekend = (date) => {
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 6) {
                date.setDate(date.getDate() + 2);
            } else if (dayOfWeek === 0) {
                date.setDate(date.getDate() + 1);
            }
            return date;
        };

        const initialSelectedDay = adjustForWeekend(new Date(today));
        setSelectedDay(initialSelectedDay);
    }, []); // No dependencies needed
    
    useEffect(() => {
        const fetchAndGenerateTimeSlots = async () => {
            if (!selectedDay) return;

            setLoading(true);

            const { morningSlotsTemp, afternoonSlotsTemp } = await fetchAndProcessBookedSlots(selectedDay, selectedEmployee, appointmentDuration);

            setMorningSlots(morningSlotsTemp);
            setAfternoonSlots(afternoonSlotsTemp);
            setLoading(false);
        };

        fetchAndGenerateTimeSlots();
    }, [selectedDay, appointmentDuration, selectedEmployee]);

    const handleSlotClick = (slot) => {
        setSelectedSlotInfo({ day: selectedDay.toDateString(), slot });

        const appointmentDateTime = new Date(selectedDay);
        const formattedDate = appointmentDateTime.toDateString();

        const [hours, minutes] = slot.split(':').map(Number);

        const startTime = hours + (minutes / 60);

        const endHours = hours + Math.floor((minutes + appointmentDuration) / 60);
        const endMinutes = (minutes + appointmentDuration) % 60;
        const endTime = endHours + endMinutes / 60;

        const selectedTime = { date: formattedDate, startTime, endTime };
        setSelectedTime(selectedTime);

        // Store in memory but not in sessionStorage to clear on page reload
        setSelectedSlotInfo({ day: selectedDay.toDateString(), slot });
    };

    return (
        <div className="pick_time">
            {selectedDay && (
                <>
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
                                <h2 className='booking_slots_title'>Morning Slots</h2>
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

                                <h2 className='booking_slots_title'>Afternoon Slots</h2>
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
                </>
            )}
        </div>
    );
};
