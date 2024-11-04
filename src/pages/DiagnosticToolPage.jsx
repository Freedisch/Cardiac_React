import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/common/Header.jsx';

import echoImage from '../assets/echocardiography.jpeg';
import ecgImage from '../assets/ecg-image.jpeg';
import mriImage from '../assets/cardiac_mri.jpeg';
import ctImage from '../assets/ct_angiography.jpeg';
import nuclearImage from '../assets/nuclear_cardiology.jpeg';
import xrayImage from '../assets/chest_xray.jpeg';

const diagnosticTools = [
    {
        name: 'Echocardiography (Ultrasound)',
        image: echoImage,
        link: '/ecg-details',
    },
    {
        name: 'Electrocardiogram (ECG/EKG)',
        image: ecgImage,
        link: '/ecg-details',  
    },
    {
        name: 'Cardiac Magnetic Resonance Imaging (MRI)',
        image: mriImage,
        link: '/mri-details',  
    },
    {
        name: 'Computed Tomography (CT) Angiography',
        image: ctImage,
        link: '/ct-details',  
    },
    {
        name: 'Nuclear Cardiology',
        image: nuclearImage,
        link: '/nuclear-details',  
    },
    {
        name: 'Chest X-ray',
        image: xrayImage,
        link: '/xray-details',  
    },
];

const DiagnosticPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <Header title='Diagnostic Tools' />
            
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {diagnosticTools.map((tool, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-300 shadow-lg rounded-lg p-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link to={tool.link}>
                                <img src={tool.image} alt={tool.name} className="w-full h-32 object-cover rounded-md mb-4" />
                            </Link>
                            <h2 className="text-xl font-semibold text-black">{tool.name}</h2>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiagnosticPage;
