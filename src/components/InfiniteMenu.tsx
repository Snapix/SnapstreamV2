// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { mat4, quat, vec2, vec3 } from 'gl-matrix';
import { useNavigate } from 'react-router-dom';
import './InfiniteMenu.css';

const discVertShaderSource = `#version 300 es
uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;
in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;
out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;
#define PI 3.141593
void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);
    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);
    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }
    worldPosition.xyz = radius * normalize(worldPosition.xyz);
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;
out vec4 outColor;
in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;
void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;
    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = st * cellSize + cellOffset;
    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

class DiscGeometry {
  constructor(steps = 4, radius = 1) {
    this.vertices = [];
    this.faces = [];
    steps = Math.max(4, steps);
    const alpha = (2 * Math.PI) / steps;
    this.addVertex(0, 0, 0, 0.5, 0.5);
    for (let i = 0; i < steps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0, x * 0.5 + 0.5, y * 0.5 + 0.5);
      if (i > 0) this.faces.push(0, i, i + 1);
    }
    this.faces.push(0, steps, 1);
  }
  addVertex(x, y, z, u, v) {
    this.vertices.push(x, y, z, u, v);
  }
  get data() {
    return {
      vertices: new Float32Array(this.vertices),
      indices: new Uint16Array(this.faces)
    };
  }
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  const vShader = createShader(gl, gl.VERTEX_SHADER, vs);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

class ArcballControl {
  constructor(canvas) {
    this.canvas = canvas;
    this.orientation = quat.create();
    this.pointerRotation = quat.create();
    this.isPointerDown = false;
    this.pointerPos = vec2.create();
    this.previousPointerPos = vec2.create();
    this.rotationAxis = vec3.fromValues(1, 0, 0);
    this.rotationVelocity = 0;
    canvas.addEventListener('pointerdown', e => {
      vec2.set(this.pointerPos, e.clientX, e.clientY);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.isPointerDown = true;
    });
    window.addEventListener('pointerup', () => this.isPointerDown = false);
    window.addEventListener('pointermove', e => {
      if (this.isPointerDown) vec2.set(this.pointerPos, e.clientX, e.clientY);
    });
  }
  update() {
    if (this.isPointerDown) {
      const dx = this.pointerPos[0] - this.previousPointerPos[0];
      const dy = this.pointerPos[1] - this.previousPointerPos[1];
      const q = quat.fromEuler(quat.create(), dy * 0.2, dx * 0.2, 0);
      quat.multiply(this.orientation, q, this.orientation);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.rotationVelocity = Math.sqrt(dx * dx + dy * dy) * 0.01;
      vec3.set(this.rotationAxis, dy, dx, 0);
      vec3.normalize(this.rotationAxis, this.rotationAxis);
    } else {
      this.rotationVelocity *= 0.95;
    }
  }
}

class InfiniteGridMenu {
  constructor(canvas, items, onActiveItemChange) {
    this.canvas = canvas;
    this.items = items;
    this.onActiveItemChange = onActiveItemChange;
    this.gl = canvas.getContext('webgl2');
    this.program = createProgram(this.gl, discVertShaderSource, discFragShaderSource);
    this.geo = new DiscGeometry(32, 1);
    this.init();
  }
  init() {
    const gl = this.gl;
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, this.geo.data.vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 20, 12);
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.geo.data.indices, gl.STATIC_DRAW);

    this.instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    const matrixData = new Float32Array(this.items.length * 16);
    gl.bufferData(gl.ARRAY_BUFFER, matrixData, gl.DYNAMIC_DRAW);
    for (let i = 0; i < 4; i++) {
      gl.enableVertexAttribArray(3 + i);
      gl.vertexAttribPointer(3 + i, 4, gl.FLOAT, false, 64, i * 16);
      gl.vertexAttribDivisor(3 + i, 1);
    }
    
    canvas.addEventListener('click', e => {
      const nearest = this.getNearestItem();
      if (nearest) this.onActiveItemChange(nearest);
    });
  }
  getNearestItem() {
    // Basic implementation: check which item is closest to the screen center in 3D
    const n = vec3.fromValues(0, 0, 1);
    const inv = quat.conjugate(quat.create(), this.control.orientation);
    const nt = vec3.transformQuat(vec3.create(), n, inv);
    let maxD = -1, idx = 0;
    for(let i=0; i<this.items.length; i++) {
      const angle = (i / this.items.length) * Math.PI * 2;
      const pos = vec3.fromValues(Math.cos(angle)*2, Math.sin(angle)*2, 0);
      const d = vec3.dot(nt, pos);
      if (d > maxD) { maxD = d; idx = i; }
    }
    return this.items[idx];
  }
  loadTextures() {
    const gl = this.gl;
    const atlasSize = Math.ceil(Math.sqrt(this.items.length));
    const cellSize = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = atlasSize * cellSize;
    const ctx = canvas.getContext('2d');
    
    Promise.all(this.items.map((item, i) => {
      return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const x = (i % atlasSize) * cellSize;
          const y = Math.floor(i / atlasSize) * cellSize;
          ctx.drawImage(img, x, y, cellSize, cellSize);
          resolve();
        };
        img.onerror = resolve;
        img.src = item.image;
      });
    })).then(() => {
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    });
  }
  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.clientWidth * dpr;
    this.canvas.height = this.canvas.clientHeight * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  render() {
    const gl = this.gl;
    this.control.update();
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    
    const proj = mat4.perspective(mat4.create(), Math.PI/4, this.canvas.width/this.canvas.height, 0.1, 100);
    const view = mat4.lookAt(mat4.create(), [0,0,5], [0,0,0], [0,1,0]);
    const world = mat4.fromQuat(mat4.create(), this.control.orientation);
    
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uProjectionMatrix'), false, proj);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uViewMatrix'), false, view);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uWorldMatrix'), false, world);
    gl.uniform4f(gl.getUniformLocation(this.program, 'uRotationAxisVelocity'), this.control.rotationAxis[0], this.control.rotationAxis[1], this.control.rotationAxis[2], this.control.rotationVelocity);
    gl.uniform1i(gl.getUniformLocation(this.program, 'uItemCount'), this.items.length);
    gl.uniform1i(gl.getUniformLocation(this.program, 'uAtlasSize'), Math.ceil(Math.sqrt(this.items.length)));
    
    const matrixData = new Float32Array(this.items.length * 16);
    for(let i=0; i<this.items.length; i++) {
      const angle = (i / this.items.length) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const y = Math.sin(angle) * 2;
      const mat = mat4.fromTranslation(mat4.create(), [x, y, 0]);
      matrixData.set(mat, i * 16);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);
    
    gl.bindVertexArray(this.vao);
    gl.drawElementsInstanced(gl.TRIANGLES, this.geo.data.indices.length, gl.UNSIGNED_SHORT, 0, this.items.length);
    this.animationId = requestAnimationFrame(() => this.render());
  }
  destroy() {
    cancelAnimationFrame(this.animationId);
  }
}

export default function InfiniteMenu({ items = [] }) {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!canvasRef.current || items.length === 0) return;
    const sketch = new InfiniteGridMenu(canvasRef.current, items, (item) => {
      if (item.link) navigate(item.link);
    });
    sketch.render();
    const res = () => sketch.resize();
    window.addEventListener('resize', res);
    return () => {
      window.removeEventListener('resize', res);
      sketch.destroy();
    };
  }, [items, navigate]);

  return <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing" style={{ width: '100%', height: '100%', outline: 'none' }} />;
}
