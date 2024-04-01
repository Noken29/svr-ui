import React from "react";
import {
    Form,
    FormContainer,
    FormInput,
    FormSubmitButton,
    FormWrapper
} from "./form.styled";
import {SectionItem} from "../../styles/page.styled";
import {Depot, DepotBean} from "../../domain/Depot";
import DynamicForm, {DynamicFormProps, DynamicFormState} from "./DynamicForm";
import {RoutingSessionMainInfoBean} from "../../domain/RoutingSession";
import {Position} from "../map/Utils";
import {ErrorsCard} from "../validation/ErrorsCard";

interface RoutingSessionMainInfoFormProps extends DynamicFormProps<RoutingSessionMainInfoBean> {
    position?: Position
    depot?: Depot
    description?: string
}

interface RoutingSessionMainInfoFormState extends DynamicFormState<RoutingSessionMainInfoBean> {
}

export class RoutingSessionMainInfoForm extends DynamicForm<RoutingSessionMainInfoFormProps, RoutingSessionMainInfoFormState, RoutingSessionMainInfoBean> {

    state: Readonly<RoutingSessionMainInfoFormState> = {
        validationErrors: [],
        validationWarnings: []
    }

    constructor(props: RoutingSessionMainInfoFormProps, context: any) {
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
                    depot: {
                        addressLines: e.target.addressLines.value,
                        latitude: this.props.position.lat,
                        longitude: this.props.position.lng
                    } as DepotBean,
                    description: e.target.description.value,
                } as RoutingSessionMainInfoBean
            )
        }
    }

    validateErrors(e: any) {
        const errorsStrings = []
        e.preventDefault()
        if (!this.props.position?.addressLines)
            errorsStrings.push('Оберіть адресу депо на мапі.')
        if (e.target.description.value === '')
            errorsStrings.push('Вкажіть назву сеансу маршрутизації.')
        this.setState({
            validationErrors: errorsStrings
        })
        return !errorsStrings.length
    }

    getAddressLines() {
        if (this.props.position?.addressLines)
            return this.props.position?.addressLines
        return this.props.depot?.addressLines
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
                                placeholder={'Адреса Депо*'}
                            />
                            <FormInput
                                id={'rs-description'}
                                type={'text'}
                                name={'description'}
                                value={this.props?.description}
                                placeholder={'Назва*'}
                            />
                        </FormContainer>
                        <FormContainer direction={'row'}>
                            <FormSubmitButton type={'submit'}>Ок</FormSubmitButton>
                        </FormContainer>
                        <FormContainer direction={'row'}>
                            <ErrorsCard errors={this.state.validationErrors} disableBackgroundColor={true}/>
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        )
    }

}