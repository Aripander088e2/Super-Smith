const symbols = ['0','!','@','#','$','%','^','&','*','(',')'];

function prettyPrint(given) {
    if (given == undefined)
        return 0;
    if (isNaN(given)) {
        let arr = given.split('_')
        for (let i = 0; i < arr.length; i++)
            arr[i] = arr[i].substr(0,1).toUpperCase() + arr[i].substr(1);
        return arr.join(' ');
    }
    else {
        if (given < 0.1)
            return '' + (parseInt(given * 100)/100);
        else 
            return '' + (parseInt(given * 10)/10);
    }
}

function toRomanNums(given) {
    var numMap = {'M':1000,'D':500,'C':100,'L':50,'X':10,'V':5,'I':1};
    var numKeys = Object.keys(numMap);
    let curr, currAddon; 

    if (isNaN(given))
        throw Error('Error: toRomanNums given bad input: ' + given);
    for (let i = 0; i < numKeys.length; i++) {
        curr = numKeys[i];
        if (given >= numMap[curr])
            return curr + toRomanNums(given - numMap[curr])
        // For special cases 4 == IV, 40 == XL, etc.
        for (let j = numKeys.length-1; j >= 0; j--) {
            currAddon = numKeys[j];
            // Only want powers of 10 and 1
            if (('' + numMap[currAddon])[0] == '1' 
            && given > numMap[currAddon]
            && given == numMap[curr] - numMap[currAddon])
                return currAddon + curr + toRomanNums(given - (numMap[curr] + numMap[currAddon]))

        }
    }
    return '';
}