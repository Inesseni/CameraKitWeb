import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
} from "@snap/camera-kit";

(async function () {
  var cameraKit = await bootstrapCameraKit({
    apiToken: "<api Token from the website>",
  });
  const session = await cameraKit.createSession();
  document.getElementById("canvas").replaceWith((await session).output.live);

  const { lenses } = await cameraKit.lensRepository.loadLensGroups([
    "group ID from the website",
  ]);

  session.applyLens(lenses[1]);
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
