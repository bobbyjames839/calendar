import '../styles/PickEmployee.css'
import employee1 from '../images/employee1.jpg'
import employee2 from '../images/employee2.jpg'
import employee3 from '../images/employee3.jpeg'
import employee4 from '../images/employee4.jpeg'

export const PickEmployee = ({handleSelectEmployee, selectedEmployee}) => {

    const EmployeeSection = ({ name, imageurl }) => {
        return (
            <div className={`employee_section ${selectedEmployee.name === name && 'employee_section_selected'}`} onClick={() => handleSelectEmployee({ name, imageurl })}>
                <img className='employee_image' src={imageurl} alt='Headshot'/>
                <p className='employee_name'>{name}</p>
            </div>
        );
    };
    

    return (
        <div className="pick_employee">
            <h1 className='pick_employee_title'>Select Service</h1>
            <EmployeeSection name='Bobby' imageurl={employee1}/>
            <span className='employee_section_separator'></span>
            <EmployeeSection name='Tommy' imageurl={employee2}/>
            <span className='employee_section_separator'></span>
            <EmployeeSection name='Jasmine' imageurl={employee3}/>
            <span className='employee_section_separator'></span>
            <EmployeeSection name='Harry' imageurl={employee4}/>
        </div>
    )
}