


var fs = require('fs');
var crypto = require('crypto');
var Buffer = require('buffer').Buffer;

var shasum;

var filePath = "./media/6-1.mp4",
	file_size,
	block_size = 1024, // 1KB	
	last_block_size = 0,
	range_start = 0,
	range_end = 0;

fs.stat(filePath , function (err, stats) {
	file_size = stats.size;	
	last_block_size = file_size % block_size;
});


fs.open(filePath , 'r', function(status, fd) {
    if (status) {
        console.log(status.message);
        return;
    }

    var 
    	fileBuffer,
    	previousHash = "";
	
	//init Block
	range_end = file_size;
	range_start = file_size - last_block_size;	


    var caculateHash = function(){  
	    fileBuffer = new Buffer(range_end - range_start)
	    fs.read(fd, fileBuffer, 0, (range_end - range_start) , range_start , function(err, num) {	    	  	    	
	    	range_end = range_start;
			range_start -= block_size;	
			shasum = new crypto.createHash('sha256');
			shasum.update(fileBuffer , "binary");
    		shasum.update(previousHash, "binary");
  			if(range_end > 0 ){
	    		previousHash = shasum.digest('binary');
  		 		caculateHash();	
  			}
  			else{  			  				  						    	
		    	previousHash = shasum.digest('hex');
  				console.log(previousHash);
  			}	  		
	    });    
	}
    
    caculateHash();
});


