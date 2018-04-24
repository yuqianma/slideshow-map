/**
 * Created by Jeffrey on 2018/4/24.
 */

const SEGMENTS = 1;

export default function Box ({
  width = 20,
  height = 20,
  depth = 20
}) {
  const mesh = new THREE.Object3D();

  const box = new THREE.BoxGeometry(
    width, height, depth, SEGMENTS, SEGMENTS, SEGMENTS
  );
  box.translate(0, 0, box.parameters.depth / 2);

  // todo, try three.meshline
  mesh.add(new THREE.LineSegments2(
    new THREE.WireframeGeometry2(box),
    new THREE.LineMaterial({
      color: 0x0090ff,
      transparent: true,
      opacity: 0.1,
      linewidth: 0.0015,
    })
  ));

  mesh.add(new THREE.Mesh(
    box,
    new THREE.MeshPhongMaterial({
      color: 0x004173,
      transparent: true,
      opacity: 0.5,
      // shininess: 0,
      // emissive: 0xffffff,
      // side: THREE.DoubleSide,
      flatShading: true
    })
  ));

  return mesh

}
