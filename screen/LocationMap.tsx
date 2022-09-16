import { StyleSheet, View, Dimensions } from 'react-native';
import { useContext, useEffect } from 'react';
import { LocationContext } from '../context/locationContext';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export function LocationMap() {
    const { userCoords, locationLabel } = useContext(LocationContext)
    console.log(locationLabel);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                mapType={"mutedStandard"}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: userCoords.latitude,
                    longitude: userCoords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>
                <Marker
                    coordinate={{
                        latitude: userCoords.latitude,
                        longitude: userCoords.longitude,
                    }}
                    title={locationLabel}
                    pinColor={"#f8a25b"}
                />
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
