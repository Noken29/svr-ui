import React, {useState} from "react";
import {Vehicle, vehicleColumns} from "../domain/Vehicle";
import {FuelType, fuelTypeColumns} from "../domain/FuelType";
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
    const [selectedFuelType, setSelectedFuelType] = useState<FuelType>()
    const [vehicles, setVehicles] = useState<Vehicle[]>(props.vehicles)

    const handleSelectFuelType = (fuelType?: FuelType) => {setSelectedFuelType(fuelType !== undefined ? fuelType : undefined)};
    const handleAddVehicle = (vehicle: Vehicle) => {setVehicles((prevState) => [...prevState, vehicle])};
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
                            <ControlButton>Маршрутизація</ControlButton>
                        </ContainerItem>
                    </ToolbarContainer>
                </MainContainerHeader>
                <MainContainerBody>
                    <SectionContainer direction={'column'}>
                        <VehicleForm
                            addingHandler={handleAddVehicle}
                            selectedFuelType={selectedFuelType}
                        />
                        <DataTable
                            columns={fuelTypeColumns}
                            data={fuelTypes}
                            itemsPerTable={3}
                            selectionProps={{
                                multipleSelection: false,
                                selectionHandler: handleSelectFuelType
                            }}
                        />
                    </SectionContainer>
                    <SectionContainer direction={'column'}>
                        <DataTable
                            columns={vehicleColumns}
                            data={vehicles}
                            itemsPerTable={5}
                            removingHandler={handleRemoveVehicle}
                        />
                    </SectionContainer>
                </MainContainerBody>
            </MainContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}

export default VehiclePage