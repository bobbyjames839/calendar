import '../styles/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 
import { useState } from 'react';

export const Calendar = ({ selectedDay, setSelectedDay }) => {
    const [month1, setMonth1] = useState(true); 

    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const daysInMonth2 = ['', '1', '2', '3', '4',  '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    const daysInMonth1 = ['', '', '', '', '', '', '1', '2', '3', '4',  '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];

    const closedDaysMonth2 = ['5', '6', '12', '13', '19', '20', '26', '27'];
    const closedDaysMonth1 = ['1', '7', '8', '14', '15', '21', '22', '28', '29'];

    const today = new Date();
    const currentDay = today.getDate();

    
    const handleDayClick = (day) => {
        if (day && !isDayDisabled(day)) {
            const selectedMonth = month1 ? 8 : 9; 
            const selectedDate = new Date(today.getFullYear(), selectedMonth, day);
            setSelectedDay(selectedDate);
        }
    };

    
    const isDayDisabled = (day) => {
        const isEmptyDay = day === '';
        const isPastDay = day && parseInt(day) < currentDay && month1;
        const isClosedDay = month1 
            ? closedDaysMonth1.includes(day) 
            : closedDaysMonth2.includes(day);
        return isEmptyDay || isPastDay || isClosedDay;
    };

    
    const CalendarDay = ({ day }) => {
        const isSelected = 
            day && 
            parseInt(day) === selectedDay.getDate() && 
            ((month1 && selectedDay.getMonth() === 8) || 
            (!month1 && selectedDay.getMonth() === 9));

        return (
            <div className='calendar_section'>
                <p 
                    className={`calendar_day ${isDayDisabled(day) ? 'past_day' : ''} ${isSelected ? 'selected_day' : ''}`} 
                    onClick={() => handleDayClick(day)}
                >
                    {day}
                </p>
            </div>
        );
    };

    
    return (
        <div className='calendar'>
            <div className='calendar_top'>
                <h1 className='calendar_month'>{month1 ? 'Sep 2024' : 'Oct 2024'}</h1>
                <div className='calendar_toggle_month_buttons'>
                    <FontAwesomeIcon 
                        icon={faArrowLeft} 
                        className={`calendar_toggle_month_button ${month1 && 'calendar_toggle_month_button_lighter'}`} 
                        onClick={() => setMonth1(true)} 
                    />
                    <FontAwesomeIcon 
                        icon={faArrowRight} 
                        className={`calendar_toggle_month_button ${!month1 && 'calendar_toggle_month_button_lighter'}`} 
                        onClick={() => setMonth1(false)} 
                    />
                </div>
            </div>

            <div className='calendar_days_of_week'>
                {daysOfWeek.map((day, index) => (
                    <div key={index} className='calendar_day_of_week'>{day}</div>
                ))}
            </div>

            <div className='calendar_main'>
                {month1 ? 
                daysInMonth1.map((day, index) => (
                    <CalendarDay key={index} day={day} />
                )) :
                daysInMonth2.map((day, index) => (
                    <CalendarDay key={index} day={day} />
                ))}
            </div>
        </div>
    );
}
