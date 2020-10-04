const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const fullscreenButton = document.getElementById("fullscreen-btn");
const preview = document.getElementById("preview");
const modalConfirm = document.getElementById("modal-confirmation");
const modalBtnConfirm = document.getElementById("fs-confirm");
const modalBtnCancel = document.getElementById("fs-cancel");
let recorder, stream;

async function startRecording() {
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: "screen" },
    audio: true,
  });
  preview.srcObject = stream;

  document.documentElement.requestFullscreen();
  fullscreenButton.style.display = "block";

  recorder = new MediaRecorder(stream);

  const chunks = [];
  const a = document.createElement("a");
  document.body.append(a);
  recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
  recorder.onstop = (e) => {
    const completeBlob = new Blob(chunks, { type: "video/mp4" });
    const url = URL.createObjectURL(completeBlob);
    a.href = url;
    a.download = "recorded-screen.mp4";
    a.click();
    window.open(url, "_blank");
  };

  recorder.start();
}

startButton.addEventListener("click", () => {
  startButton.setAttribute("disabled", true);
  stopButton.removeAttribute("disabled");

  startRecording();
});

function endRecorder() {
  stopButton.setAttribute("disabled", true);
  startButton.removeAttribute("disabled");
  fullscreenButton.style.display = "none";
  modalConfirm.style.visibility = "hidden";

  document.exitFullscreen();
  recorder.stop();
  stream.getVideoTracks()[0].stop();
}

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) console.log("Fullscreen mode activated");
  else endRecorder();
});

stopButton.addEventListener("click", endRecorder);

fullscreenButton.addEventListener("click", () => {
  modalConfirm.style.visibility = "visible";
});

modalBtnCancel.addEventListener("click", () => {
  modalConfirm.style.visibility = "hidden";
});

modalBtnConfirm.addEventListener("click", endRecorder);
