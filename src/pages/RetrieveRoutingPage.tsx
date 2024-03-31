import React from "react";
import {Link} from "react-router-dom";
import {ClientConfiguration} from "../configuration/APIConfiguration";
import {
    ContainerItem,
    MainContainer,
    MainContainerBody,
    MainContainerHeader, PageFooter,
    PageHeader, SectionContainer, SectionHeader, SectionItem,
    ToolbarContainer
} from "../styles/page.styled";
import {ControlButton} from "../styles/controls.styled";
import {DataTable} from "../components/table/DataTable";
import {RoutingSessionInfo, routingSessionInfoColumns} from "../domain/RoutingSession";

interface RetrieveRoutingPageProps {
    routingSessionInfos: RoutingSessionInfo[]
    selectRoutingSessionHandler: (rsi: RoutingSessionInfo) => void
}

export const RetrieveRoutingPage: React.FC<RetrieveRoutingPageProps> = (props) => {
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
                        <SectionItem>
                            <SectionHeader>Сеанси Маршрутизації</SectionHeader>
                            <DataTable
                                columns={routingSessionInfoColumns}
                                data={props.routingSessionInfos}
                                searchInputPlaceholder={'Фільтр Номер/Назва/...'}
                                itemsPerTable={15}
                                selectionProps={{
                                    multipleSelection: false,
                                    canUnSelect: false,
                                    selectionHandler: props.selectRoutingSessionHandler
                                }}
                            />
                        </SectionItem>
                    </SectionContainer>
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}