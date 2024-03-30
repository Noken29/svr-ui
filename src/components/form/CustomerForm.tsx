import React from "react";
import {DynamicForm, DynamicFormProps, DynamicFormState} from "./DynamicForm";
import {CustomerBean} from "../../domain/Customer";
import {SectionItem} from "../../styles/page.styled";
import {
    Form,
    FormContainer,
    FormHeader,
    FormInput,
    FormSubmitButton,
    FormTextArea,
    FormWrapper
} from "./form.styled";
import {Position} from "../map/Utils";

export interface CustomerFormProps extends DynamicFormProps<CustomerBean> {
    position?: Position
    onChangeHandler: () => void
}

export interface CustomerFormState extends DynamicFormState<CustomerBean> {
}

export class CustomerForm extends DynamicForm<CustomerFormProps, CustomerFormState, CustomerBean> {

    state: Readonly<CustomerFormState> = {
        validationErrors: []
    }

    constructor(props: CustomerFormProps, context: any) {
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
                name: e.target.name.value,
                phoneNumber: e.target.phoneNumber.value,
                addressLines: e.target.addressLines.value,
                specialRequirements: e.target.specialRequirements.value,
                packages: [],
                latitude: this.props.position.lat,
                longitude: this.props.position.lng,
            } as CustomerBean
        )
    }

    getAddressLines() {
        return this.props.position?.addressLines ?? ''
    }

    render() {
        return (
            <SectionItem>
                <FormWrapper>
                    <Form onSubmit={this.handleSubmit} onChange={this.props.onChangeHandler}>
                        <FormHeader>Додати Клієнта</FormHeader>
                        <FormContainer direction={'column'}>
                            <FormInput
                                id={'c-name'}
                                type={'text'}
                                name={'name'}
                                placeholder={'Ім\'я'}
                            />
                            <FormInput
                                id={'c-phone-number'}
                                type={'text'}
                                name={'phoneNumber'}
                                placeholder={'Номер Телефону'}
                            />
                            <FormInput
                                id={'c-address-lines'}
                                type={'text'}
                                name={'addressLines'}
                                value={this.getAddressLines()}
                                placeholder={'Адреса'}
                            />
                            <FormTextArea
                                id={'c-special-requirements'}
                                name={'specialRequirements'}
                                placeholder={'Вимоги'}
                            />
                            <FormSubmitButton type={'submit'}>Додати</FormSubmitButton>
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        );
    }
}

export default CustomerForm