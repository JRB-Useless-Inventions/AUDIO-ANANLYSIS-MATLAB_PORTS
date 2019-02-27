function BackgroundNoiseLevelD(buffer){
    var ActSigPow = []

    //calculation of maximum peak in signal
    maxPeak = Math.max.apply(null, buffer)
	maxPeak_dB = 20*Math.log10(maxPeak);

	BlockLen_ms = 5;
	BlockLen = Math.floor(buffer.length*BlockLen_ms*0.001);
	Blocks = Math.floor(buffer.length/BlockLen);

	var ActSigPow = [];
	for (var i = 1; i < Blocks+1; i++) {
    	var from = BlockLen*(i-1);
    	var to = BlockLen*i;
    	var chunk = buffer.slice(from,to);
    	const reducer = (accu, currVal) => accu + currVal;
    	var avg = Math.pow(chunk.reduce(reducer) / chunk.length,2);
    	if (avg == 0) {
    		avg = 1;
    	}
    	ActSigPow[i-1] = avg;
    }
        var minPow_dB = 10*Math.log10(Math.min.apply(null,ActSigPow));
        var output = minPow_dB - maxPeak_dB;

        return output;
}

module.exports BackgroundNoiseLevelD = BackgroundNoiseLevelD;