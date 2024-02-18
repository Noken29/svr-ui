import React from "react";
import {DynamicForm, DynamicFormProps, DynamicFormState} from "./DynamicForm";
import {Package} from "../../domain/Package";
import {Form, FormContainer, FormHeader, FormInput, FormSubmitButton, FormWrapper} from "./form.styled";
import {SectionItem} from "../../styles/page.styled";

export interface PackageFormProps extends DynamicFormProps<Package> {
}

export interface PackageFormState extends DynamicFormState<Package> {}

export class PackageForm extends DynamicForm<PackageFormProps, PackageFormState, Package> {

    state: Readonly<PackageFormState> = {
        validationErrors: []
    }

    constructor(props: PackageFormProps, context: any) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e: any) {
        e.preventDefault();
        this.props.addingHandler({
            type: e.target.type.value,
            weight: e.target.weight.valueAsNumber,
            volume: e.target.volume.valueAsNumber,
            cost: e.target.cost.valueAsNumber
        } as Package)
        // e.target.reset();
    }

    render() {
        return (
            <SectionItem>
                <FormWrapper>
                    <Form onSubmit={this.handleSubmit}>
                        <FormHeader>Додати Вантаж</FormHeader>
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
                                name={'weight'}
                                placeholder={'Вага'}
                            />
                        </FormContainer>
                        <FormContainer direction={'row'}>
                            <FormInput
                                id={'p-volume'}
                                type={'number'}
                                name={'volume'}
                                placeholder={'Об\'єм'}
                            />
                            <FormInput
                                id={'p-cost'}
                                type={'number'}
                                name={'cost'}
                                placeholder={'Вартість Доставки'}
                            />
                        </FormContainer>
                        <FormContainer direction={'column'}>
                            <FormSubmitButton type={'submit'}>Додати</FormSubmitButton>
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        );
    }
}

export default PackageForm