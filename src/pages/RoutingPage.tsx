import React, {useState} from "react";
import {Customer, CustomerBean, customerColumns} from "../domain/Customer";
import {Package, PackageBean, packageColumns} from "../domain/Package";
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
import {Vehicle, vehicleColumns} from "../domain/Vehicle";
import CustomerForm from "../components/form/CustomerForm";
import PackageForm from "../components/form/PackageForm";
import {RoutingSession, RoutingSessionBean, RoutingSessionMainInfoBean} from "../domain/RoutingSession";
import {ClientConfiguration} from "../configuration/APIConfiguration";
import {Link} from "react-router-dom";
import {RoutingSessionMainInfoForm} from "../components/form/RoutingSessionMainInfoForm";
import {Depot} from "../domain/Depot";
import {Position} from "google-map-react";
import {RoutingMap} from "../components/map/RoutingMap";
import {formatDate} from "../utils/FormatUtils";

interface RoutingPageProps {
    routingSession?: RoutingSession,
    vehicles: Vehicle[]
    savingHandler: (rs: RoutingSessionBean) => Promise<boolean>
    haveSolutions: boolean
    makeRoutesHandler: () => void
}

const RoutingPage: React.FC<RoutingPageProps> = (props) => {
    const [saved, setSaved] = useState(true)

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
        setSaved(false)
    }

    const handleAddCustomer = (c: CustomerBean) => {
        setCustomers((prevState) => [...prevState, new Customer(c)])
        setSaved(false)
    }

    const handleRemoveCustomer = (c: Customer) => {
        setSelectedCustomer(undefined)
        setCustomers(customers.filter(e => e !== c))
        setSaved(false)
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
            setSaved(false)
        }
    }
    const handleRemovePackage = (p: Package) => {
        if (selectedCustomer !== undefined) {
            selectedCustomer.packages = selectedCustomer.packages.filter(e => e !== p)
            setPackages(selectedCustomer.packages)
            setSaved(false)
        }
    }
    const handleSelectVehicle = (v: Vehicle) => {
        if (selectedVehicles.indexOf(v) === -1)
            setSelectedVehicles((prevState) => [...prevState, v])
        else
            setSelectedVehicles(selectedVehicles.filter(e => e !== v))
        setSaved(false)
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
                            <ControlButton
                                onClick={() => props.savingHandler(buildRoutingSessionBean()).then((value) => setSaved(value))}
                                disabled={saved}
                                margin={'0 10px 0 0'}
                                title={'Збережено: ' + (props.routingSession?.lastSaved.toString() ? formatDate(props.routingSession?.lastSaved.toString()) : 'Не збережено')}
                            >
                                Зберегти
                            </ControlButton>
                        </ContainerItem>
                        <ContainerItem justifyContent={'flex-end'}>
                            <Link to={ClientConfiguration.routesPage.path.replace(':routingSessionId', props.routingSession?.id?.toString() ?? '')}>
                                <ControlButton
                                    disabled={!props.haveSolutions}
                                    margin={'0 10px 0 0'}
                                >
                                    Маршрути
                                </ControlButton>
                            </Link>
                            <ControlButton
                                onClick={() => props.makeRoutesHandler()}
                                disabled={!saved}
                            >
                                Побудувати Маршрути
                            </ControlButton>
                        </ContainerItem>
                    </ToolbarContainer>
                </MainContainerHeader>
                <MainContainerBody>
                    <SectionContainer direction={'row'}>
                        <SectionHeader>Сеанс Маршрутизації</SectionHeader>
                        <RoutingSessionMainInfoForm
                            addingHandler={handleAddMainInfo}
                            position={position}
                        />
                    </SectionContainer>
                    <SectionContainer direction={'column'}>
                        <SectionItem>
                            <SectionHeader>Додати Клієнта</SectionHeader>
                            <CustomerForm
                                addingHandler={handleAddCustomer}
                                onChangeHandler={handleChangeCustomerForm}
                                position={position}
                            />
                        </SectionItem>
                        <RoutingMap
                            depot={depot}
                            customers={customers}
                            selectedCustomer={selectedCustomer}
                            processCoordinatesHandler={handleChangeCoordinates}
                            selectionHandler={handleSelectCustomer}
                        />
                    </SectionContainer>
                    <SectionContainer direction={'row'}>
                        <SectionItem>
                            <SectionHeader>Клієнти</SectionHeader>
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
                        </SectionItem>
                    </SectionContainer>
                    {selectedCustomer !== undefined && (
                        <SectionContainer direction={'column'}>
                            <SectionItem>
                                <SectionHeader>Додати Вантаж</SectionHeader>
                                <PackageForm
                                    addingHandler={handleAddPackage}
                                />
                            </SectionItem>
                        </SectionContainer>
                    )}
                    {selectedCustomer !== undefined && (
                        <SectionContainer direction={'row'}>
                            <SectionItem>
                                <SectionHeader>Клієнт - {selectedCustomer.name}: Вантажі</SectionHeader>
                                <DataTable<Package>
                                    columns={packageColumns}
                                    data={selectedCustomer?.packages}
                                    searchInputPlaceholder={'Фільтр Тип/Вага/Об\'єм/...'}
                                    itemsPerTable={5}
                                    removingHandler={handleRemovePackage}
                                />
                            </SectionItem>
                        </SectionContainer>
                    )}
                    <SectionContainer direction={'row'}>
                        <SectionItem>
                            <SectionHeader>Транспортні Засоби</SectionHeader>
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
                        </SectionItem>
                    </SectionContainer>
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}

export default RoutingPage