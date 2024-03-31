import React from "react";
import {
    Form,
    FormContainer,
    FormInput,
    FormSubmitButton,
    FormWrapper
} from "./form.styled";
import {SectionItem} from "../../styles/page.styled";
import {DepotBean} from "../../domain/Depot";
import DynamicForm, {DynamicFormProps, DynamicFormState} from "./DynamicForm";
import {RoutingSessionMainInfoBean} from "../../domain/RoutingSession";
import {Position} from "../map/Utils";

interface RoutingSessionMainInfoFormProps extends DynamicFormProps<RoutingSessionMainInfoBean> {
    position?: Position
}

interface RoutingSessionMainInfoFormState extends DynamicFormState<RoutingSessionMainInfoBean> {
}

export class RoutingSessionMainInfoForm extends DynamicForm<RoutingSessionMainInfoFormProps, RoutingSessionMainInfoFormState, RoutingSessionMainInfoBean> {

    constructor(props: RoutingSessionMainInfoFormProps, context: any) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleSubmit(e: any) {
        e.preventDefault()
        if (!this.props.position) {
            alert('Select position first!')
            return
        }
        this.props.addingHandler(
            {
                depot: {
                    addressLines: e.target.addressLines.value,
                    latitude: this.props.position.lat,
                    longitude: this.props.position.lng
                } as DepotBean,
                description: e.target.description.value,
            } as RoutingSessionMainInfoBean
        )
    }

    getAddressLines() {
        return this.props.position?.addressLines ?? ''
    }

    render() {
        return (
            <SectionItem>
                <FormWrapper>
                    <Form onSubmit={this.handleSubmit}>
                        <FormContainer direction={'row'}>
                            <FormInput
                                id={'d-address-lines'}
                                type={'text'}
                                name={'addressLines'}
                                value={this.getAddressLines()}
                                placeholder={'Адреса Депо'}
                            />
                            <FormInput
                                id={'rs-description'}
                                type={'text'}
                                name={'description'}
                                placeholder={'Назва'}
                            />
                        </FormContainer>
                        <FormContainer direction={'row'}>
                            <FormSubmitButton type={'submit'}>Ок</FormSubmitButton>
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        )
    }

}