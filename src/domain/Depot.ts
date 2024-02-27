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
}