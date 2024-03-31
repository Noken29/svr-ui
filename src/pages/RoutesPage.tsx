import React, {useState} from "react";
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
import {Route, routeColumns, Solution, solutionColumns} from "../domain/Solution";
import {RoutesMap} from "../components/map/RoutesMap";

interface RoutesPageProps {
    routingSessionId: number
    solutions: Solution[]
}

export const RoutesPage: React.FC<RoutesPageProps> = (props) => {
    const [selectedSolution, setSelectedSolution] = useState<Solution>()
    const [selectedRouteIndexes, setSelectedRouteIndexes] = useState<Map<string, number | undefined>>(new Map())

    const selectSolutionHandler = (item: Solution) => {
        if (selectedSolution === item) {
            setSelectedSolution(undefined)
        }
        else {
            setSelectedSolution(item)
        }
    }

    const selectRouteHandler = (item: Route) => {
        if (selectedSolution) {
            const newSelectedRouteIndexes = new Map(selectedRouteIndexes)
            if (newSelectedRouteIndexes.get(selectedSolution.key()) === item.index) {
                newSelectedRouteIndexes.set(selectedSolution.key(), undefined)
            } else {
                newSelectedRouteIndexes.set(selectedSolution.key(), item.index)
            }
            setSelectedRouteIndexes(newSelectedRouteIndexes)
        }
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
                        {props.solutions.map(s => {
                            return (
                                <>
                                    <RoutesMap
                                        key={s.key()}
                                        display={s === selectedSolution}
                                        solution={s}
                                    />
                                    <DataTable
                                        key={'routes_'+ s.key()}
                                        display={s === selectedSolution}
                                        columns={routeColumns}
                                        data={s.routes}
                                        searchInputPlaceholder={'Введіть Номер/ТЗ/...'}
                                        itemsPerTable={5}
                                        selectionProps={{
                                            multipleSelection: false,
                                            canUnSelect: true,
                                            selectionHandler: selectRouteHandler,
                                        }}
                                    />
                                    {s.routes.map(r => {
                                        return <RoutesMap
                                            key={r.key()}
                                            display={
                                                s === selectedSolution
                                                && r.index === selectedRouteIndexes.get(selectedSolution.key())
                                            }
                                            routeIndex={r.index}
                                            solution={s}
                                        />
                                    })}
                                </>
                            )
                        })}
                    </SectionContainer>
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}