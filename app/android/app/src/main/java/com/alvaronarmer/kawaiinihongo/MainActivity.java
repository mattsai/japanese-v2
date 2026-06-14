package com.alvaronarmer.kawaiinihongo;

import android.app.Activity;
import android.content.res.AssetManager;
import android.os.Bundle;
import android.webkit.MimeTypeMap;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final String APP_HOST = "kawaii.nihongo.local";
    private static final String APP_URL = "https://" + APP_HOST + "/index.html";

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setWebViewClient(new LocalAssetClient(getAssets()));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        setContentView(webView);
        webView.loadUrl(APP_URL);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    private static final class LocalAssetClient extends WebViewClient {
        private final AssetManager assets;

        LocalAssetClient(AssetManager assets) {
            this.assets = assets;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            String host = request.getUrl().getHost();
            if (!APP_HOST.equals(host)) {
                return super.shouldInterceptRequest(view, request);
            }

            String path = request.getUrl().getPath();
            if (path == null || "/".equals(path)) {
                path = "/index.html";
            }

            return openAsset(path);
        }

        private WebResourceResponse openAsset(String urlPath) {
            String assetPath = "public" + urlPath;
            try {
                InputStream stream = assets.open(assetPath);
                return new WebResourceResponse(mimeType(assetPath), "UTF-8", stream);
            } catch (IOException missing) {
                try {
                    InputStream stream = assets.open("public/index.html");
                    return new WebResourceResponse("text/html", "UTF-8", stream);
                } catch (IOException fallbackMissing) {
                    return null;
                }
            }
        }

        private String mimeType(String path) {
            String extension = MimeTypeMap.getFileExtensionFromUrl(path).toLowerCase(Locale.US);
            String type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
            if (type != null) {
                return type;
            }
            if (path.endsWith(".js")) {
                return "application/javascript";
            }
            if (path.endsWith(".css")) {
                return "text/css";
            }
            if (path.endsWith(".webmanifest")) {
                return "application/manifest+json";
            }
            return "text/plain";
        }
    }
}
