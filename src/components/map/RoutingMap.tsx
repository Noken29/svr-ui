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
    processCoordinatesHandler: (pos: Position) => void
    selectionHandler: (c: Customer) => void
}

export const RoutingMap = (props: RoutingMapProps) => {
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
            }
        );
        setSelectedPosition(pos)
        props.processCoordinatesHandler(pos)
    }

    const loadMarkers = () => {
        setDisplayMarkers(true)
    }

    return (
        <GoogleMap
            mapContainerStyle={{
                height: '100%',
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