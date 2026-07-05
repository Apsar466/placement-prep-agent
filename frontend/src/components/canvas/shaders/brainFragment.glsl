// Placeholder for Phase 2 custom glow/fresnel effects
varying vec3 vNormal;
void main() {
  float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
  gl_FragColor = vec4(0.23, 0.51, 0.96, 1.0) * intensity;
}