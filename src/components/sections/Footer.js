import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'; 
import '../styles/Footer.css';

export const Footer = () => {
    const socialLinks = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'];

    return (
        <div className='footer'>
            <div className='footer_main'>

                <div className='footer_section footer_section_right'>
                    <span className="footer_logo">Logo</span>
                </div>

                <div className='footer_main_inner'>
                    <div className='footer_section'>
                        <p className='footer_title'>Find us on social</p>
                        {socialLinks.map((social, index) => (
                            <div className='footer_social' key={index}>
                                <FontAwesomeIcon icon={faArrowRight} className='footer_icon'/> 
                                <a href='/' className='footer_text'>{social}</a>
                            </div>
                        ))}
                    </div>

                    <div className='footer_section'>
                        <p className='footer_title'>Contact Us</p>
                        <p className='footer_text'>info@company.com</p>
                        <p className='footer_text'>+44 0000 000000</p>
                        <p className='footer_text'>123 Company St, City, Country</p>
                    </div>
                </div>
                

            </div>
            <p className='footer_copy'>© 2024 B&T Bookings. All rights reserved.</p>
        </div>
    )
}
