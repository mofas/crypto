$(document).ready(function() {
	CBCDecrypt.init();
});


var CBCDecrypt = (function(o){
	"use strict";

	var 
		$key,
		$ct;		

	o.init = function(){
		DOMCache();
		bindEvent();		
	}

	o.getKey = function(){
		return $key.val();
	}

	o.getCT = function(){
		return $ct.val();	
	}

	var DOMCache = function(){
		$key = $("#key");
		$ct = $("#ct");		
	}

	var bindEvent = function(){
		$("#atoh").on("click" , function(){
	  		var key = o.getKey(), 	  			
  			ct = o.getCT();
	  		var bitKey = sjcl.codec.hex.toBits(key);
	  		var bitCt = sjcl.codec.hex.toBits(ct);		
			var pt = o.decrypt(bitKey , bitCt);
			$("#plainText").text(pt);
		});
	}

	o.decrypt = function(key ,  ctArr){
		var aes = new sjcl.cipher.aes(key);
		var pt = "",
			cb,
			preCb,
			aes,
			dc,
			ptbArr,
			ptb;

		for(var i = ctArr.length ; i > 7 ; i -= 4){
			cb = ctArr.slice(i-4 , i);			
			preCb = ctArr.slice(i-8 , i-4);
			dc = aes.decrypt(cb);
			ptbArr = byte.byteArrayXor(dc , preCb);
			ptb = sjcl.codec.utf8String.fromBits(ptbArr);			
			pt = ptb + pt;
		}
		console.log(pt);
		return pt;
	}	

	return o;

})( CBCDecrypt || {} );