import React, {useState} from "react";

import {GoogleMap, MarkerF} from '@react-google-maps/api';
import {geocode, OutputFormat, RequestType} from "react-geocode";
import {Customer} from "../../domain/Customer";
import {GoogleMapScript} from "./GoogleMapScript";

export type Position = {
    lat: number,
    lng: number,
    addressLines?: string
}

interface InputMapProps {
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
            key: '',
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

    return (
        <>
            {GoogleMapScript() && <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                zoom={10}
                center={KyivCoordinates}
                onClick={handleMapClick}
                onLoad={loadMarkers}
            >
                {displayMarkers && props.customers.map((c, index) => {
                    if (c.latitude && c.longitude)
                        return (
                            <MarkerF
                                label={c.name}
                                position={{lat: c.latitude, lng: c.longitude}}
                            />
                        )
                })}
                {
                    displayMarkers && selectedPosition && <MarkerF
                        position={{lat: selectedPosition.lat, lng: selectedPosition.lng}}
                    />
                }
            </GoogleMap>}
        </>
    )
}