function TitanCastApplicationIcon(a){this.image="","string"==typeof a?this.image=a:a instanceof Image&&(this.image="#none#")}function PacketClass(a,b){this.type=a,this.data=b}var TitanCastAPI={};TitanCastAPI.globalOptions={},TitanCastAPI.version="0.1.1";var TitanCastApplication=function(a,b,c,d){this.appName=a,this.appDesc=b,this.appCastURL=c,d?this.icon=d.image?d.image:d:this.icon="#none#"};TitanCastApplication.prototype.createDevice=function(a,b){return new TitanCastDevice(a,this,b)},TitanCastApplication.prototype.getIcon=function(){return this.icon},TitanCastApplication.prototype.setIcon=function(a){this.icon=a},TitanCastApplication.prototype.getAppName=function(){return this.appName},TitanCastApplication.prototype.setAppName=function(a){this.appName=a},TitanCastApplication.prototype.getAppDesc=function(){return this.appDesc},TitanCastApplication.prototype.setAppDesc=function(a){this.appDesc=a},TitanCastApplication.prototype.getAppCastURL=function(){return this.appCastURL},TitanCastApplication.prototype.setAppCastURL=function(a){this.appCastURL=a};var TitanCastDevice=function(a,b,c){if(this.uri=a.trim(),this.application=b,this.connectionState=ConnectionStates.NOT_CONNECTED,this.deviceDetails=[],c=c||{},this.port=c.port||25517,this.events=[],-1==this.uri.indexOf(".")){var d=this.uri.split(" "),e=[];for(chunk in d)e.push(parseInt(d[chunk],16));this.uri=e.join(".")}this.websocket=new WebSocket("ws://"+this.uri+":"+this.port),this.onmessage=function(a){var b=Packet.parse(a.data);if(console.log(this.connectionState,b),this.connectionState==ConnectionStates.NOT_CONNECTED&&"device_details"==b.getType()&&(this.deviceDetails=b.getData(),this.send(Packet.create("request_connect",[this.application.getAppName(),this.application.getAppDesc(),this.application.getIcon()])),this.connectionState=ConnectionStates.AWAITING_RESPONSE,this.triggerEvent("sentRequest")),this.connectionState==ConnectionStates.AWAITING_RESPONSE&&("accept_connect_request"==b.getType()?(this.send(Packet.create("cast_view_data",this.application.getAppCastURL())),this.connectionState=ConnectionStates.CONNECTED,this.triggerEvent("connect accept")):"reject_connect_request"==b.getType()&&(this.connectionState=ConnectionStates.NOT_CONNECTED,this.triggerEvent("connect reject"))),this.connectionState==ConnectionStates.CONNECTED)switch(b.getType()){case"custom_data":this.triggerEvent("custom data",[b.getData()]);break;case"accelerometer-update":var c=b.getData();c={x:parseFloat(c[0]),y:parseFloat(c[1]),z:parseFloat(c[2])},this.triggerEvent("accelerometer data",[c]);break;default:console.log("unknown packet",b)}},this.onclose=function(){this.triggerEvent("connection closed")},this.onerror=function(a){this.triggerEvent("connection error",a)};var f=this;this.websocket.onmessage=function(a){f.onmessage.call(f,a)},this.websocket.onclose=function(a){f.onclose(a)},this.websocket.onerror=function(a){f.onerror(a)}};TitanCastDevice.prototype.send=function(a){this.websocket.send(a.serialize())},TitanCastDevice.prototype.triggerEvent=function(a,b){return this.events[a]?void this.events[a].apply(this,b):!1},TitanCastDevice.prototype.setEvent=function(a,b){this.events[a]=b},TitanCastDevice.prototype.removeEvent=function(a){this.events[a]=function(){}},TitanCastDevice.prototype.enableAccelerometer=function(){this.send(Packet.create("enable_accelerometer"))},TitanCastDevice.prototype.disableAccelerometer=function(){this.send(Packet.create("disable_accelerometer"))},TitanCastDevice.prototype.setAccelerometerSpeed=function(a){this.send(Packet.create("set_accelerometer_speed",a))},TitanCastDevice.prototype.setAccelerometerCap=function(a){this.send(Packet.create("set_accelerometer_cap",a))};var ConnectionStates={NOT_CONNECTED:"not connected",CONNECTED:"connected",AWAITING_RESPONSE:"awaiting response"},AccelerometerSpeed={GAME:"game",FASTEST:"fastest",UI:"ui"};Base64={},Base64.decode=function(a){return atob(a)},Base64.encode=function(a){return btoa(encodeURIComponent(a).replace(/%([0-9A-F]{2})/g,function(a,b){return String.fromCharCode("0x"+b)}))},PacketClass.prototype.getType=function(){return this.type},PacketClass.prototype.setType=function(a){this.type=a},PacketClass.prototype.getData=function(){return this.data},PacketClass.prototype.setData=function(a){this.data=a},PacketClass.prototype.serialize=function(){var a=this.type;for(dataKey in this.data)a+=" "+Base64.encode(this.data[dataKey]);return a},Packet={},Packet.create=function(a,b){return b?b instanceof Array?new PacketClass(a,b):new PacketClass(a,[b]):new PacketClass(a,[""])},Packet.parse=function(a){var b=a.split(" "),c=[],d=-1,e=new String;for(chunkKey in b){d++;var f=b[chunkKey];if(0!=d){try{c[d-1]=Base64.decode(f)}catch(g){try{c[d-1]=Base64.decode(f.substring(0,f.length-1))}catch(g){c[d-1]=""}}f=c[d-1]}else e=f}return Packet.create(e,c)};
//# sourceMappingURL=builds/sourcemap.map