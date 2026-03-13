import UIKit
import React

@objc(SecureScreenManager)
class SecureScreenManager: NSObject, RCTBridgeModule {

  static func moduleName() -> String! {
    return "SecureScreenManager"
  }

  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func enableSecure() {
    DispatchQueue.main.async {
      guard let window = UIApplication.shared.connectedScenes
              .compactMap({ $0 as? UIWindowScene })
              .first?.windows.first else { return }

      self.makeSecure(window: window)
    }
  }

  private func makeSecure(window: UIWindow) {

    let secureField = UITextField()
    secureField.isSecureTextEntry = true
    secureField.isUserInteractionEnabled = false

    window.addSubview(secureField)

    // Move window layer under secure field layer
    window.layer.superlayer?.addSublayer(secureField.layer)

    if let lastLayer = secureField.layer.sublayers?.last {
        lastLayer.addSublayer(window.layer)
    }
  }
}