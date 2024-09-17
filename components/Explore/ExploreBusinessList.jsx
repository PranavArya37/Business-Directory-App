import { View, Text, FlatList, ScrollView } from 'react-native'
import React from 'react'
import BusinessListCard from './BusinessListCard';

export default function ExploreBusinessList({ businessList }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList
                data={businessList}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View>
                        <BusinessListCard
                            key={index}
                            business={item} />
                    </View>
                )}
            />
            <View style={{
                height: 200
            }}></View>
        </ScrollView>
    )
}
