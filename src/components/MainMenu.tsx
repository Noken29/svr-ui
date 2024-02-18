import React from "react";
import {SectionContainer} from "../styles/page.styled";
import {Button, ControlButton} from "../styles/controls.styled";
import {Link, Outlet} from "react-router-dom";

export const MainMenu: React.FC = () => {
    return (
        <SectionContainer direction={'row'}>
            <Link to={'/routing/new'}>
                <ControlButton>Маршрутизація</ControlButton>
            </Link>
            <Link to={'/routing-sessions'}>
                <ControlButton>Маршрутизація</ControlButton>
            </Link>
            <Link to={'/vehicles'}>
                <ControlButton>Транспортні Засоби</ControlButton>
            </Link>
            <Outlet/>
        </SectionContainer>
    )
}