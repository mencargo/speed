var testStatus=0,dlStatus="",ulStatus="",pingStatus="";
var xhr=null;
this.addEventListener('message', function(e){
	var params=e.data.split(" ");
	if(params[0]=="status"){
		postMessage(testStatus+";"+dlStatus+";"+ulStatus+";"+pingStatus);
	}
	if(params[0]=="start"){
		if(testStatus==0){
			testStatus=1;
			var dlUrl=params[1]?params[1]:"garbage.php", ulUrl=params[2]?params[2]:"empty.dat", pingUrl=params[3]?params[3]:"empty.dat";
			dlTest(dlUrl,function(){testStatus=2;ulTest(ulUrl,function(){testStatus=3;pingTest(pingUrl,function(){testStatus=4;});});});
		}
	}
	if(params[0]=="abort"){
		try{if(xhr)xhr.abort();}catch(e){}
		testStatus=5;dlStatus="";ulStatus="";pingStatus="";
	}
});

function dlTest(serverURL,done){
	var firstTick=true,startT=new Date().getTime(), prevT=new Date().getTime(),prevLoaded=0,speed=0.0;
	xhr=new XMLHttpRequest();
	xhr.onprogress=function(event){
		var instspd=(event.loaded-prevLoaded)/((new Date().getTime()-prevT)/1000.0);
		if(isNaN(instspd)||!isFinite(instspd)) return;
		if(firstTick){
			speed=instspd;
			firstTick=false;
		}else{
			speed=speed*0.9+instspd*0.1;
		}
		prevLoaded=event.loaded;
		prevT=new Date().getTime();
		dlStatus=((speed*8)/1048576.0).toFixed(2);
		if(((prevT-startT)/1000.0)>15){try{xhr.abort();}catch(e){} xhr=null; done();}
	}.bind(this);
	xhr.onload=function(){
		dlStatus=((speed*8)/1048576.0).toFixed(2);
		xhr=null;
		done();
	}.bind(this);
	xhr.onerror=function(){
		dlStatus="Fail";
		xhr=null;
		done();
	}.bind(this);
	xhr.open("GET", serverURL+"?random="+Math.random(),true);
	xhr.send();
}

function ulTest(serverURL,done){
	var firstTick=true,startT=new Date().getTime(), prevT=new Date().getTime(),prevLoaded=0,speed=0.0;
	xhr=new XMLHttpRequest();
	xhr.upload.onprogress=function(event){
		var instspd=(event.loaded-prevLoaded)/((new Date().getTime()-prevT)/1000.0);
		if(isNaN(instspd)||!isFinite(instspd)) return;
		if(firstTick){
			firstTick=false;
		}else{
			speed=speed*0.7+instspd*0.3;
		}
		prevLoaded=event.loaded;
		prevT=new Date().getTime();
		ulStatus=((speed*8)/1048576.0).toFixed(2);
		if(((prevT-startT)/1000.0)>15){try{xhr.abort();}catch(e){} xhr=null; done();}
	}.bind(this);
	xhr.onload=function(){
		ulStatus=((speed*8)/1048576.0).toFixed(2);
		done();
	}.bind(this);
	xhr.onerror=function(){
		ulStatus="Fail";
		done();
	}.bind(this);
	xhr.open("POST", serverURL+"?random="+Math.random(),true);
	xhr.send(new ArrayBuffer(10485760));
}

function pingTest(pingUrl,done){
	var prevT=null,ping=0.0,i=0;
	var doPing=function(){
		prevT=new Date().getTime();
		xhr=new XMLHttpRequest();
		xhr.onload=function(){
			if(i==0){
				prevT=new Date().getTime();
			}else{
				var instspd=new Date().getTime()-prevT;
				if(i==1) ping=instspd; else ping=ping*0.9+instspd*0.1;
			}
			pingStatus=ping.toFixed(2);
			i++;
			if(i<50) doPing(); else done();
		}.bind(this);
		xhr.onerror=function(){
			pingStatus="Fail";
			done();
		}.bind(this);
		xhr.open("GET", pingUrl+"?random="+Math.random(),true);
		xhr.send();
	}.bind(this);
	doPing();
}
