import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { Buffer } from 'buffer';
import axios from 'axios';
import { gapi } from 'gapi-script';
import { SitesContext } from './context/SitesContext';
import { useSearchParams } from 'react-router-dom';

const clientId = '348721234974-hqmgemcepb0v909vktsuvbuqk8m4asdj.apps.googleusercontent.com';

const App = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    console.log(code);

    const [name, setName] = useState("New user");
    const [history, sethistory] = useState(["No previous history"]);
    const [Cases, setCases] = useState(["No Cases"]);
    const [email, setEmail] = useState("");
    const {setSites} = useContext(SitesContext);
    const [isOpen, setIsOpen] = useState(true);
    const [activeHeading, setActiveHeading] = useState(null);    

    const fetchUserData = async (email) => {
        try {
          const API_URL = 'https://verisage.ai:5000/load_all';
          const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "email_id": email }),
          };
          const response = await fetch(API_URL, requestOptions);
          if (response.ok) {
            const data = await response.json();
            if (data && data.conversation && data.conversation.L) {
              sethistory(data.conversation.L);
            }
            if (data && data.instances && data.instances.L) {
              setCases(data.instances.L);
            }
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        console.log("fetch")
        if (localStorage.getItem("name") && localStorage.getItem("name") !== "null") {
            console.log(localStorage.getItem("name"))
            const nameParam = localStorage.getItem("name");
            const emailParam = localStorage.getItem("email")
            setName(nameParam || "New User");
            setEmail(emailParam || "");
            if (emailParam) {
                fetchUserData(emailParam);
            }
        }
        else {
            const clientID = "hidr36c0n1g74b3m1mrnfsvq1";
            const clientSecret = "15fbbujm5fme623e4d12k3ipqav8qkeot95vcij260e5vs4c5rh0";
            const cognitoDomain = "https://verisage.auth.us-east-1.amazoncognito.com";
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
                    setName(userInfo.data?.username);
                    setEmail(userInfo.data?.email);
                    return userInfo
                    } else {
                    // Handle error when unable to fetch user info
                    console.error("Failed to fetch user info");
                    }
                }).then(async (userInfo) => {
                    console.log(userInfo)
                    const API_URL = 'https://verisage.ai:5000/load_all';
                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            "Authorization": "basicAuthorization",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "email_id": userInfo.data?.email
                        }),
                    }

                    const response = await fetch(API_URL, requestOptions);
                    if (response === "Unregistered") {
                        setName("Please log in to continue")
                    }
                    const data = await response.json()
                    console.log(data)
                    return (data)
                }).then((data) => {
                    if (data && data.conversation && data.conversation.L) {
                        sethistory(data.conversation.L);
                    }
                    if (data && data.instances && data.instances.L) {
                        setCases(data.instances.L);
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
    }}, [code])

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if(token !== null) {
            fetch("https://searchconsole.googleapis.com/webmasters/v3/sites", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                setSites(data);
                console.log(data);
            })
            .catch(console.log)
        }

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
