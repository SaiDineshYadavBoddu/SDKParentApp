package com.networkinternational.networkcommercial.network

import com.networkinternational.networkcommercial.BuildConfig
import okhttp3.CertificatePinner
import okhttp3.OkHttpClient

object SecureHttpClient {

    private var client: OkHttpClient? = null

    fun getClient(): OkHttpClient {

        if (client == null) {
            val builder = OkHttpClient.Builder()

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