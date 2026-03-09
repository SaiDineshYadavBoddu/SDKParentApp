#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (SecureApi, NSObject)

RCT_EXTERN_METHOD(get : (NSString *)url headers : (NSDictionary *)
                      headers resolver : (RCTPromiseResolveBlock)
                          resolve rejecter : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(post : (NSString *)url body : (NSString *)body headers : (
    NSDictionary *)headers resolver : (RCTPromiseResolveBlock)
                      resolve rejecter : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(put : (NSString *)url body : (NSString *)body headers : (
    NSDictionary *)headers resolver : (RCTPromiseResolveBlock)
                      resolve rejecter : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(delete : (NSString *)url headers : (NSDictionary *)
                      headers resolver : (RCTPromiseResolveBlock)
                          resolve rejecter : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(patch : (NSString *)url body : (NSString *)body headers : (
    NSDictionary *)headers resolver : (RCTPromiseResolveBlock)
                      resolve rejecter : (RCTPromiseRejectBlock)reject)

@end