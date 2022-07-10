import React from 'react';
import { Text, View, Button } from 'react-native';
import { FeedView } from './FeedView';
import { useSelector } from 'react-redux';

export const Feed = ({ navigation }) => {
    const data = useSelector(state => state.geopicsReducer);

    return (
        <FeedView data={data} />
    )
}