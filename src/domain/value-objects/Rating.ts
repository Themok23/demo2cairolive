export class Rating {
  private constructor(public readonly value: number) {}

  static create(value: number): Rating {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }
    return new Rating(value);
  }

  static fromAverage(sum: number, count: number): string {
    if (count === 0) return '0.00';
    return (sum / count).toFixed(2);
  }
}
