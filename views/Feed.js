import React from 'react';
import { Text, View, Button } from 'react-native';
import { FeedView } from './FeedView';
import { useSelector } from 'react-redux';

export const Feed = ({ navigation, sheetRef, setCurrentGeopic, setComments }) => {
    const data = useSelector(state => state.geopicsReducer);

    return (
        <FeedView setComments={setComments} setCurrentGeopic={setCurrentGeopic} sheetRef={sheetRef} data={data} />
    )
}