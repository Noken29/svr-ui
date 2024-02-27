import {PageFooter, PageHeader} from "../styles/page.styled";
import React from "react";
import {MainMenu} from "../components/MainMenu";
import {MainMenuContainer} from "../components/nav.styled";

export const MainMenuPage: React.FC = () => {
    return (
        <>
            <PageHeader>RouteMapper</PageHeader>
            <MainMenuContainer>
                <MainMenu/>
            </MainMenuContainer>
            <PageFooter>RouteMapper</PageFooter>
        </>
    )
}