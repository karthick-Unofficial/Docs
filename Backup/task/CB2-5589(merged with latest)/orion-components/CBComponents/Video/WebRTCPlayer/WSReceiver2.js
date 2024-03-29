"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));
var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));
var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));
/* eslint-disable */
//LICENSE! This Code can be used and executed as a part of Flashphoner Web Call Server platform and having an appropriate Web Call Server license. You shall not use this code separately from Web Call Server platform. Contacts: http://flashphoner.com, support@flashphoner.com.
self.onmessage = function (e) {
  var _context;
  switch (e.data.message) {
    case "init":
      this.m = new I(e.data.data);
      this.m.CO();
      this.connection = new BF(e.data.data.urlWsServer, (0, _bind["default"])(_context = this.m.CN).call(_context, this.m));
      this.connection.connect(e.data.data.token);
      break;
    case "stop":
      this.m.stop();
      break;
    case "play":
      this.m.CL();
      break;
    case "pause":
      this.m.CQ();
      break;
    case "resume":
      this.m.CT();
      break;
    case "ack":
      this.m.AO.CR(e.data.data);
      break;
    default:
  }
};
var CV = 8000;
var J = {
  verbosity: -1,
  log: function log() {
    if (this.verbosity >= 2) {
      console.log.apply(console, arguments);
    }
  },
  warn: function warn() {
    if (this.verbosity >= 1) {
      console.warn.apply(console, arguments);
    }
  },
  error: function error() {
    if (this.verbosity >= 0) {
      console.error.apply(console, arguments);
    }
  },
  debug: function debug() {
    if (this.verbosity >= 3) {
      console.log.apply(console, arguments);
    }
  },
  trace: function trace() {
    if (this.verbosity >= 4) {
      console.log.apply(console, arguments);
    }
  }
};
function I(s) {
  this.videoWidth = s.videoWidth;
  this.videoHeight = s.videoHeight;
  this.audioContextSampleRate = s.audioContextSampleRate;
  this.audioChunkLength = s.audioChunkLength;
  this.n = this.audioChunkLength / this.audioContextSampleRate * 1000;
  this.audioBufferWaitFor = s.audioBufferWaitFor || 1000;
  this.videoBufferWaitFor = s.videoBufferWaitFor || 1000;
  this.dropDelayMultiplier = s.dropDelayMultiplier || 2;
  this.AA = 50;
  this.Ab();
  this.BY();
  this.BW();
}
I.prototype.CO = function () {
  this.resampler = new Resampler(8000, this.audioContextSampleRate, 1, this.audioContextSampleRate, true);
  this.S = T.BA;
};
I.prototype.CL = function () {
  this.S = T.A$;
  this.BU();
};
I.prototype.stop = function () {
  if (this.S != T.BA) {
    this.S = T.BA;
    this.BZ();
    this.Ab();
    this.BY();
    this.BW();
  }
};
I.prototype.CQ = function () {
  this.S = T.Bj;
  this.Ab();
  this.BZ();
};
I.prototype.CT = function () {
  this.S = T.A$;
  this.Ab();
  this.BU();
};
I.prototype.Ab = function () {
  if (this.M) {
    this.M.length = 0;
  } else {
    this.M = [];
  }
  if (this.H) {
    this.H.length = 0;
  } else {
    this.H = [];
  }
  if (this.AV) {
    this.AV.length = 0;
  } else {
    this.AV = [];
  }
  this.A3 = false;
};
I.prototype.BY = function () {
  this.BM = "";
  this.BL = "";
  this.BC = new Ar(0, 0, 8000);
  this.BK = new Ar(0, 0, 90000);
  this.sync = false;
};
I.prototype.BW = function () {
  this.BG = {
    CJ: 0,
    CP: 0,
    CI: 0,
    C9: 0
  };
};
I.prototype.CN = function (event) {
  if (this.S == T.BA || this.S == T.Bj) {
    return;
  }
  var F = new DataView(event.data);
  var O = 1;
  var AY = F.getUint8(0);
  var Af = AY >> 2 & 3;
  var AB = AY >> 1 & 1;
  var Q = AY & 1;
  if (Af == 1) {
    this.B_(F, Q, AB);
  } else if (Af == 2) {
    this.B9(F, Q, AB);
  } else if (Af == 3) {
    this.B8(F, O);
  } else {
    J.warn("Unknown binary data received, type " + Af);
  }
};
I.prototype.B_ = function (F, Q, AB) {
  this.BG.CP += F.byteLength;
  var AY = F.getUint8(0);
  var kframe = AY >> 4 & 1;
  var O = 1;
  if (AB) {
    this.BL = F.getUint32(O);
    O += 4;
  }
  var ts = 0;
  if (Q) {
    ts = F.getUint32(O);
    O += 4;
  }
  J.trace("Incoming video packet ts " + ts);
  var payload = new Uint8Array(F.buffer).subarray(O);
  var frame = new VideoFrame(payload, ts, kframe, true);
  if (!this.A3 && frame.A5()) {
    this.A3 = true;
  } else if (!this.A3) {
    return;
  }
  this.H.push(frame);
  this.BG.CI++;
};
I.prototype.B9 = function (F, Q, AB) {
  this.BG.CJ += F.byteLength;
  var O = 1;
  var A1 = {};
  var ts;
  if (AB) {
    this.BM = F.getUint32(O);
    O += 4;
  }
  if (Q) {
    ts = F.getUint32(O);
    O += 4;
  }
  A1.Q = ts;
  A1.data = this.B6(new Uint8Array(F.buffer).subarray(O));
  this.M.push(A1);
};
I.prototype.B8 = function (F, offset) {
  var As;
  var k = 0;
  if (this.BM == F.getInt32(offset)) {
    J.debug("Received audio rtcp update");
    As = F.getUint32(offset + 8) * 1000 + this.Bd(F.getUint32(offset + 12));
    k = this.BC.BX(As, F.getUint32(offset + 4));
    if (k > 50 || k < -50) {
      J.warn("Audio sync changed " + k);
    }
  } else if (this.BL == F.getInt32(offset)) {
    J.log("Received video rtcp update");
    As = F.getUint32(offset + 8) * 1000 + this.Bd(F.getUint32(offset + 12));
    k = this.BK.BX(As, F.getUint32(offset + 4));
    if (k > 50 || k < -50) {
      J.warn("Video sync changed " + k);
    }
  } else {
    J.warn("Received rtcp with unknown ssrc " + F.getInt32(offset));
  }
  if (this.BC.getTime(1) != 0 && this.BK.getTime(1) != 0) {
    this.sync = true;
  }
};
I.prototype.o = function () {
  var BJ;
  var A2;
  if (this.H.length > 1) {
    BJ = this.H[0].U();
    A2 = this.H[this.H.length - 1].U();
  }
  if (A2 != undefined && BJ != undefined) {
    return this.B7(A2 - BJ, 90000);
  }
  return 0;
};
I.prototype.p = function () {
  return this.M.length * 20;
};
I.prototype.B6 = function (payload) {
  if (this.Bb == undefined) {
    this.Bb = new l();
  }
  var Ba = this.Bb.B$(payload);
  var Ak = new Float32Array(Ba.byteLength / 2);
  var CD = new DataView(Ba.buffer);
  for (var D = 0; D < Ak.length; D++) {
    Ak[D] = CD.getInt16(D * 2, true) / 32768;
  }
  var Bf = this.resampler.resampler(Ak, [Ak.buffer]);
  var CX = this.resampler.outputBuffer.subarray(0, Bf);
  var CE = new ArrayBuffer(Bf * 4);
  var P = new Float32Array(CE);
  P.set(CX);
  return P;
};
I.prototype.Bd = function (CW) {
  return CW * 1000 / 4294967296;
};
I.prototype.B7 = function (ts, Ce) {
  return ts / Ce * 1000;
};
I.prototype.R = function (CY, ts) {
  if (CY) {
    return this.BC.getTime(ts);
  } else {
    return this.BK.getTime(ts);
  }
};
I.prototype.BU = function () {
  var _context2;
  this.Cs = (0, _setInterval2["default"])((0, _bind["default"])(_context2 = this.Cp).call(_context2, this), this.AA);
  this.At = this.videoBufferWaitFor * this.dropDelayMultiplier;
  this.Bg = (0, _now["default"])() + this.At * 10;
  this.AO = new PlayerState();
  this.c = {
    audio: 0,
    video: 0,
    Ac: false
  };
};
I.prototype.BZ = function () {
  clearInterval(this.Cs);
};
I.prototype.Cp = function () {
  if (this.S == T.A$) {
    if (this.Cr()) {
      J.log("Stream aligned, audio buffer " + this.p() + " video buffer " + this.o());
      this.S = T.Co;
    } else {
      return;
    }
  }
  if ((0, _now["default"])() - this.Bg > this.At) {
    this.Cq();
    this.Bg = (0, _now["default"])();
  }
  var data = this.Cl();
  if (data) {
    var A8 = [];
    var D;
    if (data.audio && data.audio.length > 0) {
      for (D = 0; D < data.audio.length; D++) {
        A8.push(data.audio[D].payload.buffer);
      }
    }
    if (data.video && data.video.length > 0) {
      for (D = 0; D < data.video.length; D++) {
        A8.push(data.video[D].payload.buffer);
      }
    }
    data.message = "AVData";
    self.postMessage(data, A8);
    data = null;
  }
};
I.prototype.Cr = function () {
  if (this.sync && this.p() > this.audioBufferWaitFor && this.o() > this.videoBufferWaitFor) {
    this.AC = this.R(false, this.H[1].U()) - this.R(false, this.H[0].U());
    var BS = this.R(false, this.H[0].U());
    var AQ = this.R(true, this.M[0].Q);
    var A4 = BS - AQ;
    if (Math.abs(A4) < 30) {
      return true;
    }
    if (A4 > 0) {
      while (this.M.length > 0) {
        if (BS > this.R(true, this.M[0].Q)) {
          this.M.shift();
        } else {
          return true;
        }
      }
    } else if (A4 < 0) {
      var D = 0;
      while (D < this.H.length) {
        if (this.H[D].A5()) {
          if (AQ < this.R(false, this.H[D].U())) {
            var _context3;
            this.H = (0, _slice["default"])(_context3 = this.H).call(_context3, D);
            break;
          }
        }
        D++;
      }
    } else {
      return true;
    }
  } else if (this.o() >= this.videoBufferWaitFor && this.BK.getTime(1) != 0) {
    this.AC = this.R(false, this.H[1].U()) - this.R(false, this.H[0].U());
    J.log("No sync and video ready, start playing. video frame length " + this.AC);
    return true;
  }
};
I.prototype.Cq = function () {
  if (this.sync) {
    if (this.o() > this.At && this.AV.length == 0) {
      if (this.c.Ac || this.M.length < 2) {
        this.c.audio = this.p();
        this.c.video = this.o();
        this.c.Ac = false;
        return;
      }
      var AN = this.R(true, this.M[0].Q);
      var Cb = this.R(false, this.H[0].U());
      var Av = this.R(false, this.H[this.H.length - 1].U());
      var BO = AN - Cb;
      var CZ = Av - AN;
      J.log("protectedVideoLength " + BO + " actualVideoBufferLength " + CZ);
      J.log("audio buffer " + this.p() + " video buffer " + this.o());
      this.c.audio = this.p();
      this.c.video = this.o();
      this.c.Ac = false;
      var anchors = this.Ca();
      var anchor;
      while (anchors.length > 0) {
        var A9 = anchors.shift();
        if (Av - A9.sync < this.videoBufferWaitFor / 2) {
          continue;
        }
        if (A9.sync - AN < this.videoBufferWaitFor) {
          break;
        }
        anchor = A9;
        break;
      }
      if (anchor) {
        var _context5;
        J.log("Found anchor, stream drop " + (anchor.sync - AN) + ", stream left " + (Av - anchor.sync));
        if (BO > 0) {
          var D;
          for (D = 0; D < this.H.length; D++) {
            if (this.R(false, this.H[D]) >= AN) {
              var _context4;
              this.AV = (0, _slice["default"])(_context4 = this.H).call(_context4, D);
              break;
            }
          }
        }
        var Cf = -(this.H.length - anchor.Am);
        this.H = (0, _slice["default"])(_context5 = this.H).call(_context5, Cf);
        while (this.M.length > 0) {
          if (this.R(true, this.M[0].Q) >= anchor.sync) {
            break;
          }
          this.M.shift();
        }
        this.c.audio = this.p();
        this.c.video = this.o();
        this.c.Ac = true;
        J.log("audio buffer " + this.p() + " video buffer " + this.o());
      }
    }
  } else if (this.o() > this.At) {
    if (this.c.Ac) {
      this.c.video = this.o();
      this.c.Ac = false;
      return;
    }
    var Cb = this.R(false, this.H[0].U());
    var Av = this.R(false, this.H[this.H.length - 1].U());
    this.c.video = this.o();
    this.c.Ac = false;
    var anchors = this.Ca();
    var anchor;
    while (anchors.length > 0) {
      var A9 = anchors.shift();
      if (Av - A9.sync < this.videoBufferWaitFor / 2) {
        continue;
      }
      if (A9.sync - Cb < this.videoBufferWaitFor) {
        break;
      }
      anchor = A9;
      break;
    }
    if (anchor) {
      var _context6;
      J.warn("Found anchor, stream drop " + (anchor.sync - Cb) + ", stream left " + (Av - anchor.sync));
      var Cf = -(this.H.length - anchor.Am);
      this.H = (0, _slice["default"])(_context6 = this.H).call(_context6, Cf);
      this.c.video = this.o();
      this.c.Ac = true;
      J.log("audio buffer " + this.p() + " video buffer " + this.o());
    }
  }
};
I.prototype.Ca = function () {
  var P = [];
  if (this.H.length > 1) {
    var D;
    for (D = this.H.length - 1; D >= 0; D--) {
      if (this.H[D].A5()) {
        P.push({
          Am: D,
          sync: this.R(false, this.H[D].U())
        });
      }
    }
  }
  return P;
};
I.prototype.Cl = function () {
  var data = {};
  var Ao;
  var AI;
  if (this.H.length > 1) {
    this.AC = this.R(false, this.H[1].U()) - this.R(false, this.H[0].U());
    if (this.AC > 50) {
      this.AC = 50;
    }
  }
  if (this.AO.Ci()) {
    var S = this.AO.Cg();
    if (S.window > 0) {
      return;
    }
    var AF = S.Ck + S.AH - this.n * 1.5;
    if (AF < 0) {
      AF = -AF;
      Ao = AF < this.n ? 1 : Math.round(AF / this.n);
      data.audio = this.BQ(Ao);
      data.audioLength = this.n * data.audio.length;
    } else {
      data.audioLength = 0;
    }
    J.log("State video buffer and video in flight " + (S.Cj + S.AG));
    var AJ = S.Cj + S.AG - this.AA * 6;
    if (AJ < 0) {
      AJ = -AJ;
      AI = AJ < this.AC ? 1 : Math.round(AJ / this.AC);
      J.log("videoChunks " + AI);
      if (this.sync && AI < 3) {
        data.videoLength = 0;
      } else {
        data.video = this.BN(AI);
        data.videoLength = this.AC * data.video.length;
      }
    } else {
      data.videoLength = 0;
    }
  } else {
    Ao = this.AA < this.n ? 1 : Math.round(this.AA / this.n);
    AI = this.AA < this.AC ? 1 : Math.round(this.AA / this.AC);
    data.audio = this.BQ(Ao);
    data.audioLength = this.n * data.audio.length;
    data.video = this.BN(AI);
    data.videoLength = this.AC * data.video.length;
  }
  if (data.audioLength > 0 || data.videoLength > 0) {
    J.log("Audio left " + this.M.length + " video " + this.H.length);
    this.AO.Ch(data);
    return data;
  }
};
I.prototype.BQ = function (W) {
  var data = [];
  while (W > 0) {
    if (this.M.length * 20 - 20 > this.n) {
      var Ah = new AE(this.audioChunkLength, this.audioContextSampleRate);
      var BD = undefined;
      while (!Ah.BB() && this.M.length > 0) {
        BD = Ah.B5(this.M.shift());
      }
      if (BD) {
        this.M.unshift(BD);
      }
      var CF = {
        payload: Ah.B3(),
        sync: this.R(true, Ah.U())
      };
      data.push(CF);
      W--;
    } else {
      break;
    }
  }
  return data;
};
I.prototype.BN = function (W) {
  var data = [];
  while (W > 0) {
    var frame = undefined;
    if (this.AV.length > 0) {
      frame = this.AV.shift();
    } else if (this.H.length > 0) {
      frame = this.H.shift();
    }
    if (frame) {
      frame.ts = this.R(false, frame.U());
      data.push(frame);
      W--;
    } else {
      break;
    }
  }
  return data;
};
function PlayerState() {
  this.AS = {
    seq: 0,
    time: 0,
    audioReceivedLength: 0,
    videoReceivedLength: 0,
    AQ: 0,
    audioBufferTimeLength: 0,
    videoBufferTimeLength: 0
  };
  this.seq = 0;
  this.window = 0;
  this.AH = 0;
  this.AG = 0;
}
PlayerState.prototype.Ci = function () {
  return this.seq > 0;
};
PlayerState.prototype.Cg = function () {
  var An = (0, _now["default"])() - this.AS.time;
  return {
    Cz: An > 300,
    AQ: this.AS.AQ + An,
    Ck: this.AS.audioBufferTimeLength - An,
    Cj: this.AS.videoBufferTimeLength - An,
    AH: this.AH,
    AG: this.AG,
    window: this.window
  };
};
PlayerState.prototype.CR = function (Ag) {
  this.AS = Ag;
  this.window = this.seq - Ag.seq;
  this.AH -= Ag.audioReceivedLength;
  this.AG -= Ag.videoReceivedLength;
};
PlayerState.prototype.Ch = function (data) {
  this.seq++;
  data.seq = this.seq;
  this.window++;
  this.AH += data.audioLength;
  this.AG += data.videoLength;
};
var T = function T() {};
T.BA = "STOPPED";
T.Co = "PLAYING";
T.Bj = "PAUSED";
T.A$ = "STARTUP";
function BF(url, Ax) {
  this.url = url;
  this.j = undefined;
  this.Ax = Ax;
  this.send = function (v) {
    this.j.send((0, _stringify["default"])(v));
  };
}
BF.prototype.connect = function (token) {
  if (this.j == undefined) {
    this.j = new WebSocket(this.url);
    this.j.binaryType = "arraybuffer";
    var Az = this;
    this.j.onopen = function (event) {
      var v = {};
      v.message = "connectMediaTransport";
      v.data = [{
        authToken: token
      }];
      Az.send(v);
      self.postMessage({
        message: "connection",
        status: "connected"
      });
    };
    this.j.onmessage = function (event) {
      if (event.data instanceof ArrayBuffer) {
        Az.Ax(event);
      } else {
        var v = JSON.parse(event.data);
        switch (v.message) {
          case "ping":
            var BV = {};
            BV.message = "pong";
            Az.send(BV);
            break;
          default:
        }
      }
    };
    this.j.onerror = function (error) {
      J.error("Got ws error!");
      self.m.stop();
      self.postMessage({
        message: "connection",
        status: "failed"
      });
    };
    this.j.onclose = function (event) {
      J.debug("Websocket media transport closed");
      self.m.stop();
      self.postMessage({
        message: "connection",
        status: "closed"
      });
    };
  }
};
BF.prototype.close = function () {
  this.j.close();
};
function VideoFrame(payload, ts, kframe, complete) {
  this.payload = payload;
  this.ts = ts;
  this.kframe = kframe;
  this.complete = complete;
}
VideoFrame.prototype.addPayload = function (payload, complete) {};
VideoFrame.prototype.BB = function () {
  return this.complete;
};
VideoFrame.prototype.U = function () {
  return this.ts;
};
VideoFrame.prototype.A5 = function () {
  return this.kframe;
};
function AE(W, A7) {
  this.payload = [];
  this.ts = 0;
  this.size = 0;
  this.W = W;
  this.A7 = A7;
}
AE.prototype.B5 = function (z) {
  if (this.size + z.data.length <= this.W) {
    if (this.ts == 0) {
      this.ts = z.Q;
    }
    this.payload.push(z.data);
    this.size += z.data.length;
  } else {
    var Aq = this.W - this.size;
    this.payload.push(z.data.subarray(0, Aq));
    this.size += Aq;
    var Ay = {};
    Ay.Q = Aq / this.A7 * CV + z.Q;
    Ay.data = z.data.subarray(Aq);
    return Ay;
  }
};
AE.prototype.B3 = function () {
  if (this.BB()) {
    var buffer = new Float32Array(this.size);
    var Am = 0;
    var data;
    while (this.payload.length > 0) {
      data = this.payload.shift();
      buffer.set(data, Am);
      Am += data.length;
    }
    return buffer;
  }
};
AE.prototype.U = function () {
  return this.ts;
};
AE.prototype.BB = function () {
  return this.W == this.size;
};
function Ar(time, ts, Aw) {
  this.time = time;
  this.ts = ts;
  this.Aw = Aw;
}
Ar.prototype.BX = function (time, ts) {
  var Bh = this.getTime(ts);
  this.time = time;
  this.ts = ts;
  if (this.time == 0 || Bh == 0) {
    return 0;
  }
  return Bh - time;
};
Ar.prototype.getTime = function (ts) {
  if (this.time == 0 && this.ts == 0) {
    return 0;
  }
  return (ts - this.ts) * 1000 / this.Aw + this.time;
};
var l = function l() {
  this.Bu = 128;
  this.A_ = 132;
  this.Br = 4;
  this.B2 = 15;
  this.Bv = 112;
};
l.prototype.B$ = function (data) {
  var payload = data;
  var P = new Uint8Array(data.length * 2);
  var index;
  for (index = 0; index < payload.length; ++index) {
    var AR = this.Bo(payload[index]);
    var Bc = index << 1;
    P[Bc] = AR & 255;
    P[++Bc] = (AR & 65280) >>> 8;
  }
  return P;
};
l.prototype.Bo = function (data) {
  var Ap;
  data = ~data;
  Ap = ((data & this.B2) << 3) + this.A_;
  Ap <<= (data & this.Bv) >> this.Br;
  return (data & this.Bu) != 0 ? this.A_ - Ap : Ap - this.A_;
};
l.prototype.C0 = function () {
  return this.Bl("524946466406000057415645666d74201000000001000100401f0000803e0000020010006461746140060000");
};
l.prototype.C8 = function (r) {
  var F = new DataView(this.Bl(r).buffer);
  var index = 0;
  J.log("RIFF " + F.getInt32(index));
  index += 4;
  J.log("Chunk size:" + F.getInt32(index, true));
  index += 4;
  J.log("Format:" + F.getInt32(index));
  index += 4;
  J.log("Subchunk id:" + F.getInt32(index));
  index += 4;
  J.log("Subchunk size:" + F.getInt32(index, true));
  index += 4;
  J.log("AudioFormat:" + F.getInt16(index, true));
  index += 2;
  J.log("NumChannels:" + F.getUint16(index, true));
  index += 2;
  J.log("Sample rate:" + F.getInt32(index, true));
  index += 4;
  J.log("Byte rate:" + F.getInt32(index, true));
};
l.prototype.Bl = function (r) {
  var P = [];
  for (var D = 0; D < r.length; D += 2) {
    P.push((0, _parseInt2["default"])("0x" + r.substr(D, 2), 16));
  }
  return new Uint8Array(P);
};
l.prototype.Bt = function (BP) {
  var Bi = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
  return Bi[BP >> 4 & 15] + Bi[BP & 15];
};
l.prototype.C2 = function (data) {
  var r = "";
  var table = "";
  for (var D = 0; D < data.byteLength; D++) {
    var AR = this.Bt(data[D]);
    r += AR;
    table += AR;
    if (D % 32 == 0) {
      table += "\n";
    }
  }
  J.log(r);
  J.log(table);
};
function Resampler(fromSampleRate, toSampleRate, channels, outputBufferSize, noReturn) {
  this.fromSampleRate = fromSampleRate;
  this.toSampleRate = toSampleRate;
  this.channels = channels | 0;
  this.outputBufferSize = outputBufferSize;
  this.noReturn = !!noReturn;
  this.initialize();
}
Resampler.prototype.initialize = function () {
  if (this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0) {
    if (this.fromSampleRate == this.toSampleRate) {
      this.resampler = this.bypassResampler;
      this.ratioWeight = 1;
    } else {
      this.ratioWeight = this.fromSampleRate / this.toSampleRate;
      if (this.fromSampleRate < this.toSampleRate) {
        this.compileLinearInterpolationFunction();
        this.lastWeight = 1;
      } else {
        this.compileMultiTapFunction();
        this.tailExists = false;
        this.lastWeight = 0;
      }
      this.initializeBuffers();
    }
  } else {
    throw new Error("Invalid settings specified for the resampler.");
  }
};
Resampler.prototype.compileLinearInterpolationFunction = function () {
  var toCompile = "var bufferLength = buffer.length;    var outLength = this.outputBufferSize;    if ((bufferLength % " + this.channels + ") == 0) {        if (bufferLength > 0) {            var weight = this.lastWeight;            var firstWeight = 0;            var secondWeight = 0;            var sourceOffset = 0;            var outputOffset = 0;            var outputBuffer = this.outputBuffer;            for (; weight < 1; weight += " + this.ratioWeight + ") {                secondWeight = weight % 1;                firstWeight = 1 - secondWeight;";
  for (var channel = 0; channel < this.channels; ++channel) {
    toCompile += "outputBuffer[outputOffset++] = (this.lastOutput[" + channel + "] * firstWeight) + (buffer[" + channel + "] * secondWeight);";
  }
  toCompile += "}            weight -= 1;            for (bufferLength -= " + this.channels + ", sourceOffset = Math.floor(weight) * " + this.channels + "; outputOffset < outLength && sourceOffset < bufferLength;) {                secondWeight = weight % 1;                firstWeight = 1 - secondWeight;";
  for (var channel = 0; channel < this.channels; ++channel) {
    toCompile += "outputBuffer[outputOffset++] = (buffer[sourceOffset" + (channel > 0 ? " + " + channel : "") + "] * firstWeight) + (buffer[sourceOffset + " + (this.channels + channel) + "] * secondWeight);";
  }
  toCompile += "weight += " + this.ratioWeight + ";                sourceOffset = Math.floor(weight) * " + this.channels + ";            }";
  for (var channel = 0; channel < this.channels; ++channel) {
    toCompile += "this.lastOutput[" + channel + "] = buffer[sourceOffset++];";
  }
  toCompile += "this.lastWeight = weight % 1;            return this.bufferSlice(outputOffset);        }        else {            return (this.noReturn) ? 0 : [];        }    }    else {        throw(new Error(\"Buffer was of incorrect sample length.\"));    }";
  this.resampler = Function("buffer", toCompile);
};
Resampler.prototype.compileMultiTapFunction = function () {
  var toCompile = "var bufferLength = buffer.length;    var outLength = this.outputBufferSize;    if ((bufferLength % " + this.channels + ") == 0) {        if (bufferLength > 0) {            var weight = 0;";
  for (var channel = 0; channel < this.channels; ++channel) {
    toCompile += "var output" + channel + " = 0;";
  }
  toCompile += "var actualPosition = 0;            var amountToNext = 0;            var alreadyProcessedTail = !this.tailExists;            this.tailExists = false;            var outputBuffer = this.outputBuffer;            var outputOffset = 0;            var currentPosition = 0;            do {                if (alreadyProcessedTail) {                    weight = " + this.ratioWeight + ";";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "output" + channel + " = 0;";
  }
  toCompile += "}                else {                    weight = this.lastWeight;";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "output" + channel + " = this.lastOutput[" + channel + "];";
  }
  toCompile += "alreadyProcessedTail = true;                }                while (weight > 0 && actualPosition < bufferLength) {                    amountToNext = 1 + actualPosition - currentPosition;                    if (weight >= amountToNext) {";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "output" + channel + " += buffer[actualPosition++] * amountToNext;";
  }
  toCompile += "currentPosition = actualPosition;                        weight -= amountToNext;                    }                    else {";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "output" + channel + " += buffer[actualPosition" + (channel > 0 ? " + " + channel : "") + "] * weight;";
  }
  toCompile += "currentPosition += weight;                        weight = 0;                        break;                    }                }                if (weight <= 0) {";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "outputBuffer[outputOffset++] = output" + channel + " / " + this.ratioWeight + ";";
  }
  toCompile += "}                else {                    this.lastWeight = weight;";
  for (channel = 0; channel < this.channels; ++channel) {
    toCompile += "this.lastOutput[" + channel + "] = output" + channel + ";";
  }
  toCompile += "this.tailExists = true;                    break;                }            } while (actualPosition < bufferLength && outputOffset < outLength);            return this.bufferSlice(outputOffset);        }        else {            return (this.noReturn) ? 0 : [];        }    }    else {        throw(new Error(\"Buffer was of incorrect sample length.\"));    }";
  this.resampler = Function("buffer", toCompile);
};
Resampler.prototype.bypassResampler = function (buffer) {
  if (this.noReturn) {
    this.outputBuffer = buffer;
    return buffer.length;
  } else {
    return buffer;
  }
};
Resampler.prototype.bufferSlice = function (sliceAmount) {
  if (this.noReturn) {
    return sliceAmount;
  } else {
    try {
      return this.outputBuffer.subarray(0, sliceAmount);
    } catch (error) {
      try {
        this.outputBuffer.length = sliceAmount;
        return this.outputBuffer;
      } catch (error) {
        var _context7;
        return (0, _slice["default"])(_context7 = this.outputBuffer).call(_context7, 0, sliceAmount);
      }
    }
  }
};
Resampler.prototype.initializeBuffers = function () {
  try {
    this.outputBuffer = new Float32Array(this.outputBufferSize);
    this.lastOutput = new Float32Array(this.channels);
  } catch (error) {
    this.outputBuffer = [];
    this.lastOutput = [];
  }
};