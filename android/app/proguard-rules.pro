# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# NI Card Management SDK – data-binding BR class referenced at runtime
-dontwarn ae.network.nicardmanagementsdk.BR
-keep class ae.network.nicardmanagementsdk.BR { *; }
-keep class ae.network.nicardmanagementsdk.databinding.** { *; }

# OkHttp / react-native-ssl-pinning
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
