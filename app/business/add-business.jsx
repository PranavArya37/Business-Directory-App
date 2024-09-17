import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, Alert, Platform, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { db, storage } from '../../configs/FirebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddBusiness() {

  const navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  const { user } = useUser();

  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [website, setWebsite] = useState();
  const [address, setAddress] = useState();
  const [about, setAbout] = useState();
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add New Business',
      headerShown: true,
      headerBackTitle: 'Profile'
    })
    GetCategoryList();
  }, [])

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    setImage(result.assets?.[0].uri);
    console.log(result)
  }

  const GetCategoryList = async () => {
    setCategoryList([])
    const q = query(collection(db, 'Category'));
    const snapShot = await getDocs(q);
    snapShot.forEach((doc) => {
      console.log(doc.data());
      setCategoryList(prev => [...prev, {
        label: (doc.data()).name,
        value: (doc.data()).name,
      }])
    })
  }

  const onAddNewBusiness = async () => {
    setLoading(true);
    const fileName = Date.now().toString() + ".jpg";
    const resp = await fetch(image);
    const blob = await resp.blob();

    const imageRef = ref(storage, 'business-app/' + fileName);
    uploadBytes(imageRef, blob).then((snapshot) => {
      console.log("File Uploaded...")
    }).then(resp => {
      getDownloadURL(imageRef).then(async (downloadUrl) => {
        console.log(downloadUrl);
        saveBusinessDetail(downloadUrl);
      })
    })
    setLoading(false);
  }

  const showSuccessMessageIOS = () => {
    Alert.alert(
      'Success!',
      'New Business Added!',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: true }
    );
  };

  const saveBusinessDetail = async (imageUrl) => {
    await setDoc(doc(db, 'BusinessList', Date.now().toString()), {
      name: name,
      phoneNumber: phoneNumber,
      website: website,
      address: address,
      about: about,
      category: category,
      username: user?.fullName,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      imageUrl: imageUrl
    })
    setLoading(false);
    if (Platform.OS === 'android') {
      ToastAndroid.show('New Business Added!', ToastAndroid.LONG)
    } else {
      showSuccessMessageIOS();
    }
  }

  return (
    <ScrollView style={{
      padding: 20
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 25
      }}>Add New Business</Text>

      <Text style={{
        fontFamily: 'outfit',
        color: Colors.GRAY
      }}>Fill all details in order to add new business</Text>

      <TouchableOpacity style={{
        marginTop: 20,
        marginRight: 240
      }}
        onPress={() => onImagePick()}
      >
        {!image ? <Image source={require('./../../assets/images/placeholder.png')}
          style={{
            width: 100,
            height: 100
          }}
        />
          : <Image source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15
            }}
          />}
      </TouchableOpacity>

      <View>
        <TextInput placeholder='Name'
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setName(v)}
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 5,
            fontSize: 17,
            backgroundColor: '#fff',
            marginTop: 15,
            borderColor: Colors.PRIMARY,
            fontFamily: 'outfit'
          }}
        />
        <TextInput placeholder='Phone Number'
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setPhoneNumber(v)}
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 5,
            fontSize: 17,
            backgroundColor: '#fff',
            marginTop: 15,
            borderColor: Colors.PRIMARY,
            fontFamily: 'outfit'
          }}
        />
        <TextInput placeholder='Website'
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setWebsite(v)}
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 5,
            fontSize: 17,
            backgroundColor: '#fff',
            marginTop: 15,
            borderColor: Colors.PRIMARY,
            fontFamily: 'outfit'
          }}
        />
        <TextInput placeholder='Address'
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setAddress(v)}
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 5,
            fontSize: 17,
            backgroundColor: '#fff',
            marginTop: 15,
            borderColor: Colors.PRIMARY,
            fontFamily: 'outfit'
          }}
        />
        <TextInput placeholder='About'
          placeholderTextColor={Colors.GRAY}
          onChangeText={(v) => setAbout(v)}
          multiline={true}
          numberOfLines={5}
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 5,
            fontSize: 17,
            backgroundColor: '#fff',
            marginTop: 15,
            borderColor: Colors.PRIMARY,
            fontFamily: 'outfit',
            height: 100,
          }}
        />
        <View style={{
          padding: 15,
          borderWidth: 1,
          borderRadius: 5,
          fontSize: 17,
          backgroundColor: '#fff',
          marginTop: 15,
          borderColor: Colors.PRIMARY,
          fontFamily: 'outfit',
        }}>
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={categoryList}
          />
        </View>
      </View>

      <TouchableOpacity
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 5,
          marginTop: 20
        }}
        onPress={() => onAddNewBusiness()}
      >
        {loading ?
          <ActivityIndicator size={'large'} color={'#fff'} /> :
          <Text style={{
            textAlign: 'center',
            fontFamily: 'outfit-medium',
            color: '#fff'
          }}>Add New Business</Text>}
      </TouchableOpacity>
    </ScrollView>
  )
}