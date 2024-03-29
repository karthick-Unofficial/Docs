"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));
var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));
var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));
/* eslint-disable */
//LICENSE! This Code can be used and executed as a part of Flashphoner Web Call Server platform and having an appropriate Web Call Server license. You shall not use this code separately from Web Call Server platform. Contacts: http://flashphoner.com, support@flashphoner.com.
onmessage = function onmessage(e) {
  if (e.data.message == "init") {
    var ffffB3 = function ffffB3(ffffB4) {
      if (ffffB4.type == "yuv") {
        self.postMessage(ffffB4, [ffffB4.y.buffer, ffffB4.cr.buffer, ffffB4.cb.buffer]);
      } else {
        self.postMessage(ffffB4, [ffffB4.data.buffer]);
      }
    };
    this.ffffBJ = new ffffC({
      ffffB5: (0, _bind["default"])(ffffB3).call(ffffB3, this),
      outputGl: e.data.outputGl
    });
    this.ffffBJ.ffffB7(e.data.width, e.data.height);
  } else if (e.data.message == "decode") {
    this.ffffBJ.ffffB_(e.data.data, e.data.skip);
  }
};
var ffffC = function ffffC(opts) {
  opts = opts || {};
  this.ffffBG = opts.ffffB5 || null;
  this.outputGl = opts.outputGl || false;
  this.ffffCk = new Uint8Array(64);
  this.ffffCq = new Uint8Array(64);
  this.ffffB = new Int32Array(64);
  this.ffffA9 = new Int32Array(64);
  this.ffffBS(this.ffffA9, 0);
  this.ffffB8 = this.ffffB9;
};
ffffC.prototype.ffffBR = true;
ffffC.prototype.ffffBN = 524288;
ffffC.prototype.ffffB7 = function (width, height) {
  this.buffer = new ffffV(new ArrayBuffer(this.ffffBN));
  this.ffffAk = new ffffV(new ArrayBuffer(this.ffffBN));
  this.ffffAk.ffffT = 0;
  this.ffffAk.ffffAA = 0;
  this.ffffAk.ffffA8 = 0;
  this.width = (0, _parseInt2["default"])(width);
  this.height = (0, _parseInt2["default"])(height);
};
ffffC.prototype.ffffB_ = function (data, skip) {
  var ffffAX = data;
  if (!this.ffffBM) {
    this.ffffB6();
  }
  var current = this.buffer;
  var next = this.ffffAk;
  if (next.ffffT + ffffAX.length > next.length) {
    next.ffffA8 = next.ffffT;
    next.ffffT = 0;
    next.index = 0;
  }
  next.ffffM.set(ffffAX, next.ffffT);
  next.ffffT += ffffAX.length;
  var ffffBA = 0;
  while (true) {
    ffffBA = next.ffffAx();
    if (ffffBA == ffffV.ffffA$ || next.index >> 3 > next.ffffT) {
      next.index = Math.max(next.ffffT - 3, 0) << 3;
      return;
    } else if (ffffBA == ffffB2) {
      break;
    } else if (ffffBA == ffffCa) {
      var width = next.ffffP(12);
      var height = next.ffffP(12);
      if (this.width != width || this.height != height) {
        this.width = width;
        this.height = height;
        this.ffffBM = false;
        this.ffffB6();
      }
    }
  }
  if (this.ffffBR) {
    next.ffffAr(10);
    if (next.ffffP(3) == ffffBL) {
      this.ffffBR = false;
      next.ffffAA = next.index - 13 >> 3;
    }
    return;
  }
  if (!this.ffffB0) {
    this.ffffBK(skip);
  }
  var ffffAQ = next.index >> 3;
  if (ffffAQ > next.ffffAA) {
    current.ffffM.set(next.ffffM.subarray(next.ffffAA, ffffAQ));
    current.ffffT = ffffAQ - next.ffffAA;
  } else {
    current.ffffM.set(next.ffffM.subarray(next.ffffAA, next.ffffA8));
    var ffffBT = next.ffffA8 - next.ffffAA;
    current.ffffM.set(next.ffffM.subarray(0, ffffAQ), ffffBT);
    current.ffffT = ffffAQ + ffffBT;
  }
  current.index = 0;
  next.ffffAA = ffffAQ;
  this.ffffB0 = false;
  this.ffffBK(skip);
};
ffffC.prototype.stop = function () {
  if (this.buffer) {
    this.buffer.index = this.ffffBv;
  }
};
ffffC.prototype.ffffc = function (ffffBD) {
  var ffffAg = 0;
  do {
    ffffAg = ffffBD[ffffAg + this.buffer.ffffP(1)];
  } while (ffffAg >= 0 && ffffBD[ffffAg] != 0);
  return ffffBD[ffffAg + 2];
};
ffffC.prototype.ffffCl = function (ffffN) {
  var current = 0;
  while (true) {
    current = this.buffer.ffffAx();
    if (current == ffffN || current == ffffV.ffffA$) {
      return current;
    }
  }
};
ffffC.prototype.ffffBS = function (a, value) {
  for (var i = 0, length = a.length; i < length; i++) {
    a[i] = value;
  }
};
ffffC.prototype.ffffCh = 30;
ffffC.prototype.ffffCg = 0;
ffffC.prototype.ffffBv = 0;
ffffC.prototype.ffffCi = 0;
ffffC.prototype.ffffCj = false;
ffffC.prototype.ffffCd = 0;
ffffC.prototype.ffffCn = 0;
ffffC.prototype.ffffCo = 0;
ffffC.prototype.now = function () {
  return (0, _now["default"])();
};
ffffC.prototype.ffffB6 = function () {
  this.ffffBt = ffffBu;
  this.ffffBw = ffffBz;
  this.ffffp = this.width + 15 >> 4;
  this.ffffA_ = this.height + 15 >> 4;
  this.ffffBx = this.ffffp * this.ffffA_;
  this.ffffg = this.ffffp << 4;
  this.ffffBy = this.ffffA_ << 4;
  this.ffffx = this.ffffg * this.ffffBy;
  this.ffffBd = this.ffffp << 3;
  this.ffffCW = this.ffffA_ << 3;
  this.ffffCc = this.ffffx >> 2;
  if (this.ffffBM) {
    return;
  }
  this.ffffBM = true;
  var MaybeClampedUint8Array;
  if (typeof Uint8ClampedArray !== "undefined") {
    MaybeClampedUint8Array = Uint8ClampedArray;
  } else {
    MaybeClampedUint8Array = Uint8Array;
  }
  if (typeof Uint8ClampedArray == "undefined") {
    this.ffffBe = this.ffffB1;
    this.ffffBW = this.ffffB$;
  }
  this.ffffAB = new MaybeClampedUint8Array(this.ffffx);
  this.ffffBB = new Uint32Array(this.ffffAB.buffer);
  this.ffff_ = new MaybeClampedUint8Array(this.ffffx >> 2);
  this.ffffA4 = new Uint32Array(this.ffff_.buffer);
  this.ffffz = new MaybeClampedUint8Array(this.ffffx >> 2);
  this.ffffBC = new Uint32Array(this.ffffz.buffer);
  this.ffffAF = new MaybeClampedUint8Array(this.ffffx);
  this.ffffBV = new Uint32Array(this.ffffAF.buffer);
  this.ffffAE = new MaybeClampedUint8Array(this.ffffx >> 2);
  this.ffffBX = new Uint32Array(this.ffffAE.buffer);
  this.ffffAG = new MaybeClampedUint8Array(this.ffffx >> 2);
  this.ffffBZ = new Uint32Array(this.ffffAG.buffer);
  this.ffffAw = new MaybeClampedUint8Array(this.width * this.height * 4);
  this.ffffBS(this.ffffAw, 255);
};
ffffC.prototype.ffffAB = null;
ffffC.prototype.ffff_ = null;
ffffC.prototype.ffffz = null;
ffffC.prototype.ffffAw = null;
ffffC.prototype.ffffj = 0;
ffffC.prototype.ffffAF = null;
ffffC.prototype.ffffAE = null;
ffffC.prototype.ffffAG = null;
ffffC.prototype.ffffBI = false;
ffffC.prototype.ffffBE = 0;
ffffC.prototype.ffffAD = 0;
ffffC.prototype.ffffZ = 0;
ffffC.prototype.ffffBK = function (ffffCm) {
  this.buffer.ffffAr(10);
  this.ffffj = this.buffer.ffffP(3);
  this.buffer.ffffAr(16);
  if (this.ffffj <= 0 || this.ffffj >= ffffCA) {
    return;
  }
  if (this.ffffj == ffffAh) {
    this.ffffBI = this.buffer.ffffP(1);
    this.ffffBE = this.buffer.ffffP(3);
    if (this.ffffBE == 0) {
      return;
    }
    this.ffffAD = this.ffffBE - 1;
    this.ffffZ = 1 << this.ffffAD;
  }
  var ffffN = 0;
  do {
    ffffN = this.buffer.ffffAx();
  } while (ffffN == ffffCB || ffffN == ffffCV);
  while (ffffN >= ffffCQ && ffffN <= ffffCU) {
    this.ffffCS(ffffN & 255);
    ffffN = this.buffer.ffffAx();
  }
  this.buffer.ffffCR(32);
  if (this.ffffBG && !ffffCm) {
    var ffffAm = {};
    if (this.outputGl) {
      var yBuffer, crBuffer, cbBuffer;
      yBuffer = new ArrayBuffer(this.ffffAB.length);
      crBuffer = new ArrayBuffer(this.ffff_.length);
      cbBuffer = new ArrayBuffer(this.ffffz.length);
      ffffAm.y = new Uint8Array(yBuffer);
      ffffAm.y.set(this.ffffAB);
      ffffAm.cr = new Uint8Array(crBuffer);
      ffffAm.cr.set(this.ffff_);
      ffffAm.cb = new Uint8Array(cbBuffer);
      ffffAm.cb.set(this.ffffz);
      ffffAm.width = this.width;
      ffffAm.height = this.height;
      ffffAm.type = "yuv";
      this.ffffBG(ffffAm);
    } else {
      this.ffffCN();
      var retBuff = new ArrayBuffer(this.ffffAw.length);
      ffffAm.data = new Uint8Array(retBuff);
      ffffAm.data.set(this.ffffAw);
      ffffAm.width = this.width;
      ffffAm.height = this.height;
      ffffAm.type = "rgba";
      this.ffffBG(ffffAm);
    }
  }
  if (this.ffffj == ffffBL || this.ffffj == ffffAh) {
    var ffffCP = this.ffffAF,
      ffffCO = this.ffffBV,
      ffffCT = this.ffffAE,
      ffffCM = this.ffffBX,
      ffffCG = this.ffffAG,
      ffffCC = this.ffffBZ;
    this.ffffAF = this.ffffAB;
    this.ffffBV = this.ffffBB;
    this.ffffAE = this.ffff_;
    this.ffffBX = this.ffffA4;
    this.ffffAG = this.ffffz;
    this.ffffBZ = this.ffffBC;
    this.ffffAB = ffffCP;
    this.ffffBB = ffffCO;
    this.ffff_ = ffffCT;
    this.ffffA4 = ffffCM;
    this.ffffz = ffffCG;
    this.ffffBC = ffffCC;
  }
};
ffffC.prototype.ffffCN = function () {
  var ffffAl = this.ffffAB;
  var ffffBq = this.ffffz;
  var ffffCD = this.ffff_;
  var ffffY = this.ffffAw;
  var ffffA3 = 0;
  var ffffA0 = this.ffffg;
  var ffffBY = this.ffffg + (this.ffffg - this.width);
  var ffffAv = 0;
  var ffffCE = this.ffffBd - (this.width >> 1);
  var ffffq = 0;
  var ffffv = this.width * 4;
  var ffffBc = this.width * 4;
  var ffffCF = this.width >> 1;
  var rows = this.height >> 1;
  var y, cb, cr, ffffd, ffffAe, ffffAd;
  for (var ffffBa = 0; ffffBa < rows; ffffBa++) {
    for (var ffffBb = 0; ffffBb < ffffCF; ffffBb++) {
      cb = ffffBq[ffffAv];
      cr = ffffCD[ffffAv];
      ffffAv++;
      ffffd = cr + (cr * 103 >> 8) - 179;
      ffffAe = (cb * 88 >> 8) - 44 + (cr * 183 >> 8) - 91;
      ffffAd = cb + (cb * 198 >> 8) - 227;
      var ffffO = ffffAl[ffffA3++];
      var ffffQ = ffffAl[ffffA3++];
      ffffY[ffffq] = ffffO + ffffd;
      ffffY[ffffq + 1] = ffffO - ffffAe;
      ffffY[ffffq + 2] = ffffO + ffffAd;
      ffffY[ffffq + 4] = ffffQ + ffffd;
      ffffY[ffffq + 5] = ffffQ - ffffAe;
      ffffY[ffffq + 6] = ffffQ + ffffAd;
      ffffq += 8;
      var ffffh = ffffAl[ffffA0++];
      var ffffe = ffffAl[ffffA0++];
      ffffY[ffffv] = ffffh + ffffd;
      ffffY[ffffv + 1] = ffffh - ffffAe;
      ffffY[ffffv + 2] = ffffh + ffffAd;
      ffffY[ffffv + 4] = ffffe + ffffd;
      ffffY[ffffv + 5] = ffffe - ffffAe;
      ffffY[ffffv + 6] = ffffe + ffffAd;
      ffffv += 8;
    }
    ffffA3 += ffffBY;
    ffffA0 += ffffBY;
    ffffq += ffffBc;
    ffffv += ffffBc;
    ffffAv += ffffCE;
  }
};
ffffC.prototype.ffffB9 = function () {
  this.ffffCN();
};
ffffC.prototype.ffffA1 = 0;
ffffC.prototype.ffffAz = false;
ffffC.prototype.ffffCS = function (slice) {
  this.ffffAz = true;
  this.ffffk = (slice - 1) * this.ffffp - 1;
  this.ffffu = this.ffffb = 0;
  this.ffffr = this.ffffa = 0;
  this.ffffAf = 128;
  this.ffffAb = 128;
  this.ffffAc = 128;
  this.ffffA1 = this.buffer.ffffP(5);
  while (this.buffer.ffffP(1)) {
    this.buffer.ffffAr(8);
  }
  do {
    this.ffffCH();
  } while (!this.buffer.ffffCL());
};
ffffC.prototype.ffffk = 0;
ffffC.prototype.ffffs = 0;
ffffC.prototype.ffffw = 0;
ffffC.prototype.ffffAa = 0;
ffffC.prototype.ffffAU = false;
ffffC.prototype.ffffBQ = false;
ffffC.prototype.ffffu = 0;
ffffC.prototype.ffffr = 0;
ffffC.prototype.ffffb = 0;
ffffC.prototype.ffffa = 0;
ffffC.prototype.ffffCH = function () {
  var ffff$ = 0,
    ffffAW = this.ffffc(ffffAy);
  while (ffffAW == 34) {
    ffffAW = this.ffffc(ffffAy);
  }
  while (ffffAW == 35) {
    ffff$ += 33;
    ffffAW = this.ffffc(ffffAy);
  }
  ffff$ += ffffAW;
  if (this.ffffAz) {
    this.ffffAz = false;
    this.ffffk += ffff$;
  } else {
    if (this.ffffk + ffff$ >= this.ffffBx) {
      return;
    }
    if (ffff$ > 1) {
      this.ffffAf = 128;
      this.ffffAb = 128;
      this.ffffAc = 128;
      if (this.ffffj == ffffAh) {
        this.ffffu = this.ffffb = 0;
        this.ffffr = this.ffffa = 0;
      }
    }
    while (ffff$ > 1) {
      this.ffffk++;
      this.ffffs = this.ffffk / this.ffffp | 0;
      this.ffffw = this.ffffk % this.ffffp;
      this.ffffBO(this.ffffu, this.ffffr, this.ffffAF, this.ffffAE, this.ffffAG);
      ffff$--;
    }
    this.ffffk++;
  }
  this.ffffs = this.ffffk / this.ffffp | 0;
  this.ffffw = this.ffffk % this.ffffp;
  this.ffffAa = this.ffffc(ffffCI[this.ffffj]);
  this.ffffAU = this.ffffAa & 1;
  this.ffffBQ = this.ffffAa & 8;
  if ((this.ffffAa & 16) != 0) {
    this.ffffA1 = this.buffer.ffffP(5);
  }
  if (this.ffffAU) {
    this.ffffu = this.ffffb = 0;
    this.ffffr = this.ffffa = 0;
  } else {
    this.ffffAf = 128;
    this.ffffAb = 128;
    this.ffffAc = 128;
    this.ffffCJ();
    this.ffffBO(this.ffffu, this.ffffr, this.ffffAF, this.ffffAE, this.ffffAG);
  }
  var ffffCK = (this.ffffAa & 2) != 0 ? this.ffffc(ffffBr) : this.ffffAU ? 63 : 0;
  for (var ffffW = 0, ffffBP = 32; ffffW < 6; ffffW++) {
    if ((ffffCK & ffffBP) != 0) {
      this.ffffBs(ffffW);
    }
    ffffBP >>= 1;
  }
};
ffffC.prototype.ffffCJ = function () {
  var ffffN,
    ffffi,
    ffffd = 0;
  if (this.ffffBQ) {
    ffffN = this.ffffc(MOTION);
    if (ffffN != 0 && this.ffffZ != 1) {
      ffffd = this.buffer.ffffP(this.ffffAD);
      ffffi = (Math.abs(ffffN) - 1 << this.ffffAD) + ffffd + 1;
      if (ffffN < 0) {
        ffffi = -ffffi;
      }
    } else {
      ffffi = ffffN;
    }
    this.ffffb += ffffi;
    if (this.ffffb > (this.ffffZ << 4) - 1) {
      this.ffffb -= this.ffffZ << 5;
    } else if (this.ffffb < -this.ffffZ << 4) {
      this.ffffb += this.ffffZ << 5;
    }
    this.ffffu = this.ffffb;
    if (this.ffffBI) {
      this.ffffu <<= 1;
    }
    ffffN = this.ffffc(MOTION);
    if (ffffN != 0 && this.ffffZ != 1) {
      ffffd = this.buffer.ffffP(this.ffffAD);
      ffffi = (Math.abs(ffffN) - 1 << this.ffffAD) + ffffd + 1;
      if (ffffN < 0) {
        ffffi = -ffffi;
      }
    } else {
      ffffi = ffffN;
    }
    this.ffffa += ffffi;
    if (this.ffffa > (this.ffffZ << 4) - 1) {
      this.ffffa -= this.ffffZ << 5;
    } else if (this.ffffa < -this.ffffZ << 4) {
      this.ffffa += this.ffffZ << 5;
    }
    this.ffffr = this.ffffa;
    if (this.ffffBI) {
      this.ffffr <<= 1;
    }
  } else if (this.ffffj == ffffAh) {
    this.ffffu = this.ffffb = 0;
    this.ffffr = this.ffffa = 0;
  }
};
ffffC.prototype.ffffBO = function (ffffAj, ffffAi, ffffI, ffffJ, ffffK) {
  var width, ffffG, ffffAu, ffffAs, ffffAt, ffffAN, src, ffffH, fffff;
  var ffffAq = this.ffffBB;
  var ffffAn = this.ffffBC;
  var ffffAo = this.ffffA4;
  width = this.ffffg;
  ffffG = width - 16;
  ffffAu = ffffAj >> 1;
  ffffAs = ffffAi >> 1;
  ffffAt = (ffffAj & 1) == 1;
  ffffAN = (ffffAi & 1) == 1;
  src = ((this.ffffs << 4) + ffffAs) * width + (this.ffffw << 4) + ffffAu;
  ffffH = this.ffffs * width + this.ffffw << 2;
  fffff = ffffH + (width << 2);
  var ffffO, ffffQ, y;
  if (ffffAt) {
    if (ffffAN) {
      while (ffffH < fffff) {
        ffffO = ffffI[src] + ffffI[src + width];
        src++;
        for (var x = 0; x < 4; x++) {
          ffffQ = ffffI[src] + ffffI[src + width];
          src++;
          y = ffffO + ffffQ + 2 >> 2 & 255;
          ffffO = ffffI[src] + ffffI[src + width];
          src++;
          y |= ffffO + ffffQ + 2 << 6 & 65280;
          ffffQ = ffffI[src] + ffffI[src + width];
          src++;
          y |= ffffO + ffffQ + 2 << 14 & 16711680;
          ffffO = ffffI[src] + ffffI[src + width];
          src++;
          y |= ffffO + ffffQ + 2 << 22 & 4278190080;
          ffffAq[ffffH++] = y;
        }
        ffffH += ffffG >> 2;
        src += ffffG - 1;
      }
    } else {
      while (ffffH < fffff) {
        ffffO = ffffI[src++];
        for (var x = 0; x < 4; x++) {
          ffffQ = ffffI[src++];
          y = ffffO + ffffQ + 1 >> 1 & 255;
          ffffO = ffffI[src++];
          y |= ffffO + ffffQ + 1 << 7 & 65280;
          ffffQ = ffffI[src++];
          y |= ffffO + ffffQ + 1 << 15 & 16711680;
          ffffO = ffffI[src++];
          y |= ffffO + ffffQ + 1 << 23 & 4278190080;
          ffffAq[ffffH++] = y;
        }
        ffffH += ffffG >> 2;
        src += ffffG - 1;
      }
    }
  } else {
    if (ffffAN) {
      while (ffffH < fffff) {
        for (var x = 0; x < 4; x++) {
          y = ffffI[src] + ffffI[src + width] + 1 >> 1 & 255;
          src++;
          y |= ffffI[src] + ffffI[src + width] + 1 << 7 & 65280;
          src++;
          y |= ffffI[src] + ffffI[src + width] + 1 << 15 & 16711680;
          src++;
          y |= ffffI[src] + ffffI[src + width] + 1 << 23 & 4278190080;
          src++;
          ffffAq[ffffH++] = y;
        }
        ffffH += ffffG >> 2;
        src += ffffG;
      }
    } else {
      while (ffffH < fffff) {
        for (var x = 0; x < 4; x++) {
          y = ffffI[src];
          src++;
          y |= ffffI[src] << 8;
          src++;
          y |= ffffI[src] << 16;
          src++;
          y |= ffffI[src] << 24;
          src++;
          ffffAq[ffffH++] = y;
        }
        ffffH += ffffG >> 2;
        src += ffffG;
      }
    }
  }
  width = this.ffffBd;
  ffffG = width - 8;
  ffffAu = ffffAj / 2 >> 1;
  ffffAs = ffffAi / 2 >> 1;
  ffffAt = (ffffAj / 2 & 1) == 1;
  ffffAN = (ffffAi / 2 & 1) == 1;
  src = ((this.ffffs << 3) + ffffAs) * width + (this.ffffw << 3) + ffffAu;
  ffffH = this.ffffs * width + this.ffffw << 1;
  fffff = ffffH + (width << 1);
  var ffffS, ffffX, cr;
  var ffffR, ffffU, cb;
  if (ffffAt) {
    if (ffffAN) {
      while (ffffH < fffff) {
        ffffS = ffffJ[src] + ffffJ[src + width];
        ffffR = ffffK[src] + ffffK[src + width];
        src++;
        for (var x = 0; x < 2; x++) {
          ffffX = ffffJ[src] + ffffJ[src + width];
          ffffU = ffffK[src] + ffffK[src + width];
          src++;
          cr = ffffS + ffffX + 2 >> 2 & 255;
          cb = ffffR + ffffU + 2 >> 2 & 255;
          ffffS = ffffJ[src] + ffffJ[src + width];
          ffffR = ffffK[src] + ffffK[src + width];
          src++;
          cr |= ffffS + ffffX + 2 << 6 & 65280;
          cb |= ffffR + ffffU + 2 << 6 & 65280;
          ffffX = ffffJ[src] + ffffJ[src + width];
          ffffU = ffffK[src] + ffffK[src + width];
          src++;
          cr |= ffffS + ffffX + 2 << 14 & 16711680;
          cb |= ffffR + ffffU + 2 << 14 & 16711680;
          ffffS = ffffJ[src] + ffffJ[src + width];
          ffffR = ffffK[src] + ffffK[src + width];
          src++;
          cr |= ffffS + ffffX + 2 << 22 & 4278190080;
          cb |= ffffR + ffffU + 2 << 22 & 4278190080;
          ffffAo[ffffH] = cr;
          ffffAn[ffffH] = cb;
          ffffH++;
        }
        ffffH += ffffG >> 2;
        src += ffffG - 1;
      }
    } else {
      while (ffffH < fffff) {
        ffffS = ffffJ[src];
        ffffR = ffffK[src];
        src++;
        for (var x = 0; x < 2; x++) {
          ffffX = ffffJ[src];
          ffffU = ffffK[src++];
          cr = ffffS + ffffX + 1 >> 1 & 255;
          cb = ffffR + ffffU + 1 >> 1 & 255;
          ffffS = ffffJ[src];
          ffffR = ffffK[src++];
          cr |= ffffS + ffffX + 1 << 7 & 65280;
          cb |= ffffR + ffffU + 1 << 7 & 65280;
          ffffX = ffffJ[src];
          ffffU = ffffK[src++];
          cr |= ffffS + ffffX + 1 << 15 & 16711680;
          cb |= ffffR + ffffU + 1 << 15 & 16711680;
          ffffS = ffffJ[src];
          ffffR = ffffK[src++];
          cr |= ffffS + ffffX + 1 << 23 & 4278190080;
          cb |= ffffR + ffffU + 1 << 23 & 4278190080;
          ffffAo[ffffH] = cr;
          ffffAn[ffffH] = cb;
          ffffH++;
        }
        ffffH += ffffG >> 2;
        src += ffffG - 1;
      }
    }
  } else {
    if (ffffAN) {
      while (ffffH < fffff) {
        for (var x = 0; x < 2; x++) {
          cr = ffffJ[src] + ffffJ[src + width] + 1 >> 1 & 255;
          cb = ffffK[src] + ffffK[src + width] + 1 >> 1 & 255;
          src++;
          cr |= ffffJ[src] + ffffJ[src + width] + 1 << 7 & 65280;
          cb |= ffffK[src] + ffffK[src + width] + 1 << 7 & 65280;
          src++;
          cr |= ffffJ[src] + ffffJ[src + width] + 1 << 15 & 16711680;
          cb |= ffffK[src] + ffffK[src + width] + 1 << 15 & 16711680;
          src++;
          cr |= ffffJ[src] + ffffJ[src + width] + 1 << 23 & 4278190080;
          cb |= ffffK[src] + ffffK[src + width] + 1 << 23 & 4278190080;
          src++;
          ffffAo[ffffH] = cr;
          ffffAn[ffffH] = cb;
          ffffH++;
        }
        ffffH += ffffG >> 2;
        src += ffffG;
      }
    } else {
      while (ffffH < fffff) {
        for (var x = 0; x < 2; x++) {
          cr = ffffJ[src];
          cb = ffffK[src];
          src++;
          cr |= ffffJ[src] << 8;
          cb |= ffffK[src] << 8;
          src++;
          cr |= ffffJ[src] << 16;
          cb |= ffffK[src] << 16;
          src++;
          cr |= ffffJ[src] << 24;
          cb |= ffffK[src] << 24;
          src++;
          ffffAo[ffffH] = cr;
          ffffAn[ffffH] = cb;
          ffffH++;
        }
        ffffH += ffffG >> 2;
        src += ffffG;
      }
    }
  }
};
ffffC.prototype.ffffAf;
ffffC.prototype.ffffAb;
ffffC.prototype.ffffAc;
ffffC.prototype.ffffB = null;
ffffC.prototype.ffffBs = function (ffffW) {
  var ffffF = 0,
    ffffA6;
  if (this.ffffAU) {
    var ffffAY, ffffAC;
    if (ffffW < 4) {
      ffffAY = this.ffffAf;
      ffffAC = this.ffffc(ffffBp);
    } else {
      ffffAY = ffffW == 4 ? this.ffffAb : this.ffffAc;
      ffffAC = this.ffffc(ffffBi);
    }
    if (ffffAC > 0) {
      var ffffBH = this.buffer.ffffP(ffffAC);
      if ((ffffBH & 1 << ffffAC - 1) != 0) {
        this.ffffB[0] = ffffAY + ffffBH;
      } else {
        this.ffffB[0] = ffffAY + (-1 << ffffAC | ffffBH + 1);
      }
    } else {
      this.ffffB[0] = ffffAY;
    }
    if (ffffW < 4) {
      this.ffffAf = this.ffffB[0];
    } else if (ffffW == 4) {
      this.ffffAb = this.ffffB[0];
    } else {
      this.ffffAc = this.ffffB[0];
    }
    this.ffffB[0] <<= 8;
    ffffA6 = this.ffffBt;
    ffffF = 1;
  } else {
    ffffA6 = this.ffffBw;
  }
  var ffffL = 0;
  while (true) {
    var ffffBF = 0,
      ffffAp = this.ffffc(ffffBl);
    if (ffffAp == 1 && ffffF > 0 && this.buffer.ffffP(1) == 0) {
      break;
    }
    if (ffffAp == 65535) {
      ffffBF = this.buffer.ffffP(6);
      ffffL = this.buffer.ffffP(8);
      if (ffffL == 0) {
        ffffL = this.buffer.ffffP(8);
      } else if (ffffL == 128) {
        ffffL = this.buffer.ffffP(8) - 256;
      } else if (ffffL > 128) {
        ffffL = ffffL - 256;
      }
    } else {
      ffffBF = ffffAp >> 8;
      ffffL = ffffAp & 255;
      if (this.buffer.ffffP(1)) {
        ffffL = -ffffL;
      }
    }
    ffffF += ffffBF;
    var ffffA7 = ffffBo[ffffF];
    ffffF++;
    ffffL <<= 1;
    if (!this.ffffAU) {
      ffffL += ffffL < 0 ? -1 : 1;
    }
    ffffL = ffffL * this.ffffA1 * ffffA6[ffffA7] >> 4;
    if ((ffffL & 1) == 0) {
      ffffL -= ffffL > 0 ? 1 : -1;
    }
    if (ffffL > 2047) {
      ffffL = 2047;
    } else if (ffffL < -2048) {
      ffffL = -2048;
    }
    this.ffffB[ffffA7] = ffffL * ffffBk[ffffA7];
  }
  var ffffE, ffffD, ffffG;
  if (ffffW < 4) {
    ffffE = this.ffffAB;
    ffffG = this.ffffg - 8;
    ffffD = this.ffffs * this.ffffg + this.ffffw << 4;
    if ((ffffW & 1) != 0) {
      ffffD += 8;
    }
    if ((ffffW & 2) != 0) {
      ffffD += this.ffffg << 3;
    }
  } else {
    ffffE = ffffW == 4 ? this.ffffz : this.ffff_;
    ffffG = (this.ffffg >> 1) - 8;
    ffffD = (this.ffffs * this.ffffg << 2) + (this.ffffw << 3);
  }
  if (this.ffffAU) {
    if (ffffF == 1) {
      this.ffffBf(this.ffffB[0] + 128 >> 8, ffffE, ffffD, ffffG);
      this.ffffB[0] = 0;
    } else {
      this.ffffBU();
      this.ffffBe(this.ffffB, ffffE, ffffD, ffffG);
      this.ffffB.set(this.ffffA9);
    }
  } else {
    if (ffffF == 1) {
      this.ffffBn(this.ffffB[0] + 128 >> 8, ffffE, ffffD, ffffG);
      this.ffffB[0] = 0;
    } else {
      this.ffffBU();
      this.ffffBW(this.ffffB, ffffE, ffffD, ffffG);
      this.ffffB.set(this.ffffA9);
    }
  }
  ffffF = 0;
};
ffffC.prototype.ffffBe = function (ffffB, ffffE, ffffD, ffffG) {
  for (var ffffF = 0; ffffF < 64; ffffF += 8, ffffD += ffffG + 8) {
    ffffE[ffffD + 0] = ffffB[ffffF + 0];
    ffffE[ffffD + 1] = ffffB[ffffF + 1];
    ffffE[ffffD + 2] = ffffB[ffffF + 2];
    ffffE[ffffD + 3] = ffffB[ffffF + 3];
    ffffE[ffffD + 4] = ffffB[ffffF + 4];
    ffffE[ffffD + 5] = ffffB[ffffF + 5];
    ffffE[ffffD + 6] = ffffB[ffffF + 6];
    ffffE[ffffD + 7] = ffffB[ffffF + 7];
  }
};
ffffC.prototype.ffffBW = function (ffffB, ffffE, ffffD, ffffG) {
  for (var ffffF = 0; ffffF < 64; ffffF += 8, ffffD += ffffG + 8) {
    ffffE[ffffD + 0] += ffffB[ffffF + 0];
    ffffE[ffffD + 1] += ffffB[ffffF + 1];
    ffffE[ffffD + 2] += ffffB[ffffF + 2];
    ffffE[ffffD + 3] += ffffB[ffffF + 3];
    ffffE[ffffD + 4] += ffffB[ffffF + 4];
    ffffE[ffffD + 5] += ffffB[ffffF + 5];
    ffffE[ffffD + 6] += ffffB[ffffF + 6];
    ffffE[ffffD + 7] += ffffB[ffffF + 7];
  }
};
ffffC.prototype.ffffBf = function (value, ffffE, ffffD, ffffG) {
  for (var ffffF = 0; ffffF < 64; ffffF += 8, ffffD += ffffG + 8) {
    ffffE[ffffD + 0] = value;
    ffffE[ffffD + 1] = value;
    ffffE[ffffD + 2] = value;
    ffffE[ffffD + 3] = value;
    ffffE[ffffD + 4] = value;
    ffffE[ffffD + 5] = value;
    ffffE[ffffD + 6] = value;
    ffffE[ffffD + 7] = value;
  }
};
ffffC.prototype.ffffBn = function (value, ffffE, ffffD, ffffG) {
  for (var ffffF = 0; ffffF < 64; ffffF += 8, ffffD += ffffG + 8) {
    ffffE[ffffD + 0] += value;
    ffffE[ffffD + 1] += value;
    ffffE[ffffD + 2] += value;
    ffffE[ffffD + 3] += value;
    ffffE[ffffD + 4] += value;
    ffffE[ffffD + 5] += value;
    ffffE[ffffD + 6] += value;
    ffffE[ffffD + 7] += value;
  }
};
ffffC.prototype.ffffB1 = function (ffffB, ffffE, ffffD, ffffG) {
  var ffffF = 0;
  for (var i = 0; i < 8; i++) {
    for (var ffffAZ = 0; ffffAZ < 8; ffffAZ++) {
      var ffffy = ffffB[ffffF++];
      ffffE[ffffD++] = ffffy > 255 ? 255 : ffffy < 0 ? 0 : ffffy;
    }
    ffffD += ffffG;
  }
};
ffffC.prototype.ffffB$ = function (ffffB, ffffE, ffffD, ffffG) {
  var ffffF = 0;
  for (var i = 0; i < 8; i++) {
    for (var ffffAZ = 0; ffffAZ < 8; ffffAZ++) {
      var ffffy = ffffB[ffffF++] + ffffE[ffffD];
      ffffE[ffffD++] = ffffy > 255 ? 255 : ffffy < 0 ? 0 : ffffy;
    }
    ffffD += ffffG;
  }
};
ffffC.prototype.ffffBU = function () {
  var ffffAJ,
    ffffo,
    ffffAS,
    ffffAI,
    fffft,
    ffffAV,
    ffffAP,
    ffffAL,
    ffffl,
    ffffAK,
    ffffAO,
    ffffAR,
    ffffn,
    ffffh,
    ffffe,
    ffffAT,
    ffffAH,
    ffffAM,
    i,
    ffffB = this.ffffB;
  for (i = 0; i < 8; ++i) {
    ffffAJ = ffffB[32 + i];
    ffffo = ffffB[16 + i] + ffffB[48 + i];
    ffffAS = ffffB[40 + i] - ffffB[24 + i];
    ffffAV = ffffB[8 + i] + ffffB[56 + i];
    ffffAP = ffffB[24 + i] + ffffB[40 + i];
    ffffAI = ffffB[8 + i] - ffffB[56 + i];
    fffft = ffffAV + ffffAP;
    ffffAL = ffffB[0 + i];
    ffffn = (ffffAI * 473 - ffffAS * 196 + 128 >> 8) - fffft;
    ffffl = ffffn - ((ffffAV - ffffAP) * 362 + 128 >> 8);
    ffffAK = ffffAL - ffffAJ;
    ffffAO = ((ffffB[16 + i] - ffffB[48 + i]) * 362 + 128 >> 8) - ffffo;
    ffffAR = ffffAL + ffffAJ;
    ffffh = ffffAK + ffffAO;
    ffffe = ffffAR + ffffo;
    ffffAT = ffffAK - ffffAO;
    ffffAH = ffffAR - ffffo;
    ffffAM = -ffffl - (ffffAS * 473 + ffffAI * 196 + 128 >> 8);
    ffffB[0 + i] = fffft + ffffe;
    ffffB[8 + i] = ffffn + ffffh;
    ffffB[16 + i] = ffffAT - ffffl;
    ffffB[24 + i] = ffffAH - ffffAM;
    ffffB[32 + i] = ffffAH + ffffAM;
    ffffB[40 + i] = ffffl + ffffAT;
    ffffB[48 + i] = ffffh - ffffn;
    ffffB[56 + i] = ffffe - fffft;
  }
  for (i = 0; i < 64; i += 8) {
    ffffAJ = ffffB[4 + i];
    ffffo = ffffB[2 + i] + ffffB[6 + i];
    ffffAS = ffffB[5 + i] - ffffB[3 + i];
    ffffAV = ffffB[1 + i] + ffffB[7 + i];
    ffffAP = ffffB[3 + i] + ffffB[5 + i];
    ffffAI = ffffB[1 + i] - ffffB[7 + i];
    fffft = ffffAV + ffffAP;
    ffffAL = ffffB[0 + i];
    ffffn = (ffffAI * 473 - ffffAS * 196 + 128 >> 8) - fffft;
    ffffl = ffffn - ((ffffAV - ffffAP) * 362 + 128 >> 8);
    ffffAK = ffffAL - ffffAJ;
    ffffAO = ((ffffB[2 + i] - ffffB[6 + i]) * 362 + 128 >> 8) - ffffo;
    ffffAR = ffffAL + ffffAJ;
    ffffh = ffffAK + ffffAO;
    ffffe = ffffAR + ffffo;
    ffffAT = ffffAK - ffffAO;
    ffffAH = ffffAR - ffffo;
    ffffAM = -ffffl - (ffffAS * 473 + ffffAI * 196 + 128 >> 8);
    ffffB[0 + i] = fffft + ffffe + 128 >> 8;
    ffffB[1 + i] = ffffn + ffffh + 128 >> 8;
    ffffB[2 + i] = ffffAT - ffffl + 128 >> 8;
    ffffB[3 + i] = ffffAH - ffffAM + 128 >> 8;
    ffffB[4 + i] = ffffAH + ffffAM + 128 >> 8;
    ffffB[5 + i] = ffffl + ffffAT + 128 >> 8;
    ffffB[6 + i] = ffffh - ffffn + 128 >> 8;
    ffffB[7 + i] = ffffe - fffft + 128 >> 8;
  }
};
var ffffCp = "jsmp",
  ffffCe = 1,
  ffffCf = [0, 23.976, 24, 25, 29.97, 30, 50, 59.94, 60, 0, 0, 0, 0, 0, 0, 0],
  ffffBo = new Uint8Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]),
  ffffBu = new Uint8Array([8, 16, 19, 22, 26, 27, 29, 34, 16, 16, 22, 24, 27, 29, 34, 37, 19, 22, 26, 27, 29, 34, 34, 38, 22, 22, 26, 27, 29, 34, 37, 40, 22, 26, 27, 29, 32, 35, 40, 48, 26, 27, 29, 32, 35, 40, 48, 58, 26, 27, 29, 34, 38, 46, 56, 69, 27, 29, 35, 38, 46, 56, 69, 83]),
  ffffBz = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]),
  ffffBk = new Uint8Array([32, 44, 42, 38, 32, 25, 17, 9, 44, 62, 58, 52, 44, 35, 24, 12, 42, 58, 55, 49, 42, 33, 23, 12, 38, 52, 49, 44, 38, 30, 20, 10, 32, 44, 42, 38, 32, 25, 17, 9, 25, 35, 33, 30, 25, 20, 14, 7, 17, 24, 23, 20, 17, 14, 9, 5, 9, 12, 12, 10, 9, 7, 5, 2]),
  ffffAy = new Int16Array([3, 6, 0, 9, 12, 0, 0, 0, 1, 15, 18, 0, 21, 24, 0, 27, 30, 0, 33, 36, 0, 0, 0, 3, 0, 0, 2, 39, 42, 0, 45, 48, 0, 0, 0, 5, 0, 0, 4, 51, 54, 0, 57, 60, 0, 0, 0, 7, 0, 0, 6, 63, 66, 0, 69, 72, 0, 75, 78, 0, 81, 84, 0, -1, 87, 0, -1, 90, 0, 93, 96, 0, 99, 102, 0, 105, 108, 0, 111, 114, 0, 0, 0, 9, 0, 0, 8, 117, 120, 0, 123, 126, 0, 129, 132, 0, 135, 138, 0, 0, 0, 15, 0, 0, 14, 0, 0, 13, 0, 0, 12, 0, 0, 11, 0, 0, 10, 141, -1, 0, -1, 144, 0, 147, 150, 0, 153, 156, 0, 159, 162, 0, 165, 168, 0, 171, 174, 0, 177, 180, 0, 183, -1, 0, -1, 186, 0, 189, 192, 0, 195, 198, 0, 201, 204, 0, 207, 210, 0, 213, 216, 0, 219, 222, 0, 0, 0, 21, 0, 0, 20, 0, 0, 19, 0, 0, 18, 0, 0, 17, 0, 0, 16, 0, 0, 35, 0, 0, 34, 0, 0, 33, 0, 0, 32, 0, 0, 31, 0, 0, 30, 0, 0, 29, 0, 0, 28, 0, 0, 27, 0, 0, 26, 0, 0, 25, 0, 0, 24, 0, 0, 23, 0, 0, 22]),
  ffffBm = new Int8Array([3, 6, 0, -1, 9, 0, 0, 0, 1, 0, 0, 17]),
  ffffBj = new Int8Array([3, 6, 0, 9, 12, 0, 0, 0, 10, 15, 18, 0, 0, 0, 2, 21, 24, 0, 0, 0, 8, 27, 30, 0, 33, 36, 0, -1, 39, 0, 0, 0, 18, 0, 0, 26, 0, 0, 1, 0, 0, 17]),
  ffffBg = new Int8Array([3, 6, 0, 9, 15, 0, 12, 18, 0, 24, 21, 0, 0, 0, 12, 27, 30, 0, 0, 0, 14, 39, 42, 0, 36, 33, 0, 0, 0, 4, 0, 0, 6, 54, 48, 0, 45, 51, 0, 0, 0, 8, 0, 0, 10, -1, 57, 0, 0, 0, 1, 60, 63, 0, 0, 0, 30, 0, 0, 17, 0, 0, 22, 0, 0, 26]),
  ffffBr = new Int16Array([6, 3, 0, 9, 18, 0, 12, 15, 0, 24, 33, 0, 36, 39, 0, 27, 21, 0, 30, 42, 0, 60, 57, 0, 54, 48, 0, 69, 51, 0, 81, 75, 0, 63, 84, 0, 45, 66, 0, 72, 78, 0, 0, 0, 60, 105, 120, 0, 132, 144, 0, 114, 108, 0, 126, 141, 0, 87, 93, 0, 117, 96, 0, 0, 0, 32, 135, 138, 0, 99, 123, 0, 129, 102, 0, 0, 0, 4, 90, 111, 0, 0, 0, 8, 0, 0, 16, 0, 0, 44, 150, 168, 0, 0, 0, 28, 0, 0, 52, 0, 0, 62, 183, 177, 0, 156, 180, 0, 0, 0, 1, 165, 162, 0, 0, 0, 61, 0, 0, 56, 171, 174, 0, 0, 0, 2, 0, 0, 40, 153, 186, 0, 0, 0, 48, 192, 189, 0, 147, 159, 0, 0, 0, 20, 0, 0, 12, 240, 249, 0, 0, 0, 63, 231, 225, 0, 195, 219, 0, 252, 198, 0, 0, 0, 24, 0, 0, 36, 0, 0, 3, 207, 261, 0, 243, 237, 0, 204, 213, 0, 210, 234, 0, 201, 228, 0, 216, 222, 0, 258, 255, 0, 264, 246, 0, -1, 282, 0, 285, 291, 0, 0, 0, 33, 0, 0, 9, 318, 330, 0, 306, 348, 0, 0, 0, 5, 0, 0, 10, 279, 267, 0, 0, 0, 6, 0, 0, 18, 0, 0, 17, 0, 0, 34, 339, 357, 0, 309, 312, 0, 270, 276, 0, 327, 321, 0, 351, 354, 0, 303, 297, 0, 294, 288, 0, 300, 273, 0, 342, 345, 0, 315, 324, 0, 336, 333, 0, 363, 375, 0, 0, 0, 41, 0, 0, 14, 0, 0, 21, 372, 366, 0, 360, 369, 0, 0, 0, 11, 0, 0, 19, 0, 0, 7, 0, 0, 35, 0, 0, 13, 0, 0, 50, 0, 0, 49, 0, 0, 58, 0, 0, 37, 0, 0, 25, 0, 0, 45, 0, 0, 57, 0, 0, 26, 0, 0, 29, 0, 0, 38, 0, 0, 53, 0, 0, 23, 0, 0, 43, 0, 0, 46, 0, 0, 42, 0, 0, 22, 0, 0, 54, 0, 0, 51, 0, 0, 15, 0, 0, 30, 0, 0, 39, 0, 0, 47, 0, 0, 55, 0, 0, 27, 0, 0, 59, 0, 0, 31]),
  MOTION = new Int16Array([3, 6, 0, 12, 9, 0, 0, 0, 0, 18, 15, 0, 24, 21, 0, 0, 0, -1, 0, 0, 1, 27, 30, 0, 36, 33, 0, 0, 0, 2, 0, 0, -2, 42, 45, 0, 48, 39, 0, 60, 54, 0, 0, 0, 3, 0, 0, -3, 51, 57, 0, -1, 69, 0, 81, 75, 0, 78, 63, 0, 72, 66, 0, 96, 84, 0, 87, 93, 0, -1, 99, 0, 108, 105, 0, 0, 0, -4, 90, 102, 0, 0, 0, 4, 0, 0, -7, 0, 0, 5, 111, 123, 0, 0, 0, -5, 0, 0, 7, 114, 120, 0, 126, 117, 0, 0, 0, -6, 0, 0, 6, 153, 162, 0, 150, 147, 0, 135, 138, 0, 156, 141, 0, 129, 159, 0, 132, 144, 0, 0, 0, 10, 0, 0, 9, 0, 0, 8, 0, 0, -8, 171, 198, 0, 0, 0, -9, 180, 192, 0, 168, 183, 0, 165, 186, 0, 174, 189, 0, 0, 0, -10, 177, 195, 0, 0, 0, 12, 0, 0, 16, 0, 0, 13, 0, 0, 14, 0, 0, 11, 0, 0, 15, 0, 0, -16, 0, 0, -12, 0, 0, -14, 0, 0, -15, 0, 0, -11, 0, 0, -13]),
  ffffBp = new Int8Array([6, 3, 0, 18, 15, 0, 9, 12, 0, 0, 0, 1, 0, 0, 2, 27, 24, 0, 21, 30, 0, 0, 0, 0, 36, 33, 0, 0, 0, 4, 0, 0, 3, 39, 42, 0, 0, 0, 5, 0, 0, 6, 48, 45, 0, 51, -1, 0, 0, 0, 7, 0, 0, 8]),
  ffffBi = new Int8Array([6, 3, 0, 12, 9, 0, 18, 15, 0, 24, 21, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 30, 27, 0, 0, 0, 3, 36, 33, 0, 0, 0, 4, 42, 39, 0, 0, 0, 5, 48, 45, 0, 0, 0, 6, 51, -1, 0, 0, 0, 7, 0, 0, 8]),
  ffffBl = new Int32Array([3, 6, 0, 12, 9, 0, 0, 0, 1, 21, 24, 0, 18, 15, 0, 39, 27, 0, 33, 30, 0, 42, 36, 0, 0, 0, 257, 60, 66, 0, 54, 63, 0, 48, 57, 0, 0, 0, 513, 51, 45, 0, 0, 0, 2, 0, 0, 3, 81, 75, 0, 87, 93, 0, 72, 78, 0, 96, 90, 0, 0, 0, 1025, 69, 84, 0, 0, 0, 769, 0, 0, 258, 0, 0, 1793, 0, 0, 65535, 0, 0, 1537, 111, 108, 0, 0, 0, 1281, 105, 102, 0, 117, 114, 0, 99, 126, 0, 120, 123, 0, 156, 150, 0, 162, 159, 0, 144, 147, 0, 129, 135, 0, 138, 132, 0, 0, 0, 2049, 0, 0, 4, 0, 0, 514, 0, 0, 2305, 153, 141, 0, 165, 171, 0, 180, 168, 0, 177, 174, 0, 183, 186, 0, 0, 0, 2561, 0, 0, 3329, 0, 0, 6, 0, 0, 259, 0, 0, 5, 0, 0, 770, 0, 0, 2817, 0, 0, 3073, 228, 225, 0, 201, 210, 0, 219, 213, 0, 234, 222, 0, 216, 231, 0, 207, 192, 0, 204, 189, 0, 198, 195, 0, 243, 261, 0, 273, 240, 0, 246, 237, 0, 249, 258, 0, 279, 276, 0, 252, 255, 0, 270, 282, 0, 264, 267, 0, 0, 0, 515, 0, 0, 260, 0, 0, 7, 0, 0, 1026, 0, 0, 1282, 0, 0, 4097, 0, 0, 3841, 0, 0, 3585, 315, 321, 0, 333, 342, 0, 312, 291, 0, 375, 357, 0, 288, 294, 0, -1, 369, 0, 285, 303, 0, 318, 363, 0, 297, 306, 0, 339, 309, 0, 336, 348, 0, 330, 300, 0, 372, 345, 0, 351, 366, 0, 327, 354, 0, 360, 324, 0, 381, 408, 0, 417, 420, 0, 390, 378, 0, 435, 438, 0, 384, 387, 0, 0, 0, 2050, 396, 402, 0, 465, 462, 0, 0, 0, 8, 411, 399, 0, 429, 432, 0, 453, 414, 0, 426, 423, 0, 0, 0, 10, 0, 0, 9, 0, 0, 11, 0, 0, 5377, 0, 0, 1538, 0, 0, 771, 0, 0, 5121, 0, 0, 1794, 0, 0, 4353, 0, 0, 4609, 0, 0, 4865, 444, 456, 0, 0, 0, 1027, 459, 450, 0, 0, 0, 261, 393, 405, 0, 0, 0, 516, 447, 441, 0, 516, 519, 0, 486, 474, 0, 510, 483, 0, 504, 498, 0, 471, 537, 0, 507, 501, 0, 522, 513, 0, 534, 531, 0, 468, 477, 0, 492, 495, 0, 549, 546, 0, 525, 528, 0, 0, 0, 263, 0, 0, 2562, 0, 0, 2306, 0, 0, 5633, 0, 0, 5889, 0, 0, 6401, 0, 0, 6145, 0, 0, 1283, 0, 0, 772, 0, 0, 13, 0, 0, 12, 0, 0, 14, 0, 0, 15, 0, 0, 517, 0, 0, 6657, 0, 0, 262, 540, 543, 0, 480, 489, 0, 588, 597, 0, 0, 0, 27, 609, 555, 0, 606, 603, 0, 0, 0, 19, 0, 0, 22, 591, 621, 0, 0, 0, 18, 573, 576, 0, 564, 570, 0, 0, 0, 20, 552, 582, 0, 0, 0, 21, 558, 579, 0, 0, 0, 23, 612, 594, 0, 0, 0, 25, 0, 0, 24, 600, 615, 0, 0, 0, 31, 0, 0, 30, 0, 0, 28, 0, 0, 29, 0, 0, 26, 0, 0, 17, 0, 0, 16, 567, 618, 0, 561, 585, 0, 654, 633, 0, 0, 0, 37, 645, 648, 0, 0, 0, 36, 630, 636, 0, 0, 0, 34, 639, 627, 0, 663, 666, 0, 657, 624, 0, 651, 642, 0, 669, 660, 0, 0, 0, 35, 0, 0, 267, 0, 0, 40, 0, 0, 268, 0, 0, 266, 0, 0, 32, 0, 0, 264, 0, 0, 265, 0, 0, 38, 0, 0, 269, 0, 0, 270, 0, 0, 33, 0, 0, 39, 0, 0, 7937, 0, 0, 6913, 0, 0, 7681, 0, 0, 4098, 0, 0, 7425, 0, 0, 7169, 0, 0, 271, 0, 0, 274, 0, 0, 273, 0, 0, 272, 0, 0, 1539, 0, 0, 2818, 0, 0, 3586, 0, 0, 3330, 0, 0, 3074, 0, 0, 3842]),
  ffffBL = 1,
  ffffAh = 2,
  ffffCA = 3,
  ffffCX = 4,
  ffffCa = 179,
  ffffCQ = 1,
  ffffCU = 175,
  ffffB2 = 0,
  ffffCB = 181,
  ffffCV = 178,
  ffffCY = ["precision mediump float;", "uniform sampler2D YTexture;", "uniform sampler2D CBTexture;", "uniform sampler2D CRTexture;", "varying vec2 texCoord;", "void main() {", "float y = texture2D(YTexture, texCoord).r;", "float cr = texture2D(CBTexture, texCoord).r - 0.5;", "float cb = texture2D(CRTexture, texCoord).r - 0.5;", "gl_FragColor = vec4(", "y + 1.4 * cr,", "y + -0.343 * cb - 0.711 * cr,", "y + 1.765 * cb,", "1.0", ");", "}"].join("\n"),
  ffffCZ = ["precision mediump float;", "uniform float loaded;", "varying vec2 texCoord;", "void main() {", "float c = ceil(loaded-(1.0-texCoord.y));", "gl_FragColor = vec4(c,c,c,1);", "}"].join("\n"),
  ffffCb = ["attribute vec2 vertex;", "varying vec2 texCoord;", "void main() {", "texCoord = vertex;", "gl_Position = vec4((vertex * 2.0 - 1.0) * vec2(1, -1), 0.0, 1.0);", "}"].join("\n");
var ffffCI = [null, ffffBm, ffffBj, ffffBg];
var ffffV = function ffffV(arrayBuffer) {
  this.ffffM = new Uint8Array(arrayBuffer);
  this.length = this.ffffM.length;
  this.ffffT = this.ffffM.length;
  this.index = 0;
};
ffffV.ffffA$ = -1;
ffffV.prototype.ffffAx = function () {
  for (var i = this.index + 7 >> 3; i < this.ffffT; i++) {
    if (this.ffffM[i] == 0 && this.ffffM[i + 1] == 0 && this.ffffM[i + 2] == 1) {
      this.index = i + 4 << 3;
      return this.ffffM[i + 3];
    }
  }
  this.index = this.ffffT << 3;
  return ffffV.ffffA$;
};
ffffV.prototype.ffffCL = function () {
  var i = this.index + 7 >> 3;
  return i >= this.ffffT || this.ffffM[i] == 0 && this.ffffM[i + 1] == 0 && this.ffffM[i + 2] == 1;
};
ffffV.prototype.ffffBh = function (count) {
  var ffffm = this.index >> 3,
    ffffA2 = 8 - this.index % 8;
  if (ffffA2 >= count) {
    return this.ffffM[ffffm] >> ffffA2 - count & 255 >> 8 - count;
  }
  var ffffA5 = (this.index + count) % 8,
    end = this.index + count - 1 >> 3,
    value = this.ffffM[ffffm] & 255 >> 8 - ffffA2;
  for (ffffm++; ffffm < end; ffffm++) {
    value <<= 8;
    value |= this.ffffM[ffffm];
  }
  if (ffffA5 > 0) {
    value <<= ffffA5;
    value |= this.ffffM[ffffm] >> 8 - ffffA5;
  } else {
    value <<= 8;
    value |= this.ffffM[ffffm];
  }
  return value;
};
ffffV.prototype.ffffP = function (count) {
  var value = this.ffffBh(count);
  this.index += count;
  return value;
};
ffffV.prototype.ffffAr = function (count) {
  return this.index += count;
};
ffffV.prototype.ffffCR = function (count) {
  return this.index -= count;
};