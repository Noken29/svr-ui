import React from "react";
import VehiclePage from "../../pages/VehiclePage";
import {Vehicle, VehicleBean} from "../../domain/Vehicle";
import {APIConfiguration, APIPath} from "../../configuration/APIConfiguration";
import axios from 'axios';
import {FuelType, FuelTypeBean} from "../../domain/FuelType";

interface VehiclePageControllerState {
    fuelTypes: FuelType[],
    vehicles: Vehicle[],
    isLoaded: boolean
}

export class VehiclePageController extends React.Component {

    state: VehiclePageControllerState = {
        fuelTypes: [],
        vehicles: [],
        isLoaded: false
    }

    constructor(props: any, context: any) {
        super(props, context);
        this.handleSave = this.handleSave.bind(this)
    }

    async handleSave(vs: Vehicle[]) {
        const vehicles = await axios.post<VehicleBean[]>(APIPath + APIConfiguration.saveVehicles.path, vs)
        this.setState({
            vehicles: vehicles.data.map((v) => new Vehicle(v))
        })
    }

    async componentDidMount() {
        const fuelTypes = await axios.get<FuelTypeBean[]>(APIPath + APIConfiguration.fetchFuelTypes.path)
        const vehicles = await axios.get<VehicleBean[]>(APIPath + APIConfiguration.fetchVehicles.path)
        this.setState({
            fuelTypes: fuelTypes.data.map((v) => new FuelType(v)),
            vehicles: vehicles.data.map((v) => new Vehicle(v)),
            isLoaded: true
        })
    }


    render() {
        if (!this.state.isLoaded)
            return <h1>Loading...</h1>

        return (
            <>
                <VehiclePage
                    fuelTypes={this.state.fuelTypes}
                    vehicles={this.state.vehicles}
                    savingHandler={this.handleSave}
                />
            </>
        )
    }
}