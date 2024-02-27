import React from "react";
import {Link, Outlet} from "react-router-dom";
import {MenuContainer, MenuButton, MenuButtonWhite, MenuHeader} from "./nav.styled";

export const MainMenu: React.FC = () => {
    return (
        <MenuContainer>
            <MenuHeader>RouteMapper</MenuHeader>
            <Link to={'/routing/new'}>
                <MenuButton>Маршрутизація</MenuButton>
            </Link>
            <Link to={'/routing-sessions'}>
                <MenuButtonWhite>Минулі Сеанси</MenuButtonWhite>
            </Link>
            <Link to={'/vehicles'}>
                <MenuButtonWhite>Транспортні Засоби</MenuButtonWhite>
            </Link>
            <Outlet/>
        </MenuContainer>
    )
}