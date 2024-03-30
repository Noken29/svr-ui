import React from "react";
import {RoutesPage} from "../../pages/RoutesPage";
import axios from "axios";
import {APIConfiguration, APIPath} from "../../configuration/APIConfiguration";
import {Solution, SolutionBean} from "../../domain/Solution";
import {useParams} from "react-router-dom";

interface RoutesPageControllerProps {
    routingSessionId: number
}

interface RoutesPageControllerState {
    solutions: Solution[]
    isLoaded: boolean
}

export class RoutesPageController extends React.Component<RoutesPageControllerProps, RoutesPageControllerState> {

    state: Readonly<RoutesPageControllerState> = {
        solutions: [],
        isLoaded: false
    }

    async componentDidMount() {
        const solutions = await axios.get<SolutionBean[]>(APIPath + APIConfiguration.getRoutes.path(this.props.routingSessionId))
        let s = solutions.data.map(s => new Solution(s))
        this.setState({
            solutions: solutions.data.map(s => new Solution(s))
        })
        this.setState({
            isLoaded: true
        })
    }

    render() {
        if (!this.state.isLoaded)
            return <h1>Loading...</h1>
        return <RoutesPage
            routingSessionId={this.props.routingSessionId}
            solutions={this.state.solutions}
        />;
    }
}

export const RoutesPageForRoutingSession: React.FC = () => {
    let { routingSessionId } = useParams()

    if (routingSessionId && Number.parseInt(routingSessionId))
        return <RoutesPageController routingSessionId={Number.parseInt(routingSessionId)}/>
    return <h1>Not Found</h1>
}