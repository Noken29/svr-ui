import {useJsApiLoader} from "@react-google-maps/api";

export const GOOGLE_MAPS_API_KEY = 'AIzaSyB_ejztzFPAW0W8Cb6He9lDRs5kmr45BSc'

export const GoogleMapScript = () => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['geometry', 'drawing', 'places', 'geocoding'],
    })

    return isLoaded
}