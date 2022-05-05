import { extend } from '@react-three/fiber'
import guid from 'short-uuid'
// let glsl = (v) => v.join('')
// import yoFrag from './glsl/yo.frag'
// import yoVert from './glsl/yo.vert'
import vfx from '@/helpers/vfx'
import { MeshPhysicalMaterial } from 'three'

// This shader is from Bruno Simons Threejs-Journey: https://threejs-journey.xyz
class GlassRingMaterial extends MeshPhysicalMaterial {
  constructor() {
    super({
      //
    })

    this.uniforms = {
      time: { value: 0 },
    }

    vfx.onLoop((dt) => {
      this.uniforms.time.value += dt
    })

    this.onBeforeCompile = (shader, gl) => {
      shader.uniforms.time = this.uniforms.time

      let atBeginV = `
  varying vec2 myUV;
  varying vec4 vWP;
  `
      let atEndV = `
myUV = uv;
vWP = modelMatrix * vec4(position, 1.0);
`
      shader.vertexShader = shader.vertexShader.replace(
        `void main() {`,
        `${atBeginV.trim()} void main() {`
      )

      shader.vertexShader = shader.vertexShader.replace(
        `#include <fog_vertex>`,
        `#include <fog_vertex>${atEndV}`
      )

      let atBeginF = `
varying vec2 myUV;
uniform float time;
varying vec4 vWP;

  ${getFbmPattern()}
`

      let atEnd = `
// gl_FragColor *= vec4(
//  1.3 * pattern(1.0 / length(sin(time) / vWP.xy) / vWP.xy + 0.1 * cos(time * 0.1)),
//  1.3 * pattern(1.0 / length(sin(time) / vWP.xy) / vWP.xy + 0.0 * cos(time * 0.1)),
//  1.3 * pattern(1.0 / length(sin(time) / vWP.xy) / vWP.xy - 0.1 * cos(time * 0.1)),
// 1.0);

`

      shader.fragmentShader = `${atBeginF.trim()}\n${shader.fragmentShader}`
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <dithering_fragment>`,
        `#include <dithering_fragment>\n${atEnd.trim()}`
      )
    }

    //
  }
}

function getFbmPattern() {
  return /* glsl */ `

    const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

    float noise( in vec2 p ) {
      return sin(p.x)*sin(p.y);
    }

    float fbm4( vec2 p ) {
        float f = 0.0;
        f += 0.5000 * noise( p ); p = m * p * 2.02;
        f += 0.2500 * noise( p ); p = m * p * 2.03;
        f += 0.1250 * noise( p ); p = m * p * 2.01;
        f += 0.0625 * noise( p );
        return f / 0.9375;
    }

    float fbm6( vec2 p ) {
        float f = 0.0;
        f += 0.500000*(0.5 + 0.5 * noise( p )); p = m*p*2.02;
        f += 0.250000*(0.5 + 0.5 * noise( p )); p = m*p*2.03;
        f += 0.125000*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
        f += 0.062500*(0.5 + 0.5 * noise( p )); p = m*p*2.04;
        f += 0.031250*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
        f += 0.015625*(0.5 + 0.5 * noise( p ));
        return f/0.96875;
    }

    float pattern (vec2 p) {
      float vout = fbm4( p  + fbm6(  p + fbm4( p )) );
      return abs(vout);
    }
  `
}

// This is the 🔑 that HMR will renew if this file is edited
// It works for THREE.MeshPhysicalMaterial as well as for drei/MeshPhysicalMaterial
GlassRingMaterial.key = guid.generate()
// Make the material available in JSX as <GlassRingMaterial />
extend({ GlassRingMaterial })

export { GlassRingMaterial }
