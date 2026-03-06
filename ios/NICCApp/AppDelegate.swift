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

  /// Wraps the app content in the secure text field's internal subview so it is hidden in
  /// screenshots (and already hidden in screen recording via secureOverlay). Uses the same
  /// mechanism as password fields: content inside the secure view is redacted in screenshots.
  func protectScreenshot() {
    guard let window = self.window else { return }

    // Run after React Native has added its root view to the window.
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { [weak self] in
      guard let window = self?.window else { return }
      guard let rootView = window.subviews.first else { return }

      let secureField = UITextField()
      secureField.isSecureTextEntry = true
      secureField.isUserInteractionEnabled = false
      secureField.backgroundColor = .clear
      secureField.frame = window.bounds
      // Force the text field to create its internal secure subview (used for screenshot redaction).
      secureField.layoutIfNeeded()

      guard let secureView = secureField.subviews.first else { return }

      secureView.removeFromSuperview()
      secureView.subviews.forEach { $0.removeFromSuperview() }
      secureView.frame = window.bounds
      secureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

      rootView.removeFromSuperview()
      rootView.frame = secureView.bounds
      rootView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

      window.addSubview(secureView)
      secureView.addSubview(rootView)
    }
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

    protectScreenshot()

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