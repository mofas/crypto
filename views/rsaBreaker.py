import gmpy2
import math
import binascii


class rsaBreaker:

	def __init__(self , N):
		self.N = N
		self.A = gmpy2.isqrt(self.N)		
		self.searchPrimeFactor()

	def searchPrimeFactor(self):
		for i in range(1 , 2**20):
			guessA = self.A + i;
			guessX = self.getGuessX(guessA)
			if self.verify(guessA , guessX):
				print(self.p)
				return { "p" : self.p , "q" : self.q}

	def getGuessX(self , guessA):
		# N = A**2 - X**2
		A_Squr = gmpy2.mul(guessA, guessA)
		X_Squr = gmpy2.sub(A_Squr , self.N)
		return gmpy2.isqrt(X_Squr)
		

	def verify(self , guessA , guessX):
		self.p = gmpy2.sub(guessA , guessX)
		self.q = gmpy2.add(guessA , guessX)		
		if gmpy2.mul(self.p, self.q) == self.N:
			return True
		else:
			return False


class rsaBreaker2:

	def __init__(self , N):
		#24N = 6p*4q		
		#  A = 3p+2q
		self.N = N
		self.NForFactor = gmpy2.mul(self.N,24)
		self.A = gmpy2.isqrt(self.NForFactor)
		self.searchPrimeFactor()

	def searchPrimeFactor(self):
		for i in range(1 , gmpy2.isqrt(self.N*6)):				
			guessA = self.A + i;
			self.getGuessX(guessA)
			guessX = self.getGuessX(guessA)
			if self.verify(guessA , guessX):
				print(self.p)
				return { "p" : self.p , "q" : self.q}

	def getGuessX(self , guessA):
		# N = A**2 - X**2
		A_Squr = gmpy2.mul(guessA, guessA)
		X_Squr = gmpy2.sub(A_Squr , self.NForFactor)
		return gmpy2.isqrt(X_Squr)
		

	def verify(self, guessA , guessX):
		factor1 = gmpy2.sub(guessA , guessX)
		factor2 = gmpy2.add(guessA , guessX)
		#3p is odd , 2q is even
		if gmpy2.c_mod(gmpy2.div(factor1,2),2) == 0:			
			self.p = gmpy2.div(factor1, 4)
			self.q = gmpy2.div(factor2 , 6)	
		else:
			self.p = gmpy2.div(factor1, 6)
			self.q = gmpy2.div(factor2 , 4)	
	
		if gmpy2.mul(self.p, self.q) == self.N:
			return True
		else:
			return False


class decrypt:
	def __init__(self,CT ,N):
		self.ct = CT
		self.e = 65537
		self.N = N
		factor = rsaBreaker(N)				
		#fhiY = N - p - q + 1
		fhiY = gmpy2.add(gmpy2.sub(gmpy2.sub(N , factor.p),factor.q) , 1)
		self.d = gmpy2.invert(self.e,fhiY)
		decrypted = gmpy2.powmod(self.ct , self.d , N);		

		hex = self.intToHex(decrypted)		
		hexMessage = hex[(hex.index("00")+2):]
		message = self.hexToStr(hexMessage)
		print(message)
        

	def intToHex(self, intValue):
	    data_ = format(intValue, 'x')
	    result = data_.rjust(12, '0') 
	    return result

	def hexToStr(self, hex):		
		return binascii.unhexlify(hex)
	

#problem 1
N1 = gmpy2.mpz('17976931348623159077293051907890247336179769789423065727343008115' +
		'77326758055056206869853794492129829595855013875371640157101398586' +
		'47833778606925583497541085196591615128057575940752635007475935288' +
		'71082364994994077189561705436114947486504671101510156394068052754' +
		'0071584560878577663743040086340742855278549092581')

#problem 2
N2 = gmpy2.mpz('6484558428080716696628242653467722787263437207069762630604390703787' +
		'9730861808111646271401527606141756919558732184025452065542490671989' +
		'2428844841839353281972988531310511738648965962582821502504990264452' +
		'1008852816733037111422964210278402893076574586452336833570778346897' +
		'15838646088239640236866252211790085787877')

#problem 3
N3 = gmpy2.mpz('72006226374735042527956443552558373833808445147399984182665305798191' + 
    	'63556901883377904234086641876639384851752649940178970835240791356868' +
    	'77441155132015188279331812309091996246361896836573643119174094961348' +
    	'52463970788523879939683923036467667022162701835329944324119217381272' +
    	'9276147530748597302192751375739387929') 

#problem 4
CT = gmpy2.mpz('220964518674103817763065611348834180174100697878928310717318391436761' + 
		'356001205380042823296504735094243439462197515122564658399679428894607' + 
		'645420405815647489880137348641204523252293201764879166664029975091887' +
		'299716905260832220677716000193292608700095799937240774589677736978175' + 
		'71267229951148662959627934791540')

print("Problem1 Ans:")
rsaBreaker(N1);
print("Problem2 Ans:")
rsaBreaker(N2);
print("Problem3 Ans:")
rsaBreaker2(N3);
print("Problem4 Ans:")
decrypt(CT , N1)