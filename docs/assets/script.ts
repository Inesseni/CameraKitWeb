import { bootstrapCameraKit, createMediaStreamSource } from "@snap/camera-kit";

const liveRenderTarget = document.getElementById("canvas") as HTMLCanvasElement;
const videoContainer = document.getElementById(
  "video-container"
) as HTMLElement;
const videoTarget = document.getElementById("video") as HTMLVideoElement;
const startRecordingButton = document.getElementById(
  "start"
) as HTMLButtonElement;
const stopRecordingButton = document.getElementById(
  "stop"
) as HTMLButtonElement;
const downloadButton = document.getElementById("download") as HTMLButtonElement;

let mediaRecorder: MediaRecorder;
let downloadUrl: string;

async function init() {
  const cameraKit = await bootstrapCameraKit({
    apiToken:
      "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk5Mjg3NDEyLCJzdWIiOiI5OGQwOGYxZS01OTU1LTQwNjYtOWM4NC02MTlkOTMxYzlkMzR-U1RBR0lOR344NGNjM2UwMS1kNzMzLTRjZWEtYjhkOC01ZDhlOGMxYTljNzMifQ.VjMz-SkG7I1dPM6RI3UGo_2ZX4H5hBDWtsB9q3RSQa8",
  });

  const session = await cameraKit.createSession({ liveRenderTarget });

  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  const source = createMediaStreamSource(mediaStream);

  await session.setSource(source);
  await session.play();

  const { lenses } = await cameraKit.lensRepository.loadLensGroups([
    "ad00ce44-7e95-4381-91d6-19540d6dd943",
  ]);

  session.applyLens(lenses[0]);

  bindRecorder();
}

function bindRecorder() {
  startRecordingButton.addEventListener("click", () => {
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
    downloadButton.disabled = true;
    videoContainer.style.display = "none";

    const mediaStream = liveRenderTarget.captureStream(30);

    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (!event.data.size) {
        console.warn("No recorded data available");
        return;
      }

      const blob = new Blob([event.data]);

      downloadUrl = window.URL.createObjectURL(blob);
      downloadButton.disabled = false;

      videoTarget.src = downloadUrl;
      videoContainer.style.display = "block";
    });

    mediaRecorder.start();
  });

  stopRecordingButton.addEventListener("click", () => {
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;

    mediaRecorder?.stop();
  });

  downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");

    link.setAttribute("style", "display: none");
    link.href = downloadUrl;
    link.download = "camera-kit-web-recording.webm";
    link.click();
    link.remove();
  });
}

init();
