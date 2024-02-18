import {MainContainer, MainContainerBody, PageHeader} from "../styles/page.styled";
import React from "react";
import {MainMenu} from "../components/MainMenu";

export const MainMenuPage: React.FC = () => {
    return (
        <>
            <PageHeader>RouteMapper</PageHeader>
            <MainContainer>
                <MainContainerBody>
                    <MainMenu/>
                </MainContainerBody>
            </MainContainer>
        </>
    )
}