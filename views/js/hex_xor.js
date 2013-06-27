

$(document).ready(function() {
	hexConverter.init();	
	strXor.init();
});

//http://www.dolcevie.com/js/converter.html

var hexConverter = (function(o){
	"use strict";

	var symbols = " !\"#$%&'()*+,-./0123456789:;<=>?@";
	var loAZ = "abcdefghijklmnopqrstuvwxyz";
	symbols+= loAZ.toUpperCase();
	symbols+= "[\\]^_`";
	symbols+= loAZ;
	symbols+= "{|}~";

	var $inputHex,
		$inputAscii;


	o.init = function(){
		DOMCache();
		bindEvent();
		initOnce();
	}


	o.toHex = function(asciiStr){
		var 
			hexChars = "0123456789abcdef",
			text = "";

		for( var i = 0 , n = asciiStr.length ; i < n ; i++ ){
			var oneChar = asciiStr.charAt(i);
			var asciiValue = symbols.indexOf(oneChar) + 32;
			var index1 = asciiValue % 16;
			var index2 = (asciiValue - index1)/16;			
			text += hexChars.charAt(index2);
			text += hexChars.charAt(index1);
		}		
		return text;
	}

	o.toAscii = function(hexStr){		
		hexStr = hexStr.toLowerCase();
	    var hex = "0123456789abcdef",
			text = "";			

		for( var i = 0 , n = hexStr.length; i < n ; i = i+2 ){
			var char1 = hexStr.charAt(i);			
			var char2 = hexStr.charAt(i+1);
			var num1 = hex.indexOf(char1);
			var num2 = hex.indexOf(char2);
			var value = num1 << 4;

			value = value | num2;
			var valueInt = parseInt(value);
			var symbolIndex = valueInt - 32;
			var ch = '?';
			if ( symbolIndex >= 0 && value <= 126 ){
				ch = symbols.charAt(symbolIndex)
			}
			text += ch;
		}		
		return text;
	}

	var DOMCache = function(){
		$inputHex = $("#inputHex");
		$inputAscii = $("#inputAscii");
	}

	var bindEvent = function(){
		$("#atoh").on("click" , function(){
			var asciiStr = $inputAscii.val();
			$inputHex.val(o.toHex(asciiStr)).select();
			return false;
		});
		$("#htoa").on("click" , function(){
			var hexStr = $inputHex.val();
			$inputAscii.val(o.toAscii(hexStr)).select();
			return false;
		});
	}

	var initOnce = function(){

	}

	return o;

})( hexConverter || {} );


var strXor = (function(o){
	"use strict";
	


	var checkXor = function(){		
		var str1ByteArr = byte.hexToByteArray($str1.val());
		var str2ByteArr = byte.hexToByteArray($str2.val());
		var resultArr = byte.byteArrayXor(str1ByteArr , str2ByteArr);
		$strResult.val(byte.byteArrayToString(resultArr));
		$hexResult.val(byte.byteArrayToHex(resultArr));
	}

	var 
		$str1,
		$str2,
		$strResult,
		$hexResult;

	o.init = function(){
		DOMCache();
		bindEvent();
	}

	var DOMCache = function(){
		$str1 = $("#xorStr1");
		$str2 = $("#xorStr2");
		$hexResult = $("#hexResult");
		$strResult = $("#strResult");
	}

	var bindEvent = function(){
		$str1.on("keyup" , checkXor);
		$str2.on("keyup" , checkXor);
	}



	return o;

})( strXor || {} );
