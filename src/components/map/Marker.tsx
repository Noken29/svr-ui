import React from "react";
import {ColorScheme} from "../../styles/global";
import {Depot} from "../../domain/Depot";
import {Customer} from "../../domain/Customer";
import {Position} from "./Utils";
import {MarkerF} from "@react-google-maps/api";

interface MarkerProps {
    text?: string,
    textAndFillColor: string,
    strokeColor: string,
    latitude: number,
    longitude: number,
}

export const MarkerIconPath = 'M12 0C7.24 0 3 4.24 3 9c0 6.18 9 15 9 15s9-8.82 9-15c0-4.76-4.24-9-9-9zm0 13c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z';

export const Marker: React.FC<MarkerProps> = (props) => {

    if (props.text)
        return <MarkerF
            label={{
                text: props.text,
                color: props.textAndFillColor,
                fontWeight: 'bold',
            }}
            position={{lat: props.latitude, lng: props.longitude}}
            icon={{
                path: MarkerIconPath,
                fillColor: props.textAndFillColor,
                fillOpacity: 1,
                strokeColor: props.strokeColor,
                strokeWeight: 2,
                scale: 1.2,
                anchor: new window.google.maps.Point(13, 20),
                labelOrigin: new window.google.maps.Point(13.5, -7)
            }}
        />

    return <MarkerF
        position={{lat: props.latitude, lng: props.longitude}}
        icon={{
            path: MarkerIconPath,
            fillColor: props.textAndFillColor,
            fillOpacity: 1,
            strokeColor: props.strokeColor,
            strokeWeight: 2,
            scale: 1.2,
            anchor: new window.google.maps.Point(13, 20)
        }}
    />
}

interface SelectedPositionMarkerProps {
    position: Position
}

export const SelectedPositionMarker: React.FC<SelectedPositionMarkerProps> = (props) => {
    return <Marker
        text={''}
        textAndFillColor={ColorScheme.WHITE_ACTIVE}
        strokeColor={ColorScheme.DARKBLUE_ACTIVE}
        latitude={props.position.lat}
        longitude={props.position.lng}
    />
}

interface DepotMarkerProps {
    depot: Depot
}

export const DepotMarker: React.FC<DepotMarkerProps> = (props) => {
    return <Marker
        text={'Депо'}
        textAndFillColor={ColorScheme.GREEN_ACTIVE}
        strokeColor={ColorScheme.DARKBLUE_ACTIVE}
        latitude={props.depot.latitude}
        longitude={props.depot.longitude}
    />
}

interface CustomerMarkerProps {
    customer: Customer
    routeIndex?: number
}

export const CustomerMarker: React.FC<CustomerMarkerProps> = (props) => {
    const colorScheme = props.routeIndex ?
        getRouteColorSchemeBasedOnIndex(props.routeIndex) :
        {textAndFillColor: ColorScheme.BLUE_ACTIVE, strokeColor: ColorScheme.DARKBLUE_ACTIVE}

    return <Marker
        text={props.customer.name}
        textAndFillColor={colorScheme.textAndFillColor}
        strokeColor={colorScheme.strokeColor}
        latitude={props.customer.latitude}
        longitude={props.customer.longitude}
    />
}

const routeColorSchemes = [
    { textAndFillColor: '#385170', strokeColor: '#142D4C' },
    { textAndFillColor: '#B53770', strokeColor: '#4C142D' },
    { textAndFillColor: '#704D38', strokeColor: '#4C2D14' },
    { textAndFillColor: '#42bcbd', strokeColor: '#0c4359' },
    { textAndFillColor: '#773e1e', strokeColor: '#4C1F14' },
    { textAndFillColor: '#9fc4d9', strokeColor: '#374d5d' },
    { textAndFillColor: '#644e48', strokeColor: '#592831' },
    { textAndFillColor: '#7042A8', strokeColor: '#220b46' },
    { textAndFillColor: '#1b6212', strokeColor: '#0f4242' },
    { textAndFillColor: '#6cff8f', strokeColor: '#043b0c' },
    { textAndFillColor: '#708438', strokeColor: '#37480d' }
];

export function getRouteColorSchemeBasedOnIndex(routeIndex: number) {
    return routeColorSchemes[routeIndex % (routeColorSchemes.length)]
}
