const texto = "AEDOEFIWOPZWMCCWIEDFAVPCQLGAACZXDDGLRAHUOGAARYDMRCJENDBFRAHGFEHSGONPGPSGTDGNIBGRNEWSBEEXWRYXACVPRFGNDHPHNJYZOOLLPQCYXPADVEODIYENDYLTWOHOEOOMFRMIVCEPSRDTGCVVOACMWEZOBLPPWBSGTOFOIZSZLRAGNVTDDWSPAQCYOAHEFIWWZAMPCRVTMGNMVTHNDIZZCDWPANPSDDGOWFOTSRZOGSEOSYNSDONZRZSHLJAGVNSPHHLRTCDZVFOBEINDZZOMRRVSFGCNSDONZRBDFBYPZCDVTSGQSEQCCSZOFSSESGEEZOUSIEQCYHTRCDXDOGVEHWQLWPRRYXMGVLCBOFLTPINNSESBPINVNDGAACOWFOGNIZOKSHMR";
const alphbeth = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z']
const stadistics = [10.6,1.16,4.85,5.87,13.11,1.13,1.4,0.6,7.16,0.25,0.11,4.42,3.11,7.14,0.1,8.23,2.71,0.74,6.95,8.47,5.4,4.34,0.82,0.12,0.15,0.79,0.26]
var stadistics_of_subCrypto = []
var arr=[];
var claves = [];
for (let i = 3; i <= 6; i++) {
    for (let index = 0; index < texto.length- i; index++) {
        arr.push(texto.slice(index,index+i));
        
    }
}

var contar = [];
for (let i = 0; i < arr.length; i++) {
    var space = 0;
    var espacios = [];
    var seg = arr[i];

    var distancias = [];
    for (let j = 0; j < texto.length; j++) {
        var text = texto.slice(j, j+seg.length);
        if(text == seg){
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
function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

var hash = {};
contar = contar.filter(function(current) {
  var exists = !hash[current.seg] || false;
  hash[current.seg] = true;
  return exists;
});

var array = contar.filter( (value) => value.distancias.length >= 1)
//console.log(array)

//console.log(valoresDistancia)
// MCD
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

console.log("Posibles longitudes de clave");
var longitudes = [];
for( let i = 3; i <= 6; i++){
    var newArray = array.filter(value => value.seg.length == i);
    //console.log(i,newArray)
    let valoresDistancia = [];
    newArray.map(value => {
        value.distancias.map(val => {
            valoresDistancia.push(val);
        })
        
    })
    
    var mcd = MCD(valoresDistancia);
    
    if(mcd){
        longitudes.push(mcd)
        console.log("Longitud: ", mcd)
    }
        
    
    
}

let subCryto = [];
longitudes.map(val => {
    for (let i = 0; i < val; i++) {
        subCryto[i] = '';
        for (let j = i; j < texto.length ; j += val ) {
            subCryto[i] += texto[j];
        }
        
    }    
    console.log(val, subCryto)    
    var clave = '';
    var keys = []
    subCryto.map(value => {
        clave += alphbeth[getKey(count(value), value.length)]
        keys.push(getKey(count(value),value.length))
    })
    console.log("con Longitud: "+ val +", clave="+clave)
    claves.push({longitud: val, keys: keys})
})
function count (string) { 
    var count = {};
    string.split('').forEach(function(s) {
        count[s] ? count[s]++ : count[s] = 1;
    }); 
    return count; 
} 

function getKey(string, size){

    for (let i = 0; i < alphbeth.length; i++) {
        stadistics_of_subCrypto[i] = string[alphbeth[i]]? string[alphbeth[i]]/size : 0;
    }
    var sums = []
    for (let i = 0; i < stadistics.length; i++) {
        var sum = 0;
        for (let j = 0; j < stadistics.length; j++) {
            sum += stadistics[j] * stadistics_of_subCrypto[j];
            
        }
        sums.push(Number(sum.toFixed(3)));
        //cambio
        var a = stadistics_of_subCrypto[0];
        
        for (let j = 1 ; j < stadistics.length; j++) {
            stadistics_of_subCrypto[j-1] = stadistics_of_subCrypto[j]
        }
        
        stadistics_of_subCrypto[alphbeth.length-1] = a;
        
    }
    
    var max = Math.max(...sums)
    return sums.indexOf(max);
}
console.log('claves',claves)
// transformar a numeros
var texto_numeros= []
for (let i = 0; i < texto.length; i++) {
    texto_numeros.push(alphbeth.indexOf(texto[i]))
}


for (let i = 0; i < claves.length; i++) {
    var k = 0;
    var texto_numeros_dec = []
    for (let j = 0; j < texto_numeros.length; j++) {
        if(k >= claves[i].keys.length){
            k = 0;
        }
        
        texto_numeros_dec.push((texto_numeros[j] - claves[i].keys[k]) < 0 ? alphbeth.length + (texto_numeros[j] - claves[i].keys[k]): texto_numeros[j] - claves[i].keys[k]);
        k++;
    }
    var texto_dec = '';
    for (let i = 0; i < texto_numeros_dec.length; i++) {
        texto_dec += alphbeth[texto_numeros_dec[i]];
    }
    console.log("Con clave: ", claves[i].keys);
    console.log(texto_dec)
}



