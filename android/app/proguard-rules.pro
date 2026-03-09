# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in the proguard-android.txt. For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# --- NI SDK team recommended rules (AGP 8.x / R8 full mode) ---
# Required for X.509 certificate generation
-keep class org.bouncycastle.** { *; }

# NI Card Management SDK
-keep class ae.network.nicardmanagementsdk.** { *; }
-keepclassmembers class ae.network.nicardmanagementsdk.** { *; }

# Stack traces with class names and line numbers when reflection is used
-keepattributes Exceptions, InnerClasses, Signature, Deprecated, SourceFile, LineNumberTable, *Annotation*, EnclosingMethod

# ClassCastException: Class cannot be cast to ParameterizedType (R8 FAQ: GSON TypeToken + Kotlin)
# https://r8.googlesource.com/r8/+/refs/heads/master/compatibility-faq.md#troubleshooting
-keepattributes Signature
-keep class com.google.gson.reflect.TypeToken { *; }
-keep class * extends com.google.gson.reflect.TypeToken
-keep class kotlin.coroutines.Continuation
-keep class kotlin.coroutines.** { *; }
# --- End NI SDK team rules ---

# NI Card Management SDK (additional)
-dontwarn ae.network.nicardmanagementsdk.BR
-keep class ae.network.nicardmanagementsdk.BR { *; }
-keep class ae.network.nicardmanagementsdk.databinding.** { *; }

-keep class com.nicardmanagement.** { *; }
-keep class com.niwrappercardmanagementrn.** { *; }

-keep class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**

# SSL / Certificate - keep Conscrypt (Android TLS); dontwarn optional providers
-keep class com.android.org.conscrypt.** { *; }
-dontwarn com.android.org.conscrypt.**
-dontwarn org.conscrypt.**
-dontwarn org.openjsse.**
-dontwarn javax.annotation.**

# OkHttp / SecureApi
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
