
/************************************************
***  WARNING:
***  It is very very very time comsuming.....
***  node.js is not suitable for doing arithmetic operation
***  so ,  it is just for fun.
*************************************************/
var bigInt  = require('BigInt');
// mpdule https://npmjs.org/package/BigInt

var pStr = "1340780792994259709957402499820584612747936582059239337772356144372176403007354"+
			"6976801874298166903427690031858186486050853753882811946569946433649006084171",
	gStr = "1171782988036620700951611759633536708855808499999895220559997945906392949973658"+
			"3746670572176471460312928594829675428279466566527115212748467589894601965568",
	hStr = "3239475104050450443565264378728065788649097520952449527834792452971981976143292"+
			"558073856937958553180532878928001494706097394108577585732452307673444020333",
	p = bigInt.str2bigInt(pStr, 10 , 0),
	g = bigInt.str2bigInt(gStr, 10 , 0),
	h = bigInt.str2bigInt(hStr, 10 , 0),
	hashTable = {},
	B = Math.pow(2,20);


return;

//console.log(bigInt.bigInt2str(bigInt.add(p , g) , 10));
var perviousPow = bigInt.str2bigInt("1" , 10 , 0),
	x1,
	gi,
	middleValue;

console.log("create hash Table");
for(var i = 0; i < B ; i++){
	//console.log(i , bigInt.bigInt2str(perviousPow , 10));
	//x1 = bigInt.str2bigInt(i.toString() , 10 , 0);		
	gi = bigInt.inverseMod(perviousPow , p);
	//gi = bigInt.inverseMod(bigInt.powMod(g , x1 , p) , p);
	//console.log(bigInt.bigInt2str(gi , 10));
	middleValue = bigInt.multMod(h,gi,p);
	hashTable[bigInt.bigInt2str(middleValue, 10)] = i;		
	perviousPow = bigInt.multMod(perviousPow , g , p);
	if( i % Math.pow(2,10) == 0 ){
		console.log("bulid table : " + i);
	}
}


console.log("finish create hash table\n");
console.log("start search hash table");

var bigInt_B = bigInt.str2bigInt(B.toString() , 10 , 0),
	g_pow_B = bigInt.powMod(g , bigInt_B , p);
//console.log(bigInt.bigInt2str(g_pow_B , 10));


perviousPow = bigInt.str2bigInt("1" , 10 , 0);
for(var i = 0 ; i < B ; i++){
 	//var x0 = bigInt.str2bigInt(i.toString() , 10 , 0); 	
 	middleValue = bigInt.bigInt2str(perviousPow, 10);
 	//var middleValue = bigInt.bigInt2str(bigInt.powMod(g_pow_B,x0,p), 10); 		 
 	if(hashTable[middleValue] != null){
 		console.log("*******************************************************");
 		console.log("find answer:");
 		console.log("x0 : " + i);
 		console.log("x1 : " + hashTable[middleValue]); 		
 		console.log("x(x0*B+ x1) : " + (i*B + parseInt(hashTable[middleValue],10) ));
 		console.log("*******************************************************");
 		return;
 	}
 	perviousPow = bigInt.multMod(perviousPow , g_pow_B , p);
 	// if( i % Math.pow(2,10) == 0 ){
	// 	console.log("search table : " + i);
	// }
}

// ans = 375374217830