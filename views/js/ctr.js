$(document).ready(function() {
	CTRDecrypt.init();
});


var CTRDecrypt = (function(o){
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
			var pt = o.decrypt(key , ct);
			$("#plainText").text(pt);
		});
	}

	o.decrypt = function(key ,  ct){
		var pt = "",			
			iv,
			cb,
			bitIV,
			bitKey,
			bitCt,
			ptbArr,
			hexStr,
			ptb;

		bitKey = sjcl.codec.hex.toBits(key);
		iv = ct.substring(0 , 32);
	  	ct = ct.substring(32);

	  	var aes = new sjcl.cipher.aes(bitKey);
	    bitIV = sjcl.codec.hex.toBits(iv);	  		 

	  	for(var i = 0 ; i < ct.length ; i += 32){	  		
	  		var ctb = ct.substring(i , i+32);	  		
	  		var bitCtb = sjcl.codec.hex.toBits(ctb);	  			  		
	  		ptbArr = byte.byteArrayXor( aes.encrypt(bitIV).slice(0 , bitCtb.length) , bitCtb);
	  		ptb = "";
	  		//a trick to prevent sjcl.codec.utf8string not correct parse bit
	  		while(ptb.length < 1){
	  			try{
		  			ptb = sjcl.codec.utf8String.fromBits(ptbArr);
		  		}
		  		catch (err){
		  			hexStr = sjcl.codec.hex.fromBits(ptbArr);
		  			hexStr = hexStr.substring(0, hexStr.length-2);
		  			ptbArr = sjcl.codec.hex.toBits(hexStr);		  			
		  		}		  		
	  		}
	  		
	  		pt += ptb;
	  		bitIV[bitIV.length-1] += 1;		 	
	  	}
			
		return pt;		
	}	

	return o;

})( CTRDecrypt || {} );

//