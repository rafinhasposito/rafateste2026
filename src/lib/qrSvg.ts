/**
 * Pure offline vector QR Code SVG generator (Byte Mode, ECC-L).
 * Automatically selects QR Version 4-L (<= 78 bytes) or Version 5-L (<= 106 bytes)
 * so URLs like https://protocolosolar.com.br/resgatar?code=SOLAR-XXXX-XXX
 * render as crisp, 100% offline vector graphics ready for high-res printing.
 */

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x & 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) {
    EXP[i] = EXP[i - 255];
  }
})();

function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  let gen = [1];
  for (let i = 0; i < ecLen; i++) {
    const next = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gen[j];
      next[j + 1] ^= EXP[LOG[gen[j]] + i];
    }
    gen = next;
  }
  const msg = new Uint8Array(data.length + ecLen);
  msg.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        msg[i + j] ^= EXP[LOG[gen[j]] + LOG[coef]];
      }
    }
  }
  return msg.slice(data.length);
}

interface QrVersionSpec {
  size: number;
  totalData: number;
  ecLen: number;
  alignCoord: number;
}

const SPEC_V4: QrVersionSpec = { size: 33, totalData: 80, ecLen: 20, alignCoord: 26 };
const SPEC_V5: QrVersionSpec = { size: 37, totalData: 108, ecLen: 26, alignCoord: 30 };

function makeQRMatrix(text: string): Int8Array[] {
  const utf8 = new TextEncoder().encode(text);
  const spec = utf8.length <= 78 ? SPEC_V4 : SPEC_V5;
  const { size, totalData, ecLen, alignCoord } = spec;

  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  pushBits(0b0100, 4); // Byte mode
  const maxBytes = totalData - 2;
  const byteCount = Math.min(utf8.length, maxBytes);
  pushBits(byteCount, 8);
  for (let i = 0; i < byteCount; i++) pushBits(utf8[i], 8);
  pushBits(0, Math.min(4, totalData * 8 - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes = new Uint8Array(totalData);
  const usedBytes = Math.min(totalData, Math.floor(bits.length / 8));
  for (let i = 0; i < usedBytes; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i * 8 + j];
    dataBytes[i] = b;
  }
  const pad = [0xec, 0x11];
  for (let i = usedBytes; i < totalData; i++) {
    dataBytes[i] = pad[(i - usedBytes) % 2];
  }

  const ecBytes = rsEncode(dataBytes, ecLen);
  const allCodewords = new Uint8Array(totalData + ecLen);
  allCodewords.set(dataBytes);
  allCodewords.set(ecBytes, totalData);

  const mat = Array.from({ length: size }, () => new Int8Array(size).fill(-1));
  const isFunc = Array.from({ length: size }, () => new Uint8Array(size));

  function setFinder(r: number, c: number) {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const y = r + dy;
        const x = c + dx;
        if (y < 0 || y >= size || x < 0 || x >= size) continue;
        const inOuter = dy >= 0 && dy <= 6 && dx >= 0 && dx <= 6;
        const onBorder = dy === 0 || dy === 6 || dx === 0 || dx === 6;
        const inInner = dy >= 2 && dy <= 4 && dx >= 2 && dx <= 4;
        mat[y][x] = inOuter && (onBorder || inInner) ? 1 : 0;
        isFunc[y][x] = 1;
      }
    }
  }

  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  // Alignment pattern (V4: (26,26), V5: (30,30))
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const y = alignCoord + dy;
      const x = alignCoord + dx;
      mat[y][x] = Math.abs(dy) === 2 || Math.abs(dx) === 2 || (dy === 0 && dx === 0) ? 1 : 0;
      isFunc[y][x] = 1;
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    mat[6][i] = mat[i][6] = i % 2 === 0 ? 1 : 0;
    isFunc[6][i] = isFunc[i][6] = 1;
  }

  // Reserve format info areas
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      isFunc[8][i] = 1;
      isFunc[i][8] = 1;
    }
  }
  for (let i = 0; i < 8; i++) {
    isFunc[8][size - 1 - i] = 1;
    isFunc[size - 1 - i][8] = 1;
  }
  mat[size - 8][8] = 1;
  isFunc[size - 8][8] = 1;

  // Data placement with mask 0: (y + x) % 2 === 0
  let bitIdx = 0;
  const totalBits = allCodewords.length * 8;
  let up = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const y = up ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        if (!isFunc[y][x]) {
          let bit = 0;
          if (bitIdx < totalBits) {
            bit = (allCodewords[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1;
            bitIdx++;
          }
          if ((y + x) % 2 === 0) bit ^= 1;
          mat[y][x] = bit;
        }
      }
    }
    up = !up;
  }

  // Format bits for ECC-L (01) + Mask 0 (000) => 0x77c4
  const fmt = 0x77c4;
  const fBits: number[] = [];
  for (let i = 0; i < 15; i++) fBits.push((fmt >> i) & 1);

  for (let i = 0; i <= 5; i++) mat[8][i] = fBits[i];
  mat[8][7] = fBits[6];
  mat[8][8] = fBits[7];
  mat[7][8] = fBits[8];
  for (let i = 9; i < 15; i++) mat[14 - i][8] = fBits[i];

  for (let i = 0; i < 8; i++) mat[8][size - 1 - i] = fBits[i];
  for (let i = 8; i < 15; i++) mat[size - 15 + i][8] = fBits[i];

  return mat;
}

export function renderQrSvg(url: string, darkColor = "#02050A"): string {
  const mat = makeQRMatrix(url);
  const n = mat.length;
  let paths = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (mat[y][x] === 1) {
        paths += `M${x},${y}h1v1h-1z`;
      }
    }
  }
  return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#FFFFFF"/><path d="${paths}" fill="${darkColor}"/></svg>`;
}
