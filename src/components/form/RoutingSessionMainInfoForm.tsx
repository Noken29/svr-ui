import React from "react";
import {
    Form,
    FormContainer,
    FormRequiredInput,
    FormSubmitButton,
    FormWrapper
} from "./form.styled";
import {SectionItem} from "../../styles/page.styled";
import {Depot, DepotBean} from "../../domain/Depot";
import DynamicForm, {DynamicFormProps, DynamicFormState} from "./DynamicForm";
import {RoutingSessionMainInfoBean} from "../../domain/RoutingSession";
import {Position} from "../../domain/Position";
import {ErrorsCard} from "../validation/ErrorsCard";

const errorLabels = {
    addressLinesIsRequired: 'Оберіть місцезнаходження депо на мапі.',
    descriptionIsRequired: 'Вкажіть назву сеансу маршрутизації.'
}

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
        if (!this.props.position)
            errorsStrings.push(errorLabels.addressLinesIsRequired)
        if (e.target.description.value === '')
            errorsStrings.push(errorLabels.descriptionIsRequired)
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
            <FormWrapper>
                <Form onSubmit={this.handleSubmit}>
                    <FormContainer direction={'row'}>
                        <FormRequiredInput
                            id={'d-address-lines'}
                            type={'text'}
                            name={'addressLines'}
                            defaultValue={this.getAddressLines()}
                            placeholder={'Адреса Депо*'}
                            isErrorPresent={this.state.validationErrors.includes(errorLabels.addressLinesIsRequired)}
                        />
                        <FormRequiredInput
                            id={'rs-description'}
                            type={'text'}
                            name={'description'}
                            defaultValue={this.props?.description}
                            placeholder={'Назва*'}
                            isErrorPresent={this.state.validationErrors.includes(errorLabels.descriptionIsRequired)}
                        />
                    </FormContainer>
                    <FormContainer direction={'column'}>
                        <FormSubmitButton type={'submit'}>Ок</FormSubmitButton>
                        <ErrorsCard errors={this.state.validationErrors} disableBackgroundColor={true}/>
                    </FormContainer>
                </Form>
            </FormWrapper>
        )
    }

}