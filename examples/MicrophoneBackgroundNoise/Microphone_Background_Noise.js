var constraints = {video:false,audio:true};
navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {

	var ctx = new AudioContext();
	var processor = ctx.createScriptProcessor(2048, 1, 1);
	var analyser = ctx.createAnalyser();

	var mic = ctx.createMediaStreamSource(stream);
	var noiseLevel = 0; //Inject Noise

	mic.connect(processor);
	/*processor.connect(ctx.destination);*/ //WILL CAUSE FEEDBACK LOOP, Uncomment at your own discretion
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
		      outputData[sample] = inputData[sample] + (Math.random() * noiseLevel);
		      data[sample] = Math.abs(outputData[sample]);
		    }

		    e.outputBuffer = outputData;

		    console.log(BackgroundNoiseLevelD(inputData));
		}
	}
});