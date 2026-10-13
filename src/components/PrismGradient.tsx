"use client";

/**
 * PrismGradient — 히어로 배경용 WebGL2 셰이더 그라디언트 (사용자 제공 컴포넌트를 이식, 2026-09-16)
 *  design/demos/hero-prism.html 로 먼저 시안 검토 후 확정. 원본과 달리:
 *   - 히어로는 항상 다크 고정이라 next-themes 다크/라이트 분기 제거, PRISM.dark 팔레트만 사용
 *   - noise 오버레이 제거 (기존 .hero-grain 레이어가 이미 있어 중복)
 *   - 스크롤이 히어로 높이(innerHeight)를 넘으면 rAF 루프를 멈춤. ⚠️ IntersectionObserver 로는 안 됨 —
 *     히어로가 `sticky top-0`라 다음 섹션에 완전히 덮인 뒤에도 자기 박스 자체는 뷰포트(0~innerHeight)를
 *     계속 차지하고 있어 isIntersecting 이 항상 true 로 남는다(실측 확인). Hero.tsx 가 --hero-p 계산에
 *     쓰는 것과 같은 scrollY/innerHeight 기준을 그대로 재사용.
 */
import { useEffect, useRef, useState } from "react";

const PRISM = {
  colors: ["#050505", "#66B3FF", "#FFFFFF"],
  rotation: -50,
  proportion: 1,
  scale: 0.01,
  speed: 30,
  distortion: 0,
  swirl: 50,
  swirlIterations: 16,
  softness: 47,
  offset: -299,
  shapeSize: 45,
} as const;

function hexToRgba(hex: string): [number, number, number, number] {
  const v = hex.replace("#", "");
  return [
    Number.parseInt(v.slice(0, 2), 16) / 255,
    Number.parseInt(v.slice(2, 4), 16) / 255,
    Number.parseInt(v.slice(4, 6), 16) / 255,
    1,
  ];
}

export default function PrismGradient({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!gl) { setWebglFailed(true); return; }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    };
    const vertexShader = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) { setWebglFailed(true); return; }

    const program = gl.createProgram();
    if (!program) { setWebglFailed(true); return; }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { setWebglFailed(true); return; }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      time: uniform("u_time"), resolution: uniform("u_resolution"), pixelRatio: uniform("u_pixelRatio"),
      scale: uniform("u_scale"), rotation: uniform("u_rotation"),
      color1: uniform("u_color1"), color2: uniform("u_color2"), color3: uniform("u_color3"),
      proportion: uniform("u_proportion"), softness: uniform("u_softness"), shapeScale: uniform("u_shapeScale"),
      distortion: uniform("u_distortion"), swirl: uniform("u_swirl"), swirlIterations: uniform("u_swirlIterations"),
    };

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(container.clientWidth * pixelRatio));
      canvas.height = Math.max(1, Math.round(container.clientHeight * pixelRatio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const startedAt = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [color1, color2, color3] = PRISM.colors.map(hexToRgba);
    let frameId: number | undefined;

    const draw = (time: number) => {
      const elapsed = (time - startedAt) / 1000;
      const prismSpeed = (PRISM.speed / 100) * 5;
      gl.uniform1f(u.time, elapsed * prismSpeed + PRISM.offset * 0.01);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.pixelRatio, window.devicePixelRatio || 1);
      gl.uniform1f(u.scale, PRISM.scale);
      gl.uniform1f(u.rotation, (PRISM.rotation * Math.PI) / 180);
      gl.uniform4fv(u.color1, color1);
      gl.uniform4fv(u.color2, color2);
      gl.uniform4fv(u.color3, color3);
      gl.uniform1f(u.proportion, PRISM.proportion / 100);
      gl.uniform1f(u.softness, PRISM.softness / 100);
      gl.uniform1f(u.shapeScale, PRISM.shapeSize / 100);
      gl.uniform1f(u.distortion, PRISM.distortion / 50);
      gl.uniform1f(u.swirl, PRISM.swirl / 100);
      gl.uniform1f(u.swirlIterations, PRISM.swirlIterations);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = undefined;
      if (!reduceMotion && visibleRef.current) frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);

    // 스크롤로 히어로가 완전히 덮이면 멈추고, 다시 위로 올라오면 재개
    const onScroll = () => {
      const nowVisible = window.scrollY < window.innerHeight;
      visibleRef.current = nowVisible;
      if (nowVisible && frameId === undefined && !reduceMotion) frameId = requestAnimationFrame(draw);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {webglFailed ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,#66b3ff_0%,#050505_48%,#fff_100%)]" />
      ) : (
        <canvas ref={canvasRef} className="block w-full h-full" />
      )}
    </div>
  );
}

const VERTEX_SHADER = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec4 blendColors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edgeBlur) {
  vec3 color1 = c1.rgb * c1.a;
  vec3 color2 = c2.rgb * c2.a;
  vec3 color3 = c3.rgb * c3.a;
  float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edgeBlur, mixer);
  float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edgeBlur, mixer);
  vec3 blendedColor2 = mix(color1, color2, r1);
  float blendedOpacity2 = mix(c1.a, c2.a, r1);
  vec3 color = mix(blendedColor2, color3, r2);
  float opacity = mix(blendedOpacity2, c3.a, r2);
  return vec4(color, opacity);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float time = .5 * u_time;
  float noiseScale = .0005 + .006 * u_scale;

  uv -= .5;
  uv *= noiseScale * u_resolution;
  uv = rotate(uv, u_rotation * .5 * PI);
  uv /= u_pixelRatio;
  uv += .5;

  float n1 = noise(uv + time);
  float n2 = noise(uv * 2. - time);
  float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle);
  uv.y += 4. * u_distortion * n2 * sin(angle);

  float iterations = ceil(clamp(u_swirlIterations, 1., 30.));
  for (float i = 1.; i <= iterations; i++) {
    uv.x += clamp(u_swirl, 0., 2.) / i * cos(time + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / i * cos(time + i * uv.x);
  }

  float proportion = clamp(u_proportion, 0., 1.);
  vec2 checksUv = uv * (.5 + 3.5 * u_shapeScale);
  float shape = .5 + .5 * sin(checksUv.x) * cos(checksUv.y);
  float mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  vec4 colorMix = blendColors(
    u_color1,
    u_color2,
    u_color3,
    mixer,
    1. - clamp(u_softness, 0., 1.),
    .01 + .01 * u_scale
  );
  fragColor = colorMix;
}
`;
