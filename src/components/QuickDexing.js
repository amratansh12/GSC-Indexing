import React, { useContext, useState } from 'react';
import { Typography, TextField, Button, Paper, IconButton } from '@mui/material';
import { Delete, CheckCircle } from '@mui/icons-material';
import { useEffect } from 'react';
import axios from 'axios'
import { useParams, useSearchParams } from "react-router-dom";
import { Buffer } from 'buffer';
import { SitesContext } from "../context/SitesContext";


const QuickDexing = () => {
    const {sites} = useContext(SitesContext);
    const [searchParams] = useSearchParams();
    console.log(searchParams)
    
    const code = searchParams.get("code");
    console.log(code)
    const [sitemaps, setSitemaps] = useState({});
    const [selectedSite, setSelectedSite] = useState("");
    const [name, setName] = useState("New User");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState('');
    const [jsonFile, setJsonFile] = useState(null);
    const [xmlFiles, setXmlFiles] = useState([]);
    const [submittedDataList, setSubmittedDataList] = useState([]);
    useEffect(() => {

        if (localStorage.getItem("name")) {
            const nameParam = localStorage.getItem("name");
            const emailParam = localStorage.getItem("email")
            setName(nameParam || "New User");
            setEmail(emailParam || "");
        }
        else {
            const clientID = "hidr36c0n1g74b3m1mrnfsvq1";
            const clientSecret = "15fbbujm5fme623e4d12k3ipqav8qkeot95vcij260e5vs4c5rh0";
            const cognitoDomain = "https://linkindex.auth.us-east-1.amazoncognito.com";
            const credentials = `${clientID}:${clientSecret}`;
            const base64Credentials = Buffer.from(credentials).toString("base64");
            const basicAuthorization = `Basic ${base64Credentials}`;
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: basicAuthorization,
            };

            const data = new URLSearchParams();
            let token = "";

            data.append("grant_type", "authorization_code");
            data.append("client_id", "hidr36c0n1g74b3m1mrnfsvq1");
            data.append("code", code);
            data.append("redirect_uri", "https://collabchatbots.com");
            axios
                .post(`${cognitoDomain}/oauth2/token`, data, { headers })
                .then((res) => {
                    if (res.status === 200) {
                        token = res?.data?.access_token;
                        const userInfoHeaders = {
                            Authorization: "Bearer " + token,
                        };
                        axios
                            .get(`${cognitoDomain}/oauth2/userInfo`, { headers: userInfoHeaders })
                            .then((userInfo) => {
                                if (userInfo.status === 200) {
                                    localStorage.setItem('name', userInfo.data?.username);
                                    localStorage.setItem('email', userInfo.data?.email);
                                    console.log(userInfo)
                                    setName(userInfo.data?.username);
                                    setEmail(userInfo.data?.email);
                                    return userInfo
                                } else {
                                    // Handle error when unable to fetch user info
                                    console.error("Failed to fetch user info");
                                }
                            })
                            .catch((error) => {
                                // Handle error in fetching user info
                                console.error("Error fetching user info:", error);
                            });
                    } else {
                        // Handle error when token request fails
                        console.error("Token request failed:", res.status);
                        // Display appropriate error m essage to the user
                        alert("Failed to authenticate. Please try again.");
                    }
                })
                .catch((error) => {
                    // Handle error in token request
                    console.error("Token request error:", error);
                    // Display appropriate error message to the user
                    alert("Failed to authenticate. Please try again.");
                });
        }
    }
        , [code]);

    const handleFileUpload = (event) => {
        const uploadedFiles = event.target.files;

        if (!uploadedFiles) {
            return; // No files selected
        }

        const validFiles = [...uploadedFiles].filter(file => file.type === 'text/xml');

        if (validFiles.length === 0) {
            alert('No valid XML files selected. Please upload XML files only.');
            return;
        }

        setXmlFiles(validFiles);
    };

    const handleSubmit = async () => {
        if (!website.trim() || !jsonFile || xmlFiles.length === 0) {
            alert('Please fill out all fields and upload required files.');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', localStorage.getItem("email")); // Replace 'your_user_id' with actual user ID
        formData.append('site_url', website);
        formData.append('credentials_json_file', jsonFile);

        xmlFiles.forEach((file, index) => {
            formData.append('sitemap_files', file); // Append each XML file with the same key
        });

        try {
            const response = await fetch('http://3.80.152.88:3000/send-data', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to send data. Please try again later.');
            }

            const data = await response.json();
            console.log(data); // Handle response from the backend as needed

            // Update submitted data list
            const newSubmission = {
                user_id: localStorage.getItem("email"),
                website: website,
                jsonFile: jsonFile,
            };
            setSubmittedDataList([...submittedDataList, newSubmission]);

            // Reset form fields
            setWebsite('');
            setJsonFile(null);
            setXmlFiles([]);
        } catch (error) {
            console.error('Error sending data:', error.message);
            alert('Failed to send data. Please try again later.');
        }
    };

    const handleRemove = (index) => {
        const shouldRemove = window.confirm('Are you sure you want to remove this submission?');

        if (shouldRemove) {
            const updatedList = [...submittedDataList];
            updatedList.splice(index, 1);
            setSubmittedDataList(updatedList);
        }
    };
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        // Fetch list of URLs from the API endpoint
        fetchUrls();
    }, []);

    const fetchUrls = () => {
        // Fetch list of URLs from the API endpoint
        axios.post('http://3.80.152.88:3000/getList', { "user_id": localStorage.getItem('email') })
            .then(response => {
                setUrls(response.data);
            })
            .catch(error => {
                console.error('Error fetching URLs:', error);
                // Handle error fetching URLs
            });
    };

    const handleRemoveUrl = (urlToRemove) => {
        setUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
    };
    
    const optionClick = (siteUrl) => {
        const token = localStorage.getItem("accessToken");

        fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(e => console.log(e.message))
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[#27272b]">
            <div className='w-full h-full p-5 flex flex-col'>
                <p className='font-bold text-3xl text-white'>QuickDexing</p>
                <p className='text-white font-lg w-[70%] my-2'>
                    Make a google service account, download and upload the credentials file and write the name of your website below. You can expect 200 urls indexing per day per service account. The service account has to be added to your google search console
                </p>
                <div className='w-full rounded-md bg-[#09090B] shadow-sm p-2'>
                    <div className='flex items-center justify-between w-full my-4'>
                        <p className='text-white'>
                            Website
                            <span className='text-red-600 ml-1'>*</span>
                        </p>
                        <select 
                            type="text" 
                            className='p-1 rounded-md text-black bg-[#E4E4E7] w-[75%] focus:ring-0 focus:outline-none' 
                            onChange={(e) => optionClick(e.target.value)}
                        >
                            <option value="default" selected>Select a website</option>
                            {sites.siteEntry && sites.siteEntry.map((site, index) => (
                                <option value={site.siteUrl}>{site.siteUrl}</option>
                            ))}
                        </select>
                    </div>
                    {/*<div className='relative flex items-center justify-between w-full my-4'>
                        <p className='text-white'>
                            Sitemap
                            <span className='text-red-600 ml-1'>*</span>
                        </p>
                        <select 
                            type="text" 
                            className='p-1 rounded-md text-black bg-[#E4E4E7] w-[75%]' 
                        >
                            <option value="default" selected>Select an option</option>
                            <option value="Option1">Option 1</option>
                            <option value="Option2">Option 2</option>
                        </select>
                        <p className='absolute -bottom-6 right-[25rem] text-gray-300 text-xs'>The sitemap containing the URLs you want to index</p>
                    </div>*/}
                    <div className='flex justify-center mb-4 mt-10 w-[50%]'>
                        <button className='rounded-md bg-blue-500 hover:bg-blue-600 p-2 text-sm text-black '>
                            Send to index
                        </button>
                    </div>
                </div>

                <input
                    style={{ display: 'none' }}
                    type="file"
                    id="jsonFile"
                    accept=".json"
                    onChange={(e) => setJsonFile(e.target.files[0])}
                />

                <div className='flex my-4 gap-4 items-center'>
                    <button className='rounded-md bg-blue-500 hover:bg-blue-600 p-2 text-sm text-black '>
                        Upload JSON Files
                    </button>
                    <button className='rounded-md bg-blue-500 hover:bg-blue-600 p-2 text-sm text-black '>
                        Upload XML Files
                    </button>
                    <button className='rounded-md bg-blue-700 hover:bg-blue-800 p-2 text-sm text-white' onClick={handleSubmit}>
                        Submit
                    </button>
                </div>

                {jsonFile && (
                    <Typography variant="body1" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                        {jsonFile.name} uploaded successfully
                    </Typography>
                )}

                <input
                    style={{ display: 'none' }}
                    type="file"
                    id="xmlFiles"
                    accept=".xml"
                    multiple
                    onChange={handleFileUpload}
                />

                {xmlFiles.length > 0 && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {xmlFiles.length} XML files selected
                    </Typography>
                )}
            </div>

            {submittedDataList.length > 0 && (
                <Paper sx={{ p: 4, mt: 4, maxWidth: 'xl' }}>
                    <Typography variant="h5" gutterBottom>
                        All Submitted Data:
                    </Typography>
                    {submittedDataList.map((submission, index) => (
                        <Paper key={index} sx={{ p: 2, mt: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Website: {submission.website}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                JSON File: {submission.jsonFile?.name}
                            </Typography>
                            <Button onClick={() => handleRemove(index)} variant="contained" color="error">
                                <Delete />
                                Remove
                            </Button>
                        </Paper>
                    ))}
                </Paper>
            )}

            <div className='mx-5 mb-5 w-[95%] h-full bg-[#09090B] rounded-md'>
                <p className='w-full text-md text-white px-2 border-b border-gray-700'>List of URLs to be indexed the next day</p>
                {urls !== null && urls.length > 0 ? (
                    urls.map((url, index) => (
                        <Paper key={index} sx={{ p: 2, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" gutterBottom>
                                {url}
                            </Typography>
                            <IconButton onClick={() => handleRemoveUrl(url)} color="error">
                                <Delete />
                            </IconButton>
                        </Paper>
                    ))
                ) : (
                    <div className='text-white flex mt-2 justify-center items-center'>No URLs to display</div>
                )}
            </div>

        </div>
    );
};

export default QuickDexing;
