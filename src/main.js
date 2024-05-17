import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
} from "@snap/camera-kit";

(async function () {
  var cameraKit = await bootstrapCameraKit({
    apiToken:
      "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk5Mjg3NDEyLCJzdWIiOiI5OGQwOGYxZS01OTU1LTQwNjYtOWM4NC02MTlkOTMxYzlkMzR-U1RBR0lOR344NGNjM2UwMS1kNzMzLTRjZWEtYjhkOC01ZDhlOGMxYTljNzMifQ.VjMz-SkG7I1dPM6RI3UGo_2ZX4H5hBDWtsB9q3RSQa8",
  });
  const session = await cameraKit.createSession();
  document.getElementById("canvas").replaceWith((await session).output.live);

  const { lenses } = await cameraKit.lensRepository.loadLensGroups([
    "ad00ce44-7e95-4381-91d6-19540d6dd943",
  ]);

  session.applyLens(lenses[0]);
  //only if front camera
  //let mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });

  let mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
  });

  const source = createMediaStreamSource(mediaStream, {
    //only necessary if cameraType : front
    //transform: Transform2D.MirrorX,
    cameraType: "back",
  });

  await session.setSource(source);
  session.source.setRenderSize(window.innerWidth, window.innerHeight);
  session.play();
})();
