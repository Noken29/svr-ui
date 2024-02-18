import React, {useState} from "react";

import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import {geocode, OutputFormat, RequestType} from "react-geocode";

export const InputMap = (props: any) => {
    const [markers, setMarkers] = useState<{lat: number, lng: number}[]>([])

    const handleMapClick = (e: any) => {
        const newMarker = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkers([...markers, newMarker])
        geocode(RequestType.LATLNG, newMarker.lat.toString() + ',' + newMarker.lng.toString(), {
            key: '',
            outputFormat: OutputFormat.JSON,
            language: 'uk',
            location_type: 'ROOFTOP'
        }).then(
            response => {
                const address = response.results[0].formatted_address;
                console.log(address);
            },
            error => {
                console.error(error);
            }
        );
    }

    return (
        <LoadScript googleMapsApiKey=''>
            <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                zoom={10}
                center={markers.length ? markers[-1] : { lat: 50.4567406605353, lng: 30.525140703293182 }}
                onClick={handleMapClick}
            >
                {markers.map((marker, index) => (
                    <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
                ))}
            </GoogleMap>
        </LoadScript>
    )
}