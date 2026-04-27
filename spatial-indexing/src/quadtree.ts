export interface Point2D {
  x: number;
  y: number;
  data?: any;
}

export class Rectangle {
  constructor(
    public x: number, // Center X
    public y: number, // Center Y
    public w: number, // Half-width
    public h: number  // Half-height
  ) {}

  public contains(point: Point2D): boolean {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }

  public intersects(range: Rectangle): boolean {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

export class QuadTree {
  private points: Point2D[] = [];
  private divided: boolean = false;
  private nw: QuadTree | null = null;
  private ne: QuadTree | null = null;
  private sw: QuadTree | null = null;
  private se: QuadTree | null = null;

  constructor(
    public boundary: Rectangle,
    private capacity: number = 4
  ) {}

  private subdivide(): void {
    const { x, y, w, h } = this.boundary;
    const nwBoundary = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    const neBoundary = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    const swBoundary = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    const seBoundary = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);

    this.nw = new QuadTree(nwBoundary, this.capacity);
    this.ne = new QuadTree(neBoundary, this.capacity);
    this.sw = new QuadTree(swBoundary, this.capacity);
    this.se = new QuadTree(seBoundary, this.capacity);

    this.divided = true;

    // Redistribute existing points (optional, but good for dynamic splitting)
    const pointsToRedistribute = this.points;
    this.points = [];
    pointsToRedistribute.forEach(p => this.insert(p));
  }

  public insert(point: Point2D): boolean {
    if (!this.boundary.contains(point)) return false;

    if (!this.divided) {
      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      }
      this.subdivide();
    }

    return (
      this.nw!.insert(point) ||
      this.ne!.insert(point) ||
      this.sw!.insert(point) ||
      this.se!.insert(point)
    );
  }

  public query(range: Rectangle, found: Point2D[] = []): Point2D[] {
    if (!this.boundary.intersects(range)) return found;

    if (this.divided) {
      this.nw!.query(range, found);
      this.ne!.query(range, found);
      this.sw!.query(range, found);
      this.se!.query(range, found);
    } else {
      for (const p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
    }

    return found;
  }

  public clear(): void {
    this.points = [];
    this.divided = false;
    this.nw = null;
    this.ne = null;
    this.sw = null;
    this.se = null;
  }
}
