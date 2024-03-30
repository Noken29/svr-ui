import React, {useCallback, useState} from "react";
import {Link} from "react-router-dom";
import {ClientConfiguration} from "../configuration/APIConfiguration";
import {
    ContainerItem,
    MainContainer,
    MainContainerBody,
    MainContainerHeader, PageFooter,
    PageHeader, SectionContainer,
    ToolbarContainer
} from "../styles/page.styled";
import {ControlButton} from "../styles/controls.styled";
import {DataTable} from "../components/table/DataTable";
import {routeColumns, Solution, solutionColumns} from "../domain/Solution";
import {RoutesMap} from "../components/map/RoutesMap";

interface RoutesPageProps {
    routingSessionId: number
    solutions: Solution[]
}

export const RoutesPage: React.FC<RoutesPageProps> = (props) => {
    const [selectedSolution, setSelectedSolution] = useState<Solution>()

    const selectSolutionHandler = (item: Solution) => {
        if (selectedSolution === item)
            setSelectedSolution(undefined)
        else
            setSelectedSolution(item)
    }

    return (
        <>
            <Link to={ClientConfiguration.mainMenuPage.path}>
                <PageHeader>RouteMapper</PageHeader>
            </Link>
            <MainContainer>
                <MainContainerHeader>
                    <ToolbarContainer>
                        <ContainerItem justifyContent={'flex-start'}>
                            <Link to={ClientConfiguration.existedRoutingPage.path.replace(':routingSessionId', props.routingSessionId.toString())}>
                                <ControlButton>Повернутися</ControlButton>
                            </Link>
                        </ContainerItem>
                    </ToolbarContainer>
                </MainContainerHeader>
                <MainContainerBody>
                    <SectionContainer direction={'row'}>
                        <DataTable
                            columns={solutionColumns}
                            data={props.solutions}
                            searchInputPlaceholder={'Введіть Номер/К-сть Маршрутів/...'}
                            itemsPerTable={5}
                            selectionProps={{
                                multipleSelection: false,
                                canUnSelect: true,
                                selectionHandler: selectSolutionHandler,
                            }}
                        />
                        {selectedSolution && props.solutions.map(s => <RoutesMap display={s === selectedSolution} solution={s}/>)}
                        {selectedSolution && (
                            <DataTable
                                columns={routeColumns}
                                data={selectedSolution?.routes}
                                searchInputPlaceholder={'Введіть Номер/ТЗ/...'}
                                itemsPerTable={5}
                            />)
                        }
                    </SectionContainer>
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}