import React from "react";
import DynamicForm from "./DynamicForm";
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
import {SectionItem} from "../../styles/page.styled";

interface RoutingSessionCardProps {
    lastSaved: number
}

export class RoutingSessionCard extends React.Component<RoutingSessionCardProps> {


    constructor(props: RoutingSessionCardProps) {
        super(props);
    }


    handleSubmit(e: any) {

    }

    render() {
        return (
            <SectionItem>
                <FormWrapper>
                    <Form onSubmit={this.handleSubmit}>
                        <FormHeader>Сеанс Маршрутизації</FormHeader>
                        <FormContainer direction={'row'}>
                            <FormInput
                                id={'d-address-lines'}
                                type={'text'}
                                name={'addressLines'}
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
                            <FormButton disabled={true}>Обрати На Мапі</FormButton>
                            <FormSubmitButton type={'submit'}>Ок</FormSubmitButton>
                        </FormContainer>
                        <FormContainer direction={'column'}>
                            <FormHeader>Збережено: {this.props.lastSaved}</FormHeader>
                        </FormContainer>
                    </Form>
                </FormWrapper>
            </SectionItem>
        )
    }

}