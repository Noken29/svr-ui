import React from "react";
import {Vehicle, VehicleBean} from "../../domain/Vehicle";
import {
    RoutingSession, RoutingSessionBean
} from "../../domain/RoutingSession";
import axios from 'axios';
import {
    APIConfiguration,
    APIPath,
    ClientConfiguration
} from "../../configuration/APIConfiguration";
import RoutingPage from "../../pages/RoutingPage";
import {Navigate, useParams} from "react-router-dom";

interface RoutingPageControllerProps {
    routingSessionId?: number
}

interface RoutingPageControllerState {
    routingSession?: RoutingSession,
    vehicles: Vehicle[],
    isLoaded: boolean,
    initialSave: boolean,
    haveSolutions: boolean
}

class RoutingPageController extends React.Component<RoutingPageControllerProps, RoutingPageControllerState> {

    state: Readonly<RoutingPageControllerState> = {
        vehicles: [],
        isLoaded: false,
        initialSave: !this.props.routingSessionId,
        haveSolutions: false
    }

    constructor(props: any, context: any) {
        super(props, context);
        this.handleSave = this.handleSave.bind(this)
        this.handleMakeRoutes = this.handleMakeRoutes.bind(this)
    }

    async handleSave(rsb: RoutingSessionBean) {
        const response = await axios.post(APIPath + APIConfiguration.saveRoutingSession.path(this.props.routingSessionId), rsb)
        this.setState({
            routingSession: new RoutingSession(response.data)
        })
        return true
    }

    async handleMakeRoutes() {
        const response = await axios.get(APIPath + APIConfiguration.makeRoutes.path(this.props.routingSessionId))
        this.setState({
            haveSolutions: this.state.haveSolutions || response.data
        })
    }

    async componentDidMount() {
        const vehicles = await axios.get<VehicleBean[]>(APIPath + APIConfiguration.fetchVehicles.path)
        this.setState({
            vehicles: vehicles.data.map((v) => new Vehicle(v)),
        })
        if (this.props.routingSessionId) {
            const response = await axios.get<RoutingSessionBean>(APIPath + APIConfiguration.fetchRoutingSession.path(this.props.routingSessionId))
            this.setState({
                routingSession: new RoutingSession(response.data),
                haveSolutions: response.data.haveSolutions
            })
        }
        this.setState({
            isLoaded: true
        })
    }

    render() {
        if (!this.state.isLoaded)
            return <h1>Loading...</h1>

        if (this.state.routingSession?.id && this.state.initialSave)
            return <Navigate to={ClientConfiguration.existedRoutingPage.path.replace(':routingSessionId', this.state.routingSession.id.toString())}/>

        return <RoutingPage
            vehicles={this.state.vehicles}
            routingSession={this.state.routingSession}
            savingHandler={this.handleSave}
            haveSolutions={this.state.haveSolutions}
            makeRoutesHandler={this.handleMakeRoutes}
        />
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