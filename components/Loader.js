import {
    View,
    Text,
    Spinner,
    Flex,
    Image
} from "native-base";
import { useEffect } from "react";
import { useAssets } from 'expo-asset';

export default function Loader({ text }) {

    const [assets] = useAssets([require('../assets/animations/loader.gif')]);

    useEffect(() => {

    }, [])

    if (!assets) {
        return (
            <View position="relative">                
                <Flex direction="row" position="absolute" bottom={3} alignSelf="center">
                    <Spinner color="primary.500" size={20} />
                    {text?.length > 0 ?
                        <Text marginLeft={2} fontSize={15} fontWeight="bold">{text}</Text>
                        :
                        <></>
                    }
                </Flex>
            </View>
        )
    }

    return (
        <View position="relative" marginBottom={10}>
            <Image source={assets[0]} alt="Loader" style={{ width: 300, height: 150}} />
            <Flex direction="row" position="absolute" bottom={1} alignSelf="center">
                <Spinner color="primary.500" size={20} />
                {text?.length > 0 ?
                    <Text marginLeft={2} fontSize={15} fontWeight="bold">{text}</Text>
                    :
                    <></>
                }
            </Flex>
        </View>
    )
}   