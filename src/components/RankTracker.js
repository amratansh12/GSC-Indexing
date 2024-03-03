import React, { useState } from 'react';
import countries from './countries';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';


const RankTracker = () => {
    const [webpage, setWebpage] = useState('');
    const [country, setCountry] = useState('');
    const [keyword, setKeyword] = useState('');
    const [rankings, setRankings] = useState([]);
    const [submittedDataList, setSubmittedDataList] = useState([]);

    const handleSubmit = async () => {
        if (!webpage.trim() || !country.trim() || !keyword.trim()) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch('http://18.233.0.140:3000/get_rankings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "keyword": keyword,
                    "sitename": webpage,
                    "country": country,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch rankings. Please try again later.');
            }

            const data = await response.json();
            console.log(data)
            setRankings(data);
        } catch (error) {
            console.error('Error fetching rankings:', error.message);
            alert('Failed to fetch rankings. Please try again later.');
        }

        const newSubmission = {
            webpage,
            country,
            keyword,
        };

        setSubmittedDataList([...submittedDataList, newSubmission]);

        setWebpage('');
        setCountry('');
        setKeyword('');
    };

    const handleRemove = (index) => {
        const shouldRemove = window.confirm('Are you sure you want to remove this submission?');

        if (shouldRemove) {
            const updatedList = [...submittedDataList];
            updatedList.splice(index, 1);
            setSubmittedDataList(updatedList);
        }
    };

    return (
        <div className='h-full w-full p-5 bg-[#27272b]'>
            <p className='text-3xl font-bold text-white'>Rank Tracker</p>
            <p className='w-[60%] text-white my-2'>
                Track the ranking of specific webpages. This tool sends a ranking request even if the URL is marked as "noindex".
            </p>
            <div className='bg-[#09090B] my-5 p-5 rounded-lg'>
                <div className='flex items-center justify-between w-full my-4'>
                    <p className='text-white'>Webpage</p>
                    <input
                        className='rounded px-2 py-1 w-[70%] focus:ring-0 focus:outline-none'
                        type='text'
                        value={webpage}
                        onChange={(e) => setWebpage(e.target.value)}
                        placeholder='Enter webpage'
                    />
                </div>

                <div className='flex items-center justify-between w-full my-4'>
                    <p className='text-white'>Country</p>
                    <select
                        className='rounded p-1 w-[70%]'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}>
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>{country.name}</option>
                        ))}
                    </select>
                </div>

                <div className='flex items-center justify-between w-full my-4'>
                    <p className='text-white'>Keyword</p>
                    <input
                        className='rounded px-2 py-1 w-[70%] focus:ring-0 focus:outline-none'
                        type='text'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder='Enter Keyword'
                    />
                </div>

                <div className='flex justify-center w-[70%] gap-80 items-center my-6'>
                    <button className='bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md' onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>

            {submittedDataList !== undefined && submittedDataList.length > 0 && (
                <div className='mt-4 p-4 bg-[#E2E8F0] rounded-lg'>
                    <h3 className='text-lg font-bold mb-2'>All Submitted Data:</h3>
                    {submittedDataList.map((submission, index) => (
                        <div key={index} className='mb-2 flex justify-between items-center px-2 border-b-2' >
                            <div>
                                <p>Webpage: {submission.webpage}</p>
                                <p>Country: {submission.country}</p>
                                <p>Keyword: {submission.keyword}</p>
                            </div>
                            <button className='bg-red-500 text-white px-2 py-1 rounded' onClick={() => handleRemove(index)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}

            {rankings.desktop_rankings !== undefined && rankings.desktop_rankings.length > 0 && (
                <Card className='mt-4'>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Desktop Rankings:
                        </Typography>
                        <List>
                            {rankings.desktop_rankings.map((ranking, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`Keyword: ${ranking.Keyword}`} />
                                    <ListItemText primary={`Rank: ${ranking.Rank}`} />
                                    <ListItemText primary={`Main URL: ${ranking.Main_URL}`} />

                                    <ListItemText primary={`Date: ${ranking.Date}`} />
                                    <ListItemText primary={`Type: ${ranking.Type}`} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {rankings.mobile_rankings !== undefined && rankings.mobile_rankings.length > 0 && (
                <Card className='mt-4'>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Mobile Rankings:
                        </Typography>
                        <List>
                            {rankings.mobile_rankings.map((ranking, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`Keyword: ${ranking.Keyword}`} />
                                    <ListItemText primary={`Rank: ${ranking.Rank}`} />
                                    <ListItemText primary={`Main URL: ${ranking.Main_URL}`} />

                                    <ListItemText primary={`Date: ${ranking.Date}`} />
                                    <ListItemText primary={`Type: ${ranking.Type}`} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default RankTracker;
