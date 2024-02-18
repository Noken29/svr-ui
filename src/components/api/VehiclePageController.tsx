import React from "react";
import VehiclePage from "../../pages/VehiclePage";
import {Vehicle} from "../../domain/Vehicle";
import {APIConfiguration, APIPath} from "../../configuration/APIConfiguration";
import axios from 'axios';
import {FuelType} from "../../domain/FuelType";

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
        const response = await axios.post<Vehicle[]>(APIPath + APIConfiguration.saveVehicles.path, vs)
        this.setState({
            vehicles: response.data
        })
    }

    async componentDidMount() {
        const fuelTypes = await axios.get(APIPath + APIConfiguration.fetchFuelTypes.path)
        const vehicles = await axios.get(APIPath + APIConfiguration.fetchVehicles.path)
        this.setState({
            fuelTypes: fuelTypes.data,
            vehicles: vehicles.data,
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