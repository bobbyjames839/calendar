import '../styles/PickTime.css';
import { useState } from 'react';
import { Calendar } from './Calendar';

export const PickTime = ({ selectedService, setSelectedTime }) => {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(today);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState({ day: null, slot: null });
    const appointmentDuration = parseInt(selectedService.desc.match(/(\d+)\s*minutes/)[1]) || 30;

    const generateTimeSlots = (duration) => {
        const startHour = 9;
        const endHour = 17;
        const noonHour = 12; 
        const morningSlots = [];
        const afternoonSlots = [];
    
        let currentTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, 0, 0);
    
        while (true) {
            const startHours = currentTime.getHours();
            const startMinutes = currentTime.getMinutes();
            const startTimeString = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
    
            const endTime = new Date(currentTime);
            endTime.setMinutes(currentTime.getMinutes() + duration);
    
            if (endTime.getHours() >= endHour && endTime.getMinutes() > 0) {
                break;
            }
    
            const slot = startTimeString;
    
            if (startHours < noonHour) {
                morningSlots.push(slot);
            } else {
                afternoonSlots.push(slot);
            }
    
            currentTime.setMinutes(currentTime.getMinutes() + duration);
        }
    
        return { morningSlots, afternoonSlots };
    };

    const { morningSlots, afternoonSlots } = generateTimeSlots(appointmentDuration);

    const handleSlotClick = (slot) => {
        // Set the selected slot info for the current day
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
            </div>
        </div>
    );
};
