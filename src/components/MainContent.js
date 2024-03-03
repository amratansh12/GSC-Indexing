import React from 'react'
import QuickDexing from './QuickDexing';
import RankTracker from './RankTracker';
import './styles.css'
import { Dashboard } from './Dashboard';
import { Websites } from './Websites';
import { GSC } from './GSC';

const MainContent = ({ isOpen, activeHeading, onHeadingClick }) => {
  const getContent = () => {
    switch (activeHeading) {
      case 'Quick Dexing':
        return (
          <QuickDexing />
        );

      case 'Rank Tracker':
        return (
          <RankTracker />
        );

      case 'Dashboard':
        return(
          <Dashboard onHeadingClick={onHeadingClick}/>
        )

      case 'GSC Connections':
        return(
          <GSC />
        )
      
      case 'Websites':
        return(
          <Websites onHeadingClick={onHeadingClick}/>
        )
      default:
        return null;
    }
  };

  return (
    <div className='w-full'>
      {getContent()}
    </div>
  );
};


export default MainContent
