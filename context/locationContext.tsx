import React, { useState, createContext } from "react";

const LocationContext = createContext<any|null>(null);

const LocationProvider = ({children}:any)=>{
    const [locationStamp, setLocationStamp] = useState([])
    return(
        <LocationContext.Provider value={{locationStamp, setLocationStamp}}>
            {children}
        </LocationContext.Provider>
    )
};

export {LocationContext, LocationProvider}