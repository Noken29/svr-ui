import styled from "styled-components";
import {ColorScheme, Fonts} from "../../styles/global";
import {Button, Input, TextArea} from "../../styles/controls.styled";

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  font-family: ${Fonts.MAIN_FONT};
  font-weight: bold;
  font-size: 18pt;
`

export const FormContainer = styled.div<{direction: string}>`
  display: flex;
  justify-content: space-around;
  flex-direction: ${props => props.direction};
  gap: 15px;
  margin-top: 15px;
`

export const Form = styled.form`
  background-color: ${ColorScheme.LIGHTCYAN};
  display: inherit;
  flex-direction: inherit;
  
  padding: 20px 15px;

  color: ${ColorScheme.DARKBLUE_ACTIVE};
  border-radius: 10px;
  border: 0;
`

export const FormHeader = styled.div`
  text-align: center;
`


export const FormInput = styled(Input)`
  
`

export const FormTextArea = styled(TextArea)`
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
`

export const FormButton = styled(Button)`
    width: 100%;
`

export const FormSubmitButton = styled(FormButton)`
`