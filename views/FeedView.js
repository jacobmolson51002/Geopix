import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { Dimensions, SafeAreaView, Image, View, Text, TouchableOpacity, TouchableHighlight, Button, FlatList } from 'react-native';
import { getImage, getComments, addComment, vote, getTime } from '../backend/database';
import AppLoading from 'expo-app-loading';
import * as firebase from '../backend/firebaseConfig';
import { geopicViewed, setLocalVote, getViewedComments } from '../backend/realm';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CachedImage from 'react-native-expo-cached-image';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MultiTap from 'react-native-multitap';


/*export const DisplayImage = (imageUrl) => {
    console.log(imageUrl);

    return (
        <View style={styles.image}>
            <Image source={{ uri: imageUrl }} style={{ flex: 1 }}/>
        </View>
    )
}*/

export const Votes = ({ voteableItem, tap }) => {
    const [voteCount, setVoteCount] = useState(voteableItem.vote != null ? voteableItem.vote : 0);
    const [displayVote, setDisplayVote] = useState(voteableItem.votes[2]);
    const [localTap, setLocalTap] = useState(0);
    console.log(voteableItem);
    const upVote = async () => {
        if(voteCount === 1) {
            setVoteCount(0);
            setDisplayVote(displayVote - 1);
            vote(voteableItem, -1);
            setLocalVote(voteableItem.viewed, voteableItem._id, 0);
        }else if(voteCount === -1){
            setVoteCount(1);
            setDisplayVote(displayVote + 2);
            vote(voteableItem, 2);
            setLocalVote(voteableItem.viewed, voteableItem._id, 1);
        }else{
            setVoteCount(1);
            setDisplayVote(displayVote + 1);
            vote(voteableItem, 1);
            setLocalVote(voteableItem.viewed, voteableItem._id, 1);
        }
    }
    const downVote = async () => {
        if(voteCount === -1) {
            setVoteCount(0);
            setDisplayVote(displayVote + 1);
            vote(voteableItem, 1);
            setLocalVote(voteableItem.viewed, voteableItem._id, 0);
        }else if(voteCount === 1){
            setVoteCount(-1);
            setDisplayVote(displayVote - 2);
            vote(voteableItem, -2);
            setLocalVote(voteableItem.viewed, voteableItem._id, -1);
        }else{
            setVoteCount(-1);
            setDisplayVote(displayVote - 1);
            vote(voteableItem, -1);
            setLocalVote(voteableItem.viewed, voteableItem._id, -1);
        }

    }
    if(tap !== localTap){
        setLocalTap(tap);
        if(tap == 1){
            console.log('upvote called');
            upVote();
        }else{
            downVote();
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
            
    upvote = () => {
        this.child.upVote();
    }

    downvote = () => {
        this.child.downVote();
    }

    render () {
        let viewed = false;
        console.log("rendered");
        const { geopic } = this.props;
        const { navigation } = this.props;
        const { sheetRef } = this.props;
        const { setCurrentGeopic } = this.props;
        const { setComments } = this.props;
        const { tap } = this.props;
        const { setTap } = this.props;
        if(geopic.viewed === false){
            geopicViewed(geopic._id);
        }
        let currentComments = {};
        const styles = {
            container: {
                flex: 1,
                width: '100%',
                backgroundColor: 'rgb(34,34,34)',
            },
            image: {
                width: '101%',
                flex: 1,
                height: Dimensions.get('screen').height * 0.9,
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
                shadowColor: 'black',
                shadowOffset: {
                    width: 1,
                    height: 1
                },
                shadowOpacity: 1,
            },
            captionText: {
                fontSize: 15,
                color: 'white',
                flexWrap: 'wrap',
                paddingLeft: 15,
                textShadowColor: 'black',
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
                shadowColor: 'black',
                shadowOffset: {
                    width: 1,
                    height: 1
                },
                shadowOpacity: 1,
            },
            geopicInfo: { 
                fontWeight: 'bold', 
                color: 'white', 
                paddingTop: 5,
                paddingLeft: 15,
            }
        }
        const backButton = '<-';
        const [timeStamp, units] = getTime(geopic.timestamp);

        const viewComments = async () => {
            //const geopicComments = await getComments(geopic._id);
            setComments({});
            setCurrentGeopic(geopic);
            sheetRef.current.snapTo(1);
            if(viewed === false){
                const geopicComments = await getComments(geopic._id);
                let viewedComments = await getViewedComments(geopicComments);
                viewedComments.reverse();
                console.log(viewedComments);
                currentComments = viewedComments;
                viewed = true;
                
                 
            }
            setComments(currentComments);
            
            

        }

        const profile = (userID) => {
            navigation.navigate('viewProfile', { userID: userID });
        };

        const callUpvote = () => {
            this.upvote();
        }

        const callDownvote = () => {
            this.downvote();
        }

        return (
            <View style={styles.container}>
                <MultiTap
                    onDoubleTap={callUpvote}
                    onSingleTap={callDownvote}
                    onTripleTap={() => console.log("Triple tapped")}
                    onNTaps={(n) => { console.log("I was tapped " + n + " times") }}
                    onLongPress={() => console.log("Long pressed")}
                    delay={300}

                >
                <CachedImage source={{ uri: geopic.pic }} style={styles.image}/>
                </MultiTap>
                <View style={styles.bottomBox} >
                    <View  style={styles.captionBox}>
                        <View style={{ shadowColor:'black', shadowOffset: {width: 1, height: 1}, shadowOpacity: 1 }}><Text style={styles.geopicInfo}><TouchableOpacity style={{ margin: 0,padding: 0, boxShadow: '' }} onPress={() => {profile(geopic.userID)}}><Text style={styles.geopicInfo}>{geopic.username}</Text></TouchableOpacity><View style={{ margin: 0,padding:0 }}><Text style={styles.geopicInfo}>•    {Math.floor(timeStamp)} {units} {timeStamp === "now" ? "" : "ago"}</Text></View></Text></View>
                        <View style={styles.captionTextBox} ><Text style={styles.captionText}>{geopic.caption}</Text></View>
                        <TouchableOpacity onPress={() => {viewComments()}} >
                            {geopic.comments > 0 ? (
                                <Text style={styles.viewCommentsButton}>{geopic.comments} {geopic.comments === 1 ? "comment" : "comments"}</Text>
                            ) : (
                                <Text style={styles.viewCommentsButton}>Add comment</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <Votes forwardRef={child => {this.child = child}} style={styles.votes} tap={tap} voteableItem={geopic} />
                </View>
                <StatusBar style="light" />
               
            </View>
        )
    }
}
//style={{ fontWeight: 'bold', fontSize: 12, color: "white" }}
export const SingleFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { geopic, sheetRef, setComments, setCurrentGeopic } = route.params;
    const nav = useNavigation();

    const geopicView = [geopic];

    const renderItem = useCallback(
        ({ item }) => <SingleView navigation={nav} setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} geopic={item} />,
        []
    );
    return (
        <View style={{ flex:  1, backgroundColor: '#222222' }}>
            <FlatList data={geopicView} renderItem={renderItem} keyExtractor={geopic => geopic._id} />
        </View>
    )
}

export const ClusterFeedView = ({ route, navigation }) => {
    //const [geopicData, setGeopicData] = useState(null);

    const { cluster, sheetRef, setComments, setCurrentGeopic } = route.params;
    const nav = useNavigation();

    //console.log("printing cluster");

    //console.log(cluster);

    const renderItem = useCallback(
        ({ item }) => <SingleView navigation={nav} setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} geopic={item} />,
        []
    );
    return (
        <View style={{ flex: 1 }}>
            <FlatList style={{ flex: 1, backgroundColor: '#222222' }} 
                      data={cluster} renderItem={renderItem} 
                      keyExtractor={geopic => geopic._id} 
                      showsVerticalScrollIndicator={false}
                      snapToOffsets={[...Array(cluster.length)].map((x,i) => (i * Dimensions.get('window').height * 0.9))}
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
    let nearbyGeopics = props.data.geopics;
    let nearbyClusters = props.data.clusters;
    const geopicRealm = useSelector(state => state.geopicsReducer);
    let friendGeopics = geopicRealm.friendGeopics;
    const sheetRef = props.sheetRef;
    const setCurrentGeopic = props.setCurrentGeopic;
    const setComments = props.setComments;
    const navigation = useNavigation();
    const selection = props.selection;
    const [tap, setTap] = useState(0);

    nearbyClusters.map((cluster) => {
        //console.log(cluster.geopics);
        const newData = nearbyGeopics.concat(cluster.geopics);
        nearbyGeopics = newData;
    });

    nearbyGeopics.sort((a, b) => {
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

    friendGeopics.sort((a, b) => {
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
        ({ item }) => <SingleView tap={tap} setTap={setTap} navigation={navigation} setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} geopic={item} />,
        []
    );
    const keyExtractor = useCallback((item) => item._id, []);
    return (
        <View style={{ flex: 1 }}>
        {selection === 'nearby' ? (
            <FlatList style={{ flex: 1, backgroundColor: '#222222' }} 
                      data={nearbyGeopics} renderItem={renderItem} 
                      keyExtractor={keyExtractor} 
                      showsVerticalScrollIndicator={false}
                      snapToOffsets={[...Array(nearbyGeopics.length)].map((x,i) => (i * Dimensions.get('window').height * 0.9))}
                      maxToRenderPerBatch={2}
                      windowSize={2}
                      initialNumToRender={3}
                      snapToAlignment='start'
                      decelerationRate='fast'

                      >
            </FlatList>
        ) : (
            <FlatList style={{ flex: 1, backgroundColor: '#222222' }} 
                      data={friendGeopics} renderItem={renderItem} 
                      keyExtractor={keyExtractor} 
                      showsVerticalScrollIndicator={false}
                      snapToOffsets={[...Array(friendGeopics.length)].map((x,i) => (i * Dimensions.get('window').height * 0.9))}
                      maxToRenderPerBatch={2}
                      windowSize={2}
                      initialNumToRender={3}
                      snapToAlignment='start'
                      decelerationRate='fast'

                      >
            </FlatList>
        )}
            <StatusBar style="light" />
        </View>
    )
}