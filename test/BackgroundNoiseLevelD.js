var ctx = new AudioContext();
var processor = ctx.createScriptProcessor(1024, 1, 2);
var analyser = ctx.createAnalyser();

for(item in supportedConstraints){
	if (desiredConstraints[item] == true) {
		console.log(item);
	}
	else {
		//Remove video params
		delete supportedConstraints[item];
	}
}
var constraints = {video:false,audio:true}


navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {

	var mic = ctx.createMediaStreamSource(stream);
	var noiseLevel = 0.0001;

	mic.connect(processor);
	//processor.connect(ctx.destination); //
	processor.connect(analyser);
	analyser.fftSize = 2048;



	processor.onaudioprocess = function(e) {
	/*Script Processor DUE TO BE EOL*/ //https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/onaudioprocess
	  // Do something with the data, i.e Convert this to WAV
	  for (var channel = 0; channel < e.outputBuffer.numberOfChannels; channel++){
	    var inputData = e.inputBuffer.getChannelData(0);
	    var outputData = e.outputBuffer.getChannelData(channel);
	    var data = []
	    for (var sample = 0; sample < e.inputBuffer.length; sample++) {
	      //Sample current array
	      outputData[sample] = inputData[sample] + Math.random() * noiseLevel;
	      data[sample] = Math.abs(outputData[sample]);
	    }

	    e.outputBuffer = outputData;

	    
	    var ActSigPow = []

	    //calculation of maximum peak in signal
	    maxPeak = Math.max.apply(null, data)
		maxPeak_dB = 20*Math.log10(maxPeak);

		BlockLen_ms = 5;
		BlockLen = Math.floor(inputData.length*BlockLen_ms*0.001);
		Blocks = Math.floor(data.length/BlockLen);

		var ActSigPow = [];
		for (var i = 1; i < Blocks+1; i++) {
	    	var from = BlockLen*(i-1);
	    	var to = BlockLen*i;
	    	var chunk = data.slice(from,to);
	    	const reducer = (accu, currVal) => accu + currVal;
	    	var avg = Math.pow(chunk.reduce(reducer) / chunk.length,2);
	    	if (avg == 0) {
	    		avg = 1;
	    	}
	    	ActSigPow[i-1] = avg;
	    }
	        var minPow_dB = 10*Math.log10(Math.min.apply(null,ActSigPow));
	        var output = minPow_dB - maxPeak_dB;

	        console.log(output);
		}
  	}
});