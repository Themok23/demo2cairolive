export class RatingService {
  static computeAverage(ratings: readonly number[]): string {
    if (ratings.length === 0) return '0.00';
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return (sum / ratings.length).toFixed(2);
  }

  static getRatingDistribution(ratings: readonly number[]): Record<number, number> {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const rating of ratings) {
      if (rating >= 1 && rating <= 5) {
        distribution[rating] = (distribution[rating] ?? 0) + 1;
      }
    }
    return distribution;
  }
}
