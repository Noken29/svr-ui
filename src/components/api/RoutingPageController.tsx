import React from "react";
import {Vehicle} from "../../domain/Vehicle";
import {RoutingSession} from "../../domain/RoutingSession";
import axios from 'axios';
import {
    APIConfiguration,
    APIPath,
    ClientConfiguration
} from "../../configuration/APIConfiguration";
import RoutingPage from "../../pages/RoutingPage";
import {Navigate, redirect, useParams} from "react-router-dom";

interface RoutingPageControllerProps {
    routingSessionId?: number
}

interface RoutingPageControllerState {
    routingSession: RoutingSession,
    vehicles: Vehicle[],
    isLoaded: boolean,
    initialSave: boolean
}


class RoutingPageController extends React.Component<RoutingPageControllerProps, RoutingPageControllerState> {

    state: Readonly<RoutingPageControllerState> = {
        routingSession: new RoutingSession(),
        vehicles: [],
        isLoaded: false,
        initialSave: !this.props.routingSessionId
    }

    constructor(props: any, context: any) {
        super(props, context);
        this.handleSave = this.handleSave.bind(this)
    }

    async handleSave(rs: RoutingSession) {
        const response = await axios.post<RoutingSession>(APIPath + APIConfiguration.saveRoutingSession.path(this.props.routingSessionId), rs)
        this.setState({
            routingSession: response.data
        })
    }

    async componentDidMount() {
        const vehicles = await axios.get<Vehicle[]>(APIPath + APIConfiguration.fetchVehicles.path)
        this.setState({
            vehicles: vehicles.data,
        })
        if (this.props.routingSessionId) {
            const routingSession = await axios.get<RoutingSession>(APIPath + APIConfiguration.fetchRoutingSession.path(this.props.routingSessionId))
            this.setState({
                routingSession: routingSession.data
            })
        }
        this.setState({
            isLoaded: true
        })
    }

    render() {
        if (!this.state.isLoaded)
            return <h1>Loading...</h1>

        if (this.state.routingSession.id && this.state.initialSave)
            return <Navigate to={ClientConfiguration.existedRoutingPage.path.replace(':routingSessionId', this.state.routingSession.id.toString())}/>

        return (
            <>
                <RoutingPage
                    vehicles={this.state.vehicles}
                    routingSession={this.state.routingSession}
                    savingHandler={this.handleSave}
                />
            </>
        );
    }
}

export const NewRoutingSessionPage = () => {
    return <RoutingPageController/>
}

export const ExistedRoutingSessionPage = () => {
    let { routingSessionId } = useParams()

    if (routingSessionId && Number.parseInt(routingSessionId))
        return <RoutingPageController routingSessionId={Number.parseInt(routingSessionId)}/>
    return <h1>Not Found</h1>
}