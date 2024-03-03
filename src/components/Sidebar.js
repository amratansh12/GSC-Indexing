import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { HiMiniArchiveBoxArrowDown, HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { AiOutlineHome } from "react-icons/ai";
import { CiShare2 } from "react-icons/ci";
import { LuWalletCards } from "react-icons/lu";
import { IoFlashOutline } from "react-icons/io5";

const Sidebar = ({ isOpen, onToggle, onHeadingClick }) => {
  return (
    <div className='flex flex-col bg-[#09090B] p-2'>
      <div className='my-1 flex items-center gap-2 hover:bg-[#16161B] cursor-pointer px-1 py-2 rounded-md' onClick={() => onHeadingClick('Dashboard')}>
        <AiOutlineHome className='text-[#71717A] font-bold h-6 w-6'/>
        <p className='text-[#E4E4E7] text-md'>Dashboard</p>
      </div>
      <div className='my-1 flex items-center gap-2 hover:bg-[#16161B] cursor-pointer px-1 py-2 rounded-md' onClick={() => onHeadingClick('GSC Connections')}>
        <CiShare2 className='text-[#71717A] font-bold h-6 w-6'/>
        <p className='text-[#E4E4E7] text-md'>GSC Connections</p>
      </div>
      <div className='my-1 flex items-center gap-2 hover:bg-[#16161B] cursor-pointer px-1 py-2 rounded-md' onClick={() => onHeadingClick('Websites')}>
        <LuWalletCards className='text-[#71717A] font-bold h-6 w-6'/>
        <p className='text-[#E4E4E7] text-md'>Websites</p>
      </div>
      <div className='my-1 flex items-center gap-2 hover:bg-[#16161B] cursor-pointer px-1 py-2 rounded-md'>
        <IoFlashOutline className='text-[#71717A] font-bold h-6 w-6'/>
        <p className='text-[#E4E4E7] text-md'>Service Accounts</p>
      </div>
      <div className='w-[200px] md:w-[300px]'>
        <p className='font-bold my-2 text-[#71717A]'>Tools</p>
        <div className='my-1 flex items-center gap-2 hover:bg-[#16161B] cursor-pointer px-1 py-2 rounded-md' onClick={() => onHeadingClick("Quick Dexing")}>
          <HiMiniArchiveBoxArrowDown className='text-[#71717A] h-6 w-6'/>
          <p className='text-[#E4E4E7] text-md'>Quickdexing</p>
        </div>
        <div className='my-1 flex items-center gap-2 hover:bg-[#16161B] cursor-pointer px-1 py-2 rounded-md' onClick={() => onHeadingClick("Rank Tracker")}>
          <HiMiniArchiveBoxXMark className='text-[#71717A] h-6 w-6'/>
          <p className='text-[#E4E4E7] text-md'>Rank Tracker</p>
        </div>
        <div className='flex items-center'></div>
      </div>
    </div>
  );
};

export default Sidebar;
