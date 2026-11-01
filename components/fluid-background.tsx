"use client";

/**
 * FluidBackground
 * ----------------
 * A full-screen WebGL fluid simulation that leaves a glowing, smoky trail
 * behind the cursor (or finger on touch screens). It sits in a fixed layer
 * behind every page, is mounted once in the root layout, and ignores pointer
 * events so it never blocks clicks.
 *
 * Based on the classic Navier–Stokes approach used by Pavel Dobryakov's
 * WebGL-Fluid-Simulation (MIT licence), trimmed down for a background effect.
 */

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/* ------------------------------------------------------------------ */
/* Tunables                                                            */
/* ------------------------------------------------------------------ */
const CONFIG = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  DENSITY_DISSIPATION: 2.2, // how fast the smoke fades (higher = shorter trail)
  VELOCITY_DISSIPATION: 1.6, // how fast motion settles
  PRESSURE: 0.1,
  PRESSURE_ITERATIONS: 20,
  CURL: 4, // swirliness
  SPLAT_RADIUS: 0.22, // size of the brush
  SPLAT_FORCE: 6000, // how hard the cursor pushes the fluid
  INTENSITY: 0.16, // how much colour each pointer move adds
};

// Smoke colours (linear-ish RGB, 0..1)
const DARK_COLOR: [number, number, number] = [0.35, 1.0, 0.6]; // soft green glow (matches the accent)
const LIGHT_COLOR: [number, number, number] = [0.0, 0.55, 0.3]; // green-600-ish tint

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */
const baseVertexShader = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const splatShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const advectionShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;

  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }

  void main () {
  #ifdef MANUAL_FILTERING
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
  #else
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
  #endif
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const divergenceShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const curlShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const vorticityShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const pressureShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const clearShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

// Turns the dye texture into a transparent, premultiplied-alpha image.
// In dark mode dense smoke blooms toward white, giving the bright "head".
const displayShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uBloom;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float a = max(c.r, max(c.g, c.b));
    c = mix(c, vec3(a), clamp((a - 0.45) * 1.6, 0.0, 1.0) * uBloom);
    c = min(c, vec3(1.0));
    a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
    gl_FragColor = vec4(c, a);
  }
`;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

type Format = { internalFormat: number; format: number };

type Program = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
  bind: () => void;
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef<string | undefined>(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect users who prefer less motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ---------- WebGL context ---------- */
    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    };

    let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | WebGLRenderingContext | null;
    const isWebGL2 = !!gl;
    if (!gl) gl = canvas.getContext("webgl", params) as WebGLRenderingContext | null;
    if (!gl) return; // No WebGL – silently skip the effect.

    const g = gl; // non-null alias for closures

    let halfFloatType: number;
    let supportLinearFiltering: boolean;
    if (isWebGL2) {
      g.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = !!g.getExtension("OES_texture_float_linear");
      halfFloatType = (g as WebGL2RenderingContext).HALF_FLOAT;
    } else {
      const halfFloat = g.getExtension("OES_texture_half_float");
      supportLinearFiltering = !!g.getExtension("OES_texture_half_float_linear");
      if (!halfFloat) return;
      halfFloatType = halfFloat.HALF_FLOAT_OES;
    }
    g.clearColor(0, 0, 0, 0);

    const supportRenderTextureFormat = (internalFormat: number, format: number, type: number) => {
      const texture = g.createTexture();
      g.bindTexture(g.TEXTURE_2D, texture);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = g.createFramebuffer();
      g.bindFramebuffer(g.FRAMEBUFFER, fbo);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);
      const ok = g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE;
      g.deleteTexture(texture);
      g.deleteFramebuffer(fbo);
      return ok;
    };

    const getSupportedFormat = (internalFormat: number, format: number, type: number): Format | null => {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        if (!isWebGL2) return null;
        const gl2 = g as WebGL2RenderingContext;
        switch (internalFormat) {
          case gl2.R16F:
            return getSupportedFormat(gl2.RG16F, gl2.RG, type);
          case gl2.RG16F:
            return getSupportedFormat(gl2.RGBA16F, gl2.RGBA, type);
          default:
            return null;
        }
      }
      return { internalFormat, format };
    };

    let formatRGBA: Format | null;
    let formatRG: Format | null;
    let formatR: Format | null;
    if (isWebGL2) {
      const gl2 = g as WebGL2RenderingContext;
      formatRGBA = getSupportedFormat(gl2.RGBA16F, gl2.RGBA, halfFloatType);
      formatRG = getSupportedFormat(gl2.RG16F, gl2.RG, halfFloatType);
      formatR = getSupportedFormat(gl2.R16F, gl2.RED, halfFloatType);
    } else {
      formatRGBA = getSupportedFormat(g.RGBA, g.RGBA, halfFloatType);
      formatRG = formatRGBA;
      formatR = formatRGBA;
    }
    if (!formatRGBA || !formatRG || !formatR) return;

    const dyeResolution = supportLinearFiltering ? CONFIG.DYE_RESOLUTION : 512;

    /* ---------- Shader helpers ---------- */
    const compileShader = (type: number, source: string, keywords?: string[]) => {
      if (keywords) source = keywords.map((k) => `#define ${k}\n`).join("") + source;
      const shader = g.createShader(type)!;
      g.shaderSource(shader, source);
      g.compileShader(shader);
      if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) {
        console.warn("[FluidBackground] shader error:", g.getShaderInfoLog(shader));
      }
      return shader;
    };

    const baseVertex = compileShader(g.VERTEX_SHADER, baseVertexShader);

    const createProgram = (fragSource: string, keywords?: string[]): Program => {
      const program = g.createProgram()!;
      g.attachShader(program, baseVertex);
      g.attachShader(program, compileShader(g.FRAGMENT_SHADER, fragSource, keywords));
      g.bindAttribLocation(program, 0, "aPosition");
      g.linkProgram(program);
      if (!g.getProgramParameter(program, g.LINK_STATUS)) {
        console.warn("[FluidBackground] program error:", g.getProgramInfoLog(program));
      }
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = g.getProgramParameter(program, g.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = g.getActiveUniform(program, i)!.name;
        uniforms[name] = g.getUniformLocation(program, name);
      }
      return { program, uniforms, bind: () => g.useProgram(program) };
    };

    const splatProgram = createProgram(splatShader);
    const advectionProgram = createProgram(
      advectionShader,
      supportLinearFiltering ? undefined : ["MANUAL_FILTERING"]
    );
    const divergenceProgram = createProgram(divergenceShader);
    const curlProgram = createProgram(curlShader);
    const vorticityProgram = createProgram(vorticityShader);
    const pressureProgram = createProgram(pressureShader);
    const gradientSubtractProgram = createProgram(gradientSubtractShader);
    const clearProgram = createProgram(clearShader);
    const displayProgram = createProgram(displayShader);

    /* ---------- Full-screen quad ---------- */
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), g.STATIC_DRAW);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    g.enableVertexAttribArray(0);

    const blit = (target: FBO | null) => {
      if (target == null) {
        g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
        g.bindFramebuffer(g.FRAMEBUFFER, null);
      } else {
        g.viewport(0, 0, target.width, target.height);
        g.bindFramebuffer(g.FRAMEBUFFER, target.fbo);
      }
      g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0);
    };

    /* ---------- Framebuffers ---------- */
    const createFBO = (w: number, h: number, f: Format, param: number): FBO => {
      g.activeTexture(g.TEXTURE0);
      const texture = g.createTexture()!;
      g.bindTexture(g.TEXTURE_2D, texture);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, param);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, param);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, f.internalFormat, w, h, 0, f.format, halfFloatType, null);
      const fbo = g.createFramebuffer()!;
      g.bindFramebuffer(g.FRAMEBUFFER, fbo);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);
      g.viewport(0, 0, w, h);
      g.clear(g.COLOR_BUFFER_BIT);
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          g.activeTexture(g.TEXTURE0 + id);
          g.bindTexture(g.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (w: number, h: number, f: Format, param: number): DoubleFBO => {
      let fbo1 = createFBO(w, h, f, param);
      let fbo2 = createFBO(w, h, f, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(v) {
          fbo1 = v;
        },
        get write() {
          return fbo2;
        },
        set write(v) {
          fbo2 = v;
        },
        swap() {
          const t = fbo1;
          fbo1 = fbo2;
          fbo2 = t;
        },
      };
    };

    const deleteFBO = (f: FBO) => {
      g.deleteTexture(f.texture);
      g.deleteFramebuffer(f.fbo);
    };

    const getResolution = (resolution: number) => {
      let aspect = g.drawingBufferWidth / g.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      return g.drawingBufferWidth > g.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    };

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;
    let initialised = false;

    const initFramebuffers = () => {
      if (initialised) {
        [dye.read, dye.write, velocity.read, velocity.write, divergence, curl, pressure.read, pressure.write].forEach(
          deleteFBO
        );
      }
      const simRes = getResolution(CONFIG.SIM_RESOLUTION);
      const dyeRes = getResolution(dyeResolution);
      const filtering = supportLinearFiltering ? g.LINEAR : g.NEAREST;
      g.disable(g.BLEND);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA!, filtering);
      velocity = createDoubleFBO(simRes.width, simRes.height, formatRG!, filtering);
      divergence = createFBO(simRes.width, simRes.height, formatR!, g.NEAREST);
      curl = createFBO(simRes.width, simRes.height, formatR!, g.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, formatR!, g.NEAREST);
      initialised = true;
    };

    /* ---------- Sizing ---------- */
    const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 1.5);
    const resizeCanvas = () => {
      const w = Math.floor(canvas.clientWidth * pixelRatio());
      const h = Math.floor(canvas.clientHeight * pixelRatio());
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    };

    resizeCanvas();
    initFramebuffers();

    /* ---------- Pointer tracking ---------- */
    const pointer = {
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      started: false,
    };

    const correctDeltaX = (d: number) => {
      const aspect = canvas.width / canvas.height;
      return aspect < 1 ? d * aspect : d;
    };
    const correctDeltaY = (d: number) => {
      const aspect = canvas.width / canvas.height;
      return aspect > 1 ? d / aspect : d;
    };
    const correctRadius = (r: number) => {
      const aspect = canvas.width / canvas.height;
      return aspect > 1 ? r * aspect : r;
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      if (!pointer.started) {
        // First event: don't create a huge jump from (0,0).
        pointer.prevTexcoordX = x;
        pointer.prevTexcoordY = y;
        pointer.started = true;
      } else {
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
      }
      pointer.texcoordX = x;
      pointer.texcoordY = y;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    };

    const onPointerMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updatePointer(t.clientX, t.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      pointer.started = false;
      updatePointer(t.clientX, t.clientY);
    };
    const onLeave = () => {
      pointer.started = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    /* ---------- Simulation ---------- */
    const splat = (x: number, y: number, dx: number, dy: number, color: [number, number, number]) => {
      splatProgram.bind();
      g.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      g.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      g.uniform2f(splatProgram.uniforms.point, x, y);
      g.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      g.uniform1f(splatProgram.uniforms.radius, correctRadius(CONFIG.SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      g.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      g.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    };

    const step = (dt: number) => {
      g.disable(g.BLEND);

      curlProgram.bind();
      g.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      g.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      g.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      g.uniform1f(vorticityProgram.uniforms.curl, CONFIG.CURL);
      g.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      g.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      g.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      g.uniform1f(clearProgram.uniforms.value, CONFIG.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      g.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        g.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      g.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      g.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      g.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!supportLinearFiltering) {
        g.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      const velocityId = velocity.read.attach(0);
      g.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      g.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      g.uniform1f(advectionProgram.uniforms.dt, dt);
      g.uniform1f(advectionProgram.uniforms.dissipation, CONFIG.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!supportLinearFiltering) {
        g.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      g.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      g.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      g.uniform1f(advectionProgram.uniforms.dissipation, CONFIG.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      g.disable(g.BLEND);
      displayProgram.bind();
      g.uniform1f(displayProgram.uniforms.uBloom, themeRef.current === "light" ? 0 : 1);
      g.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    };

    /* ---------- Loop ---------- */
    let lastTime = performance.now();
    let rafId = 0;

    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;

      if (resizeCanvas()) initFramebuffers();

      if (pointer.moved) {
        pointer.moved = false;
        const base = themeRef.current === "light" ? LIGHT_COLOR : DARK_COLOR;
        const color: [number, number, number] = [
          base[0] * CONFIG.INTENSITY,
          base[1] * CONFIG.INTENSITY,
          base[2] * CONFIG.INTENSITY,
        ];
        splat(
          pointer.texcoordX,
          pointer.texcoordY,
          pointer.deltaX * CONFIG.SPLAT_FORCE,
          pointer.deltaY * CONFIG.SPLAT_FORCE,
          color
        );
      }

      step(dt);
      render();
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("pointerleave", onLeave);
      // Note: we intentionally don't call loseContext() here – React Strict Mode
      // re-runs this effect on the same canvas in development.
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
