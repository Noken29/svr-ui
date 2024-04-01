import React from "react";
import {TextCardItemIcon, TextCardItem, TextCard, Text} from "../../styles/page.styled";
import {ColorScheme} from "../../styles/global";

interface ErrorsCardProps {
    errors: string[]
    disableBackgroundColor: boolean
}

export const ErrorsCard: React.FC<ErrorsCardProps> = (props) => {
    return (
        <TextCard>
            {props.errors.map(e => {
                return <TextCardItem backgroundColor={props.disableBackgroundColor ? 'inherit' : ColorScheme.GRAY}>
                    <TextCardItemIcon backgroundColor={ColorScheme.RED_ACTIVE}/>
                    <Text>{e}</Text>
                </TextCardItem>
            })}
        </TextCard>
    )
}