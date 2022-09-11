import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Button } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
const MAX_STACK: number = 30;
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

const getCurrentTimeAndDate = () => {
  let today = new Date();

  let dateStamp = `${today.getMonth()}/${today.getDate()}/${today.getFullYear()}`

  let hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
  let minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
  let seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();

  let timeString = hours + ':' + minutes + ':' + seconds;
  const [hrs, min, sec] = timeString.split(':')
  const newHrs = + hrs % 24;
  const timeStamp = (newHrs % 12 || 12) + ':' + min + ':' + sec + (newHrs < 12 ? ' AM' : ' PM');

  return { timeStamp, dateStamp }

}

const Item = ({ title, locationName }) => (
  <View style={styles.flexCol}>
    <View>
      <Text>{title}</Text>
      <Text>{locationName}</Text>
    </View>
    <TouchableOpacity activeOpacity={0.7} style={styles.clearBtn}>
      <AntDesign name="close" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

function MapView() {
  return (
    <View>
      <Text>MapView</Text>
    </View>
  )
}

function Home() {

  const [location, setLocation] = useState<{ latitude: number, longitude: number } | undefined>(
    { latitude: 0, longitude: 0 }
  );
  const [locationStamp, setLocationStamp] = useState(
    [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        locationName: 'tokyo'
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        locationName: 'tokyo'
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        locationName: 'tokyo'
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28b1',
        title: 'First Item',
        locationName: 'tokyo'
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f621',
        title: 'Second Item',
        locationName: 'tokyo'
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d12',
        title: 'Third Item',
        locationName: 'tokyo'
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb2b12',
        title: 'First Item',
        locationName: 'tokyo'
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa9763',
        title: 'Second Item',
        locationName: 'tokyo'
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d7212',
        title: 'Third Item',
        locationName: 'tokyo'
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb2811',
        title: 'First Item',
        locationName: 'tokyo'
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f633',
        title: 'Second Item',
        locationName: 'tokyo'
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d44',
        title: 'Third Item',
        locationName: 'tokyo'
      },
    ]
  )
  const [currentTime, setCurrentTime] = useState<Date | any>();
  const [currentDate, setCurrentDate] = useState<Date | any>();
  // const [timer, setTimer] = useState(Date.now());
  const [errorMsg, setErrorMsg] = useState('');

  const renderItem = ({ item }) => (
    <Item title={item.title} locationName={item.locationName} />
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
            <Text style={{paddingVertical: 10, paddingLeft: 10}}>Previous Locations</Text>
        </View>

      <FlatList
        style={styles.flatList}
        data={locationStamp}
        renderItem={renderItem}
        initialNumToRender={30}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.touchableOpacityStyle}>
        <Text style={{ fontWeight: 'bold' }}>Clear all</Text>
      </TouchableOpacity>

    </View>
  )
}

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'cloudo'
                : 'cloud';
            } else if (route.name === 'location') {
              iconName = focused ? 'enviroment' : 'enviromento';
            }

            // You can return any component that you like here!
            return <AntDesign name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="location" component={MapView} />
      </Tab.Navigator>
    </NavigationContainer>
  );
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
  currentLocatinText:{
    fontSize: 25,
    fontWeight: 'bold',
  },
  currentLocationStamps:{
    flexDirection: 'row',
  },
  currentLocatinDate:{
    fontSize: 15,
    paddingRight: 5,
    fontWeight: 'bold',
    color: '#5a5a5a'
  },
  currentLocatinTime:{
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
