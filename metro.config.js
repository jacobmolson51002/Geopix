// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

//const defaultConfig = getDefaultConfig(__dirname);

//defaultConfig.resolver.assetExts.push("cjs");

module.exports = getDefaultConfig(__dirname);
