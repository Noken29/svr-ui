import React, {useState} from "react";
import {Vehicle, VehicleBean, vehicleColumns} from "../domain/Vehicle";
import {FuelType, fuelTypeColumns} from "../domain/FuelType";
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
import VehicleForm from "../components/form/VehicleForm";
import {ClientConfiguration} from "../configuration/APIConfiguration";
import {Link} from "react-router-dom";

interface VehiclePageProps {
    fuelTypes: FuelType[]
    vehicles: Vehicle[]
    savingHandler: (vehicles: Vehicle[]) => void
}

const VehiclePage: React.FC<VehiclePageProps> = (props: VehiclePageProps) => {
    const [fuelTypes, ] = useState<FuelType[]>(props.fuelTypes)
    const [selectedFuelType, setSelectedFuelType] = useState<FuelType>(props.fuelTypes[0])
    const [vehicles, setVehicles] = useState<Vehicle[]>(props.vehicles)

    const handleSelectFuelType = (fuelType: FuelType) => {setSelectedFuelType(fuelType)};
    const handleAddVehicle = (v: VehicleBean) => {setVehicles((prevState) => [...prevState, new Vehicle(v)])};
    const handleRemoveVehicle = (vehicle: Vehicle) => {setVehicles(vehicles.filter(e => e !== vehicle))}

    return (
        <>
            <Link to={ClientConfiguration.mainMenuPage.path}>
                <PageHeader>RouteMapper</PageHeader>
            </Link>
            <MainContainer>
                <MainContainerHeader>
                    <ToolbarContainer>
                        <ContainerItem justifyContent={'flex-start'}>
                            <ControlButton onClick={() => props.savingHandler(vehicles)}>Зберегти</ControlButton>
                        </ContainerItem>
                        <ContainerItem justifyContent={'flex-end'}>
                            <Link to={ClientConfiguration.newRoutingPage.path}>
                                <ControlButton>Маршрутизація</ControlButton>
                            </Link>
                        </ContainerItem>
                    </ToolbarContainer>
                </MainContainerHeader>
                <MainContainerBody>
                    <SectionContainer direction={'row'}>
                        <SectionItem>
                            <SectionHeader>Види Пального</SectionHeader>
                            <DataTable<FuelType>
                                columns={fuelTypeColumns}
                                data={fuelTypes}
                                searchInputPlaceholder={'Фільтр Тип/Вартість/...'}
                                selectedData={[fuelTypes[0]]}
                                itemsPerTable={3}
                                selectionProps={{
                                    multipleSelection: false,
                                    canUnSelect: false,
                                    selectionHandler: handleSelectFuelType
                                }}
                            />
                        </SectionItem>
                        <SectionItem>
                            <SectionHeader>Додати Транспортний Засіб</SectionHeader>
                            <VehicleForm
                                addingHandler={handleAddVehicle}
                                selectedFuelType={selectedFuelType}
                            />
                        </SectionItem>
                    </SectionContainer>
                    <SectionContainer direction={'column'}>
                        <SectionItem>
                            <SectionHeader>Транспортні Засоби</SectionHeader>
                            <DataTable<Vehicle>
                                columns={vehicleColumns}
                                data={vehicles}
                                searchInputPlaceholder={'Фільтр Марка/Модель/...'}
                                itemsPerTable={5}
                                removingHandler={handleRemoveVehicle}
                            />
                        </SectionItem>
                    </SectionContainer>
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}

export default VehiclePage