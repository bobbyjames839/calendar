import '../styles/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faPhoneAlt, faClock } from '@fortawesome/free-solid-svg-icons'; 
import { useState } from 'react';

export const Sidebar = ({ setSidebar }) => {
    const [closing, setClosing] = useState(false)

    const handleCloseSidebar = () => {
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            setSidebar(false)
        }, 500)
    }

    const SidebarSection = ({ title, desc, icon }) => {
        return (
            <div className='sidebar_section'>
                <div className='sidebar_section_left'>
                    <h3 className='sidebar_section_title'>{title}</h3>
                    <p className='sidebar_section_desc'>{desc}</p>
                </div>
                <FontAwesomeIcon icon={icon} className='sidebar_section_icon'/>
            </div>
        );
    };

    return (
        <div className={`sidebar ${closing && 'sidebar_closed'}`}>
            <FontAwesomeIcon icon={faTimes} className='close_sidebar' onClick={handleCloseSidebar} />

            <h1 className='sidebar_title'>Company Name</h1>

            <SidebarSection title='Address' desc='123 Main Street, City, Country' icon={faMapMarkerAlt} />
            <SidebarSection title='Phone' desc='+123 456 7890' icon={faPhoneAlt} />
            <SidebarSection title='Opening Hours' desc='Mon - Fri: 9am - 6pm' icon={faClock} />
        </div>
    );
};
