import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../config/Firebase.js';

export const assignEmployee = async (selectedTime, startTime, appointmentDuration, setRandomName) => {
    const bookingsRef = collection(db, 'bookings');

    const endTime = startTime + appointmentDuration / 60;

    const q = query(bookingsRef, where("date", "==", selectedTime));
    const querySnapshot = await getDocs(q);

    const employeeAvailability = {};

    querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const employeeName = data.employee;
        
        if (!employeeAvailability[employeeName]) {
            employeeAvailability[employeeName] = [];
        }
        
        employeeAvailability[employeeName].push({
            startTime: data.startTime,
            endTime: data.endTime
        });
    });

    for (let employee in employeeAvailability) {
        const bookedSlots = employeeAvailability[employee];
        const isBooked = bookedSlots.some(slot => 
            (startTime < slot.endTime && endTime > slot.startTime)
        );

        if (!isBooked) {
            console.log(employee)
            setRandomName(employee)
        }
    }
    return null
};
