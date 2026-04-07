package com.networkinternational.networkcommercial.network

import com.networkinternational.networkcommercial.BuildConfig
import okhttp3.CertificatePinner
import okhttp3.OkHttpClient
import okhttp3.Protocol
import okhttp3.ConnectionSpec
import okhttp3.TlsVersion
import java.util.concurrent.TimeUnit

object SecureHttpClient {

    private var client: OkHttpClient? = null

    fun getClient(): OkHttpClient {

        if (client == null) {
            val builder = OkHttpClient.Builder()

            // 1. Force HTTP/1.1 as a baseline for debugging (HTTP/2 often causes INTERNAL_ERROR)
            builder.protocols(listOf(Protocol.HTTP_1_1))

            // 2. Increase timeouts to handle slower prod handshakes or redirects
            builder.connectTimeout(30, TimeUnit.SECONDS)
            builder.readTimeout(30, TimeUnit.SECONDS)
            builder.writeTimeout(30, TimeUnit.SECONDS)

            // 3. Explicitly allow modern TLS versions
            val spec = ConnectionSpec.Builder(ConnectionSpec.MODERN_TLS)
                .tlsVersions(TlsVersion.TLS_1_2, TlsVersion.TLS_1_3)
                .build()
            builder.connectionSpecs(listOf(spec, ConnectionSpec.CLEARTEXT))

            // 4. Add User-Agent to mimic a browser or iOS client (some servers reject OkHttp default)
            builder.addInterceptor { chain ->
                val original = chain.request()
                val request = original.newBuilder()
                    .header("User-Agent", "NICCApp/1.0 (Android; " + android.os.Build.VERSION.RELEASE + ")")
                    .build()
                chain.proceed(request)
            }

            // 5. SSL Pinning
            val hostname = BuildConfig.SSL_PINNING_HOSTNAME
            
            if (!hostname.isNullOrEmpty()) {
                val pinnerBuilder = CertificatePinner.Builder()
                val sha1 = BuildConfig.SSL_PINNING_SHA256_1
                val sha2 = BuildConfig.SSL_PINNING_SHA256_2

                if (!sha1.isNullOrEmpty() && sha1 != "ENTER_SHA256_1_HERE") {
                    pinnerBuilder.add(hostname, "sha256/$sha1")
                }
                if (!sha2.isNullOrEmpty() && sha2 != "ENTER_SHA256_2_HERE") {
                    pinnerBuilder.add(hostname, "sha256/$sha2")
                }
                
                try {
                    builder.certificatePinner(pinnerBuilder.build())
                } catch (e: Exception) {
                    // Fallback to no pinning if configuration is invalid
                }
            }

            client = builder.build()
        }

        return client!!
    }
}