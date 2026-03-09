package com.techmojo.networkcommercial.network

import com.facebook.react.bridge.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import java.io.IOException

class SecureApiModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SecureApi"
    }

    private fun performRequest(
        method: String,
        url: String,
        body: String?,
        headers: ReadableMap?,
        promise: Promise
    ) {

        val client = SecureHttpClient.getClient()

        var requestBody: RequestBody? = null

        if (!body.isNullOrEmpty()) {
            requestBody = RequestBody.create(
                "application/json".toMediaTypeOrNull(),
                body
            )
        }

        val builder = Request.Builder().url(url)

        headers?.let {
            val iterator = it.keySetIterator()
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                builder.addHeader(key, it.getString(key) ?: "")
            }
        }

        when (method) {
            "POST" -> builder.post(requestBody!!)
            "PUT" -> builder.put(requestBody!!)
            "PATCH" -> builder.patch(requestBody!!)
            "DELETE" -> if (requestBody != null) builder.delete(requestBody) else builder.delete()
            else -> builder.get()
        }

        val request = builder.build()

        client.newCall(request).enqueue(object : okhttp3.Callback {

            override fun onFailure(call: Call, e: IOException) {
                promise.reject("NETWORK_ERROR", e)
            }

            override fun onResponse(call: Call, response: Response) {

                val data = Arguments.createMap()
                data.putInt("status", response.code)
                data.putString("bodyString", response.body?.string() ?: "")

                promise.resolve(data)
            }
        })
    }

    @ReactMethod
    fun get(url: String, headers: ReadableMap?, promise: Promise) {
        performRequest("GET", url, null, headers, promise)
    }

    @ReactMethod
    fun post(url: String, body: String, headers: ReadableMap?, promise: Promise) {
        performRequest("POST", url, body, headers, promise)
    }

    @ReactMethod
    fun put(url: String, body: String, headers: ReadableMap?, promise: Promise) {
        performRequest("PUT", url, body, headers, promise)
    }

    @ReactMethod
    fun delete(url: String, body: String?, headers: ReadableMap?, promise: Promise) {
        performRequest("DELETE", url, body, headers, promise)
    }

    @ReactMethod
    fun patch(url: String, body: String, headers: ReadableMap?, promise: Promise) {
        performRequest("PATCH", url, body, headers, promise)
    }
}