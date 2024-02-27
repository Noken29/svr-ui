import styled from "styled-components";
import {MainContainer, MaxWidthContainer} from "../styles/page.styled";
import {ColorScheme, Fonts} from "../styles/global";
import {ControlButton} from "../styles/controls.styled";

export const MainMenuContainer = styled(MainContainer)`
  background-color: ${ColorScheme.BLUE_ACTIVE};
  padding-top: 100px;
  min-height: 100vh;
  width: 100%;
`

export const MenuContainer = styled(MaxWidthContainer)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  grid-auto-columns: 1fr;
  grid-auto-rows: auto;
  gap: 30px;
  width: 100%;
  max-width: 60rem;
  padding: 30px 10px 0 10px;
`

export const MenuHeader = styled.h1`
  margin: 0;
  text-align: center;
  
  padding: 10px;
  width: 100%;
  color: ${ColorScheme.WHITE_ACTIVE};

  font-weight: bold;
  font-size: 120pt;
  font-family: ${Fonts.LOGO_FONT};
`

export const MenuButton = styled(ControlButton)`
  padding: 30px 40px;
  font-size: 20pt;
  width: 100%;
`

export const MenuButtonWhite = styled(MenuButton)`
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