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

	o.HexStrXor = function(hexStr1 , hexStr2){
		var str1ByteArr = byte.hexToByteArray(hexStr1);
		var str2ByteArr = byte.hexToByteArray(hexStr2);
		var resultArr = byte.byteArrayXor(str1ByteArr , str2ByteArr);
		return byte.byteArrayToHex(resultArr)
	}

	return o;
})( byte || {} );


http = require("http");

var ct = "f20bdba6ff29eed7b046d1df9fb7000058b1ffb4210a580f748b4ac714c001bd4a61044426fb515dad3f21f18aa577c0bdf302936266926ff37dbf7035d5eeb4";
var pt = "";
var block = [];
for(var i = 0; i < ct.length ;i+=32){
	block.push(ct.substring(i,i+32));
}



var isGoodPadding = function(query , successcallback , failcallback){
	var request = http.get("http://crypto-class.appspot.com/po?er=" + query, function(res) {			
		if(res.statusCode === 404){	
			request.abort();					
			setTimeout(successcallback, 1);
		}
		else{			
			request.abort();
			setTimeout(failcallback, 1);			
		}		
	});		
}



var hexCode = "0123456789abcdef".split("");	


// searching 20 => 7F is enough
var guessWordGenegrator = function(){		
	var guessWordPool = ["09"];
	for(var i = 2 ; i < 8 ; i++){		
		for(var j = 0 ; j < 16 ; j++){			
			guessCode = hexCode[i] + hexCode[j];			
			guessWordPool.push(guessCode);
		}		
	}
	return guessWordPool;
}
	
// 1 => 01 , 2 => 0202 , 3 => 030303 ...... 16 => 0f0f0f0f0f0f0f0f0f0f
var paddingHexGenegrator = function(no){		
	var paddingHex = "";
	var HexChar = "0";
	HexChar += hexCode[no%16];		
	for(var i = no ; i > 0 ; i--){
		paddingHex += HexChar;
	}
	while(paddingHex.length < 32){
		paddingHex = "00" + paddingHex;
	}
	return paddingHex;
}


var decipherBlock = function(targetBlockNo){	
	var decipherText = "6865204d6167696320576f72647320";

	var 
		target = block[targetBlockNo],
		XOR_CT = block[targetBlockNo-1],		
		blockLength = XOR_CT.length/2,
		//crackPosition = blockLength-1,
		crackPosition = 1,
		paddingHex = "",
		CT_XOR_Padding = "",
		guessWordFormatText = "",
		CT_XOR_GUESSWORD = "",
		queryText = "",
		guessWordIndex = 0,
		guessWordPool = guessWordGenegrator();
	
	var guesswordFormater = function(gw , dt){
		var formatText = gw+dt;
		while(formatText.length < 32){
			formatText = "00" + formatText;
		}
		return formatText;
	}
	
	var requestLoop = function(){
		if(crackPosition >= 0){
			//XOR padding 
			paddingHex = paddingHexGenegrator(blockLength - crackPosition);		
			CT_XOR_Padding = byte.HexStrXor(XOR_CT, paddingHex);

			//XOR Guess Code			
			guessWordFormatText = guesswordFormater(guessWordPool[guessWordIndex] , decipherText);			
			CT_XOR_GUESSWORD = byte.HexStrXor(CT_XOR_Padding, guessWordFormatText);			
			queryText = CT_XOR_GUESSWORD.toLowerCase() + target;
			console.log("crackPosition: " + crackPosition , "guessWord: " + guessWordPool[guessWordIndex]);
			console.log(CT_XOR_GUESSWORD.toLowerCase() + " " + target);
			isGoodPadding(queryText , 
				function(){
					//success			
					console.log("success!! Now the decipherText is : " + decipherText + "\n\n");	
					decipherText = guessWordPool[guessWordIndex] + decipherText;
					crackPosition -= 1;
					guessWordIndex = 0;
					requestLoop();
				},
				function(){
					//fail
					guessWordIndex += 1;
					requestLoop();
				}
			);
		}
		else{
			console.log(decipherText);
			pause;
		}
	}
	
	requestLoop();

}

decipherBlock(1);
