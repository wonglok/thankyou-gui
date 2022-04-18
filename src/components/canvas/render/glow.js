import { Water } from 'three/examples/jsm/objects/Water.js'
import {
  //
  DoubleSide,
  CircleBufferGeometry,
  Vector3,
  RepeatWrapping,
  TextureLoader,
  Mesh,
  MeshStandardMaterial,
  sRGBEncoding,

  //
  Clock,
  Color,
  Vector2,
  ShaderMaterial,
  MeshBasicMaterial,
  Layers,
  LineBasicMaterial,
  Material,
} from 'three'

//

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
// import { InstancedMesh } from 'three'
// import { Points } from 'three'
// import { MeshLambertMaterial } from 'three'
// import { MeshPhysicalMaterial } from 'three'
// import { MeshPhongMaterial } from 'three'
// import { MeshMatcapMaterial } from 'three'
// import { MeshToonMaterial } from 'three'
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

export const ENTIRE_SCENE = 0
export const BLOOM_SCENE = 1

export const enableBloom = (item) => {
  item.layers.enable(BLOOM_SCENE)
}

export const disableBloom = (item) => {
  item.layers.disable(BLOOM_SCENE)
}

/**
 * @param {Object} props - The props stuff
 * @param {IOParams} props.io - The sockets
 */
export function glow({ vfx }) {
  // let tool = useTools();
  let gl = vfx.now.gl
  let renderer = gl
  let scene = vfx.now.scene
  let camera = vfx.now.camera
  let size = new Vector2()
  renderer.getSize(size)

  // let baseRTT = new WebGLRenderTarget(size.width, size.height, {
  //   encoding: sRGBEncoding,
  // });
  let bloomComposer = new EffectComposer(gl)
  bloomComposer.renderToScreen = false

  let renderPass = new RenderPass(scene, camera)
  bloomComposer.addPass(renderPass)

  //
  let unrealPass = new UnrealBloomPass(size, 1.0, 0.5, 0.5)
  unrealPass.renderToScreen = true

  // unrealPass.strength = 1.0;
  // let audio = ({ detail: { low, mid, high, texture } }) => {
  //   if (low !== 0) {
  //     unrealPass.strength = 3 * (low + mid + high);
  //   }
  // };
  // window.addEventListener("audio-info", audio);
  // window.removeEventListener("audio-info", audio);

  unrealPass.strength = 1
  unrealPass.threshold = 0.2
  unrealPass.radius = 1

  vfx.onChange('bloomStrength', (v) => {
    unrealPass.strength = v
  })
  vfx.onChange('bloomThreshold', (v) => {
    unrealPass.threshold = v
  })
  vfx.onChange('bloomRadius', (v) => {
    unrealPass.radius = v
  })

  const finalComposer = new EffectComposer(gl)
  finalComposer.addPass(renderPass)
  finalComposer.renderToScreen = true

  vfx.now.finalComposer = finalComposer

  vfx.onResize(() => {
    let dpr = renderer.getPixelRatio()
    let sizeV2 = new Vector2()
    renderer.getSize(sizeV2)
    bloomComposer.setSize(sizeV2.x, sizeV2.y)
    finalComposer.setSize(sizeV2.x, sizeV2.y)
    unrealPass.setSize(0.05 * sizeV2.x, 0.05 * sizeV2.y)
    bloomComposer.setPixelRatio(dpr)
    finalComposer.setPixelRatio(dpr)
  })

  bloomComposer.addPass(unrealPass)

  // bloomComposer.renderTarget2.texture.encoding = sRGBEncoding;
  // bloomComposer.renderTarget1.texture.encoding = sRGBEncoding;
  // finalComposer.renderTarget2.texture.encoding = sRGBEncoding;
  // finalComposer.renderTarget1.texture.encoding = sRGBEncoding;

  //
  //
  // let bloomTexture = {
  //   value: bloomComposer.renderTarget2.texture,
  // };
  const finalPass = new ShaderPass(
    new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: {
          value: bloomComposer.renderTarget2.texture,
        },
      },
      vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
      fragmentShader: /* glsl */ `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;

          varying vec2 vUv;

          void main() {
            gl_FragColor = LinearTosRGB(( texture2D( baseTexture, vUv ) * 1.0 + 1.0 * texture2D( bloomTexture, vUv ) ));
          }
        `,
      defines: {},
    }),
    'baseTexture'
  )
  //

  finalPass.needsSwap = true
  finalComposer.addPass(finalPass)

  // window.addEventListener(
  //   "resize",
  //   () => {

  //   },

  //   //
  //   false
  // );

  window.dispatchEvent(new CustomEvent('resize'))

  // let materials = {};
  const darkMaterial = new MeshBasicMaterial({
    color: new Color('#000000'),
    // skinning: true,
    side: DoubleSide,
  })

  const bloomLayer = new Layers()
  bloomLayer.set(BLOOM_SCENE)

  let cacheMap = new Map()
  //
  function darkenNonBloomed(obj) {
    if (obj.material instanceof Array) {
      // console.log();

      obj.material.forEach((it) => {
        if (it.isMesh && bloomLayer.test(it.layers) === false) {
          // materials[it.uuid] = it.material;
          cacheMap.set(it.uuid, it.material)
          it.material = it.userData.darkMaterial || darkMaterial
        }
      })
    } else if (obj.material instanceof Material) {
      // if (
      //   obj.material instanceof MeshStandardMaterial ||
      //   obj.material instanceof LineBasicMaterial ||
      //   obj.material instanceof MeshPhongMaterial ||
      //   obj.material instanceof MeshBasicMaterial ||
      //   obj.material instanceof MeshLambertMaterial ||
      //   obj.material instanceof MeshMatcapMaterial ||
      //   obj.material instanceof MeshPhysicalMaterial ||
      //   obj.material instanceof MeshToonMaterial
      // ) {

      // if (obj.geometry) {
      //   if (
      //     obj.geometry.type === "PlaneGeometry" &&
      //     obj.geometry.parameters.width >= 1000 &&
      //     obj.geometry.parameters.height >= 1000
      //   ) {
      //     obj.visible = false;
      //   }
      // }

      if (obj.name === 'helper') {
        obj.userData.helperOrigVis = obj.visible
        obj.visible = false
      }

      if (obj.type === 'GridHelper') {
        obj.userData.helperOrigVis = obj.visible
        obj.visible = false
      }

      // if (
      //   obj?.material?.userData?.forceBloom &&
      //   obj?.material?.bloomAPI?.forceBloom
      // ) {
      //   obj.material.bloomAPI.forceBloom();
      //   return;
      // }

      // if (obj?.material?.bloomAPI?.pixelScan) {
      //   obj.material.bloomAPI.pixelScan();
      //   return;
      // }

      // it.material.bloomAPI

      //
      if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        // materials[obj.uuid] = obj.material;
        cacheMap.set(obj.uuid, obj.material)
        obj.material = obj.userData.darkMaterial || darkMaterial
      }
    }
    // }
  }

  function restoreMaterial(obj) {
    //
    if (obj.material instanceof Array) {
      // console.log();

      obj.material.forEach((it) => {
        if (it.isMesh && bloomLayer.test(it.layers) === false) {
          // materials[it.uuid] = it.material;
          cacheMap.set(it.uuid, it.material)
          it.material = it.userData.darkMaterial || darkMaterial
        }
      })
    } else if (obj.material instanceof Material) {
      if (obj.name === 'helper') {
        obj.visible = obj.userData.helperOrigVis
      }
      if (obj.type === 'GridHelper') {
        obj.visible = obj.userData.helperOrigVis
      }

      // if (obj?.material?.bloomAPI?.restore) {
      //   obj.material.bloomAPI.restore();
      //   return;
      // }

      if (cacheMap.has(obj.uuid)) {
        obj.material = cacheMap.get(obj.uuid)
        cacheMap.delete(obj.uuid)
      }

      // if (materials[obj.uuid]) {
      //   obj.material = materials[obj.uuid];
      //   delete materials[obj.uuid];
      // }
    }
  }

  let run = (dt) => {
    let origBG = scene.background

    //
    gl.shadowMap.enabled = false
    scene.background = null
    scene.traverse(darkenNonBloomed)
    bloomComposer.render(dt)
    //
    gl.shadowMap.enabled = true
    scene.background = origBG
    scene.traverse(restoreMaterial)
    finalComposer.render(dt)
  }

  let clock = new Clock()

  vfx.onLoop(() => {
    scene.traverse((it) => {
      if (it.name === 'helper') {
        it.traverse((sub) => {
          sub.userData.dispose = true
        })
      }

      if (it.material) {
        if (it.material.emissive && it.material.emissive.getHex() > 0) {
          enableBloom(it)
        }
        if (it.material.emissiveMap) {
          enableBloom(it)
        }

        if (it?.material?.userData?.enableBloom === true) {
          enableBloom(it)
        }
        if (it.userData.enableBloom === true) {
          enableBloom(it)
        }

        if (it.userData.forceBloom === 'glow') {
          enableBloom(it)
        }

        if (it.userData.forceBloom === 'dim') {
          disableBloom(it)
        }
      }
    })

    let dt = clock.getDelta()

    if (vfx.now.stopGlow) {
      renderer.render(scene, camera)
    } else {
      run(dt)
    }
  })

  //

  return null
}
