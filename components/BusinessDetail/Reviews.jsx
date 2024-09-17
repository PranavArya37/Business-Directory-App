import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Alert, Platform, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { Rating } from 'react-native-ratings'
import { Colors } from '../../constants/Colors';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export default function Reviews({ business }) {

    const [rating, setRating] = useState(4);
    const [userInput, setUserInput] = useState();
    const { user } = useUser();

    const showSuccessMessageIOS = () => {
        Alert.alert(
            'Success!',
            'Comment Added Successfully!',
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: true }
        );
    };


    const onSubmit = async () => {
        const docRef = doc(db, 'BusinessList', business.id)
        await updateDoc(docRef, {
            reviews: arrayUnion({
                rating: rating,
                comment: userInput,
                userName: user?.fullName,
                userImage: user?.imageUrl,
                userEmail: user?.primaryEmailAddress?.emailAddress
            })
        })
        if (Platform.OS === 'android') {
            ToastAndroid.show('Comment Added Successfully!', ToastAndroid.BOTTOM)
        } else {
            showSuccessMessageIOS();
        }
    }

    return (
        <View style={{
            padding: 20,
            backgroundColor: '#fff'
        }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 20
            }}>Reviews</Text>

            <View>
                <Rating
                    imageSize={35}
                    showRating={false}
                    onFinishRating={(rating) => setRating(rating)}
                    style={{ paddingVertical: 10 }}
                />
                <TextInput
                    placeholder='Write your comment'
                    placeholderTextColor={Colors.GRAY}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(value) => setUserInput(value)}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        borderColor: Colors.GRAY,
                        height: 90,
                        textAlignVertical: 'top',
                        marginTop: 10
                    }}
                />
                <TouchableOpacity
                    disabled={!userInput}
                    onPress={() => onSubmit()}
                    style={{
                        padding: 10,
                        backgroundColor: Colors.PRIMARY,
                        borderRadius: 6,
                        marginTop: 10
                    }}
                >
                    <Text style={{
                        fontFamily: 'outfit',
                        color: '#fff',
                        textAlign: 'center'
                    }}>Submit</Text>
                </TouchableOpacity>
            </View>

            {/* Display Previous Reviews */}
            <View>
                {business?.reviews?.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                            padding: 10,
                            borderWidth: 1,
                            borderColor: Colors.GRAY,
                            borderRadius: 15,
                            marginTop: 10
                        }}>
                        <Image source={{ uri: item.userImage }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 99
                            }}
                        />
                        <View style={{
                            display: 'flex',
                            gap: 5
                        }}>
                            <Text style={{
                                fontFamily: 'outfit-medium'
                            }}>{item.userName}</Text>
                            <Rating
                                imageSize={20}
                                ratingCount={item.rating}
                                style={{
                                    alignItems: 'flex-start'
                                }}
                            />
                            <Text>{item.comment}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}