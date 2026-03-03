import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black">
            <div className="animate-pulse flex flex-col items-center">
                <img src="/assets/logo.webp" alt="Loading..." className="h-32 w-auto object-contain skew-x-[-12deg]" />
            </div>
        </div>
    );
};

export default Loader;
