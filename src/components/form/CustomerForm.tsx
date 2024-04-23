import React from "react";
import {DynamicForm, DynamicFormProps, DynamicFormState} from "./DynamicForm";
import {CustomerBean} from "../../domain/Customer";
import {SectionItem} from "../../styles/page.styled";
import {
    Form,
    FormContainer,
    FormInput, FormRequiredInput,
    FormSubmitButton,
    FormTextArea,
    FormWrapper
} from "./form.styled";
import {Position} from "../../domain/Position";
import {ErrorsCard} from "../validation/ErrorsCard";
import {WarningsCard} from "../validation/WarningsCard";

const errorLabels = {
    nameIsRequired: 'Вкажіть ім\'я клієнта.',
    addressLinesIsRequired: 'Оберіть місцезнаходження клієнта на мапі.',
}

const warningLabels = {
    phoneNumberIsMissed: 'Ви не вказали номер телефону клієнта. Встановлено значення за замовчуванням.',
    specialRequirementsIsMissed: 'Ви не вказали особливі вимоги клієнта. Встановлено значення за замовчуванням.'
}

export interface CustomerFormProps extends DynamicFormProps<CustomerBean> {
    position?: Position
    onChangeHandler: () => void
}

export interface CustomerFormState extends DynamicFormState<CustomerBean> {
}

export class CustomerForm extends DynamicForm<CustomerFormProps, CustomerFormState, CustomerBean> {

    state: Readonly<CustomerFormState> = {
        validationErrors: [],
        validationWarnings: []
    }

    constructor(props: CustomerFormProps, context: any) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.validateErrors = this.validateErrors.bind(this)
    }

    handleSubmit(e: any) {
        e.preventDefault()
        if (!this.validateErrors(e)) {
            return
        }
        if (this.props.position) {
            this.props.addingHandler(
                {
                    name: e.target.name.value,
                    phoneNumber: e.target.phoneNumber.value !== '' ? e.target.phoneNumber.value : 'Не вказано',
                    addressLines: e.target.addressLines.value !== '' ? e.target.addressLines.value : 'Не вказано',
                    specialRequirements: e.target.specialRequirements.value !== '' ? e.target.specialRequirements.value : 'Не вказано',
                    packages: [],
                    latitude: this.props.position.lat,
                    longitude: this.props.position.lng,
                } as CustomerBean
            )
            this.setState({
                validationErrors: []
            })
            super.clearWarnings(2500)
        }
    }

    validateErrors(e: any) {
        const errorStrings = []
        const warningStrings = []
        e.preventDefault()
        if (e.target.name.value === '')
            errorStrings.push(errorLabels.nameIsRequired)
        if (e.target.phoneNumber.value === '')
            warningStrings.push(warningLabels.phoneNumberIsMissed)
        if (!this.props.position)
            errorStrings.push(errorLabels.addressLinesIsRequired)
        if (e.target.specialRequirements.value === '')
            warningStrings.push(warningLabels.specialRequirementsIsMissed)
        this.setState({
            validationErrors: errorStrings,
            validationWarnings: warningStrings
        })
        return !errorStrings.length
    }

    getAddressLines() {
        return this.props.position?.addressLines ?? ''
    }

    render() {
        return (
            <SectionItem>
                <FormWrapper>
                    <Form onSubmit={this.handleSubmit} onChange={this.props.onChangeHandler}>
                        <FormContainer direction={'row'}>
                            <FormRequiredInput
                                id={'c-name'}
                                type={'text'}
                                name={'name'}
                                placeholder={'Ім\'я*'}
                                isErrorPresent={this.state.validationErrors.includes(errorLabels.nameIsRequired)}
                            />
                            <FormInput
                                id={'c-phone-number'}
                                type={'text'}
                                name={'phoneNumber'}
                                placeholder={'Номер Телефону'}
                            />
                        </FormContainer>
                        <FormContainer direction={'column'}>
                            <FormRequiredInput
                                id={'c-address-lines'}
                                type={'text'}
                                name={'addressLines'}
                                defaultValue={this.getAddressLines()}
                                placeholder={'Адреса*'}
                                isErrorPresent={this.state.validationErrors.includes(errorLabels.addressLinesIsRequired)}
                            />
                        </FormContainer>
                        <FormContainer direction={'column'}>
                            <FormTextArea
                                id={'c-special-requirements'}
                                name={'specialRequirements'}
                                placeholder={'Вимоги'}
                            />
                        </FormContainer>
                        <FormContainer direction={'column'}>
                            <FormSubmitButton type={'submit'}>Додати</FormSubmitButton>
                            {this.state.validationErrors.length !== 0 && (
                                <ErrorsCard errors={this.state.validationErrors} disableBackgroundColor={true}/>
                            )}
                            {this.state.validationErrors.length === 0 && this.state.validationWarnings.length !== 0 && (
                                <WarningsCard warnings={this.state.validationWarnings} disableBackgroundColor={true}/>
                            )}
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        );
    }
}

export default CustomerForm