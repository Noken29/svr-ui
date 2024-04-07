import {DynamicForm, DynamicFormProps, DynamicFormState} from "./DynamicForm";
import React from "react";
import {VehicleBean, vehicleFields} from "../../domain/Vehicle";
import {FuelType} from "../../domain/FuelType";
import {Form, FormContainer, FormInput, FormSubmitButton, FormWrapper} from "./form.styled";
import {SectionItem} from "../../styles/page.styled";

export interface VehicleFormProps extends DynamicFormProps<VehicleBean> {
    selectedFuelType?: FuelType
}

export interface VehicleFormState extends DynamicFormState<VehicleBean> {}

export class VehicleForm extends DynamicForm<VehicleFormProps, VehicleFormState, VehicleBean> {

    state: Readonly<VehicleFormState> = {
        validationErrors: [],
        validationWarnings: []
    }

    constructor(props: VehicleFormProps, context: any) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e: any) {
        e.preventDefault();
        if (!this.props.selectedFuelType) {
            return
        }
        this.props.addingHandler(
            {
                description: e.target.description.value,
                carryingCapacity: e.target.carryingCapacity.valueAsNumber,
                volume: e.target.volume.valueAsNumber,
                fuelType: this.props.selectedFuelType,
                fuelConsumption: e.target.fuelConsumption.valueAsNumber
            } as VehicleBean
        )
    }

    render() {
        return (
            <SectionItem>
                <FormWrapper>
                    <Form onSubmit={this.handleSubmit}>
                            <FormInput
                                type={'text'}
                                id={'description'}
                                name={'description'}
                                placeholder={vehicleFields.description + '*'}
                            />
                        <FormContainer direction={'row'}>
                            <FormInput
                                type={'number'}
                                name={'carryingCapacity'}
                                placeholder={vehicleFields.carryingCapacity + '*'}
                            />
                            <FormInput
                                type={'number'}
                                name={'volume'}
                                placeholder={vehicleFields.volume + '*'}
                            />
                            <FormInput
                                type={'number'}
                                name={'fuelConsumption'}
                                placeholder={vehicleFields.fuelConsumption + '*'}
                            />
                        </FormContainer>
                        <FormContainer direction={'column'}>
                            <FormSubmitButton>Додати</FormSubmitButton>
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        );
    }
}

export default VehicleForm