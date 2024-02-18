import styled from 'styled-components';
import {ColorScheme, Fonts} from "./global";

export const ControlButton = styled.button<{margin?: string}>`
  padding: 10px 20px;
  
  box-shadow: 0 4px 4px ${ColorScheme.BLACK_BOX_SHADOW};
  
  border-radius: 10px;
  border: 0;
  
  font-weight: bold;
  font-size: 12pt;
  font-family: ${Fonts.MAIN_FONT};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  margin: ${props => props.margin ? props.margin : 'none'};
  
  &:hover {
    background-color: ${ColorScheme.GREEN_FOCUS};
  }
  
  background-color: ${ColorScheme.GREEN_ACTIVE};
  color: ${ColorScheme.WHITE_ACTIVE};
  
  &:disabled, &:active {
    background-color: ${ColorScheme.GREEN_INACTIVE};
    color: ${ColorScheme.WHITE_INACTIVE}; 
  }
`

export const Input = styled.input`
  background-color: ${ColorScheme.WHITE_ACTIVE};
  padding: 10px 20px;

  width: 100%;
  box-sizing: border-box;
  
  box-shadow: 0 4px 4px ${ColorScheme.BLACK_BOX_SHADOW};
  
  border-radius: 10px;
  border: 3px solid ${ColorScheme.DARKBLUE_BORDER};
  
  font-size: 12pt;
  font-family: ${Fonts.MAIN_FONT};
  color: ${ColorScheme.BLUE_FOCUS};
  
  &:focus {
    outline: none;
    background-color: ${ColorScheme.WHITE_FOCUS};
  }

  &::placeholder {
    color: ${ColorScheme.BLUE_FOCUS};
  }
`

export const TextArea = styled.textarea`
  background-color: ${ColorScheme.WHITE_ACTIVE};
  padding: 10px 20px;
  
  box-shadow: 0 4px 4px ${ColorScheme.BLACK_BOX_SHADOW};
  
  border-radius: 10px;
  border: 3px solid ${ColorScheme.DARKBLUE_BORDER};
  
  font-size: 12pt;
  font-family: ${Fonts.MAIN_FONT};
  color: ${ColorScheme.BLUE_FOCUS};
  
  &:focus {
    outline: none;
    background-color: ${ColorScheme.WHITE_FOCUS};
  }

  &::placeholder {
    color: ${ColorScheme.BLUE_FOCUS};
  }
`

export const Button = styled.button`
  padding: 10px 20px;
  
  box-shadow: 0 4px 4px ${ColorScheme.BLACK_BOX_SHADOW};
  
  border-radius: 10px;
  border: 0;

  font-weight: bold;
  font-size: 14pt;
  font-family: ${Fonts.MAIN_FONT};
  
  &:hover {
    background-color: ${ColorScheme.WHITE_FOCUS};
  }
  
  background-color: ${ColorScheme.WHITE_ACTIVE};
  color: ${ColorScheme.DARKBLUE_ACTIVE};
  
  &:disabled, &:active {
    background-color: ${ColorScheme.WHITE_INACTIVE};
    color: ${ColorScheme.DARKBLUE_INACTIVE}; 
  }
`

export const RemoveButton = styled.button`
  padding: 20px;

  margin: 0 auto;
  
  box-shadow: 0 4px 4px ${ColorScheme.BLACK_BOX_SHADOW};
  
  border-radius: 100%;
  border: 0;

  &:hover {
    background-color: ${ColorScheme.RED_FOCUS};
  }

  background-color: ${ColorScheme.RED_ACTIVE};

  &:disabled, &:active {
    background-color: ${ColorScheme.RED_INACTIVE};
  }
`

export const RemoveButtonUnsaved = styled(RemoveButton)`
  &:hover {
    background-color: ${ColorScheme.YELLOW_FOCUS};
  }

  background-color: ${ColorScheme.YELLOW_ACTIVE};

  &:disabled, &:active {
    background-color: ${ColorScheme.YELLOW_INACTIVE};
  }
`


