import { createContext, useState } from "react";

export const SitesContext = createContext({});

const SitesContextProvider = ({children}) => {
  const [token, setToken] = useState("");
  const [sites, setSites] = useState({});
  
  return(
    <SitesContext.Provider value={{
      sites,
      setSites,
      token,
      setToken
    }}>
      {children}
    </SitesContext.Provider>
  )
}

export default SitesContextProvider;

