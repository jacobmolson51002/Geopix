# Notes for running
* run npm i
  * go to node_modules/react-native/Libraries/Blob/RCTBlobManager.mm and paste [NSThread sleepForTimeInterval:0.1f]; underneath (NSDictionary *)handleNetworkingRequest:(NSDictionary *)data method. 
  * Here is link to post about it (NSDictionary *)handleNetworkingRequest:(NSDictionary *)data