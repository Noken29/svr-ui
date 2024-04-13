import React, {useState} from "react";
import {Link} from "react-router-dom";
import {ClientConfiguration} from "../configuration/APIConfiguration";
import {
    ConditionalSectionItem,
    ContainerItem,
    MainContainer,
    MainContainerBody,
    MainContainerHeader, PageFooter,
    PageHeader, SectionContainer, SectionHeader, SectionItem,
    ToolbarContainer
} from "../styles/page.styled";
import {ControlButton} from "../styles/controls.styled";
import {DataTable} from "../components/table/DataTable";
import {Route, routeColumns, Solution, solutionColumns} from "../domain/Solution";
import {RoutesMap} from "../components/map/RoutesMap";
import {Customer, customerColumns} from "../domain/Customer";
import {packageColumns} from "../domain/Package";

interface RoutesPageProps {
    routingSessionId: number
    solutions: Solution[]
}

export const RoutesPage: React.FC<RoutesPageProps> = (props) => {
    const [selectedSolution, setSelectedSolution] = useState<Solution>()
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>()
    const [selectedRouteIndexes, setSelectedRouteIndexes] = useState<Map<string, number | undefined>>(new Map())

    const [selectedCustomer, setSelectedCustomer] = useState<Customer>()

    const selectSolutionHandler = (item: Solution) => {
        if (selectedSolution === item) {
            setSelectedSolution(undefined)
            setSelectedRouteIndex(undefined)
        }
        else {
            setSelectedSolution(item)
            setSelectedRouteIndex(selectedRouteIndexes.get(item.key()))
        }
        setSelectedCustomer(undefined)
    }

    const selectRouteHandler = (item: Route) => {
        if (selectedSolution) {
            const newSelectedRouteIndexes = new Map(selectedRouteIndexes)
            if (newSelectedRouteIndexes.get(selectedSolution.key()) === item.index) {
                newSelectedRouteIndexes.set(selectedSolution.key(), undefined)
                setSelectedRouteIndex(undefined)
            } else {
                newSelectedRouteIndexes.set(selectedSolution.key(), item.index)
                setSelectedRouteIndex(item.index)
            }
            setSelectedRouteIndexes(newSelectedRouteIndexes)
        }
        setSelectedCustomer(undefined)
    }

    const handleSelectCustomer = (c: Customer) => {
        if (selectedCustomer !== c) {
            setSelectedCustomer(c)
        } else {
            setSelectedCustomer(undefined)
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
                        <SectionItem>
                            <SectionHeader>Таблиця Розв'язків</SectionHeader>
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
                        </SectionItem>
                        {props.solutions.map(s => {
                            return (
                                <ConditionalSectionItem display={s === selectedSolution}>
                                    {s === selectedSolution && <SectionHeader>Розв'язок №{selectedSolution?.id}: Маршрути</SectionHeader>}
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
                                </ConditionalSectionItem>
                            )
                        })}
                    </SectionContainer>
                    {selectedSolution !== undefined && selectedRouteIndexes.get(selectedSolution.key()) === undefined && (
                        <SectionContainer direction={'row'}>
                            <SectionItem>
                                <SectionHeader>Розв'язок №{selectedSolution?.id}: Клієнти</SectionHeader>
                                <DataTable
                                    columns={customerColumns}
                                    data={selectedSolution.customers}
                                    searchInputPlaceholder={'Фільтр Ім\'я/Номер Телефону/...'}
                                    itemsPerTable={5}
                                    selectionProps={{
                                        multipleSelection: false,
                                        canUnSelect: true,
                                        selectionHandler: handleSelectCustomer
                                    }}
                                />
                            </SectionItem>
                            {selectedCustomer && (
                                <SectionItem>
                                    <SectionHeader>Розв'язок №{selectedSolution?.id}, Клієнт - {selectedCustomer.name}: Вантажі</SectionHeader>
                                    <DataTable
                                        columns={packageColumns}
                                        data={selectedCustomer?.packages}
                                        searchInputPlaceholder={'Фільтр Тип/Вага/Об\'єм/...'}
                                        itemsPerTable={5}
                                    />
                                </SectionItem>
                            )}
                        </SectionContainer>
                    )}
                    {selectedSolution && selectedRouteIndexes.get(selectedSolution.key()) !== undefined && selectedRouteIndex !== undefined && (
                        <SectionContainer direction={'row'}>
                            <SectionItem>
                                <SectionHeader>Розв'язок №{selectedSolution?.id}, Маршрут №{selectedRouteIndex + 1}: Клієнти</SectionHeader>
                                <DataTable
                                    columns={customerColumns}
                                    data={selectedSolution.routes[selectedRouteIndex].customers}
                                    searchInputPlaceholder={'Фільтр Ім\'я/Номер Телефону/...'}
                                    itemsPerTable={5}
                                    selectionProps={{
                                        multipleSelection: false,
                                        canUnSelect: true,
                                        selectionHandler: handleSelectCustomer
                                    }}
                                />
                            </SectionItem>
                            {selectedCustomer && (
                                <SectionItem>
                                    <SectionHeader>Розв'язок №{selectedSolution?.id}, Маршрут №{selectedRouteIndex + 1}, Клієнт - {selectedCustomer.name}: Вантажі</SectionHeader>
                                    <DataTable
                                        columns={packageColumns}
                                        data={selectedCustomer.packages}
                                        searchInputPlaceholder={'Фільтр Тип/Вага/Об\'єм/...'}
                                        itemsPerTable={5}
                                    />
                                </SectionItem>
                            )}
                        </SectionContainer>
                    )}
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}