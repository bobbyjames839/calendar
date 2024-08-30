import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../config/Firebase.js'
import timeMapping from '../other/timeMapping.js';

export const finalCheck = async (selectedTime, selectedEmployee, startTime, appointmentDuration) => {
    const bookingsRef = collection(db, 'bookings');
    let q;

    if (selectedEmployee.name === "Any Staff") {
        q = query(bookingsRef, where("date", "==", selectedTime));
    } else {
        q = query(bookingsRef, where("date", "==", selectedTime), where("employee", "==", selectedEmployee.name));
    }
    
    const querySnapshot = await getDocs(q);

    let bookedSlots = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { startTime: data.startTime, endTime: data.endTime };
    });

    if (selectedEmployee.name === "Any Staff") {
        const aggregatedSlots = {};
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

    const startTimeDecimal = timeMapping[startTime];
    const endTimeDecimal = startTimeDecimal + appointmentDuration / 60;

    const isBooked = bookedSlots.some(slot => 
        (startTimeDecimal < slot.endTime && endTimeDecimal > slot.startTime)
    );

    return !isBooked;
};
