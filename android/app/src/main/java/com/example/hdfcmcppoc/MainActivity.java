package com.example.hdfcmcppoc;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Bridge;
import android.webkit.WebChromeClient;
import android.webkit.GeolocationPermissions;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // This enables geolocation in the WebView
        this.bridge.getWebView().setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                // Grant permission
                callback.invoke(origin, true, false);
            }
        });
    }
}
