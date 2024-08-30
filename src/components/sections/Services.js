import '../styles/Services.css'

export const Services = ({handleSelectService, selectedService, setAppointmentDuration}) => {

    const ServiceSection = ({ title, desc, top = false, duration = 30 }) => {
        return (
            <div className={`service_section ${selectedService.title === title && 'service_section_selected'} ${top && 'service_section_top'}`} onClick={() => {handleSelectService({ title, desc })
            setAppointmentDuration(duration)}}>
                <h3 className='service_section_title'>{title}</h3>
                <p className='service_section_desc'>{desc}</p>
            </div>
        );
    };
    

    return (
        <div className="services">
            <h1 className='services_title'>Select Service</h1>
            <ServiceSection title='Haircut' desc='£20.00 - 30 minutes' top={true} duration={30}/>
            <ServiceSection title='Skin Fade' desc='£25.00 - 30 minutes' duration={30}/>
            <ServiceSection title='Beard Trim' desc='£15.00 - 15 minutes' duration={15}/>
            <ServiceSection title='Kids Haircut' desc='£15.00 - 30 minutes' duration={30}/>
            <ServiceSection title='Haircut & Beard Trim' desc='£35.00 - 45 minutes' duration={45}/>
        </div>
    )
}