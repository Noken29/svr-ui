import {MainMenuPage} from "../pages/MainMenuPage";
import React from "react";
import {ExistedRoutingSessionPage, NewRoutingSessionPage} from "../components/api/RoutingPageController";
import {VehiclePageController} from "../components/api/VehiclePageController";
import {createBrowserRouter} from "react-router-dom";
import {RetrieveRoutingPageController} from "../components/api/RetrieveRoutingPageController";
import {RoutesPageController, RoutesPageForRoutingSession} from "../components/api/RoutesPageController";

export const ClientPath = 'http://localhost:3000'
export const APIPath = 'http://localhost:8080'

export const ClientConfiguration = {
    mainMenuPage: {
        path: '/main-menu',
        element: <MainMenuPage/>
    },
    retrieveRoutingPage: {
        path: '/routing-sessions',
        element: <RetrieveRoutingPageController/>
    },
    newRoutingPage: {
        path: '/routing/new',
        element: <NewRoutingSessionPage/>
    },
    existedRoutingPage: {
        path: '/routing-session/:routingSessionId',
        element: <ExistedRoutingSessionPage/>
    },
    routesPage: {
        path: '/routing-session/routes/:routingSessionId',
        element: <RoutesPageForRoutingSession/>
    },
    vehiclesPage: {
        path: '/vehicles',
        element: <VehiclePageController/>
    }
}

export const ClientRouter = createBrowserRouter([
    ClientConfiguration.mainMenuPage,
    ClientConfiguration.newRoutingPage,
    ClientConfiguration.retrieveRoutingPage,
    ClientConfiguration.existedRoutingPage,
    ClientConfiguration.routesPage,
    ClientConfiguration.vehiclesPage,
])

export const APIConfiguration = {
    fetchFuelTypes: {
        path: '/vehicles/fuel-types'
    },
    fetchVehicles: {
        path: '/vehicles/all'
    },
    saveVehicles: {
        path: '/vehicles'
    },

    fetchRoutingSessionInfos: {
        path: '/routing-session/all'
    },
    fetchRoutingSession: {
        path: (id: number) => '/routing-session/' + id
    },
    saveRoutingSession: {
        path: (id?: number) => '/routing-session' + (id ? '/' + id : '')
    },
    makeRoutes: {
        path: (id?: number) => '/routing-session/routes' + (id ? '/' + id : '')
    },
    getRoutes: {
        path: (id?: number) => '/routing-session/routes/all' + (id ? '/' + id : '')
    }
}