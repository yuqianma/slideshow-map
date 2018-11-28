/**
 * Created by Jeffrey on 2018/11/28.
 */
// http://bl.ocks.org/MAKIO135/eab7b74e85ed2be48eeb

export function getVideoTexture ({
  src,
  width,
  height
}) {
  const video = document.createElement('video');
  video.loop = true;
  video.crossOrigin = 'anonymous';
  video.muted = true;

  const source = document.createElement('source');
  source.src = src;
  video.append(source);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.Texture( canvas );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;

  video.addEventListener('play', function () {
    function loop() {
      if (!video.paused && !video.ended) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);

        texture.needsUpdate = true;

        requestAnimationFrame(loop);
      }
    }
    loop();
  }, false);

  texture.video = video;

  return texture;
}
