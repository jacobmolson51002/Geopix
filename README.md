# Notes for running
* run npm i
  * go to node_modules/react-native/Libraries/Blob/RCTBlobManager.mm and paste [NSThread sleepForTimeInterval:0.1f]; underneath (NSDictionary *)handleNetworkingRequest:(NSDictionary *)data method. 
  * Here is link to post about it https://github.com/invertase/react-native-firebase/issues/2521
* run for android
  * create file in android folder called "local.properties", and add the following line: sdk.dir = /Users/jacobolson/Library/Android/sdk 
  * In build.gradle, replace "tasks.register('forwardDebugPort', Exec) {" with "task forwardDebugPort(type: Exec)", and move the entire method to below the android{} method.