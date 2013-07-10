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

/** four block
f20bdba6ff29eed7b046d1df9fb70000
58b1ffb4210a580f748b4ac714c001bd
4a61044426fb515dad3f21f18aa577c0
bdf302936266926ff37dbf7035d5eeb4
**/


var isGoodPadding = function(query , successcallback , failcallback){
	var request = http.get("http://crypto-class.appspot.com/po?er=" + query, function(res) {			
		if(res.statusCode === 404){	
			request.abort();	
			successcallback();							
		}
		else{			
			request.abort();				
			failcallback();
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
	
// 1 => 01 , 2 => 0202 , 3 => 030303 ...... 15 => 0e0e0e0e0e0e0e0e0e 
var paddingHexGenegrator = function(no){		
	var paddingHex = "";
	var HexChar = "0";
	//notice:  16 => 10101010101010101010101010101010
	if(no < 16){
		HexChar += hexCode[no%16];
			for(var i = no ; i > 0 ; i--){
			paddingHex += HexChar;
		}
		while(paddingHex.length < 32){
			paddingHex = "00" + paddingHex;
		}
	}	
	else{
		paddingHex = "10101010101010101010101010101010";
	}
	return paddingHex;
}


var decipherBlock = function(targetBlockNo){	
	var decipherText = "";

	var 
		target = block[targetBlockNo],
		XOR_CT = block[targetBlockNo-1],		
		blockLength = XOR_CT.length/2,
		crackPosition = blockLength-1,				
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
			isGoodPadding(queryText , 
				function(){
					//success								
					decipherText = guessWordPool[guessWordIndex] + decipherText;
					console.log("success!! Now the decipherText is : " + decipherText + "\n\n");	
					crackPosition -= 1;
					guessWordIndex = 0;
					requestLoop();
				},
				function(){
					//fail
					guessWordIndex += 1;
					if(guessWordIndex > guessWordPool.length-1){
						console.log("ERR OCCUR: No words fit");						
						return;
					}
					requestLoop();
				}
			);
		}
		else{
			var ptFrag = byte.byteArrayToString(byte.hexToByteArray(decipherText)); 			
			pt += ptFrag;
			console.log("\n"+ pt + "\n");
			if(targetBlockNo+1 < block.length){
				decipherBlock(targetBlockNo+1);	
				console.log("The final answer:\n\n\n"+ pt + "\n\n\n");
			}			
		}
	}
	
	requestLoop();

}

decipherBlock(1);
