import React from "react";
import {Navigate} from "react-router-dom";
import {APIConfiguration, APIPath, ClientConfiguration} from "../../configuration/APIConfiguration";
import {RoutingSessionInfo, RoutingSessionInfoBean, routingSessionInfoColumns} from "../../domain/RoutingSession";
import axios from "axios";
import {RetrieveRoutingPage} from "../../pages/RetrieveRoutingPage";

interface RetrieveRoutingPageControllerState {
    routingSessionInfos: RoutingSessionInfo[],
    isLoaded: boolean,
    selectedRoutingSessionId?: number
}

export class RetrieveRoutingPageController extends React.Component {

    state: RetrieveRoutingPageControllerState = {
        routingSessionInfos: [],
        isLoaded: false,
        selectedRoutingSessionId: undefined
    }

    constructor(props: any) {
        super(props);
        this.handleSelectRoutingSession = this.handleSelectRoutingSession.bind(this)
    }

    async componentDidMount() {
        const response = await axios.get<RoutingSessionInfoBean[]>(APIPath + APIConfiguration.fetchRoutingSessionInfos.path)
        this.setState({
            routingSessionInfos: response.data.map((rsi) => new RoutingSessionInfo(rsi)),
            isLoaded: true
        })
    }

    handleSelectRoutingSession(rsi: RoutingSessionInfo) {
        this.setState({
            selectedRoutingSessionId: rsi.id
        })
    }

    render() {
        if (!this.state.isLoaded)
            return <h1>Loading...</h1>
        if (this.state.selectedRoutingSessionId)
            return <Navigate to={ClientConfiguration.existedRoutingPage.path.replace(':routingSessionId', this.state.selectedRoutingSessionId.toString())}/>
        return <RetrieveRoutingPage routingSessionInfos={this.state.routingSessionInfos} selectRoutingSessionHandler={this.handleSelectRoutingSession}/>
    }
}