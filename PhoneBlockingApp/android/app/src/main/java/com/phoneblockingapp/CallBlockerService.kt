package com.phoneblockingapp

import android.content.Context
import android.service.calls.CallScreeningService
import android.service.calls.CallScreeningService.CallResponse
import android.util.Log
import org.json.JSONArray

class CallBlockerService : CallScreeningService() {
    override fun onScreenCall(details: Call.Details) {
        val prefs = applicationContext.getSharedPreferences("RNAsyncStorage", Context.MODE_PRIVATE)
        val json = prefs.getString("@blocked_numbers", "[]")
        val numbers = mutableSetOf<String>()
        try {
            val arr = JSONArray(json)
            for (i in 0 until arr.length()) {
                numbers.add(arr.getString(i))
            }
        } catch (e: Exception) {
            Log.w("CallBlockerService", "Failed to parse blocked numbers", e)
        }

        val incoming = details.handle?.schemeSpecificPart
        if (incoming != null && numbers.contains(incoming)) {
            val response = CallResponse.Builder()
                .setDisallowCall(true)
                .setRejectCall(true)
                .setSkipNotification(true)
                .build()
            respondToCall(details, response)
        } else {
            respondToCall(details, CallResponse.Builder().build())
        }
    }
}
