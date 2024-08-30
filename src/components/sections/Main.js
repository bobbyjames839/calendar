import { useState } from 'react';
import '../styles/Main.css';
import { Services } from './Services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUsers } from '@fortawesome/free-solid-svg-icons'; 
import { PickEmployee } from './PickEmployee';
import { PickTime } from './PickTime';
import { Finalise } from './Finalise';
import { db } from '../config/Firebase.js'; 
import { collection, addDoc } from "firebase/firestore"; 
import timeMapping from '../other/timeMapping.js';
import { assignEmployee } from '../other/assignEmployee.js';
import { finalCheck } from '../other/finalCheck.js';


export const Main = ({ setMain, setBookingComplete }) => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [mainSectionTracker, setMainSectionTracker] = useState(0)
    const [continueError, setContinueError] = useState(false)
    const [selectedTime, setSelectedTime] = useState({ date: '', startTime: '', endTime: '' });
    const [unfilledFormtext, setUnfilledFormText] = useState('')
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [appointmentNote, setAppointmentNote] = useState('')
    const [pendingBooking, setPendingBooking] = useState(false)
    const [randomName, setRandomName] = useState('')
    const [appointmentDuration, setAppointmentDuration] = useState(30)

    const handleSelectService = (service) => {
        setSelectedService(service);
    };

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee)
    }

    const handleContinueBooking = () => {
        const checkAndProceed = (condition) => {
            if (typeof condition === 'string' && condition === '') {
                setContinueError(true);
                setTimeout(() => {
                    setContinueError(false);
                }, 3000);
                return;
            }
            
            if (typeof condition === 'object' && (condition.date === '' || condition.time === '')) {
                setContinueError(true);
                setTimeout(() => {
                    setContinueError(false);
                }, 3000);
                return;
            }
    
            setMainSectionTracker(prev => prev + 1);
        };
    
        if (mainSectionTracker === 0) {
            checkAndProceed(selectedService);
        } else if (mainSectionTracker === 1) {
            checkAndProceed(selectedEmployee);
        } else if (mainSectionTracker === 2) {
            if (selectedEmployee.name === 'Any Staff') {
                assignEmployee(selectedTime.date, selectedTime.startTime, appointmentDuration, setRandomName)
            }
            checkAndProceed(selectedTime);
        } 
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        return isValid;
    }

    const handleMakeBooking = async () => {
        const emailIsValid = validateEmail(email);
        let errorMessage = '';
        
        if (!firstName) {
            errorMessage = 'Please enter your first name.';
        } else if (!lastName) {
            errorMessage = 'Please enter your last name.';
        } else if (!emailIsValid) {
            errorMessage = 'Please enter a valid email address.';
        } else if (!phoneNumber) {
            errorMessage = 'Please enter your phone number.';
        } 

        if (errorMessage) {
            setUnfilledFormText(errorMessage);
            setContinueError(true);
            setTimeout(() => {
                setContinueError(false);
            }, 3000);
            return;
        }
        setPendingBooking(true)


        try {

            const isAvailable = await finalCheck(selectedTime.date, selectedEmployee, selectedTime.startTime, appointmentDuration, randomName);
            
            if (isAvailable === true) {
                setPendingBooking(false);
                setUnfilledFormText('This spot has just been taken, please restart the page and try again.')
                setContinueError(true);
                setTimeout(() => {
                    setContinueError(false);
                }, 3000);
                return;
            } else {
                console.log('we are continuing')
            }

            const employeeName = selectedEmployee.name === 'Any Staff' ? randomName : selectedEmployee.name;
            
            const bookingData = {
                service: selectedService.title,
                employee: employeeName,
                date: selectedTime.date,   
                startTime: selectedTime.startTime,  
                endTime: selectedTime.endTime,  
                duration: appointmentDuration,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                appointmentNote: appointmentNote,
                createdAt: new Date().toISOString(),  
            };
    
            await addDoc(collection(db, "bookings"), bookingData);
    
            setMain(false);
            setBookingComplete(true);
    
            console.log("Booking added to Firestore: ", bookingData);
        } catch (error) {
            console.error("Error adding booking: ", error);
        }
    };

    return (
        <div className="main">
            {mainSectionTracker === 0 && <Services 
                setAppointmentDuration={setAppointmentDuration}
                handleSelectService={handleSelectService} 
                selectedService={selectedService} />}

            {mainSectionTracker === 1 && <PickEmployee
                handleSelectEmployee={handleSelectEmployee} 
                selectedEmployee={selectedEmployee} />}
            
            {mainSectionTracker === 2 && <PickTime 
            appointmentDuration={appointmentDuration}
            setRandomName={setRandomName}
            selectedService={selectedService} 
            setSelectedTime={setSelectedTime} 
            selectedEmployee={selectedEmployee}/>}

            {mainSectionTracker === 3 && <Finalise 
                setFirstName={setFirstName} 
                setLastName={setLastName}
                setEmail={setEmail} 
                setPhoneNumber={setPhoneNumber}
                setAppointmentNote={setAppointmentNote}
            />}

            {pendingBooking ? <div className='pending_booking'>
                <span className='loading_icon'></span>
            </div>
            :
            <div className='main_right'>
                <h1 className='main_title'>Appointment Summary</h1>

                <div className='main_right_inner'>
                    {selectedService ? (
                        <>
                            <div className='main_right_section'>
                                <div className='main_right_services_left'>
                                    <h2 className='main_service_title'>{selectedService.title}</h2>
                                    <p className='main_service_desc'>{selectedService.desc}</p>
                                </div>
                                <FontAwesomeIcon icon={faEdit} className='main_right_section_icon' onClick={() => (setMainSectionTracker(0))}/>
                            </div>

                            {selectedEmployee && <div className='main_right_section main_right_section_below'>
                                <div className='main_right_employee_left'>
                                    {selectedEmployee.random ? 
                                        <span className='employee_image_random_main'><FontAwesomeIcon icon={faUsers} size='1x'/></span>
                                        :
                                        <img alt='Headshot' 
                                        src={selectedEmployee.imageurl} className='main_right_employee_image'/> 
                                    }
                                    <p className='main_right_employee_name'>{selectedEmployee.name}</p>
                                </div>
                                <FontAwesomeIcon icon={faEdit} className='main_right_section_icon' onClick={() => (setMainSectionTracker(1))}/>
                            </div>}

                            {selectedTime.date && (
                                <div className='main_right_section main_right_section_below'>
                                    <div className='main_right_time_left'>
                                        <p className='main_right_date'>{selectedTime.date}</p>
                                        <p className='main_right_time'>
                                            {Object.keys(timeMapping).find(key => timeMapping[key] === selectedTime.startTime)} -{'\u00A0'}  
                                            {Object.keys(timeMapping).find(key => timeMapping[key] === selectedTime.endTime)}
                                        </p>
                                    </div>
                                    <FontAwesomeIcon icon={faEdit} className='main_right_section_icon' onClick={() => (setMainSectionTracker(2))}/>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className='main_nothing_added'>Nothing added yet</p>
                    )}
                </div>

                <button className='main_next_button' onClick={mainSectionTracker === 3 ? handleMakeBooking : handleContinueBooking}>{mainSectionTracker === 3 ? 'Complete Booking' : 'Next'}</button>
                {continueError && <p className='continue_error'>{mainSectionTracker === 3 ? unfilledFormtext : 'Please select an option'}</p>}
            </div>}
        </div>
    );
};