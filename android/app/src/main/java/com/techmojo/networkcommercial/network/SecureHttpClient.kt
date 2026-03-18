package com.networkinternational.networkcommercial.network

import okhttp3.CertificatePinner
import okhttp3.OkHttpClient

object SecureHttpClient {

    private var client: OkHttpClient? = null

    fun getClient(): OkHttpClient {

        if (client == null) {

            val hostname = "sit.corporate.un.infradev.w4.az.network.ae"
            val certificatePinner = CertificatePinner.Builder()
                .add(
                    "sit.corporate.un.infradev.w4.az.network.ae",
                    "sha256/YGqEby6vfqMde2KyON4Jtg5e1GAtHe9Ky1hrNanULgA="
                )
                .add(
                    "sit.corporate.un.infradev.w4.az.network.ae",
                    "sha256/iFvwVyJSxnQdyaUvUERIf+8qk7gRze3612JMwoO3zdU="
                )
                .build()

            client = OkHttpClient.Builder()
                .certificatePinner(certificatePinner)
                .build()
        }

        return client!!
    }
}