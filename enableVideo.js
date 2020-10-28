var vid = document.getElementById('videoel');
var vid_width = vid.width;
var vid_height = vid.height;
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var webgl_overlay = document.getElementById('webgl');

function enablestart() {
    var startbutton = document.getElementById('startbutton');
    startbutton.value = "start";
    startbutton.disabled = null;
}


function adjustVideoProportions() {
    // resize overlay and video if proportions are not 4:3
    // keep same height, just change width
    var proportion = vid.videoWidth/vid.videoHeight;
    vid_width = Math.round(vid_height * proportion);
    vid.width = vid_width;
    overlay.width = vid_width;
    webgl_overlay.width = vid_width;
    webGLContext.viewport(0,0,webGLContext.canvas.width,webGLContext.canvas.height);
}



navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;


// check whether browser supports webGL
				var webGLContext;
				if (window.WebGLRenderingContext) {
					webGLContext = webgl_overlay.getContext('webgl') || webgl_overlay.getContext('experimental-webgl');
					if (!webGLContext || !webGLContext.getExtension('OES_texture_float')) {
						webGLContext = null;
					}
				}
				if (webGLContext == null) {
					alert("Your browser does not seem to support WebGL. Unfortunately this face mask example depends on WebGL, so you'll have to try it in another browser. :(");
				}

				function gumSuccess( stream ) {
					// add camera stream if getUserMedia succeeded
					if ("srcObject" in vid) {
						vid.srcObject = stream;
					} else {
						vid.src = (window.URL && window.URL.createObjectURL(stream));
					}
					vid.onloadedmetadata = function() {
						adjustVideoProportions();
						fd.init(webgl_overlay);
						vid.play();
					}
					vid.onresize = function() {
						adjustVideoProportions();
						fd.init(webgl_overlay);
						if (trackingStarted) {
							ctrack.stop();
							ctrack.reset();
							ctrack.start(vid);
						}
					}
				}

				function gumFail() {
					// fall back to video if getUserMedia failed
					insertAltVideo(vid);
					document.getElementById('gum').className = "hide";
					document.getElementById('nogum').className = "nohide";
					alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
				}


				// check for camerasupport
				if (navigator.mediaDevices) {
					navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
				} else if (navigator.getUserMedia) {
					navigator.getUserMedia({video : true}, gumSuccess, gumFail);
				} else {
					insertAltVideo(vid)
					document.getElementById('gum').className = "hide";
					document.getElementById('nogum').className = "nohide";
					alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
				}

				vid.addEventListener('canplay', enablestart, false);