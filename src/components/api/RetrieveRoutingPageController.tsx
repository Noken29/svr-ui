import {
    ContainerItem,
    MainContainer, MainContainerBody,
    MainContainerHeader, PageFooter,
    PageHeader, SectionContainer,
    ToolbarContainer
} from "../../styles/page.styled";
import {ControlButton} from "../../styles/controls.styled";
import {DataTable} from "../table/DataTable";
import React, {useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {APIConfiguration, APIPath, ClientConfiguration} from "../../configuration/APIConfiguration";
import {RoutingSessionInfo, routingSessionInfoColumns} from "../../domain/RoutingSession";
import axios from "axios";

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
        const response = await axios.get<RoutingSessionInfo[]>(APIPath + APIConfiguration.fetchRoutingSessionInfos.path)
        console.log(response.data)
        this.setState({
            routingSessionInfos: response.data,
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
        return (
            <>
                <Link to={ClientConfiguration.mainMenuPage.path}>
                    <PageHeader>RouteMapper</PageHeader>
                </Link>
                <MainContainer>
                    <MainContainerHeader>
                        <ToolbarContainer>
                            <ContainerItem justifyContent={'flex-start'}>
                                <Link to={ClientConfiguration.newRoutingPage.path}>
                                    <ControlButton>Маршрутизація</ControlButton>
                                </Link>
                            </ContainerItem>
                        </ToolbarContainer>
                    </MainContainerHeader>
                    <MainContainerBody>
                        <SectionContainer direction={'row'}>
                            <DataTable
                                columns={routingSessionInfoColumns}
                                data={this.state.routingSessionInfos}
                                itemsPerTable={15}
                                selectionProps={{
                                    multipleSelection: false,
                                    selectionHandler: this.handleSelectRoutingSession
                                }}
                            />
                        </SectionContainer>
                    </MainContainerBody>
                </MainContainer>
                <PageFooter>RouteMapper</PageFooter>
            </>
        );
    }
}