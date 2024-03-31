import React, {useState} from "react";
import {KyivPosition, Position} from "./Utils";
import {CustomerMarker, DepotMarker, getRouteColorSchemeBasedOnIndex} from "./Marker";
import {Solution} from "../../domain/Solution";
import {DirectionsRenderer, DirectionsService, GoogleMap} from "@react-google-maps/api";
import {Customer} from "../../domain/Customer";
import {Depot} from "../../domain/Depot";

interface RoutesMapProps {
    display: boolean
    routeIndex?: number
    solution: Solution
}

export const RoutesMap = (props: RoutesMapProps) => {
    const [displayRoutes, setDisplayRoutes] = useState(false)

    const loadRoutes = () => {
        setDisplayRoutes(true)
    }

    if (props.routeIndex !== undefined)
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
                {displayRoutes && props.solution.depot && <DepotMarker depot={props.solution.depot}/>}
                {displayRoutes && (
                    <RouteDirection
                        displayCustomers={true}
                        routeIndex={props.routeIndex}
                        depot={props.solution.depot}
                        customers={props.solution.routes[props.routeIndex].customers}
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
            {displayRoutes && props.solution.depot && <DepotMarker depot={props.solution.depot}/>}
            {displayRoutes && props.solution.customers.map(c => {
                if (c.latitude && c.longitude)
                    return <CustomerMarker customer={c}/>
            })}
            {displayRoutes && props.solution.routes.map((r, index) => {
                return <RouteDirection
                    key={r.key()}
                    displayCustomers={false}
                    routeIndex={index}
                    depot={props.solution.depot}
                    customers={props.solution.routes[index].customers}
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