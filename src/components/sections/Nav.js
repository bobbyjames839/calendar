import '../styles/Nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 

export const Nav = ({ setSidebar }) => {
    return (
        <div className="nav">
            <span className="nav_logo">Logo</span>
            <FontAwesomeIcon className='nav_icon' icon={faBars} onClick={() => setSidebar(true)} />
        </div>
    );
};
