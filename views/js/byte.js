
//modify from http://www.darkfader.net/toolbox/convert/

var byte = (function(o){
	"use strict";

	o.stringToByteArray = function(string){
		var byteArray = new Array(string.length);
		for (var i = 0 ; i < string.length ; i++){
			byteArray[i] = string.charCodeAt(i);
		}
		return byteArray;
	}

	o.byteArrayToString = function(byteArray){
		var string = "";
		for (var i=0 ; i < byteArray.length ; i++){
			string += String.fromCharCode(byteArray[i]);
		}
		return string;
	}

	o.hexdigit = function(c){
		if (c >= 'a') return c.charCodeAt(0) - 87;
		if (c >= 'A') return c.charCodeAt(0) - 55;
		if (c >= '0') return c.charCodeAt(0) - 48;
		return -1;
	}

	o.hexToByteArray = function(hexString){
		var byteArray = new Array();
		var upper4 = true;
		var j = 0;
		for (var i = 0 ; i < hexString.length ; i++){
			var c = o.hexdigit(hexString.charAt(i));
			if (c < 0) continue;
			if (upper4){
				byteArray[j] = c << 4;
			}				
			else{
				byteArray[j++] |= c;
			}
			upper4 = !upper4;
		}
		if (!upper4) byteArray.length--;
		return byteArray;
	}

	o.byteArrayToHex = function(byteArray){
		var hexdigits = '0123456789ABCDEF';
		var hexString = "";
		for (var i = 0 ; i < byteArray.length; i++ )
		{
			hexString += hexdigits.charAt((byteArray[i] >> 4) & 15) + hexdigits.charAt(byteArray[i] & 15);
		}
		return hexString;
	}

	o.byteArrayXor = function(str1ByteArr , str2ByteArr){		
		var resultArr = new Array();
		var j = 0;
		for (var i = 0; i < str1ByteArr.length ; i++){
			var x = str1ByteArr[i];
			if (j < str2ByteArr.length) x ^= str2ByteArr[j++];			
			resultArr[i] = x;
		}
		return resultArr;
	}

	return o;

})( byte || {} );