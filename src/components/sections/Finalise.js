import { useState } from 'react';
import '../styles/Finalise.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'; 

export const Finalise = () => {
    const [label, setLabel] = useState([false, false, false, false]);
    const [note, setNote] = useState(false)

    const handleFocus = (index) => {
        const newLabelState = [...label];
        newLabelState[index] = true;
        setLabel(newLabelState);
    }

    const handleBlur = (index, event) => {
        if (event.target.value === '') {
            const newLabelState = [...label];
            newLabelState[index] = false;
            setLabel(newLabelState);
        }
    }

    return (
        <div className="finalise">
            <h1 className='finalise_title'>Complete Booking</h1>

            <div className='customer_names'>
                <div className='form_input_group form_input_group_top'>
                    <input 
                        className='form_input customer_first_name' 
                        type='text' 
                        onFocus={() => handleFocus(0)} 
                        onBlur={(event) => handleBlur(0, event)} 
                    />
                    <label className={`form_label ${label[0] ? 'focused_label' : ''}`}>First Name</label>
                </div>
                <div className='form_input_group form_input_group_top'>
                    <input 
                        className='form_input customer_second_name' 
                        type='text' 
                        onFocus={() => handleFocus(1)} 
                        onBlur={(event) => handleBlur(1, event)} 
                    />
                    <label className={`form_label ${label[1] ? 'focused_label' : ''}`}>Last Name</label>
                </div>
            </div>

            <div className='form_input_group'>
                <input 
                    className='form_input customer_email' 
                    type='email' 
                    onFocus={() => handleFocus(2)} 
                    onBlur={(event) => handleBlur(2, event)} 
                />
                <label className={`form_label ${label[2] ? 'focused_label' : ''}`}>Email</label>
            </div>
            <div className='form_input_group'>
                <input 
                    className='form_input customer_number' 
                    type='text' 
                    onFocus={() => handleFocus(3)} 
                    onBlur={(event) => handleBlur(3, event)} 
                />
                <label className={`form_label ${label[3] ? 'focused_label' : ''}`}>Phone Number</label>
            </div>

            <div className='appointment_note'>
                <div className='appointment_note_top'>
                    <h1 className='add_note_title'>Appointment Note</h1>
                    <FontAwesomeIcon icon={note ? faTimes : faPlus} className='add_note' onClick={() => (setNote(!note))}/>
                </div>
                <div className={`appointment_note_content ${note ? 'expanded_anc' : ''}`}>
                    <textarea className='appointment_note_textarea' placeholder='Add note...'></textarea>
                </div>
            </div>

            <div className='cancellation_policy'>
                <h1 className='cancellation_title'>Cancellation Policy</h1>
                <p className='cancellation_desc'>To avoid any charges, please ensure you cancel or reschedule your appointment before it begins. You ca do this via the same portal where you made your booking.</p>
            </div>
            <p className='booking_final_note'>Upon booking with [company name], you will be sent a conformtion email with a booking reference number which you can use to view, cancel or reschedule your booking. By creating this appointment you acknowledge that you will be sent an email with your booking information.</p>
        </div>
    )
}
