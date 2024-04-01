import React from "react";
import {Text, TextCard, TextCardItem, TextCardItemIcon} from "../../styles/page.styled";
import {ColorScheme} from "../../styles/global";

interface WarningsCardProps {
    warnings: string[]
    disableBackgroundColor: boolean
}

export const WarningsCard: React.FC<WarningsCardProps> = (props) => {
    return (
        <TextCard>
            {props.warnings.map(e => {
                return <TextCardItem backgroundColor={props.disableBackgroundColor ? 'inherit' : ColorScheme.GRAY}>
                    <TextCardItemIcon backgroundColor={ColorScheme.YELLOW_ACTIVE}/>
                    <Text>{e}</Text>
                </TextCardItem>
            })}
        </TextCard>
    )
}