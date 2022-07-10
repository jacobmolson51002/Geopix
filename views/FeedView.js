import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, SafeAreaView, Image, View, Text, TouchableOpacity, TouchableHighlight, Button, FlatList } from 'react-native';
import { getImage, getComments } from '../backend/realm';
import AppLoading from 'expo-app-loading';
import * as firebase from '../backend/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CachedImage from 'react-native-expo-cached-image';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';


/*export const DisplayImage = (imageUrl) => {
    console.log(imageUrl);

    return (
        <View style={styles.image}>
            <Image source={{ uri: imageUrl }} style={{ flex: 1 }}/>
        </View>
    )
}*/

const CommentSection = () => {
    return (
        <View>
        <BottomSheet
            snapPoints={["75%"]}
            index={0}
            handleHeight={40}
            enablePanDownToClose />
        </View>
    )
  }

class SingleView extends React.PureComponent {

    render () {

        console.log("rendered");
        const { geopic } = this.props;
        const { navigation } = this.props;
        const { sheetRef } = this.props;
        const { setCurrentGeopic } = this.props;
        const { setComments } = this.props;
        const styles = {
            container: {
                flex: 1,
                width: '100%',
                height: Dimensions.get('window').height * 0.9 - 1,
                backgroundColor: '#222222',
                borderBottomWidth: 1,
                borderBottomColor: '#f5f5f5'
            },
            topBox: {
                backgroundColor: "#222222",
                width: '100%',
                height: 50
            },
            image: {
                width: '101%',
                height: (Dimensions.get('window').height * .80) - 50,
                borderLeftWidth: 0,
                marginLeft: -1,
                marginRight: -1
            },
            bottomBox: {
                width: '100%',
                padding: 15,
                paddingBottom: 5,
                backgroundColor: '#222222'
            },
            captionBox: {
                height: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                width: '60%'
            },
            captionText: {
                fontSize: 15,
                color: 'white'
            },
            retakeButton: {
                color: 'white',
                fontSize: 25
            },
                retakeButtonContainer: {
                position: 'absolute',
                top: 70,
                left: 15
            },
        }
        const backButton = '<-';
    
        const currentDateTime = new Date();
        const geopicDateTime = new Date(geopic.timestamp);
        const timeDifference = currentDateTime.getTime() - geopicDateTime.getTime();
        let displayTime = timeDifference / (86400000);
        let units = Math.floor(displayTime) > 1 ? "days" : "day";
        if(displayTime < 1){
            displayTime = displayTime * 24;
            units = Math.floor(displayTime) > 1 ? "hrs" : "hr";
            if(displayTime < 1){
                displayTime = displayTime * 60;
                units = Math.floor(displayTime) > 1 ? "mins" : "min";
                if(displayTime < 1){
                    units = Math.floor(displayTime) > 1 ? "seconds" : "second";
                    displayTime = displayTime * 60;
                    if(displayTime < 1){
                        displayTime = "now";
                        units = "";
                    } 
                }
            }
        }
        const viewComments = async () => {
            const geopicComments = await getComments(geopic._id);
            setComments(geopicComments);
            setCurrentGeopic(geopic); 
            sheetRef.current.snapTo(1)
        }

        return (
            <View style={styles.container}>
                <View style={styles.topBox} >
                <StatusBar />
                </View>
                <CachedImage source={{ uri: geopic.pic }} style={styles.image}/>
                <View style={styles.bottomBox} >
                    <View style={styles.captionBox}>
                        <Text style={{ fontWeight: 'bold', color: 'white', paddingBottom: 5}}>{geopic.username}      <Text style={{ fontWeight: 'normal', fontSize: 12, color: "#bebebe" }}>{Math.floor(displayTime)} {units} {displayTime === "now" ? "" : "ago"}</Text></Text>
                        <Text style={styles.captionText}>{geopic.caption}</Text>
                        <TouchableOpacity onPress={() => {viewComments()}} ><Text>comments</Text></TouchableOpacity>
                    </View>
                </View>

                
            </View>
        )
    }
}

export const SingleFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { geopic } = route.params;

    const geopicView = [geopic];

    const renderItem = ({ item }) => <SingleView geopic={item} />;
    return (
        <View style={{ flex:  1, backgroundColor: '#222222' }}>
            <FlatList data={geopicView} renderItem={renderItem} keyExtractor={geopic => geopic._id} />
        </View>
    )
}

export const ClusterFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { cluster } = route.params;

    //console.log("printing cluster");

    //console.log(cluster);

    const renderItem = ({ navigation, item }) => <SingleView navigation={navigation} geopic={item} />;
    return (
        <View style={{ flex: 1 }}>
            <FlatList style={{ flex: 1, backgroundColor: '#222222' }} 
                      data={cluster} renderItem={renderItem} 
                      keyExtractor={geopic => geopic._id} 
                      showsVerticalScrollIndicator={false}
                      snapToInterval={Dimensions.get('window').height - 48}
                      snapToAlignment='start'
                      decelerationRate='fast'
                      />
        </View>
    )
}

export const FeedView = (props) => {
    //const [geopicData, setGeopicData] = useState(null);
    let geopics = props.data.geopics;
    let clusters = props.data.clusters;
    const sheetRef = props.sheetRef;
    const setCurrentGeopic = props.setCurrentGeopic;
    const setComments = props.setComments;

    clusters.map((cluster) => {
        console.log(cluster.geopics);
        const newData = geopics.concat(cluster.geopics);
        geopics = newData;
    });

    geopics.sort((a, b) => {
        const aTime = new Date(a.timestamp);
        const bTime = new Date(b.timestamp);
        if(aTime.getTime() > bTime.getTime()){
            return -1;
        }
        if(aTime.getTime() < bTime.getTime()){
            return 1;
        }
        return 0;
    })

    //console.log("printing cluster");

    //console.log(cluster);

    const renderItem = useCallback(
        ({ item }) => <SingleView setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} geopic={item} />,
        []
    );
    const keyExtractor = useCallback((item) => item._id, []);
    return (
            <FlatList style={{ flex: 1, backgroundColor: '#222222' }} 
                      data={geopics} renderItem={renderItem} 
                      keyExtractor={keyExtractor} 
                      showsVerticalScrollIndicator={false}
                      snapToInterval={Dimensions.get('window').height * 0.9}
                      maxToRenderPerBatch={2}
                      windowSize={2}
                      initialNumToRender={3}
                      snapToAlignment='start'
                      decelerationRate='fast'

                      >
                      <StatusBar />
            </FlatList>
    )
}