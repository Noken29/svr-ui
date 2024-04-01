import React, {useState} from "react";
import {CustomerMarker, DepotMarker} from "./Marker";
import {Solution} from "../../domain/Solution";
import {GoogleMap} from "@react-google-maps/api";
import {ColorScheme} from "../../styles/global";
import {RouteDirection} from "./Direction";

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
                    height: '650px',
                    display: (props.display ? 'block' : 'none'),
                    boxSizing: 'border-box',
                    borderRadius: '10px',
                    border: '3px solid' + ColorScheme.LIGHTCYAN,
                }}
                zoom={10}
                center={props.solution.depot.asPosition()}
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
                height: '650px',
                display: (props.display ? 'block' : 'none'),
                boxSizing: 'border-box',
                borderRadius: '10px',
                border: '3px solid' + ColorScheme.LIGHTCYAN,
            }}
            zoom={10}
            center={props.solution.depot.asPosition()}
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