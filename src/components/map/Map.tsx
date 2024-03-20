import React, {useState} from "react";

import {GoogleMap, MarkerF} from '@react-google-maps/api';
import {geocode, OutputFormat, RequestType} from "react-geocode";
import {Customer} from "../../domain/Customer";
import {GOOGLE_MAPS_API_KEY, GoogleMapScript} from "../../configuration/GoogleMapScript";
import {Depot} from "../../domain/Depot";
import {ColorScheme} from "../../styles/global";

export type Position = {
    lat: number,
    lng: number,
    addressLines?: string
}

interface InputMapProps {
    depot?: Depot
    customers: Customer[]
    selectedCustomer?: Customer
    processCoordinatesHandler: (pos: Position) => void
    selectionHandler: (c: Customer) => void
}

const KyivCoordinates: Position = {
    lat: 50.4567406605353,
    lng: 30.525140703293182
}

export const InputMap = (props: InputMapProps) => {
    const [displayMarkers, setDisplayMarkers] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState<Position>()

    const handleMapClick = async (e: any) => {
        let pos: Position = {lat: e.latLng.lat(), lng: e.latLng.lng(), addressLines: ''}
        await geocode(RequestType.LATLNG, pos.lat.toString() + ',' + pos.lng.toString(), {
            key: GOOGLE_MAPS_API_KEY,
            outputFormat: OutputFormat.JSON,
            language: 'uk',
            location_type: 'ROOFTOP'
        }).then(
            response => {
                pos.addressLines = response.results[0].formatted_address
                console.log(pos.addressLines)
            }
        );
        setSelectedPosition(pos)
        props.processCoordinatesHandler(pos)
    }

    const loadMarkers = () => {
        setDisplayMarkers(true)
    }

    const isLoaded = GoogleMapScript()

    if (!isLoaded) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                zoom={10}
                center={KyivCoordinates}
                onClick={handleMapClick}
                onLoad={loadMarkers}
            >
                {displayMarkers && props.depot &&
                        <MarkerF
                            label={{
                                text: 'Депо',
                                color: ColorScheme.GREEN_ACTIVE,
                                fontWeight: 'bold',
                            }}
                            position={{lat: props.depot.latitude, lng: props.depot.longitude}}
                            icon={{
                                path: 'M12 0C7.24 0 3 4.24 3 9c0 6.18 9 15 9 15s9-8.82 9-15c0-4.76-4.24-9-9-9zm0 13c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
                                fillColor: ColorScheme.GREEN_ACTIVE,
                                fillOpacity: 1,
                                strokeColor: ColorScheme.DARKBLUE_ACTIVE,
                                strokeWeight: 2,
                                scale: 1.2,
                                anchor: new window.google.maps.Point(13, 20),
                                labelOrigin: new google.maps.Point(13.5, -7)
                            }}
                        />
                }
                {displayMarkers && props.customers.map((c, index) => {
                    if (c.latitude && c.longitude)
                        return (
                            <MarkerF
                                label={{
                                    text: c.name,
                                    color: ColorScheme.BLUE_ACTIVE,
                                    fontWeight: 'bold'
                                }}
                                position={{lat: c.latitude, lng: c.longitude}}
                                icon={{
                                    path: 'M12 0C7.24 0 3 4.24 3 9c0 6.18 9 15 9 15s9-8.82 9-15c0-4.76-4.24-9-9-9zm0 13c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
                                    fillColor: ColorScheme.BLUE_ACTIVE,
                                    fillOpacity: 1,
                                    strokeColor: ColorScheme.DARKBLUE_ACTIVE,
                                    strokeWeight: 2,
                                    scale: 1.2,
                                    anchor: new window.google.maps.Point(13, 20),
                                    labelOrigin: new window.google.maps.Point(13.5, -7)
                                }}
                            />
                        )
                })}
                {
                    displayMarkers && selectedPosition && <MarkerF
                        position={{lat: selectedPosition.lat, lng: selectedPosition.lng}}
                        icon={{
                            path: 'M12 0C7.24 0 3 4.24 3 9c0 6.18 9 15 9 15s9-8.82 9-15c0-4.76-4.24-9-9-9zm0 13c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
                            fillColor: ColorScheme.WHITE_ACTIVE,
                            fillOpacity: 1,
                            strokeColor: ColorScheme.DARKBLUE_ACTIVE,
                            strokeWeight: 2,
                            scale: 1,
                            anchor: new window.google.maps.Point(13, 20)
                        }}
                    />
                }
            </GoogleMap>
        </>
    )
}