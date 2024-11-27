
import axios from "axios";
import { Coordinates } from '../types/Coordinates';

export const getAddress = async (geoCode: Coordinates) => {
    const geoCodeString = `${geoCode.latitude},${geoCode.longitude}`
    const address = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${geoCodeString}&key=${GOOGLE_API_KEY}`)
    return address.data.results[0].formatted_address
}