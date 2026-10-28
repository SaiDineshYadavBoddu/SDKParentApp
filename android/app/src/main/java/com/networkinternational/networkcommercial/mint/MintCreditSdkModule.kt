package com.networkinternational.networkcommercial.mint

import android.graphics.Color
import android.util.Base64
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity
import com.networkinternational.networkcommercial.R
import com.mintcredit.MintCreditSdk
import com.mintcredit.SdkError
import com.mintcredit.SdkEventListener
import com.mintcredit.SdkOutcome
import com.mintcredit.SdkRequest
import com.mintcredit.SdkUiStyle
import com.mintcredit.SdkUserDetails
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MintCreditSdkModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    private var headerHeightPx: Int = 0
    private var footerHeightPx: Int = 0

    override fun getName(): String = "MintCreditSdkModule"

    @ReactMethod
    fun show(headerHeight: Double, footerHeight: Double) {
        val activity = reactApplicationContext.currentActivity as? AppCompatActivity ?: return
        activity.runOnUiThread {
            rememberInsets(headerHeight, footerHeight)
            val content = activity.findViewById<ViewGroup>(android.R.id.content) ?: return@runOnUiThread
            val container = sdkContainer(activity, content)
            MintCreditSdk.initialize(activity.applicationContext)
            MintCreditSdk.show(
                fragmentManager = activity.supportFragmentManager,
                request = hostRequest(),
                listener = sdkListener(activity, content, container),
                containerId = container.id,
            )
            if (container.childCount == 0) {
                content.removeView(container)
            }
        }
    }

    @ReactMethod
    fun updateInsets(headerHeight: Double, footerHeight: Double) {
        val activity = reactApplicationContext.currentActivity as? AppCompatActivity ?: return
        activity.runOnUiThread {
            rememberInsets(headerHeight, footerHeight)
            val content = activity.findViewById<ViewGroup>(android.R.id.content) ?: return@runOnUiThread
            content.findViewById<FrameLayout>(R.id.mint_credit_sdk_container)?.let { applyInsets(it) }
        }
    }

    @ReactMethod
    fun goBack() {
        val activity = reactApplicationContext.currentActivity as? AppCompatActivity ?: return
        activity.runOnUiThread {
            activity.onBackPressedDispatcher.onBackPressed()
        }
    }

    @ReactMethod
    fun close() {
        val activity = reactApplicationContext.currentActivity as? AppCompatActivity ?: return
        activity.runOnUiThread {
            if (activity.supportFragmentManager.findFragmentByTag(SDK_FRAGMENT_TAG) == null &&
                activity.findViewById<View>(R.id.mint_credit_sdk_container) == null
            ) {
                return@runOnUiThread
            }
            MintCreditSdk.clearSession()
        }
    }

    private fun rememberInsets(headerHeight: Double, footerHeight: Double) {
        val density = reactApplicationContext.resources.displayMetrics.density
        headerHeightPx = (headerHeight * density).toInt().coerceAtLeast(0)
        footerHeightPx = (footerHeight * density).toInt().coerceAtLeast(0)
    }

    private fun sdkListener(
        activity: AppCompatActivity,
        content: ViewGroup,
        container: FrameLayout,
    ): SdkEventListener {
        return object : SdkEventListener {
            override fun onResult(result: SdkOutcome) {
                emit(SCREEN_EVENT, result.screen)
            }

            override fun onDismissed() {
                activity.runOnUiThread {
                    content.removeView(container)
                    emit(DISMISSED_EVENT, null)
                }
            }

            override fun onError(error: SdkError) {
                android.util.Log.e(NAME, "${error.code}: ${error.message}")
            }
        }
    }

    private fun emit(event: String, title: String?) {
        val payload = Arguments.createMap().apply {
            if (title != null) {
                putString("title", title)
            }
        }
        reactApplicationContext.emitDeviceEvent(event, payload)
    }

    private fun sdkContainer(
        activity: AppCompatActivity,
        content: ViewGroup,
    ): FrameLayout {
        val existing = content.findViewById<FrameLayout>(R.id.mint_credit_sdk_container)
        val container = existing ?: FrameLayout(activity).apply {
            id = R.id.mint_credit_sdk_container
            setBackgroundColor(PARENT_BACKGROUND)
            content.addView(this)
        }
        applyInsets(container)
        return container
    }

    private fun applyInsets(container: FrameLayout) {
        container.layoutParams = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
        ).apply {
            topMargin = headerHeightPx
            bottomMargin = footerHeightPx
        }
    }

    private fun hostRequest(): SdkRequest {
        return SdkRequest(
            baseUrl = BASE_URL,
            accessToken = ACCESS_TOKEN,
            refreshToken = REFRESH_TOKEN,
            clientAssertion = clientAssertion(),
            customerId = CUSTOMER_ID,
            cif = CIF,
            mobile = MOBILE,
            nationalId = NATIONAL_ID,
            customerType = CUSTOMER_TYPE,
            userDetails = SdkUserDetails(
                fullName = FULL_NAME,
                firstName = FIRST_NAME,
                lastName = LAST_NAME,
                email = EMAIL,
                gender = GENDER,
                mobile = MOBILE,
            ),
            style = SdkUiStyle(
                primary = Color.parseColor("#0069B1"),
                onPrimary = Color.WHITE,
                background = PARENT_BACKGROUND,
                onBackground = Color.BLACK,
                surface = PARENT_BACKGROUND,
                onSurface = Color.parseColor("#1A1C1E"),
                secondary = Color.parseColor("#707070"),
                onSecondary = Color.WHITE,
                cornerRadiusDp = 20f,
                danger = Color.parseColor("#BA1A1A"),
                success = Color.parseColor("#2FBF71"),
                warning = Color.parseColor("#C97A20"),
            ),
            tenantId = TENANT_ID,
            locale = LOCALE,
            clientId = CLIENT_ID,
            clientSecret = CLIENT_SECRET,
        )
    }

    private fun clientAssertion(): String {
        val flags = Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING
        val header = Base64.encodeToString("{}".toByteArray(Charsets.UTF_8), flags)
        val payload = Base64.encodeToString(
            """{"source":"android","tenant":"$TENANT_ID"}""".toByteArray(Charsets.UTF_8),
            flags,
        )
        return "$header.$payload.signature"
    }

    private companion object {
        const val NAME: String = "MintCreditSdkModule"
        const val SDK_FRAGMENT_TAG: String = "com.mintcredit.SdkFragment"
        const val SCREEN_EVENT: String = "MintCreditSdkScreen"
        const val DISMISSED_EVENT: String = "MintCreditSdkDismissed"
        const val PARENT_BACKGROUND: Int = 0xFFFFFFFF.toInt()
        const val BASE_URL: String = "https://sdk-bff.example/"
        const val ACCESS_TOKEN: String = "access-token"
        const val REFRESH_TOKEN: String = "refresh-token"
        const val CUSTOMER_ID: String = "C1"
        const val CIF: String = "CIF-100"
        const val MOBILE: String = "971500000001"
        const val NATIONAL_ID: String = "784199012345671"
        const val CUSTOMER_TYPE: String = "individual"
        const val TENANT_ID: String = "A"
        const val LOCALE: String = "en"
        const val CLIENT_ID: String = "omH6VhOKh52wBuJf9SSv5A"
        const val CLIENT_SECRET: String = "S3P-9NVoKnhToUsMkXKJGY10aDip8HDy5J00ACg1w3A"
        const val FULL_NAME: String = "Customer C1"
        const val FIRST_NAME: String = "Customer"
        const val LAST_NAME: String = "C1"
        const val EMAIL: String = "c1@bank.example"
        const val GENDER: String = "unspecified"
    }
}
