import '../styles/PickEmployee.css'
import employee1 from '../images/employee1.jpg'
import employee2 from '../images/employee2.jpg'
import employee3 from '../images/employee3.jpeg'
import employee4 from '../images/employee4.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons'; 
import { useEffect } from 'react'

export const PickEmployee = ({setSelectedEmployee, selectedEmployee, setSelectedTime }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 

    const EmployeeSection = ({ name, imageurl = null, desc, random = false }) => {
        return (
            <div 
                className={`employee_section ${selectedEmployee.name === name ? 'employee_section_selected' : ''} ${random ? 'employee_section_top' : ''}`} 
                onClick={() => {(setSelectedEmployee({ name, imageurl, random }))
                setSelectedTime({ date: '', startTime: '', endTime: '' })}}>
                {random ? <span className='employee_image_random'><FontAwesomeIcon icon={faUsers} size='2x'/></span>
                :
                <img className='employee_image' src={imageurl} alt='Headshot'/>}
                <div className='employee_info'>
                    <p className='employee_name'>{name ? name : 'Any Staff'}</p>
                    <p className='employee_desc'>{desc}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="pick_employee">
            <h1 className='pick_employee_title'>Select Service</h1>
            <EmployeeSection 
                name= 'Any Staff'  
                desc = '' 
                random = {true}
            />
            <EmployeeSection 
                name='Bobby' 
                imageurl={employee1} 
                desc='Senior stylist, precise and detailed.' 
            />
            <EmployeeSection 
                name='Tommy' 
                imageurl={employee2} 
                desc='Creative, trendy, loves colors.' 
            />
            <EmployeeSection 
                name='Jasmine' 
                imageurl={employee3} 
                desc='Hair treatments and extensions expert.' 
            />
            <EmployeeSection 
                name='Harry' 
                imageurl={employee4} 
                desc='Classic styles, client favorite.' 
            />
        </div>
    );
}
