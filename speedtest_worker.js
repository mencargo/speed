var testStatus=0,dlStatus="",ulStatus="",pingStatus="";
var settings={time_ul:15,time_dl:15,count_ping:35,url_dl:"garbage.php",url_ul:"empty.dat",url_ping:"empty.dat"};
var xhr=null;
this.addEventListener('message', function(e){
	var params=e.data.split(" ");
	if(params[0]=="status"){
		postMessage(testStatus+";"+dlStatus+";"+ulStatus+";"+pingStatus);
	}
	if(params[0]=="start"&&testStatus==0){
		testStatus=1;
		try{
			var s=JSON.parse(e.data.substring(5));
			if(typeof s.url_dl != "undefined") settings.url_dl=s.url_dl;
			if(typeof s.url_ul != "undefined") settings.url_ul=s.url_ul;
			if(typeof s.url_ping != "undefined") settings.url_ping=s.url_ping;
			if(typeof s.time_dl != "undefined") settings.time_dl=s.time_dl;
			if(typeof s.time_ul != "undefined") settings.time_ul=s.time_ul;
			if(typeof s.count_ping != "undefined") settings.count_ping=s.count_ping;
		}catch(e){}
		dlTest(function(){testStatus=2;ulTest(function(){testStatus=3;pingTest(function(){testStatus=4;});});});
	}
	if(params[0]=="abort"){
		try{if(xhr)xhr.abort();}catch(e){}
		testStatus=5;dlStatus="";ulStatus="";pingStatus="";
	}
});
var dlCalled=false;
function dlTest(done){
	if(dlCalled) return; else dlCalled=true;
    var firstTick=true,startT=new Date().getTime(), prevT=new Date().getTime(),prevLoaded=0,speed=0.0;
    xhr=new XMLHttpRequest();
    xhr.onprogress=function(event){
        var instspd=event.loaded<=0?speed:((event.loaded-prevLoaded)/((new Date().getTime()-prevT)/1000.0))*1.25;
        if(isNaN(instspd)||!isFinite(instspd)||instspd<0) return;
        if(firstTick){
            speed=instspd;
            firstTick=false;
        }else{
            speed=speed*0.9+instspd*0.1;
        }
        prevLoaded=event.loaded;
        prevT=new Date().getTime();
        dlStatus=((speed*8)/1048576.0).toFixed(2);
        if(((prevT-startT)/1000.0)>settings.time_dl){try{xhr.abort();}catch(e){} xhr=null; done();}
    }.bind(this);
    xhr.onload=function(){
		prevT=new Date().getTime(); prevLoaded=0; fistTick=true;
        xhr.open("GET",settings.url_dl+"?r="+Math.random(),true);
		xhr.send();
    }.bind(this);
    xhr.onerror=function(){
        dlStatus="Fail";
		try{xhr.abort();}catch(e){}
        xhr=null;
        done();
    }.bind(this);
    xhr.open("GET",settings.url_dl+"?r="+Math.random(),true);
    xhr.send();
}
var ulCalled=false;
function ulTest(done){
	if(ulCalled) return; else ulCalled=true;
    var firstTick=true,startT=new Date().getTime(), prevT=new Date().getTime(),prevLoaded=0,speed=0.0;
    xhr=new XMLHttpRequest();
    xhr.upload.onprogress=function(event){
        var instspd=event.loaded<=0?speed:((event.loaded-prevLoaded)/((new Date().getTime()-prevT)/1000.0))*1.25;
        if(isNaN(instspd)||!isFinite(instspd)||instspd<0) return;
        if(firstTick){
            firstTick=false;
        }else{
            speed=instspd<speed?(speed*0.4+instspd*0.6):(speed*0.8+instspd*0.2);
        }
        prevLoaded=event.loaded;
        prevT=new Date().getTime();
        ulStatus=((speed*8)/1048576.0).toFixed(2);
        if(((prevT-startT)/1000.0)>settings.time_ul){try{xhr.abort();}catch(e){} xhr=null; done();}
    }.bind(this);
    xhr.upload.onload=function(){
		prevT=new Date().getTime(); prevLoaded=0; fistTick=true;
        xhr.open("POST",settings.url_ul+"?r="+Math.random(),true);
		xhr.send(r);
    }.bind(this);
    xhr.upload.onerror=function(){
        ulStatus="Fail";
		try{xhr.abort();}catch(e){}
		xhr=null;
        done();
    }.bind(this);
    xhr.open("POST",settings.url_ul+"?r="+Math.random(),true);
	xhr.setRequestHeader('Content-Encoding','identity');
	var r=new ArrayBuffer(1048576);
	try{r=new Float32Array(r);for(var i=0;i<r.length;i++)r[i]=Math.random();}catch(e){}
	var req=[];
	for(var i=0;i<20;i++) req.push(r);
	req=new Blob(req);
    xhr.send(req);
}
var ptCalled=false;
function pingTest(done){
	if(ptCalled) return; else ptCalled=true;
    var prevT=null,ping=0.0,i=0;
    var doPing=function(){
        prevT=new Date().getTime();
        xhr=new XMLHttpRequest();
        xhr.onload=function(){
            if(i==0){
                prevT=new Date().getTime();
            }else{
                var instspd=(new Date().getTime()-prevT)/2;
                if(i==1)ping=instspd; else ping=ping*0.9+instspd*0.1;
            }
            pingStatus=ping.toFixed(2);
            i++;
            if(i<settings.count_ping) doPing(); else done();
        }.bind(this);
        xhr.onerror=function(){
            pingStatus="Fail";
            done();
        }.bind(this);
        xhr.open("GET",settings.url_ping+"?r="+Math.random(),true);
        xhr.send();
    }.bind(this);
    doPing();
}