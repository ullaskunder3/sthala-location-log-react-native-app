import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState, useContext } from 'react';
import { LocationContext } from '../context/locationContext';
import { getCurrentTimeAndDate } from '../api/getCurrentTime';
import { LocationInterface } from '../Interface/Location';
import fetchReverseGeolocation from '../api/fetchData';
import { tostMessage } from '../api/toastMessage';
import uuid from 'react-native-uuid';
const MAX_STACK: number = 30;

export function Home() {
  const { locationStamp, setLocationStamp, setUserCords, setLocationLabel } = useContext(LocationContext)

  const [locationPrevView, setLocationPreView] = useState('');
  const [location, setLocation] = useState<LocationInterface>({ latitude: 0, longitude: 0 });
  const [currentTime, setCurrentTime] = useState<Date | any>();
  const [currentDate, setCurrentDate] = useState<Date | any>();
  const [errorMsg, setErrorMsg] = useState('');
  const [maxStackMsg, setMaxStackMsg] = useState(false)

  const onClickDelete = (recentLocationID:any) => {
    const newRecentList = locationStamp.filter((item: { id: any; }) => item.id != recentLocationID)
    setLocationStamp(newRecentList)
  }
  const onClickClearAll = () => {
    setLocationStamp([]);
  }

  const rednderEmptyMessage = () => (
    <View style={styles.recentloctaionMessage}>
      <Text>Your Recent Location</Text>
    </View>
  )

  const Item = ({ id, location, locationName }:any) => (
    <View style={styles.flexCol}>
      <View style={styles.listItemContent} >
        <Text>{location}</Text>
        <Text>{locationName}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} style={styles.clearBtn} onPress={() => onClickDelete(id)}>
        <Text>Clear</Text>
      </TouchableOpacity>
    </View>
  );


  const renderItem = ({ item }:any) => (
    <Item id={item.id} location={item.location} locationName={item.locationName} />
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let { timeStamp, dateStamp } = getCurrentTimeAndDate()
      setCurrentTime(timeStamp)
      setCurrentDate(dateStamp)
      setLocation({
        latitude: location.coords["latitude"],
        longitude: location.coords["longitude"]
      });
    })();

    if (location.latitude !== 0) apiCall(location.latitude, location.longitude)
    fetchReverseGeolocation(location.latitude, location.longitude)
      .then(response => {
        if (response !== '404') {
          const { data } = response;
          
          setLocationPreView(data[0].label)
          setUserCords({
            latitude: data[0].latitude,
            longitude: data[0].longitude,
          })
          setLocationLabel(data[0].label);
        } else {
          tostMessage('Something Went Worng')
        }
      }).catch(() => {
        tostMessage('Something Went Worng')
      })

    if (locationStamp.length === MAX_STACK) {
      setMaxStackMsg(true);
    } else {
      setMaxStackMsg(false);
    }

    // call every 20 seconds
    const interval = setInterval(() => {
      if (locationStamp.length < MAX_STACK) {
        apiCall(location.latitude, location.longitude)
      }
    }, 20000);
    return () => clearInterval(interval);

  }, [location.latitude, location.longitude]);

  function apiCall(latitude:any, longitude:any) {
    fetchReverseGeolocation(latitude, longitude)
      .then(response => {
        // console.log('did run', response);
        if (response !== '404') {
          const { data } = response;
          setLocationStamp((prevState: any) => [...prevState, {
            id: uuid.v4(),
            location: data[0].label,
            locationName: `${data[0].country_code} - ${data[0].region_code}`,
            coords: { lat: location.latitude, long: location.longitude },
          }])

        } else {
          tostMessage('Something Went Worng')
        }
      }).catch(() => {
        tostMessage('Something Went Worng')
      })
  }

  return (
    <View style={styles.container}>

      {errorMsg ? <Text>Permission to access location was denied</Text> :
        <View style={styles.currentLocatinContainer}>
          <View>
            <Text>Current Location</Text>
          </View>
          <View >
            <Text style={styles.currentLocatinText} ellipsizeMode='tail'>{locationStamp[1]?.location ? locationStamp[1]?.location : locationPrevView}</Text>
          </View>
          <View style={styles.currentLocationStamps}>
            <Text style={styles.currentLocatinDate}>{currentDate},</Text>
            <Text style={styles.currentLocatinTime} >{currentTime}</Text>
          </View>
        </View>}

      <View>
        <Text style={{ paddingVertical: 10, paddingLeft: 10 }}>Previous Locations</Text>
      </View>

      <FlatList
        style={styles.flatList}
        data={locationStamp}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => rednderEmptyMessage()}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.touchableOpacityStyle}
        onPress={() => onClickClearAll()}
      >
        <Text style={[{ fontWeight: '800' }, { color: maxStackMsg ? '#ff5100' : 'black' }]}>Clear all</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recentloctaionMessage: {
    backgroundColor: '#f5e6dc',
    alignItems: 'center',
  },
  currentLocatinContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    flexWrap: 'wrap',

    shadowColor: '#2c2c2c',
    elevation: 3
  },
  currentLocatinText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  currentLocationStamps: {
    flexDirection: 'row',
  },
  currentLocatinDate: {
    fontSize: 15,
    paddingRight: 5,
    fontWeight: 'bold',
    color: '#5a5a5a'
  },
  currentLocatinTime: {
    fontSize: 15,
    color: '#5a5a5a',
    fontWeight: 'bold',
  },
  flatList: {
    flex: 3,
    width: '100%',
  },

  touchableOpacityStyle: {
    backgroundColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    borderRadius: 10,
    paddingHorizontal: 50,
    paddingVertical: 10,
    marginRight: 20,

    left: '30%',
    // right: 0,
  },
  clearBtn: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  flexCol: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 3,
    borderRadius: 10,
    marginHorizontal: 10,

    shadowColor: '#dfdfdf',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 5,
    elevation: 2
  },
  listItemContent: {
    flex: 1
  }
});
