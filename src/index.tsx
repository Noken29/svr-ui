import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {RouterProvider} from "react-router-dom";
import {ClientRouter} from "./configuration/APIConfiguration";
import {LoadScript} from "@react-google-maps/api";
import {GOOGLE_MAPS_API_KEY} from "./configuration/GoogleMapsAPIConfiguration";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
    <>
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}/>
        <RouterProvider router={ClientRouter}/>
    </>
)

reportWebVitals();
