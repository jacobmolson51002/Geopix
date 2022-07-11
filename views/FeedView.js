import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, SafeAreaView, Image, View, Text, TouchableOpacity, TouchableHighlight, Button, FlatList } from 'react-native';
import { getImage, getComments, addComment, vote } from '../backend/realm';
import AppLoading from 'expo-app-loading';
import * as firebase from '../backend/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CachedImage from 'react-native-expo-cached-image';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';


/*export const DisplayImage = (imageUrl) => {
    console.log(imageUrl);

    return (
        <View style={styles.image}>
            <Image source={{ uri: imageUrl }} style={{ flex: 1 }}/>
        </View>
    )
}*/

export const Votes = ({ voteableItem }) => {
    const [voteCount, setVoteCount] = useState(0);
    const [displayVote, setDisplayVote] = useState(voteableItem.votes[2]);
    const upVote = async () => {
        if(voteCount === 1) {
            setVoteCount(0);
            setDisplayVote(displayVote - 1);
            vote(voteableItem, -1, 'comment');
        }else{
            setVoteCount(1);
            setDisplayVote(displayVote + 1);
            vote(voteableItem, 1, 'comment');
        }
    }
    const downVote = async () => {
        if(voteCount === -1) {
            setVoteCount(0);
            setDisplayVote(displayVote + 1);
            vote(voteableItem, 1, 'comment');
        }else{
            setVoteCount(-1);
            setDisplayVote(displayVote - 1);
            vote(voteableItem, -1, 'comment');
        }

    }
    const styles = {
        wrapper: {
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'flex-end',
            width: '25%',
            paddingRight: 7
        },
        voteCount: {
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center',
        },
        voteCountDisplay: {
            fontWeight: 'bold', 
            fontSize: 15,
            color: voteCount === 0 ? 'white' : voteCount === -1 ? 'red' : 'turquoise',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10
        },
        innerWrapper: {
            display: 'flex',
            justiftyContent: 'center',
            alignItems: 'center'
        },
        voteButton: {
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10
        }
    }
    return (
        <View style={styles.wrapper}>
        <View style={styles.innerWrapper} >
        <TouchableOpacity style={styles.voteButton} onPress={upVote} >
            <Entypo name="chevron-up" style={styles.voteButton} size={35} color={voteCount === 0 || voteCount === -1 ? "white" : "turquoise"} />
        </TouchableOpacity>
        <View style={styles.voteCount}>
            <Text style={styles.voteCountDisplay}>{displayVote}</Text>
        </View>
        <TouchableOpacity style={styles.voteButton} onPress={downVote} >
            <Entypo name="chevron-down" style={styles.voteButton} size={35} color={voteCount === 0 || voteCount === 1 ? "white" : "red"} />
        </TouchableOpacity>
        </View>
        </View>
    )
}

class SingleView extends React.PureComponent {

    render () {
        let viewed = false;
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
                height: Dimensions.get('window').height * 0.9,
                backgroundColor: 'rgb(34,34,34)',
            },
            image: {
                width: '101%',
                flex: 1,
                height: (Dimensions.get('window').height * .9),
                borderLeftWidth: 0,
                marginLeft: -1,
                marginRight: -1
            },
            bottomBox: {
                width: '100%',
                paddingBottom: 5,
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10
            },
            captionBox: {
                width: '75%'
            },
            captionTextBox: {
                flexDirection: 'row',
                width: '100%',
                flex: 1,
                marginBottom: 5,
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10
            },
            captionText: {
                fontSize: 15,
                color: 'white',
                flexWrap: 'wrap',
                paddingLeft: 15,
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10
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
            viewCommentsButton: {
                color: 'white',
                paddingBottom: 10,
                paddingLeft: 15,
                textShadowColor: 'rgba(0, 0, 0, 1)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 5
            },
            geopicInfo: { 
                fontWeight: 'bold', 
                color: 'white', 
                paddingBottom: 5, 
                paddingTop: 5,
                paddingLeft: 15,
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10
            }
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
        const viewComments = () => {
            //const geopicComments = await getComments(geopic._id);
            if(viewed === false){
                viewed = true;
                setComments({});
                 
            }
            setCurrentGeopic(geopic);
            sheetRef.current.snapTo(1)
            

        }

        return (
            <View style={styles.container}>
                
                <CachedImage source={{ uri: geopic.pic }} style={styles.image}/>
                <View style={styles.bottomBox} >
                    <View  style={styles.captionBox}>
                        <Text style={styles.geopicInfo}>{geopic.username}   •   <Text style={{ fontWeight: 'bold', fontSize: 12, color: "white" }}>{Math.floor(displayTime)} {units} {displayTime === "now" ? "" : "ago"}</Text></Text>
                        <View style={styles.captionTextBox} ><Text style={styles.captionText}>{geopic.caption}</Text></View>
                        <TouchableOpacity onPress={() => {viewComments()}} ><Text style={styles.viewCommentsButton}>{geopic.comments} {geopic.comments === 1 ? "comment" : "comments"}</Text></TouchableOpacity>
                    </View>
                    <Votes style={styles.votes} voteableItem={geopic} />
                </View>
                <StatusBar />
                
            </View>
        )
    }
}

export const SingleFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { geopic, sheetRef, setComments, setCurrentGeopic } = route.params;

    const geopicView = [geopic];

    const renderItem = ({ item }) => <SingleView setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} geopic={item} />;
    return (
        <View style={{ flex:  1, backgroundColor: '#222222' }}>
            <FlatList data={geopicView} renderItem={renderItem} keyExtractor={geopic => geopic._id} />
        </View>
    )
}

export const ClusterFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { cluster, sheetRef, setComments, setCurrentGeopic } = route.params;

    //console.log("printing cluster");

    //console.log(cluster);

    const renderItem = ({ navigation, item }) => <SingleView setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} navigation={navigation} geopic={item} />;
    return (
        <View style={{ flex: 1 }}>
            <FlatList style={{ flex: 1, backgroundColor: '#222222' }} 
                      data={cluster} renderItem={renderItem} 
                      keyExtractor={geopic => geopic._id} 
                      showsVerticalScrollIndicator={false}
                      snapToInterval={Dimensions.get('window').height * 0.9}
                      maxToRenderPerBatch={2}
                      windowSize={2}
                      initialNumToRender={3}
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