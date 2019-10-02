"use strict";  

const alphbeth = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z']

const SPANISH_FREQS = [
	0.11525, 0.02215, 0.04019, 0.05010, 0.12181, 0.00692, 0.01768, 0.00703, 0.06247, 0.00493, 0.00011, 0.04967, 0.03157,
	0.06712, 0.00311, 0.08683, 0.02510, 0.00877, 0.06871, 0.07977, 0.04632, 0.02927, 0.01138, 0.00017, 0.00215, 0.01008, 0.00467
];



var entropies = [];

function doBreak(text){
    var text = document.getElementById("textArea1").value;
    var nGrams = getNGrams(text);
    var distancias = getDistance(nGrams,text);
    var lengths = getPossiblesLengths(distancias);
    var subCryptos = getSubCrytograms(lengths, text);
    
    
    var decrypted = []
    var keys = []
    lengths.map( i => {
        var values = subCryptos.filter( val => val.num == i)
        
        var decrypted = []
        var key = ''
        values.map( j => {
            var entro = getAllEntropies(j.subCrypto)
            entro.sort(function(x, y) {
                // Compare by lowest entropy, break ties by lowest shift
                if (x[1] != y[1])
                    return x[1] - y[1];
                else
                    return x[0] - y[0];
            });
            entropies.push(entro);
            var bestShift = entro[0][0];
            key += alphbeth[bestShift];
            
            decrypted.push(decrypt(j.subCrypto,bestShift))
        })
        keys.push(key);
        document.getElementById('textArea2').append('Clave: '+ key);
        var string = '';
        for(var k = 0; k < decrypted.length; k++){
            var crypto = decrypted[k];
            
            for(var j = 0; j < crypto.length; j++){
                for(var l = 0; l < decrypted.length; l++){
                    string += decrypted[l][j];
                }
            }
            
        }
        document.getElementById('textArea2').append('\nTexto: '+ string + '\n\n');
    })
    
}
function getNGrams(text){
    var arr = []
    for (let i = 3; i <= 6; i++) {
        for (let index = 0; index < text.length- i; index++) {
            arr.push(text.slice(index,index+i));
            
        }
    }
    return [...new Set(arr)];
}
function getDistance(arr, text){
    var contar = [];
    for (let i = 0; i < arr.length; i++) {
        var espacios = [];
        var seg = arr[i];

        var distancias = [];
        for (let j = 0; j < text.length; j++) {
            var texto = text.slice(j, j+seg.length);
            if(texto == seg){
                espacios.push(j);
            }
        }   
        if(espacios.length > 1){
            for(let i = 0; i < espacios.length; i++){
                if(espacios[i+1]){
                    distancias.push(espacios[i+1] - espacios[i]);
                }
                
            }
        }
        contar.push({seg:seg,posiciones: espacios, distancias: distancias})
    }
    return contar;
}
function MCD(nums){
    var mcd = nums[0];
    var r;
    for(let i = 1; i < nums.length; i++){
        var num = nums[i];
        do{
            r = mcd % num;
            mcd = num;
            num = r; 
        }while(r != 0)
    }
    return mcd;
}
function getPossiblesLengths(arrL){
    var longitudes = [];
    var arr = arrL.filter((val) => val.distancias.length>=1)
    for( let i = 3; i <= 6; i++){
        var newArray = arr.filter(value => value.seg.length == i);
        
        let valoresDistancia = [];
        newArray.map(value => {
            value.distancias.map(val => {
                valoresDistancia.push(val);
            })            
        })        
        var mcd = MCD(valoresDistancia);
        if(mcd && mcd>2){
            longitudes.push(mcd)
        }
    }
    return [...new Set(longitudes)];
}
function getSubCrytograms(arr,text){
    let subCryto = '';
    let subCrytoArr = []
    arr.map(val => {
        if(val > 2){
            for (let i = 0; i < val; i++) {
                subCryto = '';
                
                for (let j = i; j < text.length ; j += val ) {
                    subCryto += text[j];
                }
                subCrytoArr.push({num: val, subCrypto: subCryto})
            }
        }
       
    })
    return subCrytoArr;
}
function mod(x, y) {
	return (x % y + y) % y;
}
function decrypt(str, key) {
	var result = "";
	for (var i = 0; i < str.length; i++) {
        result += alphbeth[mod(alphbeth.indexOf(str[i]) - key, 27)]
    }
	return result;
}
function getEntropy(str) {
	var sum = 0;
	var ignored = 0;
	for (var i = 0; i < str.length; i++) {
		
		sum += Math.log(SPANISH_FREQS[alphbeth.indexOf(str[i])]);  // Uppercase
		
	}
	return -sum / Math.log(2) / (str.length - ignored);
}
function getAllEntropies(str) {
	var result = [];
	for (var i = 0; i < 27; i++)
		result.push([i, getEntropy(decrypt(str, i))]);
	return result;
}