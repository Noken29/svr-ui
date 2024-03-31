import styled from "styled-components";
import {ColorScheme, Fonts} from "../../styles/global";
import {ControlButton} from "../../styles/controls.styled";

export const TableWrapper = styled.div`
  color: ${ColorScheme.DARKBLUE_ACTIVE};
  font-family: ${Fonts.MAIN_FONT};
  font-size: 12pt;
`

export const Table = styled.table`
  width: 100%;
  text-align: left;
  border-spacing: 0;
  vertical-align: middle;
  line-height: 2.6em;
  border-radius: 10px;
  background-color: ${ColorScheme.GRAY};
`

export const TableHeader = styled.thead`
  font-weight: bold;
`


export const TableHead = styled.th`
  padding: 20px 20px;

  max-width: unset;
  width: 1px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TableBody = styled.tbody`
`

export const TableHeaderRow = styled.tr``

export const TableRow = styled("tr")<{backgroundColor?: string, color?: string}>`
  background-color: ${props => props.backgroundColor ? props.backgroundColor : ColorScheme.GRAY};
  color: ${props => props.color ? props.color : ColorScheme.BLUE_ACTIVE};
  
  ${props => props.backgroundColor === ColorScheme.LIGHTCYAN && `
    &:hover {
      background-color: ${ColorScheme.LIGHTCYAN_FOCUS};
    }
  `}
  ${props => props.backgroundColor !== ColorScheme.LIGHTCYAN && `
    &:hover {
      background-color: ${ColorScheme.GRAY_FOCUS};
    }
  `}
`

export const TableCell = styled.td`
  padding: 20px 20px;
  
  max-width: unset;
  width: 1px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TableFooter = styled.div<{backgroundColor?: string}>`
  width: 100%;
  padding: 20px 20px;
  height: 81.59px;
  white-space: nowrap;
  box-sizing: border-box;
  border-radius: 0 0 10px 10px;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : 'inherit'};;
`

export const TableFooterRow = styled(TableRow)<{backgroundColor?: string}>`
  background-color: ${props => props.backgroundColor ? props.backgroundColor : 'inherit'};
`

export const TableControlCell = styled(TableCell)`
  padding: 10px 30px;
  text-align: right;
  width: 40px;
`

export const TableControlButton = styled(ControlButton)`
  margin-right: 10px;
`
