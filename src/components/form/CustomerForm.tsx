import React from "react";
import {DynamicForm, DynamicFormProps, DynamicFormState} from "./DynamicForm";
import {Customer} from "../../domain/Customer";
import {SectionItem} from "../../styles/page.styled";
import {
    Form,
    FormButton,
    FormContainer,
    FormHeader,
    FormInput,
    FormSubmitButton,
    FormTextArea,
    FormWrapper
} from "./form.styled";

export interface CustomerFormProps extends DynamicFormProps<Customer> {
}

export interface CustomerFormState extends DynamicFormState<Customer> {}

export class CustomerForm extends DynamicForm<CustomerFormProps, CustomerFormState, Customer> {

    state: Readonly<CustomerFormState> = {
        validationErrors: []
    }

    constructor(props: CustomerFormProps, context: any) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e: any) {
        e.preventDefault();
        this.props.addingHandler({
            id: null,
            name: e.target.name.value,
            phoneNumber: e.target.phoneNumber.value,
            addressLines: e.target.addressLines.value,
            specialRequirements: e.target.specialRequirements.value,
            packages: []
        } as Customer)
        // e.target.reset();
    }

    render() {
        return (
            <SectionItem>
                <FormWrapper>
                    <Form onSubmit={this.handleSubmit}>
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
                                placeholder={'Адреса'}
                            />
                            <FormTextArea
                                id={'c-special-requirements'}
                                name={'specialRequirements'}
                                placeholder={'Вимоги'}
                            />
                            <FormButton disabled={true}>Обрати На Мапі</FormButton>
                            <FormSubmitButton type={'submit'}>Додати</FormSubmitButton>
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        );
    }
}

export default CustomerForm