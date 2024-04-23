import React, {useState} from "react";

import {geocode, OutputFormat, RequestType} from "react-geocode";
import {Customer} from "../../domain/Customer";
import {GOOGLE_MAPS_API_KEY} from "../../configuration/GoogleMapsAPIConfiguration";
import {Depot} from "../../domain/Depot";
import {CustomerMarker, DepotMarker, SelectedPositionMarker} from "./Marker";
import {KyivPosition, Position} from "../../domain/Position";
import {GoogleMap} from "@react-google-maps/api";
import {ColorScheme} from "../../styles/global";

interface RoutingMapProps {
    depot?: Depot
    customers: Customer[]
    selectedCustomer?: Customer
    processCoordinatesHandler: (pos: Position, isGeocodingFailed: boolean) => void
    selectionHandler: (c: Customer) => void
}

export const RoutingMap = (props: RoutingMapProps) => {
    const [displayMarkers, setDisplayMarkers] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState<Position>()

    const handleMapClick = async (e: any) => {
        let pos: Position = {lat: e.latLng.lat(), lng: e.latLng.lng(), addressLines: ''}
        let geocodingFailed = false
        await geocode(RequestType.LATLNG, pos.lat.toString() + ',' + pos.lng.toString(), {
            key: GOOGLE_MAPS_API_KEY,
            outputFormat: OutputFormat.JSON,
            language: 'uk',
            location_type: 'ROOFTOP'
        }).then(
            response => pos.addressLines = response.results[0].formatted_address
        ).catch(
            error => {
                geocodingFailed = true
                pos.addressLines = 'Не вказано'
            }
        ).finally(
            () => props.processCoordinatesHandler(pos, geocodingFailed)
        );
        setSelectedPosition(pos)
    }

    const loadMarkers = () => {
        setDisplayMarkers(true)
    }

    return (
        <GoogleMap
            mapContainerStyle={{
                height: '650px',
                boxSizing: 'border-box',
                borderRadius: '10px',
                border: '3px solid' + ColorScheme.LIGHTCYAN,
            }}
            zoom={10}
            center={props.depot?.asPosition() ?? KyivPosition}
            onClick={handleMapClick}
            onLoad={loadMarkers}
        >
            {displayMarkers && props.depot && <DepotMarker depot={props.depot}/>}
            {displayMarkers && props.customers.map(c => {if (c.latitude && c.longitude) return <CustomerMarker customer={c}/>})}
            {displayMarkers && selectedPosition && <SelectedPositionMarker position={selectedPosition}/>}
        </GoogleMap>
    )
}

// apiKey={GOOGLE_MAPS_API_KEY} libraries={['geometry', 'drawing', 'places', 'geocoding', 'routes']}