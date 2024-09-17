import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Colors } from './../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import Category from './../../components/Home/Category'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import ExploreBusinessList from '../../components/Explore/ExploreBusinessList';

export default function explore() {

    const [businessList, setBusinessList] = useState([]);

    const GetBusinessByCategory = async (category) => {
        setBusinessList([]);
        const q = query(collection(db, 'BusinessList'), where('category', '==', category))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.data())
            setBusinessList(prev => [...prev, { id: doc.id, ...doc.data() }])
        })
    }

    return (
        <View style={{
            padding: 20,
            marginTop: 26
        }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 30
            }}>explore more</Text>
            {/* Search Bar */}
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: 10,
                marginVertical: 10,
                marginTop: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Colors.PRIMARY
            }}>
                <Ionicons name="search" size={24} color={Colors.PRIMARY} />
                <TextInput placeholder='Search...' placeholderTextColor={Colors.GRAY}
                    style={{
                        fontFamily: 'outfit',
                        fontSize: 16,
                    }}
                />
            </View>

            {/* Category  */}
            <View style={{
                marginTop: 15,
                marginLeft: -20
            }}>
                <Category
                    explore={true}
                    onCategorySelect={(category) => GetBusinessByCategory(category)}
                />
            </View>

            {/* Business List */}
            <ExploreBusinessList businessList={businessList} />
        </View>
    )
}