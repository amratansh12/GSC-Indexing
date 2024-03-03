import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { gapi } from 'gapi-script';

const clientId = '348721234974-hqmgemcepb0v909vktsuvbuqk8m4asdj.apps.googleusercontent.com';

const App = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeHeading, setActiveHeading] = useState(null);

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: "https://www.googleapis.com/auth/webmasters"
            })
        };

        gapi.load('client:auth2', start);
    }, [])

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleHeadingClick = (heading) => {
        setActiveHeading(heading);
    };

    return (
        <div className="app">
            <Sidebar isOpen={isOpen} onToggle={handleToggle} onHeadingClick={handleHeadingClick} />
            <MainContent isOpen={isOpen} activeHeading={activeHeading} onHeadingClick={handleHeadingClick}/>
        </div>
    );
};

export default App;
