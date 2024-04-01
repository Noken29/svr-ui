import {Position} from "google-map-react";

export type DepotBean = {
    id?: number,
    addressLines: string,
    latitude: number,
    longitude: number
}

export class Depot {
    id?: number
    addressLines: string
    latitude: number
    longitude: number

    constructor(bean: DepotBean) {
        this.id = bean.id
        this.addressLines = bean.addressLines
        this.latitude = bean.latitude
        this.longitude = bean.longitude
    }

    asBean() {
        return {
            id: this.id,
            addressLines: this.addressLines,
            latitude: this.latitude,
            longitude: this.longitude
        } as DepotBean
    }

    asPosition() {
        return {
            lat: this.latitude,
            lng: this.longitude
        } as Position
    }
}