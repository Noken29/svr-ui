import React from "react";
import {DynamicForm, DynamicFormProps, DynamicFormState} from "./DynamicForm";
import {PackageBean} from "../../domain/Package";
import {Form, FormContainer, FormInput, FormSubmitButton, FormWrapper} from "./form.styled";
import {SectionItem} from "../../styles/page.styled";
import {ErrorsCard} from "../validation/ErrorsCard";
import {WarningsCard} from "../validation/WarningsCard";

export interface PackageFormProps extends DynamicFormProps<PackageBean> {
}

export interface PackageFormState extends DynamicFormState<PackageBean> {}

export class PackageForm extends DynamicForm<PackageFormProps, PackageFormState, PackageBean> {

    state: Readonly<PackageFormState> = {
        validationErrors: [],
        validationWarnings: []
    }

    constructor(props: PackageFormProps, context: any) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.validateErrors = this.validateErrors.bind(this)
    }

    handleSubmit(e: any) {
        e.preventDefault();
        if (!this.validateErrors(e)) {
            return
        }
        this.props.addingHandler(
            {
                type: e.target.type.value !== '' ? e.target.type.value : 'Інше',
                weight: e.target.weight.valueAsNumber,
                volume: e.target.volume.valueAsNumber,
                cost: e.target.cost.valueAsNumber
            } as PackageBean
        )
    }

    validateErrors(e: any) {
        const errorStrings = []
        const warningStrings = []
        e.preventDefault()
        if (e.target.type.value === '')
            warningStrings.push('Ви не вказали тип вантажу. Встановлено значення за замовчуванням.')
        if (!e.target.weight.valueAsNumber)
            errorStrings.push('Вкажіть вагу вантажу.')
        if (!e.target.volume.valueAsNumber)
            errorStrings.push('Вкажіть об\'єм вантажу.')
        if (!e.target.cost.valueAsNumber)
            errorStrings.push('Вкажіть вартість доставки вантажу.')
        this.setState({
            validationErrors: errorStrings,
            validationWarnings: warningStrings
        })
        return !errorStrings.length
    }

    render() {
        return (
            <SectionItem>
                <FormWrapper>
                    <Form onSubmit={this.handleSubmit}>
                        <FormContainer direction={'row'}>
                            <FormInput
                                id={'p-type'}
                                type={'text'}
                                name={'type'}
                                placeholder={'Тип'}
                            />
                            <FormInput
                                id={'p-weight'}
                                type={'number'}
                                step="0.001"
                                name={'weight'}
                                placeholder={'Вага*'}
                            />
                        </FormContainer>
                        <FormContainer direction={'row'}>
                            <FormInput
                                id={'p-volume'}
                                type={'number'}
                                step="0.001"
                                name={'volume'}
                                placeholder={'Об\'єм*'}
                            />
                            <FormInput
                                id={'p-cost'}
                                type={'number'}
                                step="0.01"
                                name={'cost'}
                                placeholder={'Вартість Доставки*'}
                            />
                        </FormContainer>
                        <FormContainer direction={'column'}>
                            <FormSubmitButton type={'submit'}>Додати</FormSubmitButton>
                        </FormContainer>
                        <FormContainer direction={'column'}>
                            <ErrorsCard errors={this.state.validationErrors} disableBackgroundColor={true}/>
                            {this.state.validationErrors.length === 0 && <WarningsCard warnings={this.state.validationWarnings} disableBackgroundColor={true}/>}
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        );
    }
}

export default PackageForm