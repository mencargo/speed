var testStatus=0,dlStatus="",ulStatus="",pingStatus="";
var settings={time_ul:15, time_dl:15, count_ping:35, url_dl:"garbage.php",url_ul:"empty.dat",url_ping:"empty.dat"};
var xhr=null;
this.addEventListener('message', function(e){
	var params=e.data.split(" ");
	if(params[0]=="status"){
		postMessage(testStatus+";"+dlStatus+";"+ulStatus+";"+pingStatus);
	}
	if(params[0]=="start"){
		if(testStatus==0){
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
	}
	if(params[0]=="abort"){
		try{if(xhr)xhr.abort();}catch(e){}
		testStatus=5;dlStatus="";ulStatus="";pingStatus="";
	}
});

function dlTest(done){
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
        if(((prevT-startT)/1000.0)>settings.time_dl){try{xhr.abort();}catch(e){} xhr=null; done();}
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
    xhr.open("GET", settings.url_dl+"?r="+Math.random(),true);
    xhr.send();
}

function ulTest(done){
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
        if(((prevT-startT)/1000.0)>settings.time_ul){try{xhr.abort();}catch(e){} xhr=null; done();}
    }.bind(this);
    xhr.onload=function(){
        ulStatus=((speed*8)/1048576.0).toFixed(2);
        done();
    }.bind(this);
    xhr.onerror=function(){
        ulStatus="Fail";
        done();
    }.bind(this);
    xhr.open("POST", settings.url_ul+"?r="+Math.random(),true);
    xhr.send(new ArrayBuffer(10485760));
}

function pingTest(done){
    var prevT=null,ping=0.0,i=0;
    var doPing=function(){
        prevT=new Date().getTime();
        xhr=new XMLHttpRequest();
        xhr.onload=function(){
            if(i==0){
                prevT=new Date().getTime();
            }else{
                var instspd=new Date().getTime()-prevT;
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
