/**
 * Ti.Meow, Titanium Mobile Simple Live Preview Module
 * Author: Erin Lin
 * https://github.com/erinlin
 * Your reuse is governed by the Creative Commons Attribution 3.0 License
 */
var current;
(function(){
	//library includes
	var ti = Ti;
})();

exports.start = function() {
	var isAndroid = Ti.Platform.osname === "android";
	
	var win = Ti.UI.createWindow({
		backgroundColor:"#ccc", 
		title:"Ti.Meow", 
		layout:"vertical"
	});
	
	var label = Ti.UI.createLabel({
		text: "Ti.Meow", 
		width: "auto", 
		height: "60dp",
		top: "10dp",
		color:'#999',
		font:{fontSize:'45dp',fontFamily:'Helvetica Neue'},
	});
	
	win.add( label );
	
	var ipInput = Ti.UI.createTextField({
		value:  Ti.App.Properties.getString('ip', "127.0.0.1"),
		width: "200dp", 
		height: "45dp",
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		top: "10dp"
	});
	
	win.add( ipInput );
	
	var portInput = Ti.UI.createTextField({
		value: Ti.App.Properties.getString('port', "1337"),
		width: "200dp", 
		height: "45dp",
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		top: "10dp"
	});
	
	win.add( portInput );
	
	var btn = Ti.UI.createButton({
		title:"Connect",
		width: "120dp", 
		height: "50dp",
		top: "10dp"
	});
	
	win.add( btn );
	
	var connecting = function(e){
		btn.title = "Connecting...";
		if( isAndroid ){
			btn.enabled = false;
			ipInput.enabled = false;
			portInput.enabled = false;
		}else{
			win.touchEnabled = false;
			win.opacity = .7;
		}
	};

	btn.addEventListener("click", function(){
		Ti.App.Properties.setString('ip', ipInput.value );
		Ti.App.Properties.setString('port', portInput.value );
		if( isAndroid ) Ti.UI.Android.hideSoftKeyboard();
		connecting();
		sync();
	} );
	
	win.open();
	
	if( isAndroid ){
		 Ti.Android.currentActivity.addEventListener('pause', function(e){
			Ti.Android.currentActivity.finish();
		});
	}
	
	function sync() {
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(40000);
		xhr.onload = function() {
			xhr.abort();
			var result = JSON.parse(this.responseText);
			if( !result ) this.onerror();
			Ti.API.info(this.responseText);
			try {
				if( result.state ){
					if(current && current.close !== undefined) {
						current.close();
					}
					current = eval(result.code);
					if(current && current.open !== undefined) {
						current.open();
					}
					Ti.API.info("Deployed");
				}
				sync();
			} catch (e) {
				var error_message;
				if(e.line === undefined) {
					error_message = e.toString();
				} else {//iOS Error
					error_message = "Line " + e.line + ": " + e.message;
				}
				Ti.API.debug(error_message);
			}
		};
		xhr.onerror = function() {
			alert('HttpRequest ERROR');
			if( isAndroid ){
				btn.enabled = true;
				ipInput.enabled = true;
				portInput.enabled = true;
			}else{
				win.touchEnabled = true;
				win.opacity = 1;
			}
			btn.title = "Connect";
			if(current && current.close !== undefined) {
				current.close();
			}
		}
		xhr.open('GET', 'http://' + Ti.App.Properties.getString('ip') + ":" + Ti.App.Properties.getString('port') + "/sync?os=" + Ti.Platform.osname);
		xhr.send();
	}
}
