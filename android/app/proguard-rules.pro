# Add project specific ProGuard rules here.
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# FastImage
-keep class com.dylanvann.fastimage.** { *; }

# Keychain
-keep class com.oblador.keychain.** { *; }

# NetInfo
-keep class com.reactnativecommunity.netinfo.** { *; }

# WebView
-keep class com.reactnativecommunity.webview.** { *; }

# Sentry
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
