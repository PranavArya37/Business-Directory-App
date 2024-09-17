import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.6;

export default function PopularBusinessCard({ business }) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push("/businessdetail/" + business?.id)}
            style={{
                marginLeft: 20,
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 15,
                width: cardWidth,
            }}>
            <Image source={{ uri: business?.imageUrl }}
                style={{
                    width: cardWidth - 20,
                    height: 130,
                    borderRadius: 15
                }}
            />
            <View style={{ marginTop: 7, gap: 5, flex: 1 }}>
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 17,
                }} numberOfLines={1} ellipsizeMode="tail">{business.name}</Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 13,
                    color: Colors.GRAY,
                }} numberOfLines={2} ellipsizeMode="tail">{business.address}</Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('./../../assets/images/star.png')}
                            style={{
                                width: 15,
                                height: 15,
                                marginRight: 5,
                            }}
                        />
                        <Text style={{ fontFamily: 'outfit' }}>4.5</Text>
                    </View>
                    <View style={{
                        backgroundColor: Colors.PRIMARY,
                        padding: 3,
                        borderRadius: 5,
                    }}>
                        <Text
                            style={{
                                fontFamily: 'outfit',
                                color: '#fff',
                                fontSize: 12,
                            }}>{business.category}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}