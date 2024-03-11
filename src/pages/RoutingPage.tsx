import React, {useState} from "react";
import {Customer, CustomerBean, customerColumns} from "../domain/Customer";
import {Package, PackageBean, packageColumns} from "../domain/Package";
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
import {Vehicle, vehicleColumns} from "../domain/Vehicle";
import CustomerForm from "../components/form/CustomerForm";
import PackageForm from "../components/form/PackageForm";
import {RoutingSession, RoutingSessionBean, RoutingSessionMainInfoBean} from "../domain/RoutingSession";
import {ClientConfiguration} from "../configuration/APIConfiguration";
import {Link} from "react-router-dom";
import {RoutingSessionMainInfoForm} from "../components/form/RoutingSessionMainInfoForm";
import {InputMap, Position} from "../components/map/Map";
import {Depot} from "../domain/Depot";

interface RoutingPageProps {
    routingSession?: RoutingSession,
    vehicles: Vehicle[]
    savingHandler: (rs: RoutingSessionBean) => void
}

const RoutingPage: React.FC<RoutingPageProps> = (props) => {
    const [depot, setDepot] = useState(props.routingSession?.depot)
    const [description, setDescription] = useState(props.routingSession?.description)

    const [customers, setCustomers] = useState<Customer[]>(props.routingSession?.customers ?? [])
    const [vehicles, setVehicles] = useState<Vehicle[]>(props.vehicles)

    const [selectedCustomer, setSelectedCustomer] = useState<Customer>()
    const [packages, setPackages] = useState<Package[]>([])

    const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>(
        props.routingSession ? props.vehicles.filter(v => v.id && props.routingSession?.vehicleIds.has(v.id)) : []
    )

    const [position, setPosition] = useState<Position>()

    const handleAddMainInfo = (r: RoutingSessionMainInfoBean) => {
        setDepot(new Depot(r.depot))
        setDescription(r.description)
    }

    const handleAddCustomer = (c: CustomerBean) => {
        setCustomers((prevState) => [...prevState, new Customer(c)])
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
    const handleAddPackage = (p: PackageBean) => {
        if (selectedCustomer !== undefined) {
            selectedCustomer.packages = [new Package(p), ...selectedCustomer.packages]
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
    const handleChangeCustomerForm = () => {
        setSelectedCustomer(undefined)
    }

    const handleChangeCoordinates = (pos: Position) => {
        setPosition(pos)
    }

    const buildRoutingSessionBean = () => {
        return {
            description: description,
            lastSaved: Date.now(),
            depot: depot?.asBean(),
            customers: customers.map((c) => c.asBean()),
            vehicleIds: selectedVehicles.map((v) => v.id)
        } as RoutingSessionBean
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
                            <ControlButton onClick={() => props.savingHandler(buildRoutingSessionBean())}>
                                Зберегти
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
                        <RoutingSessionMainInfoForm
                            addingHandler={handleAddMainInfo}
                            lastSaved={props.routingSession?.lastSaved ?? 'Не збережено'}
                            position={position}
                        />
                    </SectionContainer>
                    <SectionContainer direction={'column'}>
                        <CustomerForm
                            addingHandler={handleAddCustomer}
                            onChangeHandler={handleChangeCustomerForm}
                            position={position}
                        />
                        <InputMap
                            depot={depot}
                            customers={customers}
                            selectedCustomer={selectedCustomer}
                            processCoordinatesHandler={handleChangeCoordinates}
                            selectionHandler={handleSelectCustomer}
                        />
                    </SectionContainer>
                    <SectionContainer direction={'row'}>
                        <DataTable<Customer>
                            columns={customerColumns}
                            data={customers}
                            selectedData={selectedCustomer ? [selectedCustomer] : []}
                            searchInputPlaceholder={'Фільтр Ім\'я/Номер Телефону/...'}
                            itemsPerTable={5}
                            selectionProps={{
                                multipleSelection: false,
                                canUnSelect: true,
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
                            <DataTable<Package>
                                columns={packageColumns}
                                data={selectedCustomer?.packages}
                                searchInputPlaceholder={'Фільтр Тип/Вага/Об\'єм/...'}
                                itemsPerTable={5}
                                removingHandler={handleRemovePackage}
                            />
                        </SectionContainer>
                    )}
                    <SectionContainer direction={'row'}>
                        <DataTable<Vehicle>
                            columns={vehicleColumns}
                            data={vehicles}
                            selectedData={selectedVehicles}
                            searchInputPlaceholder={'Фільтр Марка/Модель/...'}
                            itemsPerTable={10}
                            selectionProps={{
                                multipleSelection: true,
                                canUnSelect: true,
                                selectionHandler: handleSelectVehicle
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