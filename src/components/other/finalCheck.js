import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../config/Firebase.js'

export const finalCheck = async (selectedTime, selectedEmployee, startTime, appointmentDuration, randomName) => {
    console.log(startTime, selectedEmployee, selectedTime, appointmentDuration)
    const bookingsRef = collection(db, 'bookings');
    const endTime = startTime + appointmentDuration / 60;

    let q;

    if (selectedEmployee.name === "Any Staff") {
        q = query(bookingsRef, where("date", "==", selectedTime), where("employee", "==", randomName));
    } else {
        q = query(bookingsRef, where("date", "==", selectedTime), where("employee", "==", selectedEmployee.name));
    }
    
    const querySnapshot = await getDocs(q);

    let bookedSlots = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { startTime: data.startTime, endTime: data.endTime };
    });

        
    const isBooked = bookedSlots.some(slot => 
        (startTime < slot.endTime && endTime > slot.startTime)
    );

    return isBooked
};
