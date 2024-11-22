// src/pages/PendingReportsPage.jsx

// eslint-disable-next-line no-unused-vars
import React from 'react';
import Header from '../components/common/Header.jsx';

const PendingReportsPage = () => {
    return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <Header title='Pending Reports' />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <h2>Pending Reports</h2>
                <p>This is the Pending Reports page. Show pending reports here.</p>
            </main>
        </div>
    );
};

export default PendingReportsPage;
