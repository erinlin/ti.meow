#Ti.Meow
##### Version 0.5
Ti.Meow provides the ability to write code snippets in a browser and render the code across all iOS and Android devices.This project only for learning Node.js without using any other open soucre Node.js modules. Therefore doesn't use socket server for continuous connection. Reference from [dbankier/TiShadow](https://github.com/dbankier/TiShadow).

本專案參考自 [dbankier/TiShadow](https://github.com/dbankier/TiShadow) 。目前版本功能僅提供瀏覽器鍵入程式片段傳送至安裝 Ti.Meow Module 的 [Titanium Mobile](http://www.appcelerator.com/) 專案之 Android 或 iOS 手執裝置做即時預覽。

製作原則僅為學習使用 Node.js，在不採用任何外掛模組下，也撇除因 Android 瀏覽器版本不支援 HTML5 WebSocket，故採用 long pulling 方式進行即時更新。

![ti.meow test](https://lh4.googleusercontent.com/-3bgZbgbpWzg/T4gFQ5pMm-I/AAAAAAAABQg/UT89Q4Rrntg/s288/ti.meow-1.jpg)

##Ti.Meow server
* [node.js](http://nodejs.org/)

Start the server:

    node app.js [ip] [port]
	//default 127.0.0.1 3000


## Test Ti.Meow Project
Start a new Titanium Mobile project and then place the ti.meow.js file in Resources folder. Just require the  ti.meow commonJS module into app.js like below:
	
	var timeow = require("ti.meow").start();
	
## Code Snippets Via Webpage
Enter the following address in a browser window:

    http://localhost:3000/

Wrap your code in an anonymous function returns a view object that contains `open` and `close` functions.

	(function() {
      var win = Ti.UI.createWindow();
	
      return win;
    }());