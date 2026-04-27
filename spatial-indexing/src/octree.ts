export interface Point3D {
  x: number;
  y: number;
  z: number;
  data?: any;
}

export class Box {
  constructor(
    public x: number, // Center X
    public y: number, // Center Y
    public z: number, // Center Z
    public w: number, // Half-width
    public h: number, // Half-height
    public d: number  // Half-depth
  ) {}

  public contains(point: Point3D): boolean {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h &&
      point.z >= this.z - this.d &&
      point.z <= this.z + this.d
    );
  }

  public intersects(range: Box): boolean {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h ||
      range.z - range.d > this.z + this.d ||
      range.z + range.d < this.z - this.d
    );
  }
}

export class Octree {
  private points: Point3D[] = [];
  private divided: boolean = false;
  private children: Octree[] | null = null;

  constructor(
    public boundary: Box,
    private capacity: number = 8
  ) {}

  private subdivide(): void {
    const { x, y, z, w, h, d } = this.boundary;
    const nw = w / 2, nh = h / 2, nd = d / 2;
    
    this.children = [];
    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        for (let k = -1; k <= 1; k += 2) {
          const subBoundary = new Box(
            x + i * nw, y + j * nh, z + k * nd,
            nw, nh, nd
          );
          this.children.push(new Octree(subBoundary, this.capacity));
        }
      }
    }

    this.divided = true;
    const pointsToRedistribute = this.points;
    this.points = [];
    pointsToRedistribute.forEach(p => this.insert(p));
  }

  public insert(point: Point3D): boolean {
    if (!this.boundary.contains(point)) return false;

    if (!this.divided) {
      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      }
      this.subdivide();
    }

    for (const child of this.children!) {
      if (child.insert(point)) return true;
    }
    return false;
  }

  public query(range: Box, found: Point3D[] = []): Point3D[] {
    if (!this.boundary.intersects(range)) return found;

    if (this.divided) {
      for (const child of this.children!) {
        child.query(range, found);
      }
    } else {
      for (const p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
    }

    return found;
  }
}
