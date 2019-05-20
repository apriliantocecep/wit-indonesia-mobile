// source: https://gist.github.com/faisalman/845309#file-convert-rupiah-js
export function convertToRupiah(angka)
{
	var rupiah = '';		
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp '+rupiah.split('',rupiah.length-1).reverse().join('');
}

// ngambil huruf dari string
export function textSpliter(text = 'Aku Bisa') {
	var string = text.split(' ');
	var str1 = string[0];
	var str2 = string[1];
	var strJoin = '';

	// jika ada string ke 2
	// join string 1 dan 2
	if (str2) {
		var textStr1 = str1.charAt(0);
		var textStr2 = str2.charAt(0);
		strJoin = `${textStr1}${textStr2}`;
	} else {
		var str1 = str1.replace(/-/g, '').replace(/ /g, '');
		var text1 = str1.charAt(0);
		var text2 = str1.charAt(1);
		strJoin = `${text1}${text2}`;
	}

	return strJoin;
}

// source: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
export function compareValues(key, order='asc') {
  return function(a, b) {
    if(!a.hasOwnProperty(key) || 
       !b.hasOwnProperty(key)) {
  	  return 0; 
    }
    
    const varA = (typeof a[key] === 'string') ? 
      a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ? 
      b[key].toUpperCase() : b[key];
      
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order == 'desc') ? 
      (comparison * -1) : comparison
    );
  };
}
