# Mobile wallet provider integrations

The bitcoin wallet api package allows for integrations into mobile webviews in Android and iOS applications. The following details the method for communication for each platform, and the interface to facilitate client interactions.

All interactions between the client web application and the wallet provider are async. Requests from the web app will be sent across to the wallet provider using the provided webview to native app interface, and will expect the request to be fulfiled or rejected based on input from the user.

## Android

Communication with the webview is handled using the `WebView` methods, `evaluateJavascript` and `addJavascriptInterface`.

### Receiving messages from the webview

Create a class with a `JavascriptInterface` funtion called `messageHandler`.
```
class WebAppJavascriptInterface() {
  @JavascriptInterface
  fun messageHandler(jsonString: String) {
    // parse stringified json
    // handle input message
  }
}
```

Add the javascript interface method to the global `_bitcoinWalletApi` object within the webview.
```
<webview_instance>.addJavascriptInterface(WebAppJavascriptInterface(), "_bitcoinWalletApi")
```

### Sending messages into the webview

A method `receiveMessage` will be available on the global `_bitcoinWalletApi` object within the webview, which will receive responses from the native app.

To call it by using the `evaluateJavascript` method on the webview instance.
```
<webview_instance>.evaluateJavascript("_bitcoinWalletApi.receiveMessage(" + <stringified_message_object> + ")")
```

## iOS

Communication with the webview is handled using the `WKWebView` methods, `evaluateJavascript` and a custom message handler `sendMessageHandler` in the `WKUserContentController`.

### Receiving messages from the webview

When initializing your webview, make sure to pass in the content controller to the config with a message handler named `sendMessageHandler`. This will be made avaiable within the webview so that the javascript code can send data to the native app.
```
let contentController = WKUserContentController()
contentController.add(self, name: "sendMessageHandler")
let config = WKWebViewConfiguration()
config.userContentController = contentController
let webView = WKWebView( frame: <frame_bounds>, configuration: config)
```

Create a handler for the messages being received from the webview. Incoming messages will have an attribute `name` value of `sendMessageHandler`, which we specified earlier.
```
extension WebViewController: WKScriptMessageHandler {
  func userContentController(_ userContentController: WKUserContentController,
                              didReceive message: WKScriptMessage) {
    
    if (message.name != "sendMessageHandler") {
        return
    }

    // parse stringified json
    // handle input message
  }
}
```

### Sending messages into the webview

A method `receiveMessage` will be available on the global `_bitcoinWalletApi` object within the webview, which will receive responses from the native app.

To call it by using the `evaluateJavascript` method on the webview instance.
```
<webview_instance>.evaluateJavaScript("_bitcoinWalletApi.receiveMessage(\(<stringified_message_object>))") { (result, error) in
  if error != nil {
    print(result)
  }
}
```

## Message interface

Messages sent to and from the client app and the wallet provider are all async and will have the following format. Replies to incoming messages will be identified by the client by the messageId that is sent back into the webview after user input.

### Messages sent from the webview to the native app

```
interface Message {
  messageId: string; // arbitrary unique id which should be passed back to the webview as the response.
  command: string; // method on the dapi which was called (eg. getAddress, sendAssets)
  data?: any; // any input data for the method that was called (eg. for getAddress, it could be {protocol: "SLP"})
}
```

### Messages sent back into the webview from the native app

```
interface Message {
  messageId: string; // messageId for the incoming message which is being responded to
  command: string; // method on the dapi which was called (eg. getAddress, sendAssets)
  data?: any; // any response data for the method that was called (eg. for getAddress, it could be {address: "bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq"})
  error?: Error; // if there was an error in the transaction or if the user rejected the transaction request
}

interface Error {
  type: string;
  description?: string;
  data?: any;
}
```