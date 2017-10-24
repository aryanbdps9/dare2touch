function encr(text, n, e){ // n = p*q; gcd(e, phi(n)) = 1;
	m = text2num(text);
	console.log("m = ", m.toString());
	c = m.modPow(e, n); // c = (m^e) mod n
	return c.toString();
}

function text2num(text){
	// assuming text has ascii chars
	l = text.length;
	var res = bigInt(0);
	var multiplier = bigInt(1);
	var prd = 256;
	for(var i = l-1; i >= 0; --i){
		var face = text.charCodeAt(i);
		// console.log("face = ", face);
		res = res.add(multiplier.multiply(face)) ;
		multiplier = multiplier.multiply(prd);
	}
	return res;
}
