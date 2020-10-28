


/*********** Code for face tracking and face masking *********/

var ctrack = new clm.tracker();
ctrack.init(pModel);
var trackingStarted = false;

// document.getElementById('selectmask').addEventListener('change', updateMask, false);

function updateMask(el) {
    //currentMask = parseInt(el.target.value, 10);

    switchMasks();
}

function startVideo() {
    // start video
    vid.play();
    // start tracking
    ctrack.start(vid);
    trackingStarted = true;
    // start drawing face grid
    drawGridLoop();
}

var positions;
var fd = new faceDeformer();
var currentMask = 1;
var animationRequest;

function drawGridLoop() {
    // get position of face
    positions = ctrack.getCurrentPosition();
    overlayCC.clearRect(0, 0, vid_width, vid_height);
    if (positions) {
        // draw current grid
        ctrack.draw(overlay);
    }
    // check whether mask has converged
    var pn = ctrack.getConvergence();
    if (pn < 0.4) {
        switchMasks();
        requestAnimFrame(drawMaskLoop);
    } else {
        requestAnimFrame(drawGridLoop);
    }
}

function switchMasks() {
    // get mask
    var maskname = Object.keys(masks)[currentMask];
    fd.load(document.getElementById('acne'), masks['acne'], pModel);
}

function drawMaskLoop() {
    // get position of face
    positions = ctrack.getCurrentPosition();
    overlayCC.clearRect(0, 0, vid_width, vid_height);
    if (positions) {
        // draw mask on top of face
        fd.draw(positions);
    }
    animationRequest = requestAnimFrame(drawMaskLoop);
}

