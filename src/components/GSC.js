import { useState } from "react";
import {GoogleLogin, GoogleLogout} from "react-google-login"

export const GSC = () => {
  const [token, setToken] = useState("");
  const [sites, setSites] = useState({});
  const clientId = '348721234974-hqmgemcepb0v909vktsuvbuqk8m4asdj.apps.googleusercontent.com';

  const onSuccess = (res) => {
    console.log("Success: ", res);
    setToken(res.accessToken);

  }

  const execute = async () => {
    try{
      const res = await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = res.json();

      setSites(data);
      console.log(data);
    } catch(error) {
      console.log(error);
    }
  }
  
  const onFailure = (res) => {
    console.log("Error: ", res)
  }
  
  const onLogoutSuccess = () => {
    console.log("Logout success!");
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
      <div className="w-full h-[60%] rounded-md my-10 bg-[#09090B] flex flex-col justify-center items-center p-2">
        
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <button className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm" onClick={execute}>Fetch sites</button>
          {sites && sites.siteEntry ? (
            <p className="text-cyan-200">Working</p>
          ) : (
            <p className="text-cyan-200">No Sites registered</p>
          )}
        </div>
      </div>
    </div>
  )
}