import React, {useCallback, useEffect, useState} from "react";
import {Customer, customerColumns} from "../domain/Customer";
import {Package, packageColumns} from "../domain/Package";
import {
    ContainerItem, Control,
    MainContainer,
    MainContainerBody,
    MainContainerHeader, PageFooter,
    PageHeader, SectionContainer,
    ToolbarContainer
} from "../styles/page.styled";
import {ControlButton} from "../styles/controls.styled";
import {DataTable} from "../components/table/DataTable";
import {Vehicle, vehicleColumns} from "../domain/Vehicle";
import CustomerForm from "../components/form/CustomerForm";
import PackageForm from "../components/form/PackageForm";
import {RoutingSession} from "../domain/RoutingSession";
import {ClientConfiguration} from "../configuration/APIConfiguration";
import {Link} from "react-router-dom";
import {RoutingSessionCard} from "../components/form/RoutingSessionCard";
import {InputMap} from "../components/map/Map";

interface RoutingPageProps {
    routingSession: RoutingSession,
    vehicles: Vehicle[]
    savingHandler: (rs: RoutingSession) => void
}

const RoutingPage: React.FC<RoutingPageProps> = (props) => {
    const [customers, setCustomers] = useState<Customer[]>(props.routingSession.customers)
    const [vehicles, setVehicles] = useState<Vehicle[]>(props.vehicles)

    const [selectedCustomer, setSelectedCustomer] = useState<Customer>()
    const [packages, setPackages] = useState<Package[]>([])

    const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>(props.routingSession.vehicles)

    const handleAddCustomer = (c: Customer) => {
        setCustomers((prevState) => [...prevState, c])
    }
    const handleRemoveCustomer = (c: Customer) => {
        setSelectedCustomer(undefined)
        setCustomers(customers.filter(e => e !== c))
    }
    const handleSelectCustomer = (c: Customer) => {
        if (selectedCustomer !== c) {
            setSelectedCustomer(c)
            setPackages(c.packages)
        } else {
            setSelectedCustomer(undefined)
            setPackages([])
        }
    }
    const handleAddPackage = (p: Package) => {
        if (selectedCustomer !== undefined) {
            selectedCustomer.packages = [p, ...selectedCustomer.packages]
            setPackages(selectedCustomer.packages)
        }
    }
    const handleRemovePackage = (p: Package) => {
        if (selectedCustomer !== undefined) {
            selectedCustomer.packages = selectedCustomer.packages.filter(e => e !== p)
            setPackages(selectedCustomer.packages)
        }
    }
    const handleSelectVehicle = (v: Vehicle) => {
        if (selectedVehicles.indexOf(v) === -1)
            setSelectedVehicles((prevState) => [...prevState, v])
        else
            setSelectedVehicles(selectedVehicles.filter(e => e !== v))
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
                            <ControlButton
                                onClick={() => props.savingHandler(
                                    new RoutingSession().setAll('', Date.now(), selectedVehicles, customers)
                                )}
                            >Зберегти
                            </ControlButton>
                        </ContainerItem>
                        <ContainerItem justifyContent={'flex-end'}>
                            <ControlButton margin={'0 10px 0 0'} disabled={true}>Маршрути</ControlButton>
                            <ControlButton>Побудувати Маршрути</ControlButton>
                        </ContainerItem>
                    </ToolbarContainer>
                </MainContainerHeader>
                <MainContainerBody>
                    <SectionContainer direction={'column'}>
                        <RoutingSessionCard lastSaved={props.routingSession.lastSaved}/>
                    </SectionContainer>
                    <SectionContainer direction={'column'}>
                        <CustomerForm
                            addingHandler={handleAddCustomer}
                        />
                        <InputMap/>
                    </SectionContainer>
                    <SectionContainer direction={'row'}>
                        <DataTable
                            columns={customerColumns}
                            data={customers}
                            itemsPerTable={5}
                            selectionProps={{
                                multipleSelection: false,
                                selectionHandler: handleSelectCustomer
                            }}
                            removingHandler={handleRemoveCustomer}
                        />
                    </SectionContainer>
                    {selectedCustomer !== undefined && (
                        <SectionContainer direction={'column'}>
                            <PackageForm
                                addingHandler={handleAddPackage}
                            />
                        </SectionContainer>
                        )
                    }
                    {selectedCustomer !== undefined && (
                        <SectionContainer direction={'row'}>
                            <DataTable
                                columns={packageColumns}
                                data={selectedCustomer?.packages}
                                itemsPerTable={5}
                                removingHandler={handleRemovePackage}
                            />
                        </SectionContainer>
                    )}
                    <SectionContainer direction={'row'}>
                        <DataTable
                            columns={vehicleColumns}
                            data={vehicles}
                            itemsPerTable={10}
                            selectionProps={{
                                multipleSelection: true,
                                selectionHandler: handleSelectVehicle,
                                selectedItems: selectedVehicles
                            }}
                        />
                    </SectionContainer>
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}

export default RoutingPage