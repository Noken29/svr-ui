import React, {useState} from "react";
import {KyivPosition, mapRouteCustomers, mapRoutePositions, Position} from "./Utils";
import {CustomerMarker, DepotMarker, getRouteColorSchemeBasedOnIndex} from "./Marker";
import {SolutionData} from "../../domain/Solution";
import {DirectionsRenderer, DirectionsService, GoogleMap} from "@react-google-maps/api";
import {Customer} from "../../domain/Customer";
import {Depot} from "../../domain/Depot";

interface RoutesMapProps {
    display: boolean
    routeIndex?: number
    data: SolutionData
}

export const RoutesMap = (props: RoutesMapProps) => {
    const [displayRoutes, setDisplayRoutes] = useState(false)

    const loadRoutes = () => {
        setDisplayRoutes(true)
    }

    if (props.routeIndex)
        return (
            <GoogleMap
                mapContainerStyle={{
                    height: '500px',
                    width: '100%',
                    display: (props.display ? 'block' : 'none')
                }}
                zoom={10}
                center={KyivPosition}
                onLoad={loadRoutes}
            >
                {displayRoutes && props.data.depot && <DepotMarker depot={props.data.depot}/>}
                {displayRoutes && (
                    <RouteDirection
                        displayCustomers={true}
                        routeIndex={props.routeIndex}
                        depot={props.data.depot}
                        customers={props.data.customers}
                        customerIds={props.data.routes[props.routeIndex].customersIds}
                    />
                )}
            </GoogleMap>
        )

    return (
        <GoogleMap
            mapContainerStyle={{
                height: '500px',
                width: '100%',
                display: (props.display ? 'block' : 'none')
            }}
            zoom={10}
            center={KyivPosition}
            onLoad={loadRoutes}
        >
            {displayRoutes && props.data.depot && <DepotMarker depot={props.data.depot}/>}
            {displayRoutes && props.data.customers.map(c => {
                if (c.latitude && c.longitude)
                    return <CustomerMarker customer={c}/>
            })}
            {displayRoutes && props.data.routes.map((r, index) => {
                return <RouteDirection
                    displayCustomers={false}
                    routeIndex={index}
                    depot={props.data.depot}
                    customers={props.data.customers}
                    customerIds={r.customersIds}
                />
            })}
        </GoogleMap>
    )
}

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
    customerIds: number[]
}

export const RouteDirection: React.FC<RouteDirectionProps> = (props) => {
    const [customers, ] = useState(
        mapRouteCustomers(
            props.customers,
            props.customerIds
        )
    )
    const [positions, ] = useState(
        mapRoutePositions(
            props.depot,
            props.customers,
            props.customerIds
        )
    )

    return (
        <>
            {props.displayCustomers && customers.map(c => {
                if (c.latitude && c.longitude)
                    return <CustomerMarker customer={c} routeIndex={props.routeIndex}/>
            })}
            {positions.map((p, index) => {
                if (index + 1 < positions.length) {
                    return <SingleDirection routeIndex={props.routeIndex} from={positions[index]} to={positions[index + 1]}/>
                }
            })}
        </>
    )
}