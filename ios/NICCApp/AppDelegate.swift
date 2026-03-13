import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate, RNAppAuthAuthorizationFlowManager {

  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public weak var authorizationFlowManagerDelegate:
    RNAppAuthAuthorizationFlowManagerDelegate?

  var blurView: UIVisualEffectView?
  var secureOverlay: UIView?

  // MARK: Blur screen when app goes background
  func applicationWillResignActive(_ application: UIApplication) {

    if blurView == nil {
      let blurEffect = UIBlurEffect(style: .extraLight)
      blurView = UIVisualEffectView(effect: blurEffect)
      blurView?.frame = window?.bounds ?? UIScreen.main.bounds
    }

    if let blurView = blurView {
      window?.addSubview(blurView)
    }
  }

  func applicationDidBecomeActive(_ application: UIApplication) {
    blurView?.removeFromSuperview()
  }

  // MARK: Screen Recording Detection
  func setupScreenCaptureProtection() {

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(screenCaptureChanged),
      name: UIScreen.capturedDidChangeNotification,
      object: nil
    )
  }

  @objc func screenCaptureChanged() {

    guard let window = window else { return }

    if UIScreen.main.isCaptured {

      if secureOverlay == nil {

        let overlay = UIView(frame: window.bounds)
        overlay.backgroundColor = .black

        let label = UILabel(frame: overlay.bounds)
        label.text = "Screen recording is not allowed"
        label.textAlignment = .center
        label.textColor = .white
        label.font = UIFont.systemFont(ofSize: 18)

        overlay.addSubview(label)
        window.addSubview(overlay)

        secureOverlay = overlay
      }

    } else {

      secureOverlay?.removeFromSuperview()
      secureOverlay = nil
    }
  }

  // MARK: App Launch
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "NI Commercial",
      in: window,
      launchOptions: launchOptions
    )

    // Enable screen recording protection
    setupScreenCaptureProtection()

    // Detect screenshot
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(userDidTakeScreenshot),
      name: UIApplication.userDidTakeScreenshotNotification,
      object: nil
    )

    return true
  }

  // MARK: Screenshot detection
  @objc func userDidTakeScreenshot() {
    print("⚠️ Screenshot detected")
  }

  // MARK: OAuth URL Handling
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {

    if let authorizationFlowManagerDelegate = self.authorizationFlowManagerDelegate {
      if authorizationFlowManagerDelegate.resumeExternalUserAgentFlow(with: url) {
        return true
      }
    }

    return false
  }

  // MARK: Universal Link Handling
  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {

    if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
       let delegate = authorizationFlowManagerDelegate,
       delegate.resumeExternalUserAgentFlow(with: userActivity.webpageURL) {
      return true
    }

    return RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
  }
}

// MARK: React Native Delegate

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}