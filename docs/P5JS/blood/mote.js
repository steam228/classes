// Mote class
// Tiny white particles suspended in a slow, oily flow,
// living on a layer between the background and the boids

let MOTE_SIZE = 1.9; // 70% smaller than before (6.3)
let MOTE_COVERAGE = 0.05; // Fraction of the background the motes cover if summed
let MOTE_SPEED = 0.25; // Drift speed of the flow
let MOTE_VISCOSITY = 0.03; // How slowly motes follow the flow (lower = oilier)
let MOTE_PARALLAX = 18; // Max layer shift (px) as the mouse moves

class Mote {
  constructor(margin) {
    this.spawn(margin);
    this.grow = 1; // Initial motes start fully grown
  }

  // Place the mote at a random spot with a random shape
  spawn(margin) {
    this.x = random(-margin, width + margin);
    this.y = random(-margin, height + margin);
    this.vx = 0;
    this.vy = 0;
    this.size = MOTE_SIZE * random(0.8, 1.2);
    this.kind = floor(random(3)); // 0 dot, 1 square, 2 star
    this.angle = random(TWO_PI);
    this.spin = random(-0.008, 0.008);
    this.grow = 0; // Respawned motes grow in instead of popping
  }

  update(t, margin) {
    // Follow a slowly evolving noise flow field, with a lot of inertia
    let a = noise(this.x * 0.002, this.y * 0.002, t) * TWO_PI * 2;
    this.vx += (cos(a) * MOTE_SPEED - this.vx) * MOTE_VISCOSITY;
    this.vy += (sin(a) * MOTE_SPEED - this.vy) * MOTE_VISCOSITY;
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.spin;
    if (this.grow < 1) this.grow = min(1, this.grow + 0.01);

    // Re-create once it drifts past the edges
    if (
      this.x < -margin ||
      this.y < -margin ||
      this.x > width + margin ||
      this.y > height + margin
    ) {
      this.spawn(margin);
    }
  }
}

// Manages all motes and draws them in batched paths straight on the
// canvas context, so tens of thousands of them stay cheap
class MoteField {
  constructor() {
    this.margin = MOTE_PARALLAX + MOTE_SIZE;
    this.offsetX = 0;
    this.offsetY = 0;
    // Visible footprint of one mote: anti-aliasing spreads each shape
    // about half a pixel on every side, which matters a lot at tiny sizes
    let footprint = (MOTE_SIZE + 1) * (MOTE_SIZE + 1);
    let count = floor((MOTE_COVERAGE * width * height) / footprint);
    this.motes = [];
    for (let i = 0; i < count; i++) {
      this.motes.push(new Mote(this.margin));
    }
  }

  run() {
    this.update();
    this.show();
  }

  update() {
    // Subtle parallax: the whole layer eases away from the mouse
    let tx = ((mouseX - width / 2) / (width / 2)) * -MOTE_PARALLAX;
    let ty = ((mouseY - height / 2) / (height / 2)) * -MOTE_PARALLAX;
    this.offsetX += (tx - this.offsetX) * 0.04;
    this.offsetY += (ty - this.offsetY) * 0.04;

    let t = frameCount * 0.0015;
    for (let m of this.motes) {
      m.update(t, this.margin);
    }
  }

  show() {
    let ctx = drawingContext;
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // 20% opacity, no stroke

    // All shapes in one filled path
    ctx.beginPath();
    for (let m of this.motes) {
      let r = (m.size / 2) * m.grow;
      if (m.kind === 0) {
        ctx.moveTo(m.x + r, m.y);
        ctx.arc(m.x, m.y, r, 0, TWO_PI);
      } else if (m.kind === 1) {
        let c = cos(m.angle) * r;
        let s = sin(m.angle) * r;
        ctx.moveTo(m.x + c - s, m.y + s + c);
        ctx.lineTo(m.x - c - s, m.y - s + c);
        ctx.lineTo(m.x - c + s, m.y - s - c);
        ctx.lineTo(m.x + c + s, m.y + s - c);
        ctx.closePath();
      } else {
        // Six-pointed star, alternating outer and inner points
        for (let k = 0; k < 12; k++) {
          let a = m.angle + (k * PI) / 6;
          let d = k % 2 === 0 ? r : r * 0.45;
          let px = m.x + cos(a) * d;
          let py = m.y + sin(a) * d;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
    }
    ctx.fill();

    ctx.restore();
  }
}
