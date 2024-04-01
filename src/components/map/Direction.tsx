import React, {useState} from "react";
import {DirectionsRenderer, DirectionsService} from "@react-google-maps/api";
import {CustomerMarker, getRouteColorSchemeBasedOnIndex} from "./Marker";
import {Depot} from "../../domain/Depot";
import {Customer} from "../../domain/Customer";
import {Position} from "google-map-react";

interface SingleDirectionProps {
    routeIndex: number
    from: Position
    to: Position
}

const SingleDirection: React.FC<SingleDirectionProps> = (props) => {
    const [response, setResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [loaded, setLoaded] = useState(false)

    const directionsCallback = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === google.maps.DirectionsStatus.OK)
            setResponse(result)
        else
            console.error(`Error fetching direction: ${result}`);
    }

    const directionsResult = {directions: response}

    return (
        <>
            {directionsResult.directions && (
                <DirectionsRenderer
                    options={{
                        directions: directionsResult.directions,
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: getRouteColorSchemeBasedOnIndex(props.routeIndex).textAndFillColor
                        }
                    }}
                />
            )}
            {!loaded && (
                <DirectionsService
                    options={{
                        origin: props.from,
                        destination: props.to,
                        travelMode: window.google.maps.TravelMode.DRIVING
                    }}
                    callback={directionsCallback}
                    onLoad={() => setLoaded(true)}
                />)}
        </>
    )
}

interface RouteDirectionProps {
    displayCustomers: boolean
    routeIndex: number
    depot: Depot
    customers: Customer[]
}

export const RouteDirection: React.FC<RouteDirectionProps> = (props) => {

    return (
        <>
            {props.displayCustomers && props.customers.map((c, index) => {
                if (c.latitude && c.longitude)
                    return <CustomerMarker customer={c} routeIndex={props.routeIndex} textOverride={`#${index+1}: ${c.name}`}/>
            })}
            <SingleDirection routeIndex={props.routeIndex} from={props.depot.asPosition()} to={props.customers[0].asPosition()}/>
            {props.customers.map((c, index) => {
                if (index + 1 < props.customers.length) {
                    return <SingleDirection
                        key={c.id}
                        routeIndex={props.routeIndex}
                        from={props.customers[index].asPosition()}
                        to={props.customers[index + 1].asPosition()}
                    />
                }
            })}
            <SingleDirection routeIndex={props.routeIndex} from={props.depot.asPosition()} to={props.customers[props.customers.length - 1].asPosition()}/>
        </>
    )
}