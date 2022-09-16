import React, { useState, createContext, useEffect } from "react";
import { tostMessage } from '../api/toastMessage';
import uuid from 'react-native-uuid';
import fetchReverseGeolocation from '../api/fetchData';

const LocationContext = createContext<any|null>(null);

const LocationProvider = ({children}:any)=>{
    const [locationStamp, setLocationStamp] = useState([])
    
    const [userCoords, setUserCords] = useState({
        latitude: '',
        longitude: ''
    });
    const [locationLabel, setLocationLabel] = useState('');

    return(
        <LocationContext.Provider value={{locationStamp, setLocationStamp, userCoords, setUserCords, locationLabel, setLocationLabel}}>
            {children}
        </LocationContext.Provider>
    )
};

export {LocationContext, LocationProvider}