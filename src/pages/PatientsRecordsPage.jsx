// src/pages/FollowUpsPage.jsx

// eslint-disable-next-line no-unused-vars
import React from 'react';
import Header from '../components/common/Header.jsx';

const PatientsRecordsPage = () => {
    return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <Header title='Patient Records' />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <h2>Patient Records</h2>
                <p>This is the Patient Records page. Display Patient Records information here.</p>
            </main>
        </div>
    );
};

export default PatientsRecordsPage;
