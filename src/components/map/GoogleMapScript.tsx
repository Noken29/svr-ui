import {useJsApiLoader} from "@react-google-maps/api";

export const GoogleMapScript = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: '',
        libraries: ['geometry', 'drawing', 'places', 'geocoding'],
    })

    return isLoaded
}