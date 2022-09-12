import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState, useContext } from 'react';
const MAX_STACK: number = 5;
import { AntDesign } from '@expo/vector-icons';
import { LocationContext } from '../context/locationContext';
import { getCurrentTimeAndDate } from '../api/getCurrentTime';
import { LocationInterface } from '../Interface/Location';

export function Home() {
  const { locationStamp, setLocationStamp } = useContext(LocationContext)

  const [location, setLocation] = useState<LocationInterface>({ latitude: 0, longitude: 0 });
  const [currentTime, setCurrentTime] = useState<Date | any>();
  const [currentDate, setCurrentDate] = useState<Date | any>();
  const [errorMsg, setErrorMsg] = useState('');

  const onClickDelete = (recentLocationID) => {
    const newRecentList = locationStamp.filter(item => item.id != recentLocationID)
    setLocationStamp(newRecentList)
  }
  const onClickClearAll = () => {
    setLocationStamp({})
  }
  const rednderEmptyMessage = () => {
    <View>
      <Text>You have no employers in your favorite list.</Text>
    </View>
  }

  const Item = ({ id, location, locationName }) => (
    <View style={styles.flexCol}>
      <View>
        <Text>{location}</Text>
        <Text>{locationName}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} style={styles.clearBtn} onPress={() => onClickDelete(id)}>
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );


  const renderItem = ({ item }) => (
    <Item id={item.id} location={item.location} locationName={item.locationName} />
  );

  function setIntervalX(callback, delay, repetitions) {
    var currentCounter = 0;
    var intervalID = window.setInterval(function () {
      callback();
      if (++currentCounter === repetitions) {
        window.clearInterval(intervalID);
      }
    }, delay);
  }

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

    let counter = 0;

    setIntervalX(() => {
      console.log('did run', counter++);
      setLocationStamp(prevState => [...prevState, {
        id: `bd7acbea-c1b1-46c2-aed5-3ad5 ${Math.random()} 3`,
        location: `First Item ${Math.random()}`,
        locationName: 'tokyo',
        coords: { lat: location.latitude, long: location.longitude },
      }])
    }, 2, 4)

  }, []);

  return (
    <View style={styles.container}>

      {errorMsg ? <Text>Permission to access location was denied</Text> :
        <View style={styles.currentLocatinContainer}>
          <View>
            <Text>Current Location</Text>
          </View>
          <View >
            <Text style={styles.currentLocatinText} >{location?.longitude ? location.longitude : 'Waiting...'}</Text>
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
        initialNumToRender={30}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => rednderEmptyMessage()}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.touchableOpacityStyle}
        onPress={() => onClickClearAll()}
      >
        <Text style={{ fontWeight: 'bold' }}>Clear all</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: '#00000044',
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
    // backgroundColor: 'blue'
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
  }
});
