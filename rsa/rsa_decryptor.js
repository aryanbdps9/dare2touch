rsa_decrypt = function(){
	this.bigInt = require('./BigInteger.min.js');
	this.self = this;
}

rsa_decrypt.prototype.modexp = function(a, b, c){ // calculates (a^b) mod c
	return a.modPow(b, c);
}

rsa_decrypt.prototype.decr = function(c, d, n){ // calculates c^d mod n
	return c.modPow(d, n);
}

rsa_decrypt.prototype.calc_d = function(e, phin){
	return e.modInv(phin);
}

rsa_decrypt.prototype.prime_mom = function(lo_lim){
	ulim = lo_lim.multiply(100);
	var res = this.bigInt(0);
	var cnt = 1;
	while (true){
		var contestant = this.bigInt.randBetween(lo_lim, ulim);
		if (contestant.isProbablePrime(200)){
			res = contestant;
			break;
		}
		cnt++;
		if (cnt > 100){
			ulim = ulim.multiply(10);
		}
	}
	return res;
}

rsa_decrypt.prototype.prime_gen = function(){
	return this.prime_mom(this.bigInt(256).pow(16));
}


rsa_decrypt.prototype.get_the_package = function(){
	var p = this.prime_gen();
	var q = this.prime_gen();
	var n = p.multiply(q);
	var phin = p.prev().multiply(q.prev());
	var e = this.bigInt(65537);
	var d = this.calc_d(e, phin);
	return {phin: phin, d: d, n: n, e: e};
}

rsa_decrypt.prototype.bi_to_text = function(num){
	var out = "";
	while (num.gt(0)){
		var temp_num = num.mod(256).toJSNumber();
		var nextchar = String.fromCharCode(temp_num);
		out  = nextchar + out;
		num = num.divide(256);
	}
	return out;
}

rsa_decrypt.prototype.get_decr_text = function(c, n, d){
	// c is string, phin and d are bigInt;
	return this.bi_to_text(this.decr(this.bigInt(c), d, n));
}
if( 'undefined' != typeof global ) {
    module.exports = global.rsa_decrypt = rsa_decrypt;
}
