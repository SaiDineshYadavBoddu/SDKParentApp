import Foundation
import React
import CommonCrypto

@objc(SecureApi)
class SecureApi: NSObject, URLSessionDelegate {

    // MARK: SSL Pins
    private let allowedPins = [
        "YGqEby6vfqMde2KyON4Jtg5e1GAtHe9Ky1hrNanULgA=",
        "iFvwVyJSxnQdyaUvUERIf+8qk7gRze3612JMwoO3zdU="
    ]

    // MARK: SHA256
    private func sha256(data: Data) -> String {

        var hash = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))

        data.withUnsafeBytes {
            _ = CC_SHA256($0.baseAddress, CC_LONG(data.count), &hash)
        }

        return Data(hash).base64EncodedString()
    }

    // MARK: Public Key Hash
    private func publicKeyHash(for certificate: SecCertificate) -> String? {

        guard let key = SecCertificateCopyKey(certificate),
            let keyData = SecKeyCopyExternalRepresentation(key, nil) as Data? else {
            return nil
        }

        let keyType = SecKeyCopyAttributes(key) as NSDictionary?
        let keyClass = keyType?[kSecAttrKeyType] as? String

        var spki: Data

        if keyClass == (kSecAttrKeyTypeRSA as String) {

            let rsaHeader: [UInt8] = [
                0x30,0x82,0x01,0x22,
                0x30,0x0d,
                0x06,0x09,0x2a,0x86,0x48,0x86,0xf7,0x0d,0x01,0x01,0x01,
                0x05,0x00,
                0x03,0x82,0x01,0x0f,
                0x00
            ]

            spki = Data(rsaHeader)
            spki.append(keyData)

        } else {

            // ECDSA (Let's Encrypt often uses this)

            let ecHeader: [UInt8] = [
                0x30,0x59,
                0x30,0x13,
                0x06,0x07,0x2a,0x86,0x48,0xce,0x3d,0x02,0x01,
                0x06,0x08,0x2a,0x86,0x48,0xce,0x3d,0x03,0x01,0x07,
                0x03,0x42,
                0x00
            ]

            spki = Data(ecHeader)
            spki.append(keyData)
        }

        return sha256(data: spki)
    }

    // MARK: SSL Pinning
    func urlSession(_ session: URLSession,
                    didReceive challenge: URLAuthenticationChallenge,
                    completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {

        let host = challenge.protectionSpace.host
        print("SecureApi: Received challenge for host: \(host)")

        guard challenge.protectionSpace.authenticationMethod ==
              NSURLAuthenticationMethodServerTrust,
              let serverTrust = challenge.protectionSpace.serverTrust else {

            print("SecureApi: Challenge rejected - not server trust or no server trust object")
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }

        let policy = SecPolicyCreateSSL(true, host as CFString)
        SecTrustSetPolicies(serverTrust, policy)

        var error: CFError?
        let trusted = SecTrustEvaluateWithError(serverTrust, &error)

        if !trusted {
            print("SecureApi: Trust evaluation failed: \(error?.localizedDescription ?? "unknown error")")
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }

        if let certChain = SecTrustCopyCertificateChain(serverTrust) as? [SecCertificate] {
            print("SecureApi: Certificate chain count: \(certChain.count)")

            for certificate in certChain {
                if let hash = publicKeyHash(for: certificate) {

                    print("SecureApi: SERVER PIN: \(hash)")

                    if allowedPins.contains(hash) {
                        print("SecureApi: Pin matched!")
                        completionHandler(.useCredential,
                                          URLCredential(trust: serverTrust))
                        return
                    }
                } else {
                    print("SecureApi: Could not calculate hash for cert")
                }
            }
        }

        print("SecureApi: No pins matched. Allowed pins: \(allowedPins)")
        completionHandler(.cancelAuthenticationChallenge, nil)
    }

    // MARK: Generic Request Handler
    private func performRequest(method: String,
                                url: String,
                                headers: [String: String]?,
                                body: String?,
                                resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {

        guard let requestURL = URL(string: url) else {
            reject("INVALID_URL", "Invalid URL", nil)
            return
        }

        var request = URLRequest(url: requestURL)
        request.httpMethod = method

        if let headers = headers {
            for (key, value) in headers {
                request.setValue(value, forHTTPHeaderField: key)
            }
        }

        if let body = body {
            request.httpBody = body.data(using: .utf8)
        }

        let session = URLSession(configuration: .default,
                                 delegate: self,
                                 delegateQueue: nil)

        let task = session.dataTask(with: request) { data, response, error in

            if let error = error {
                reject("NETWORK_ERROR", error.localizedDescription, error)
                return
            }

            guard let data = data else {
                reject("NO_DATA", "No response data", nil)
                return
            }

            let responseString = String(data: data, encoding: .utf8)

            let httpResponse = response as? HTTPURLResponse
            let result: [String: Any] = [
                "status": httpResponse?.statusCode ?? 200,
                "bodyString": responseString ?? ""
            ]

            resolve(result)
        }

        task.resume()
    }

    // MARK: GET
    @objc
    func get(_ url: String,
             headers: NSDictionary?,
             resolver resolve: @escaping RCTPromiseResolveBlock,
             rejecter reject: @escaping RCTPromiseRejectBlock) {

        performRequest(method: "GET",
                       url: url,
                       headers: headers as? [String: String],
                       body: nil as String?,
                       resolve: resolve,
                       reject: reject)
    }

    // MARK: POST
    @objc
    func post(_ url: String,
              body: String,
              headers: NSDictionary?,
              resolver resolve: @escaping RCTPromiseResolveBlock,
              rejecter reject: @escaping RCTPromiseRejectBlock) {

        performRequest(method: "POST",
                       url: url,
                       headers: headers as? [String: String],
                       body: body,
                       resolve: resolve,
                       reject: reject)
    }

    // MARK: PUT
    @objc
    func put(_ url: String,
             body: String,
             headers: NSDictionary?,
             resolver resolve: @escaping RCTPromiseResolveBlock,
             rejecter reject: @escaping RCTPromiseRejectBlock) {

        performRequest(method: "PUT",
                       url: url,
                       headers: headers as? [String: String],
                       body: body,
                       resolve: resolve,
                       reject: reject)
    }

    // MARK: DELETE
    @objc
    func delete(_ url: String,
                headers: NSDictionary?,
                resolver resolve: @escaping RCTPromiseResolveBlock,
                rejecter reject: @escaping RCTPromiseRejectBlock) {

        performRequest(method: "DELETE",
                       url: url,
                       headers: headers as? [String: String],
                       body: nil,
                       resolve: resolve,
                       reject: reject)
    }

    // MARK: PATCH
    @objc
    func patch(_ url: String,
               body: String,
               headers: NSDictionary?,
               resolver resolve: @escaping RCTPromiseResolveBlock,
               rejecter reject: @escaping RCTPromiseRejectBlock) {

        performRequest(method: "PATCH",
                       url: url,
                       headers: headers as? [String: String],
                       body: body,
                       resolve: resolve,
                       reject: reject)
    }
}
