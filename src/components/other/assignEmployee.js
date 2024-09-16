import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../config/Firebase.js';

export const assignEmployee = async (selectedTime, startTime, appointmentDuration, setRandomName) => {
    const bookingsRef = collection(db, 'bookings');

    const endTime = startTime + appointmentDuration / 60;

    const q = query(bookingsRef, where("date", "==", selectedTime));
    const querySnapshot = await getDocs(q);

    // Pre-configure the employee names in the object
    const employeeAvailability = {
        'Bobby': [],
        'Tommy': [],
        'Jasmine': [],
        'Harry': []
    };

    querySnapshot.docs.forEach(doc => {
        const data = doc.data();

        const employeeName = data.employee;

        // Make sure we only handle employees who are in the pre-configured list
        if (employeeAvailability[employeeName]) {
            employeeAvailability[employeeName].push({
                startTime: data.startTime,
                endTime: data.endTime
            });
        }
    });

    // Check each employee for availability
    for (let employee in employeeAvailability) {
        const bookedSlots = employeeAvailability[employee];
        const isBooked = bookedSlots.some(slot => 
            (startTime < slot.endTime && endTime > slot.startTime)
        );
        if (!isBooked) {
            setRandomName(employee);
            break; // Exit once an employee is found
        }
    }
    
    return null;
};
