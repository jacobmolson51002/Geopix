import React from 'react';
import {registerRootComponent} from 'expo'
import {AppWrapperNonSync} from './app/AppWrapperNonSync';
import {AppWrapperSync} from './app/AppWrapperSync';
import {SYNC_CONFIG} from './sync.config';
import {Map} from './views/Map';
import {CameraView} from './views/CameraView';
import { View, Text } from 'react-native';

export const MainApp = () => {

    return (
        <View style={{ flex: 1 }}>
            <Map style={styles.map} />
            <View style={styles.nav}>
                <Text>This is working</Text>
            </View>
        </View>
    )
}

const styles = {
    map: {
        width: '100%',
        height: '87%'
    },
    nav: {
        width: '100%',
        height: '13%'
    }
};