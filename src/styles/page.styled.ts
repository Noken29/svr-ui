import styled from "styled-components";
import {ColorScheme, Fonts} from "./global";

export const PageHeader = styled.header`
  background-color: ${ColorScheme.DARKBLUE_ACTIVE};
  padding: 10px;
  color: ${ColorScheme.WHITE_ACTIVE};
  
  font-weight: bold;
  font-size: 12pt;
  font-family: ${Fonts.LOGO_FONT};
`

export const MaxWidthContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 100rem;
  padding: 20px 10px;
`

export const ToolbarContainer = styled(MaxWidthContainer)`
  align-items: center;
  display: grid;
  grid-auto-columns: 1fr 1fr;
  grid-auto-flow: column;
  grid-auto-rows: auto;
  width: 100%;
`

export const Control = styled.div`
  display: grid;
  grid-auto-columns: 2fr 1fr 1fr;
  grid-auto-flow: column;
  gap: 30px;
  padding: 0 15px;
`

export const SectionContainer = styled(MaxWidthContainer)<{direction: string}>`
  display: grid;
  align-items: flex-start;
  grid-auto-columns: 1fr 1fr;
  grid-auto-flow: ${props => props.direction};
  grid-auto-rows: auto;
  gap: 30px;
  width: 100%;
  padding: 30px 10px 0 10px;
`

export const SectionHeader = styled.div`
  background-color: ${ColorScheme.LIGHTCYAN};
  padding: 20px 15px;

  font-family: ${Fonts.MAIN_FONT};
  font-weight: bold;
  font-size: 18pt;

  color: ${ColorScheme.DARKBLUE_ACTIVE};
  border-radius: 10px;
  border: 0;
  
  text-align: center;
`

export const SectionItem = styled(MaxWidthContainer)`
  display: grid;
  align-items: flex-start;
  grid-auto-columns: 1fr 1fr;
  grid-auto-rows: auto;
  gap: 30px;
  width: 100%;
  padding: 0;
`

export const ConditionalSectionItem = styled(SectionItem)<{display: boolean}>`
  display: ${props => props.display ? 'grid' : 'none'};
`

export const MainContainer = styled.main`
`

export const MainContainerHeader = styled.div`
  background-color: ${ColorScheme.BLUE_ACTIVE};
  display: flex;
  min-height: 3rem;
`

export const MainContainerBody = styled.div`
  background-color: ${ColorScheme.WHITE_ACTIVE};
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
  min-height: 100vh;
`

export const ContainerItem = styled.div<{justifyContent: string}>`
  display: flex;
  justify-content: ${props => props.justifyContent};
`

export const PageFooter = styled.footer`
  background-color: ${ColorScheme.DARKBLUE_ACTIVE};
  align-self: flex-end;
  padding: 10px;
  color: ${ColorScheme.WHITE_ACTIVE};
  
  font-weight: bold;
  font-size: 12pt;
  font-family: ${Fonts.LOGO_FONT};
`