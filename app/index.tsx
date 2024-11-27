import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { getAddress } from "../utils";
import axios from "axios";
import { Coordinates } from "../types/Coordinates";

export default function Screen(){

    const [local, setLocal] = useState<Coordinates | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [data, setData] = useState<any>()

    const estimar = async (address: string) => {
        await getLocation()
        const origin = await getAddress(local as Coordinates)

        try{
            const response = await axios.post('https://routes.googleapis.com/directions/v2:computeRoutes', {
                origin: {address: origin},
                destination: {address: address},
                travelMode: "DRIVE"
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": GOOGLE_API_KEY,
                    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
                }
            })
        
            console.log(response.data)
            setData(response.data.routes[0])
        }catch(error){
            console.log('erro ao pegar api do google')
        }
    }

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
        setErrorMsg('Permissão negada para acessar a localização.');
        return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocal({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        });
        setErrorMsg(null);

        console.log(local)
    };

    

    return(
        <SafeAreaView 
            style={{ marginTop: StatusBar.currentHeight || 0 }}
            className="justify-center items-center h-full"
        >
            <Text className="text-3xl font-bold">Calcule a distância!!</Text>
            <View className="flex-row gap-4 my-5">
                <Pressable 
                    className="bg-blue-700 p-2 rounded-xl"
                    onPress={() => estimar("Praia de Boa Viagem, Avenida Boa Viagem, Recife, PE, Brasil")}
                >
                    <Text className="text-white">Boa Viagem</Text>
                </Pressable>
                <Pressable 
                    className="bg-blue-700 p-2 rounded-xl"
                    onPress={() => estimar("Praça do Marco Zero, Recife, PE, Brasil")}
                >
                    <Text className="text-white">Marco Zero</Text>
                </Pressable>
                <Pressable 
                    className="bg-blue-700 p-2 rounded-xl"
                    onPress={() => estimar("Avenida Paulista, 1578, São Paulo, SP, Brasil")}
                >
                    <Text className="text-white">São Paulo</Text>
                </Pressable>
            </View>

            <View className="w-4/5 h-[400px] bg-gray-300 justify-center items-center">
                <Text className="text-xl font-bold">
                    Distância: {data && <>{data.distanceMeters / 1000}km</>}
                </Text>
                <Text className="text-xl font-bold">
                    Tempo: {data?.duration}
                </Text>
            </View>
            
        </SafeAreaView>
    )
}