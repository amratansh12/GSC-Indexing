import React, { useContext, useEffect, useState } from "react";
import {GoogleLogin, GoogleLogout} from "react-google-login"
import { SitesContext } from "../context/SitesContext";

export const GSC = () => {
  const {sites, setSites, token, setToken} = useContext(SitesContext);
  const clientId = '348721234974-hqmgemcepb0v909vktsuvbuqk8m4asdj.apps.googleusercontent.com';

  useEffect(() => {
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
  }, [token])

  const onSuccess = (res) => {
    console.log("Success: ", res);
    setToken(res.accessToken);
    localStorage.setItem("accessToken", res.accessToken);
  }

  const onFailure = (res) => {
    console.log("Error: ", res)
  }
  
  const onLogoutSuccess = () => {
    console.log("Logout success!");
    setToken("");
    localStorage.removeItem("accessToken")
    setSites({});
  }

  return(
    <div className="w-full h-full bg-[#27272B] p-5">
      <div className="flex justify-between items-center">
        <p className="text-3xl font-bold text-white">GSC Connections</p>
        <div className="flex gap-2 items-center">
          <GoogleLogin 
            render={renderProps => (
              <button className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm" onClick={renderProps.onClick} disabled={renderProps.disabled}>Login</button>
            )}
            clientId={clientId}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy="single_host_origin"
            isSignedIn={true}
          />
          <GoogleLogout 
            render={renderProps => (
              <button className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm" onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</button>
            )}
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={onLogoutSuccess}
          />
        </div>
      </div>
      <div className="w-full h-[60%] rounded-md my-10 bg-[#09090B] flex flex-col overflow-y-scroll">
        {!sites.siteEntry && (
          <div className="h-full text-white text-sm flex justify-center items-center">Please login to list sites</div>
        )}
        {sites.siteEntry && (
          <div className="w-full flex flex-col">
            {sites.siteEntry.map((site) => (
              <li className='flex items-center gap-5 border-b border-gray-700 p-3'>
                <input type="checkbox" className="h-3 w-3 block"/>
                <p className="text-white">{site.siteUrl}</p>
              </li>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}