window.onload = function() {
    console.log('123')
    var wrap = document.getElementById("wrap");
    var cxt = wrap.getContext("2d");
    //start

    (function drawSpectrum() {
        cxt.clearRect(0, 0, wrap.width, wrap.height); //draw lines
        cxt.strokeStyle = '#ddd9d6';
        for (var i = 0; i < 360; i++) {
            cxt.beginPath();
            cxt.lineWidth = 2;
            cxt.moveTo(300, 300); //R * cos (PI / 180 * rotation angle) ,-R * sin ( PI / 180 * rotation angle)
            cxt.lineTo(Math.cos((i * 1) / 180 * Math.PI) * 258 + 300, (-Math.sin((i * 1) / 180 * Math.PI) * 258 + 300));
            cxt.stroke();
        }

        //draw a circle to cover unnecessary lines
        cxt.beginPath();
        cxt.lineWidth = 1;
        cxt.arc(300, 300, 250, 0, 2 * Math.PI, false);
        cxt.fillStyle = "#161412";
        cxt.fill();

        cxt.strokeStyle = "#ddd9d6";
        cxt.beginPath();
        cxt.lineWidth = 1;
        cxt.moveTo( 232 + 300, 300);
        for (var i = 1; i < 360; i++) {
            cxt.lineTo(Math.cos((i * 1) / 180 * Math.PI) * 232 + 300, (-Math.sin((i * 1) / 180 * Math.PI) * 232 + 300));
        }
        cxt.lineTo( 232 + 300, 300);
        cxt.stroke();
    })();


    //get audio api
    var file = null;
    var audioDecodeBuffer = null; //data after audio is decoded


    //get audio api
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        var audioApi = new AudioContext();
    } catch (e) {
        alert('Your browser does not support dragover feature. Please use Chrome or Firefox');
    }

    //observe selected file
    var audioInput = document.getElementById('file');
    audioInput.onchange = function() {
        //here to check if the user really selected a file. If the length is 0, then the user cancelled the selection
        if (audioInput.files.length !== 0) {
            file = audioInput.files[0];
            readMusicData();
        }
    };

    function readMusicData() {
        //convert file into array buffer
        var fr = new FileReader();
        fr.readAsArrayBuffer(file);

        //callback after data is loaded
        fr.onload = function(e) {
            var prompt = document.getElementById('prompt')
            prompt.setAttribute('style', 'display:none')

            audioApi.decodeAudioData(e.target.result, function(buffer) { //buffer is the decoded audio
                audioDecodeBuffer = buffer;
                saveAndPlayMusicData();
            }, function(e) {
                alert('Failed to decode audio');
            });
        };
    }

    function saveAndPlayMusicData() {
        //create audio buffer
        var audioBufferSourceNode = audioApi.createBufferSource();

        //create analyzer
        var analyser = audioApi.createAnalyser();

        //connect buffer to analyzer
        audioBufferSourceNode.connect(analyser);

        //connect analyzer to player
        analyser.connect(audioApi.destination);

        //start playing
        audioBufferSourceNode.buffer = audioDecodeBuffer;
        audioBufferSourceNode.start(0);

        //draw wavelength
        draw(analyser);
    }

    function draw(analyser) {
        // var canvas = document.getElementById('canvas');
        var wrap = document.getElementById("wrap");
        var cxt = wrap.getContext("2d");
        // var ctx=canvas.getContext("2d");

        // this gradient is used for test drawing
        // var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        // gradient.addColorStop(1, '#0f0');
        // gradient.addColorStop(0.7, '#f00');
        // gradient.addColorStop(0.5, '#ff0');
        // gradient.addColorStop(0.3, '#f00');
        // gradient.addColorStop(0, '#0f0');
        // ctx.strokeStyle=gradient;

        var drawMeter = function() {
            // var array = new Uint8Array(analyser.frequencyBinCount);
            var array = new Uint8Array(360);
            analyser.getByteFrequencyData(array);

            var length = analyser.frequencyBinCount * 44100 / audioApi.sampleRate | 0; //创建数据
            var output2 = new Uint8Array(length);

            // var step=5;
            // var gap = 6;
            // var meterNum=70;
            // ctx.clearRect(0, 0, 400, 400);

            //    for (var i = 1; i <meterNum ;i++ ) {
            //        var value = array[i * step];
            //        ctx.beginPath();

            //        ctx.moveTo(i*gap,400);
            //        ctx.lineTo(i*gap,value);
            //        ctx.stroke();
            //    }

            // for (var i = 1; i <array.length  ;i++ ) {
            //     ctx.beginPath();
            //     ctx.moveTo(i,200);
            //     ctx.lineTo(i,200-array[i]/2);
            //     ctx.stroke();

            //     ctx.beginPath();
            //     ctx.moveTo(i,200);
            //     ctx.lineTo(i,200+array[i]/2);
            //     ctx.stroke();

            // }
            cxt.clearRect(0, 0, wrap.width, wrap.height); // draw lines
            // cxt.fillStyle = "rgba(255,255,255,0.2)";
            // cxt.strokeStyle = "rgb("+Math.floor(255-42.5*i)+","+Math.floor(255-42.5*i)+","+ 0 + ")"
            cxt.strokeStyle = "#ddd9d6";

            for (var i = 0; i < array.length; i++) {

                var value = 8 + array[i] / 4;
                cxt.beginPath();
                cxt.lineWidth = 2;
                cxt.moveTo(300, 300);
                //R * cos (PI/180*一次旋转的角度数) ,-R * sin (PI/180*一次旋转的角度数)
                cxt.lineTo(Math.cos((i * 1) / 180 * Math.PI) * (250 + value) + 300, (- Math.sin((i * 1) / 180 * Math.PI) * (250 + value) + 300));
                cxt.stroke();
            }


            cxt.beginPath();
            cxt.lineWidth = 1;
            cxt.arc(300, 300, 250, 0, 2 * Math.PI, false);
            // cxt.strokeStyle = "black";
            cxt.fillStyle = "#161412";
            //cxt.stroke();
            cxt.fill();


            cxt.strokeStyle = "#ddd9d6";
            cxt.beginPath();
            cxt.lineWidth = 1;
            cxt.moveTo( (240 - (8 + array[0] / 4)) + 300, 300);

            for (var i = 1; i < array.length; i++) {
                var value = 8 + array[i] / 4;
                cxt.lineTo(Math.cos((i * 1) / 180 * Math.PI) * (240 - value) + 300, (-Math.sin((i * 1) / 180 * Math.PI) * (240 - value) + 300));
            }

            cxt.lineTo( (240 - (8 + array[0] / 4)) + 300, 300);
            cxt.stroke();


            //request next frame
            requestAnimationFrame(drawMeter);
        };
        requestAnimationFrame(drawMeter);
    }
}