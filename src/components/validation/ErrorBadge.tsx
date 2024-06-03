import React from "react";
import {Text, TextCard, TextCardItem, TextCardItemIcon} from "../../styles/page.styled";
import {ColorScheme} from "../../styles/global";
import {RemoveButton} from "../../styles/controls.styled";

interface ErrorBadgeProps {
    error: string
}

export const ErrorBadge: React.FC<ErrorBadgeProps> = (props) => {

    const handleRemove = () => {

    }

    return (
        <TextCard>
            <TextCardItem backgroundColor={ColorScheme.GRAY}>
                <TextCardItemIcon backgroundColor={ColorScheme.RED_ACTIVE}/>
                <Text>{props.error}</Text>
            </TextCardItem>
        </TextCard>
    )
}