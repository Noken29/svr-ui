import React, {useEffect, useState} from "react";
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
import {ErrorsCard} from "../components/validation/ErrorsCard";
import {WarningsCard} from "../components/validation/WarningsCard";

interface RoutingPageProps {
    routingSession?: RoutingSession,
    vehicles: Vehicle[]
    savingHandler: (rs: RoutingSessionBean) => Promise<boolean>
    haveSolutions: boolean
    makeRoutesHandler: () => void
}

const RoutingPage: React.FC<RoutingPageProps> = (props) => {
    const [saved, setSaved] = useState(true)
    const [selectedPosition, setSelectedPosition] = useState<Position>()

    const [depot, setDepot] = useState(props.routingSession?.depot)
    const [description, setDescription] = useState(props.routingSession?.description)

    const handleAddMainInfo = (r: RoutingSessionMainInfoBean) => {
        setDepot(new Depot(r.depot))
        setDescription(r.description)
        setSaved(false)
    }

    const [customers, setCustomers] = useState<Customer[]>(props.routingSession?.customers ?? [])
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>()
    const [customersPackages, setCustomersPackages] = useState<Map<string, Package[]>>(
        () => {
            const initialCustomersPackages = new Map()
            customers.forEach(c => {
                initialCustomersPackages.set(c.key(), c.packages)
            })
            return initialCustomersPackages
        }
    )


    const handleAddCustomer = (bean: CustomerBean) => {
        const newCustomer = new Customer(bean)
        setCustomers((prevState) => [...prevState, newCustomer])

        const newCustomersPackages = new Map(customersPackages)
        newCustomersPackages.set(newCustomer.key(), [])
        setCustomersPackages(newCustomersPackages)

        setSaved(false)
    }

    const handleRemoveCustomer = (customer: Customer) => {
        setSelectedCustomer(undefined)
        setCustomers(customers.filter(c => c !== customer))

        const newCustomerPackages = new Map(customersPackages)
        newCustomerPackages.delete(customer.key())
        setCustomersPackages(newCustomerPackages)

        setSaved(false)
    }

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(selectedCustomer !== customer ? customer : undefined)
    }
    const handleAddPackage = (bean: PackageBean) => {
        const newPackage = new Package(bean)

        if (selectedCustomer !== undefined) {
            const newCustomersPackages = new Map(customersPackages)
            const selectedCustomerPackages = newCustomersPackages.get(selectedCustomer.key())
            if (selectedCustomerPackages)
                newCustomersPackages.set(selectedCustomer.key(), [newPackage, ...selectedCustomerPackages])
            else
                newCustomersPackages.set(selectedCustomer.key(), [newPackage])
            setCustomersPackages(newCustomersPackages)
        }

        setSaved(false)
    }
    const handleRemovePackage = (pcg: Package) => {
        if (selectedCustomer) {
            const newCustomersPackages = new Map(customersPackages)
            const selectedCustomerPackages = newCustomersPackages.get(selectedCustomer.key())
            if (selectedCustomerPackages)
                newCustomersPackages.set(selectedCustomer.key(), selectedCustomerPackages.filter(p => p !== pcg))
            else
                newCustomersPackages.set(selectedCustomer.key(), [])
            setCustomersPackages(newCustomersPackages)
        }

        setSaved(false)
    }

    const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>(
        props.routingSession ? props.vehicles.filter(v => v.id && props.routingSession?.vehicleIds.has(v.id)) : []
    )

    const handleSelectVehicle = (vehicle: Vehicle) => {
        if (selectedVehicles.indexOf(vehicle) === -1)
            setSelectedVehicles((prevState) => [...prevState, vehicle])
        else
            setSelectedVehicles(selectedVehicles.filter(v => v !== vehicle))

        setSaved(false)
    }
    const handleChangeCustomerForm = () => {
        setSelectedCustomer(undefined)
    }

    const handleChangeCoordinates = (pos: Position) => {
        setSelectedPosition(pos)
    }

    const buildRoutingSessionBean = () => {
        customers.forEach(c => {
            const customerPackages = customersPackages.get(c.key())
            if (customerPackages)
                c.packages = customerPackages
        })
        return {
            description: description,
            lastSaved: Date.now(),
            depot: depot?.asBean(),
            customers: customers.map((c) => c.asBean()),
            vehicleIds: selectedVehicles.map((v) => v.id)
        } as RoutingSessionBean
    }

    const [denySave, setDenySave] = useState<boolean>(false)
    const [mainInfoValidationErrors, setMainInfoValidationErrors] = useState<string[]>([])
    const [customersValidationErrors, setCustomersValidationErrors] = useState<string[]>([])
    const [selectedVehiclesValidationErrors, setSelectedVehiclesValidationErrors] = useState<string[]>([])

    const validateErrors = () => {
        let errorStrings = []
        let haveErrors = false
        if (!depot) {
            errorStrings.push('Необхідно обрати Депо.')
        }
        if (!description) {
            errorStrings.push('Необхідно вказати назву сеансу маршрутизації.')
        }
        setMainInfoValidationErrors(errorStrings)
        haveErrors = errorStrings.length !== 0
        errorStrings = []

        if (!customers.length) {
            errorStrings.push('Необхідно додати хоча б одного клієнта.')
        } else {
            customers.forEach(c => {
                const customerPackages = customersPackages.get(c.key())
                if (!customerPackages || !customerPackages.length) {
                    errorStrings.push(`Клієнт - ${c.name} не має вантажів.`)
                }
            })
        }
        setCustomersValidationErrors(errorStrings)
        haveErrors = haveErrors || errorStrings.length !== 0
        errorStrings = []

        if (!selectedVehicles.length) {
            errorStrings.push('Необхідно обрати хоча б один транспортний засіб.')
        }
        setSelectedVehiclesValidationErrors(errorStrings)
        haveErrors = haveErrors || errorStrings.length !== 0
        setDenySave(haveErrors)
    }

    const [selectedVehiclesValidationWarnings, setSelectedVehiclesValidationWarnings] = useState<string[]>([])

    const checkWarnings = () => {
        const warningStrings = []
        if (selectedVehicles.length) {
            let warningFound = false
            for (let i = 0; i < selectedVehicles.length; i++) {
                for (let j = 0; j < customers.length; j++) {
                    const customerPackages = customersPackages.get(customers[j].key())
                    if (customerPackages) {
                        for (let k = 0; k < customerPackages.length; k++) {
                            warningFound = selectedVehicles[i].volume < customerPackages[k].volume
                                || selectedVehicles[i].carryingCapacity < customerPackages[k].weight
                            if (warningFound) {
                                warningStrings.push(`Клієнт - ${customers[j].name}, вантаж: (Тип: ${customerPackages[k].type}, Вага/Об'єм: ${customerPackages[k].weight}/${customerPackages[k].volume}) перевищує місткість ТЗ: ${selectedVehicles[i].description}.`)
                                break
                            }
                        }
                    }
                }
            }
        }
        setSelectedVehiclesValidationWarnings(warningStrings)
    }

    useEffect(() => {
        validateErrors()
        checkWarnings()
    }, [depot, description, customers, customersPackages, selectedVehicles]);

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
                                disabled={saved || denySave}
                                margin={'0 10px 0 0'}
                                title={'Збережено: ' + (props.routingSession?.lastSaved.toString() ? formatDate(props.routingSession?.lastSaved.toString()) : 'Не збережено')}
                            >
                                Зберегти
                            </ControlButton>
                        </ContainerItem>
                        <ContainerItem justifyContent={'flex-end'}>
                            <Link to={ClientConfiguration.routesPage.path.replace(':routingSessionId', props.routingSession?.id?.toString() ?? '')}>
                                <ControlButton margin={'0 10px 0 0'} disabled={!props.haveSolutions}>Маршрути</ControlButton>
                            </Link>
                            <ControlButton onClick={() => props.makeRoutesHandler()} disabled={!saved}>Побудувати Маршрути</ControlButton>
                        </ContainerItem>
                    </ToolbarContainer>
                </MainContainerHeader>
                <MainContainerBody>
                    <SectionContainer direction={'row'}>
                        <SectionItem>
                            <SectionHeader>Сеанс Маршрутизації</SectionHeader>
                            <RoutingSessionMainInfoForm
                                addingHandler={handleAddMainInfo}
                                position={selectedPosition}
                                depot={depot}
                                description={description}
                            />
                            {mainInfoValidationErrors.length !== 0 && <ErrorsCard errors={mainInfoValidationErrors} disableBackgroundColor={false}/>}
                        </SectionItem>
                    </SectionContainer>
                    <SectionContainer direction={'column'}>
                        <SectionItem>
                            <SectionHeader>Обрати Депо / Додати Клієнта</SectionHeader>
                            <RoutingMap
                                depot={depot}
                                customers={customers}
                                selectedCustomer={selectedCustomer}
                                processCoordinatesHandler={handleChangeCoordinates}
                                selectionHandler={handleSelectCustomer}
                            />
                            <CustomerForm
                                addingHandler={handleAddCustomer}
                                onChangeHandler={handleChangeCustomerForm}
                                position={selectedPosition}
                            />
                        </SectionItem>
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
                            {customersValidationErrors.length !== 0 && <ErrorsCard errors={customersValidationErrors} disableBackgroundColor={false}/>}
                        </SectionItem>
                        {selectedCustomer !== undefined && (
                            <>
                                <SectionItem>
                                    <SectionHeader>Додати Вантаж</SectionHeader>
                                    <PackageForm
                                        addingHandler={handleAddPackage}
                                    />
                                </SectionItem>
                                <SectionItem>
                                    <SectionHeader>Клієнт - {selectedCustomer.name}: Вантажі</SectionHeader>
                                    <DataTable<Package>
                                        columns={packageColumns}
                                        data={customersPackages.get(selectedCustomer.key()) ?? []}
                                        searchInputPlaceholder={'Фільтр Тип/Вага/Об\'єм/...'}
                                        itemsPerTable={5}
                                        removingHandler={handleRemovePackage}
                                    />
                                </SectionItem>
                            </>
                        )}
                    </SectionContainer>
                    <SectionContainer direction={'row'}>
                        <SectionItem>
                            <SectionHeader>Транспортні Засоби</SectionHeader>
                            <DataTable<Vehicle>
                                columns={vehicleColumns}
                                data={props.vehicles}
                                selectedData={selectedVehicles}
                                searchInputPlaceholder={'Фільтр Марка/Модель/...'}
                                itemsPerTable={10}
                                selectionProps={{
                                    multipleSelection: true,
                                    canUnSelect: true,
                                    selectionHandler: handleSelectVehicle
                                }}
                            />
                            {selectedVehiclesValidationErrors.length !== 0 && <ErrorsCard errors={selectedVehiclesValidationErrors} disableBackgroundColor={false}/>}
                            {selectedVehiclesValidationWarnings.length !== 0 && <WarningsCard warnings={selectedVehiclesValidationWarnings} disableBackgroundColor={false}/>}
                        </SectionItem>
                    </SectionContainer>
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}

export default RoutingPage