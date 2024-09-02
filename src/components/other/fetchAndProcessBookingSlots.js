import timeMapping from '../other/timeMapping.js'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../config/Firebase.js'

export const fetchAndProcessBookedSlots = async (selectedDay, selectedEmployee, appointmentDuration) => {
    
    const startHour = 9;
    const endHour = 17;
    const noonHour = 12;
    const morningSlotsTemp = [];
    const afternoonSlotsTemp = [];
    const bookingsRef = collection(db, 'bookings');

    let q;

    if (selectedEmployee.name === "Any Staff") {
        //get all bookings in that day 
        q = query(bookingsRef, where("date", "==", selectedDay.toDateString()));
    } else {
        //get all the bookings for the employee in that day
        q = query(bookingsRef, where("date", "==", selectedDay.toDateString()), where("employee", "==", selectedEmployee.name));
    }

    const querySnapshot = await getDocs(q);

    let bookedSlots = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { startTime: data.startTime, endTime: data.endTime };
    });
    // [{startTime: 9.5, endTime: 10}]

    if (selectedEmployee.name === "Any Staff") {

        const aggregatedSlots = {};

        //map through every 0.25 hours of every booked slot and add 1 to every 0.25 that it exists in 
        bookedSlots.forEach(slot => {
            for (let time = slot.startTime; time < slot.endTime; time += 0.25) {
                
                if (!aggregatedSlots[time]) {
                    aggregatedSlots[time] = 0;
                }
                aggregatedSlots[time]++;
            }
        });

        bookedSlots = [];
        Object.keys(aggregatedSlots).forEach(time => {
            if (aggregatedSlots[time] >= 4) { 
                bookedSlots.push({ startTime: parseFloat(time), endTime: parseFloat(time) + 0.25 });
            }
        });

        if (bookedSlots.length > 0) {
            const mergedSlots = [];
            let currentSlot = bookedSlots[0];

            for (let i = 1; i < bookedSlots.length; i++) {
                if (currentSlot.endTime === bookedSlots[i].startTime) {
                    currentSlot.endTime = bookedSlots[i].endTime;
                } else {
                    mergedSlots.push(currentSlot);
                    currentSlot = bookedSlots[i];
                }
            }
            mergedSlots.push(currentSlot);
            bookedSlots = mergedSlots;
        }
    }

    let currentTime = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), startHour, 0, 0, 0);

    while (true) {
        const endTime = new Date(currentTime);
        endTime.setMinutes(currentTime.getMinutes() + appointmentDuration);
    
        if (endTime.getHours() > endHour || (endTime.getHours() === endHour && endTime.getMinutes() > 0)) {
            break;
        }
    
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const timeSlot = `${hours}:${minutes}`;
    
        const currentTimeDecimal = timeMapping[timeSlot];
        const endTimeDecimal = currentTimeDecimal + appointmentDuration / 60;
    
        const isBooked = bookedSlots.some(slot => 
            (currentTimeDecimal < slot.endTime && endTimeDecimal > slot.startTime)
        );
    
        if (!isBooked) {
            if (currentTime.getHours() < noonHour) {
                morningSlotsTemp.push(timeSlot);
            } else {
                afternoonSlotsTemp.push(timeSlot);
            }
        }
    
        currentTime.setMinutes(currentTime.getMinutes() + appointmentDuration);
    }
        
    return { morningSlotsTemp, afternoonSlotsTemp };
};
