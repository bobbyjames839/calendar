import { useState } from 'react';
import '../styles/Main.css';
import { Services } from './Services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; 
import { PickEmployee } from './PickEmployee';
import { PickTime } from './PickTime';
import { Finalise } from './Finalise';

export const Main = () => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [mainSectionTracker, setMainSectionTracker] = useState(0)
    const [continueError, setContinueError] = useState(false)
    const [selectedTime, setSelectedTime] = useState({ date: '', time: '' });

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
            checkAndProceed(selectedTime);
        }
    };
    

    return (
        <div className="main">
            {mainSectionTracker === 0 && <Services 
                handleSelectService={handleSelectService} 
                selectedService={selectedService} />}

            {mainSectionTracker === 1 && <PickEmployee
               handleSelectEmployee={handleSelectEmployee} 
               selectedEmployee={selectedEmployee} />}
            
            {mainSectionTracker === 2 && <PickTime selectedService={selectedService} setSelectedTime={setSelectedTime} />}

            {mainSectionTracker === 3 && <Finalise/>}

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
                                    <img alt='Headshot' src={selectedEmployee.imageurl} className='main_right_employee_image'/>
                                    <p className='main_right_employee_name'>{selectedEmployee.name}</p>
                                </div>
                                <FontAwesomeIcon icon={faEdit} className='main_right_section_icon' onClick={() => (setMainSectionTracker(1))}/>
                            </div>}

                            {selectedTime.date && <div className='main_right_section main_right_section_below'>
                                <div className='main_right_time_left'>
                                    <p className='main_right_date'>{selectedTime.date}</p>
                                    <p className='main_right_time'>{selectedTime.time}</p>
                                </div>
                                <FontAwesomeIcon icon={faEdit} className='main_right_section_icon' onClick={() => (setMainSectionTracker(2))}/>
                            </div>}

                        </>
                    ) : (
                        <p className='main_nothing_added'>Nothing added yet</p>
                    )}
                </div>

                <button className='main_next_button' onClick={handleContinueBooking}>Next</button>
                {continueError && <p className='continue_error'>Please select an option</p>}
            </div>
        </div>
    );
};
