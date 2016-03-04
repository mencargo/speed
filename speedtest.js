function DownloadTester(serverURL,done,update,err){
	this.xhr=new XMLHttpRequest();
	this.firstTick=true;
	this.prevLoaded=0;
	this.startT=new Date().getTime();
	this.prevT=new Date().getTime();
	this.speed=0.0;
	if(done)this.onDone=done; if(update)this.onUpdate=update; if(err)this.onFail=err;
	this.xhr.onprogress=function(event){
		var instspd=(event.loaded-this.prevLoaded)/((new Date().getTime()-this.prevT)/1000.0);
		if(isNaN(instspd)||!isFinite(instspd)) return;
		if(this.firstTick){
			this.speed=instspd;
			this.firstTick=false;
		}else{
			this.speed=this.speed*0.9+instspd*0.1;
		}
		this.prevLoaded=event.loaded;
		this.prevT=new Date().getTime();
		this.onUpdate();
		if(((this.prevT-this.startT)/1000.0)>15){try{this.xhr.abort();}catch(e){} this.onDone();}
	}.bind(this);
	this.xhr.onload=function(){
		this.onUpdate();
		this.onDone();
	}.bind(this);
	this.xhr.onerror=function(){
		this.onUpdate();
		this.onFail();
	}.bind(this);
	this.xhr.open("GET", serverURL+"?random="+Math.random(),true);
	this.xhr.send();
}
DownloadTester.prototype={
	constructor:DownloadTester,
	onDone:function(){},
	onFail:function(){},
	onUpdate:function(){},
	getValue:function(){return ((this.speed*8)/1048576.0).toFixed(2);},
	cancel:function(){try{this.xhr.abort();}catch(e){}}
}

function UploadTester(serverURL,done,update,err){
	this.xhr=new XMLHttpRequest();
	this.firstTick=true;
	this.prevLoaded=0;
	this.startT=new Date().getTime();
	this.prevT=new Date().getTime();
	this.speed=0.0;
	if(done)this.onDone=done; if(update)this.onUpdate=update; if(err)this.onFail=err;
	this.xhr.upload.onprogress=function(event){
		var instspd=(event.loaded-this.prevLoaded)/((new Date().getTime()-this.prevT)/1000.0);
		if(isNaN(instspd)||!isFinite(instspd)) return;
		if(this.firstTick){
			this.firstTick=false;
		}else{
			this.speed=this.speed*0.7+instspd*0.3;
		}
		this.prevLoaded=event.loaded;
		this.prevT=new Date().getTime();
		this.onUpdate();
		if(((this.prevT-this.startT)/1000.0)>15){try{this.xhr.abort();}catch(e){} this.onDone();}
	}.bind(this);
	this.xhr.onload=function(){
		this.onUpdate();
		this.onDone();
	}.bind(this);
	this.xhr.onerror=function(){
		this.onUpdate();
		this.onFail();
	}.bind(this);
	this.xhr.open("POST", serverURL+"?random="+Math.random(),true);
	this.xhr.send(new ArrayBuffer(10485760));
}
UploadTester.prototype={
	constructor:UploadTester,
	onDone:function(){},
	onFail:function(){},
	onUpdate:function(){},
	getValue:function(){return ((this.speed*8)/1048576.0).toFixed(2);},
	cancel:function(){try{this.xhr.abort();}catch(e){}}
}

function PingTester(serverURL,done,update,err){
	this.xhr=null;
	this.prevT=null;
	this.ping=0.0;
	this.i=0;
	this.pingURL=serverURL;
	if(done)this.onDone=done;
	if(update)this.onUpdate=update;
	if(err)this.onFail=err;
	this.doPing=function(){
		this.prevT=new Date().getTime();
		this.xhr=new XMLHttpRequest();
		this.xhr.onload=function(){
			if(this.i==0){
				this.prevT=new Date().getTime();
			}else{
				var instspd=new Date().getTime()-this.prevT;
				if(this.i==1) this.ping=instspd; else this.ping=this.ping*0.9+instspd*0.1;
			}
			this.onUpdate();
			this.i++;
			if(this.i<50) this.doPing(); else this.onDone();
		}.bind(this);
		this.xhr.onerror=function(){
			this.onUpdate();
			this.onFail();
		}.bind(this);
		this.xhr.open("GET", this.pingURL+"?random="+Math.random(),true);
		this.xhr.send();
	}.bind(this);
	this.doPing();
}
PingTester.prototype={
	constructor:PingTester,
	onDone:function(){},
	onFail:function(){},
	onUpdate:function(){},
	getValue:function(){return this.ping.toFixed(2);},
	cancel:function(){this.i=9999; if(this.xhr) try{xhr.abort();}catch(e){}}
}