import { StyleSheet, View, Dimensions } from 'react-native';
import { useContext } from 'react';
import { LocationContext } from '../context/locationContext';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export function LocationMap() {
    const { locationStamp } = useContext(LocationContext)

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                mapType={"mutedStandard"}
                provider={PROVIDER_GOOGLE}
                >
                {locationStamp.map((host: any, i: any) => {
                    console.log("data: ", host);

                    if (host.coords.lat && host.coords.long) {
                        console.log("TEST", host.coords.lat);
                        return (
                        <Marker
                            key={i}
                            coordinate={{
                                latitude: host.coords.lat,
                                longitude: host.coords.long
                            }}
                            title={host.locationName}
                            pinColor={"#ffd1dc"}
                        />)
                    }
                })}
            </MapView>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
