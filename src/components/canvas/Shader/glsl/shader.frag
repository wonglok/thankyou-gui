  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;
  #pragma glslify: random = require(glsl-random)

  void main() {
    gl_FragColor.rgba = vec4(0.3 + 0.1 + 0.5 * sin(vUv.yyx + time) + color, 1.0);
  }
