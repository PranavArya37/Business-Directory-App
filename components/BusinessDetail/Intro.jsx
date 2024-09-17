import { View, Text, Image, TouchableOpacity, Alert, Platform, ToastAndroid } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export default function Intro({ business }) {

    const router = useRouter();
    const { user } = useUser();

    const OnDelete = () => {
        Alert.alert('Do you want to Delete?', 'Are you sure you want to Delete this Business?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => deleteBusiness()
            }
        ])
    }

    const showSuccessMessageIOS = () => {
        Alert.alert(
            'Business Deleted!',
            'Business Deleted Successfully!',
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: true }
        );
    };

    const deleteBusiness = async () => {
        console.log("Delete Business");
        await deleteDoc(doc(db, 'BusinessList', business?.id))
        router.back();
        if (Platform.OS === 'android') {
            ToastAndroid.show('Business Deleted!', ToastAndroid.LONG)
        } else {
            showSuccessMessageIOS();
        }
    }

    return (
        <View>
            <View style={{
                position: 'absolute',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                padding: 20,
                marginTop: 30
            }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-circle" size={40} color="white" />
                </TouchableOpacity>
                <Ionicons name="heart-outline" size={40} color="white" />
            </View>
            <Image source={{ uri: business?.imageUrl }}
                style={{
                    width: '100%',
                    height: 340,
                }}
            />

            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
                marginTop: -20,
                backgroundColor: '#fff',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
            }}>
                <View style={{
                    padding: 20,
                    marginTop: -20,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25
                }}>
                    <Text style={{
                        fontSize: 26,
                        fontFamily: 'outfit-bold'
                    }}>{business?.name}
                    </Text>
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 18
                    }}>{business?.address}</Text>
                </View>
                {user?.primaryEmailAddress?.emailAddress == business?.userEmail && <TouchableOpacity onPress={() => OnDelete()}>
                    <Ionicons name='trash' size={24} color="red" />
                </TouchableOpacity>}
            </View>
        </View>
    )
}