import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../config/Firebase.js';

export const assignEmployee = async (selectedTime, startTime, appointmentDuration, setRandomName) => {
    // Wed Sep 11 2024 – 9.5 – 30 – useState
    const bookingsRef = collection(db, 'bookings');

    const endTime = startTime + appointmentDuration / 60;

    const q = query(bookingsRef, where("date", "==", selectedTime));
    const querySnapshot = await getDocs(q);

    const employeeAvailability = {};

    querySnapshot.docs.forEach(doc => {
        const data = doc.data();

        // we want the employee name from every booking in the day
        const employeeName = data.employee;
        
        //if one does not exist we create one
        if (!employeeAvailability[employeeName]) {
            employeeAvailability[employeeName] = [];
        }
        
        //access the array of booking slots for this employee and append the time of the appointment
        employeeAvailability[employeeName].push({
            startTime: data.startTime,
            endTime: data.endTime
        });
    });


    for (let employee in employeeAvailability) {
        const bookedSlots = employeeAvailability[employee];
        //check if there is overlap between any of the slots in the same employee
        const isBooked = bookedSlots.some(slot => 
            (startTime < slot.endTime && endTime > slot.startTime)
        );

        if (!isBooked) {
            setRandomName(employee)
        }
    }
    return null
};
