window.onload = function() {
    var wrap = document.getElementById("wrap");
    var cursor = wrap.getContext("2d");

    //start
    (function drawSpectrum() {
        cursor.clearRect(0, 0, wrap.width, wrap.height); //draw lines
        cursor.strokeStyle = '#ddd9d6';
        for (var i = 0; i < 360; i++) {
            cursor.beginPath();
            cursor.lineWidth = 2;
            cursor.moveTo(300, 300); //R * cos (PI / 180 * rotation angle) ,-R * sin ( PI / 180 * rotation angle)
            cursor.lineTo(Math.cos((i * 1) / 180 * Math.PI) * 258 + 300, (-Math.sin((i * 1) / 180 * Math.PI) * 258 + 300));
            cursor.stroke();
        }

        //draw a circle to cover unnecessary lines
        cursor.beginPath();
        cursor.lineWidth = 1;
        cursor.arc(300, 300, 250, 0, 2 * Math.PI, false);
        cursor.fillStyle = "#161412";
        cursor.fill();

        //inner wavelength
        cursor.strokeStyle = "#ddd9d6";
        cursor.beginPath();
        cursor.lineWidth = 1;
        cursor.moveTo(232 + 300, 300);
        for (var i = 1; i < 360; i++) {
            cursor.lineTo(
                Math.cos((i * 1) / 180 * Math.PI) * 232 + 300,
                (-Math.sin((i * 1) / 180 * Math.PI) * 232 + 300)
            );
        }
        cursor.lineTo(232 + 300, 300);
        cursor.stroke();
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
            document.getElementById('dynamic-text').setAttribute('style', 'display:none');
            document.getElementById('prompt1').setAttribute('style', 'display:none');
            document.getElementById('prompt2').setAttribute('style', 'display:none');
            document.getElementById('prompt3').setAttribute('style', 'display:none');
            document.getElementById('prompt4').setAttribute('style', 'display:none');
            audioApi.decodeAudioData(e.target.result, function(buffer) { //buffer is the decoded audio
                audioDecodeBuffer = buffer;
                saveAndPlayMusicData();
            }, function(e) {
                alert('Failed to decode audio. Maybe you uploaded an incorrect format?');
            });
        };
    }

    function saveAndPlayMusicData() {
        //create audio buffer
        var audioRaw = audioApi.createBufferSource();

        //create analyzer
        var analyser = audioApi.createAnalyser();

        //connect buffer to analyzer
        audioRaw.connect(analyser);

        //connect analyzer to player
        analyser.connect(audioApi.destination);

        //start playing
        audioRaw.buffer = audioDecodeBuffer;
        audioRaw.start(0);

        //draw wavelength
        draw(analyser);
    }

    function draw(analyser) {
        var wrap = document.getElementById("wrap");
        var cursor = wrap.getContext("2d");

        var drawCurrent = function() {
            var array = new Uint8Array(360);
            analyser.getByteFrequencyData(array);
            cursor.clearRect(0, 0, wrap.width, wrap.height); // draw lines
            cursor.strokeStyle = "#ddd9d6";
            for (var i = 0; i < array.length; i++) {
                var value = 8 + array[i] / 4;
                cursor.beginPath();
                cursor.lineWidth = 2;
                cursor.moveTo(300, 300);
                //R * cos (PI / 180 * rotation angle) ,-R * sin ( PI / 180 * rotation angle)
                cursor.lineTo(
                    Math.cos((i * 1) / 180 * Math.PI) * (250 + value) + 300,
                    (-Math.sin((i * 1) / 180 * Math.PI) * (250 + value) + 300)
                );
                cursor.stroke();
            }

            //black circle to cover inner wavelength
            cursor.beginPath();
            cursor.lineWidth = 1;
            cursor.arc(300, 300, 250, 0, 2 * Math.PI, false);
            cursor.fillStyle = "#161412";
            cursor.fill();

            //inner wavelength
            cursor.strokeStyle = "#ddd9d6";
            cursor.beginPath();
            cursor.lineWidth = 1;
            cursor.moveTo((240 - (8 + array[0] / 4)) + 300, 300);
            for (var i = 1; i < array.length; i++) {
                var power = 8 + array[i] / 4;
                cursor.lineTo(
                    Math.cos((i * 1) / 180 * Math.PI) * (240 - power) + 300,
                    (-Math.sin((i * 1) / 180 * Math.PI) * (240 - power) + 300)
                );
            }
            cursor.lineTo((240 - (8 + array[0] / 4)) + 300, 300);
            cursor.stroke();
            requestAnimationFrame(drawCurrent);
        };
        requestAnimationFrame(drawCurrent);
    }
}