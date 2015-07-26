function TitanCastApplicationIcon(a){this.image="","string"==typeof a?this.image=a:a instanceof Image&&(this.image="#none#")}function PacketClass(a,b){this.type=a,this.data=b}var TitanCastAPI={};TitanCastAPI.globalOptions={port:25517,debugging:!1},TitanCastAPI.version="0.1.3.1";var TitanCastApplication=function(a,b,c,d,e){this.appName=a,this.appDesc=b,this.appCastURL=c,this.setIcon(d,e)};TitanCastApplication.prototype.createDevice=function(a,b){return new TitanCastDevice(a,this,b)},TitanCastApplication.prototype.setIcon=function(a,b){if(a){var c=this;a instanceof Image?a.complete?TitanCastUtils.base64Loaded(a,function(a){c.icon=a;var d=b||c.onIconLoad||function(){};d()}):TitanCastUtils.base64Img(a,function(a){c.icon=a;var d=b||c.onIconLoad||function(){};d()}):("string"==typeof a||a instanceof String)&&"@"===a.charAt(0)?TitanCastUtils.base64URL(a.substr(1),function(a){c.icon=a.substr(22);var d=b||c.onIconLoad||function(){};d()}):this.icon=a}else this.icon="#none#"};var TitanCastDevice=function(a,b,c){if(this.uri=a.trim(),this.application=b,this.connectionState=ConnectionStates.NOT_CONNECTED,this.deviceDetails=[],c=c||{},this.port=c.port||TitanCastAPI.globalOptions.port,this.events=[],-1==this.uri.indexOf(".")){var d=this.uri.split(" "),e=[];for(chunk in d)e.push(parseInt(d[chunk],16));this.uri=e.join(".")}if(this.websocket=new WebSocket("wss://"+this.uri+":"+this.port),this.debugging=c.debugging||TitanCastAPI.globalOptions.debugging,this.debuggingStore={byteLength:0,packetLength:0},this.debugging){var f=this;setInterval(function(){debugTransfer(f)},1e3)}this.onmessage=function(a){var b=Packet.parse(a.data);if(this.debugging&&(this.debuggingStore.byteLength+=a.data.length,this.debuggingStore.packetLength++),this.connectionState==ConnectionStates.NOT_CONNECTED&&"device_details"==b.type&&(this.deviceDetails=b.data,this.send(Packet.create("request_connect",[this.application.appName,this.application.appDesc,this.application.icon])),console.log(this.application.icon),this.connectionState=ConnectionStates.AWAITING_RESPONSE,this.triggerEvent("sentRequest")),this.connectionState==ConnectionStates.AWAITING_RESPONSE){if("accept_connect_request"==b.type)return this.send(Packet.create("cast_view_data",this.application.appCastURL)),this.connectionState=ConnectionStates.CONNECTED,void this.triggerEvent("connectAccept");if("reject_connect_request"==b.type)return this.connectionState=ConnectionStates.NOT_CONNECTED,void this.triggerEvent("connectReject")}if(this.connectionState==ConnectionStates.CONNECTED)switch(b.type){case"custom_data":this.triggerEvent("customData",[b.data]);break;case"accelerometer-update":var c=b.data;c={x:parseFloat(c[0]),y:parseFloat(c[1]),z:parseFloat(c[2])},this.triggerEvent("accelerometerData",[c]);break;case"view-loaded":this.triggerEvent("viewLoaded");break;default:this.triggerEvent("badPacket")}},this.onclose=function(){this.triggerEvent("connectionClosed")},this.onerror=function(a){this.triggerEvent("connectionError",a)};var g=this;this.websocket.onmessage=function(a){g.onmessage.call(g,a)},this.websocket.onclose=function(a){g.onclose(a)},this.websocket.onerror=function(a){g.onerror(a)}};TitanCastDevice.prototype.send=function(a){this.websocket.send(a.serialize())},TitanCastDevice.prototype.triggerEvent=function(a,b){return this.events[a]?void this.events[a].apply(this,b):!1},TitanCastDevice.prototype.on=function(a,b){this.events[a]=b},TitanCastDevice.prototype.off=function(a){this.events[a]=function(){}},TitanCastDevice.prototype.enableAccelerometer=function(){this.send(Packet.create("enable_accelerometer"))},TitanCastDevice.prototype.disableAccelerometer=function(){this.send(Packet.create("disable_accelerometer"))},TitanCastDevice.prototype.setAccelerometerSpeed=function(a){this.send(Packet.create("set_accelerometer_speed",a))},TitanCastDevice.prototype.setOrientation=function(a){this.send(Packet.create("set_orientation",a))},debugTransfer=function(a){console.log("packets",a.debuggingStore.packetLength),console.log("kB",a.debuggingStore.byteLength/1024),console.log(""),a.debuggingStore.packetLength=0,a.debuggingStore.byteLength=0},TitanCastUtils={},TitanCastUtils.base64URL=function(a,b,c){var d=new Image;d.crossOrigin="Anonymous",d.onload=function(){var a,d=document.createElement("CANVAS"),e=d.getContext("2d");d.height=this.height,d.width=this.width,e.drawImage(this,0,0),a=d.toDataURL(c),b(a),d=null},d.src=a},TitanCastUtils.base64Img=function(a,b,c){a.crossOrigin="Anonymous",a.onload=function(){var a,d=document.createElement("CANVAS"),e=d.getContext("2d");d.height=this.height,d.width=this.width,e.drawImage(this,0,0),a=d.toDataURL(c),b(a),d=null}},TitanCastUtils.base64Loaded=function(a,b,c){a.crossOrigin="Anonymous";var d,e=document.createElement("CANVAS"),f=e.getContext("2d");e.height=this.height,e.width=this.width,f.drawImage(this,0,0),d=e.toDataURL(c),b(d),e=null};var ConnectionStates={NOT_CONNECTED:"not connected",CONNECTED:"connected",AWAITING_RESPONSE:"awaiting response"},AccelerometerSpeed={GAME:"game",FASTEST:"fastest",UI:"ui"};Base64={},Base64.decode=function(a){return atob(a)},Base64.encode=function(a){return btoa(encodeURIComponent(a).replace(/%([0-9A-F]{2})/g,function(a,b){return String.fromCharCode("0x"+b)}))},PacketClass.prototype.serialize=function(){var a=this.type;for(dataKey in this.data)a+=" "+Base64.encode(this.data[dataKey]);return a},Packet={},Packet.create=function(a,b){return b?b instanceof Array?new PacketClass(a,b):new PacketClass(a,[b]):new PacketClass(a,[""])},Packet.parse=function(a){var b=a.split(" "),c=[],d=-1,e=new String;for(chunkKey in b){d++;var f=b[chunkKey];if(0!=d){try{c[d-1]=Base64.decode(f)}catch(g){try{c[d-1]=Base64.decode(f.substring(0,f.length-1))}catch(g){c[d-1]=""}}f=c[d-1]}else e=f}return Packet.create(e,c)};
//# sourceMappingURL=builds/sourcemap.map