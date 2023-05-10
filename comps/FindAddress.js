import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function FindAddress() {
    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const pKey = 'YOUR_API_KEY';

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission to get location')
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setCoordinates({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
        })();
    }, []);

    const handleSearch = async () => {
        const response = await fetch(
            `https://www.mapquestapi.com/geocoding/v1/address?key=${pKey}&location=${location}`
        );
        const data = await response.json();
        setCoordinates(data.results[0].locations[0].latLng);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={{ width: '100%', height: '90%', marginBottom: 10 }}
                initialRegion={{
                    latitude: 60.200692,
                    longitude: 24.934302,
                    latitudeDelta: 0.0500,
                    longitudeDelta: 0.0500,
                }}>
                <Marker
                    coordinate={{
                        latitude: coordinates.lat,
                        longitude: coordinates.lng
                    }}
                    title={location} />
            </MapView>

            <TextInput
                value={location}
                onChangeText={setLocation}
                style={{ borderWidth: 1, height: 20, width: 220 }}
            />
            <Button title="Search" onPress={handleSearch} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 20
    },
});