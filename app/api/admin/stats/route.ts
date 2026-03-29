import { NextResponse } from 'next/server';
import { success, error } from '../../helpers';
import { requireDashboardAuth } from '../adminAuth';
import { getDatabase } from '@/infrastructure/db/client';
import {
  items,
  reviews,
  users,
  categories,
} from '@/infrastructure/db/schema';
import {
  eq,
  desc,
  asc,
  sql,
  and,
  gte,
  lte,
  inArray,
} from 'drizzle-orm';

export async function GET() {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    // Get overview counts
    const [totalItemsResult, totalReviewsResult, totalUsersResult, totalCategoriesResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(items),
      db.select({ count: sql<number>`count(*)` }).from(reviews),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(categories),
    ]);

    const totalItems = Number(totalItemsResult[0]?.count ?? 0);
    const totalReviews = Number(totalReviewsResult[0]?.count ?? 0);
    const totalUsers = Number(totalUsersResult[0]?.count ?? 0);
    const totalCategories = Number(totalCategoriesResult[0]?.count ?? 0);

    // Get pending reviews and active items
    const [pendingReviewsResult, activeItemsResult] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(eq(reviews.status, 'pending')),
      db
        .select({ count: sql<number>`count(*)` })
        .from(items)
        .where(eq(items.isActive, true)),
    ]);

    const pendingReviews = Number(pendingReviewsResult[0]?.count ?? 0);
    const activeItems = Number(activeItemsResult[0]?.count ?? 0);

    // Get trends - this month vs last month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = monthStart;

    const [itemsThisMonthResult, reviewsThisMonthResult, usersThisMonthResult] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(items)
        .where(gte(items.createdAt, monthStart)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(gte(reviews.createdAt, monthStart)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(gte(users.createdAt, monthStart)),
    ]);

    const [itemsLastMonthResult, reviewsLastMonthResult, usersLastMonthResult] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(items)
        .where(and(gte(items.createdAt, lastMonthStart), lte(items.createdAt, lastMonthEnd))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(and(gte(reviews.createdAt, lastMonthStart), lte(reviews.createdAt, lastMonthEnd))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(and(gte(users.createdAt, lastMonthStart), lte(users.createdAt, lastMonthEnd))),
    ]);

    const trends = {
      itemsThisMonth: Number(itemsThisMonthResult[0]?.count ?? 0),
      reviewsThisMonth: Number(reviewsThisMonthResult[0]?.count ?? 0),
      usersThisMonth: Number(usersThisMonthResult[0]?.count ?? 0),
      itemsLastMonth: Number(itemsLastMonthResult[0]?.count ?? 0),
      reviewsLastMonth: Number(reviewsLastMonthResult[0]?.count ?? 0),
      usersLastMonth: Number(usersLastMonthResult[0]?.count ?? 0),
    };

    // Get top categories with item count and average rating
    const topCategoriesData = await db
      .select({
        name: categories.name,
        itemCount: sql<number>`count(${items.id})`,
        avgRating: sql<string>`avg(${items.avgRating})`,
      })
      .from(categories)
      .leftJoin(items, eq(items.categoryId, categories.id))
      .groupBy(categories.id, categories.name)
      .orderBy(desc(sql<number>`count(${items.id})`))
      .limit(5);

    const topCategories = topCategoriesData.map((cat: any) => ({
      name: cat.name,
      itemCount: Number(cat.itemCount ?? 0),
      avgRating: parseFloat(cat.avgRating ?? '0'),
    }));

    // Get rating distribution
    const ratingDistributionData = await db
      .select({
        stars: reviews.rating,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(eq(reviews.status, 'approved'))
      .groupBy(reviews.rating)
      .orderBy(asc(reviews.rating));

    const ratingDistribution = ratingDistributionData.map((dist: any) => ({
      stars: dist.stars,
      count: Number(dist.count ?? 0),
    }));

    // Get reviews by day for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const reviewsByDayData = await db
      .select({
        date: sql<string>`DATE(${reviews.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(gte(reviews.createdAt, thirtyDaysAgo))
      .groupBy(sql<string>`DATE(${reviews.createdAt})`)
      .orderBy(asc(sql<string>`DATE(${reviews.createdAt})`));

    const reviewsByDay = reviewsByDayData.map((day: any) => ({
      date: day.date,
      count: Number(day.count ?? 0),
    }));

    // Get items by category
    const itemsByCategoryData = await db
      .select({
        category: categories.name,
        count: sql<number>`count(${items.id})`,
      })
      .from(categories)
      .leftJoin(items, eq(items.categoryId, categories.id))
      .groupBy(categories.id, categories.name)
      .orderBy(desc(sql<number>`count(${items.id})`));

    const itemsByCategory = itemsByCategoryData.map((cat: any) => ({
      category: cat.category,
      count: Number(cat.count ?? 0),
    }));

    // Get top rated items
    const topRatedItemsData = await db
      .select({
        name: items.name,
        avgRating: items.avgRating,
        totalReviews: items.totalReviews,
      })
      .from(items)
      .where(eq(items.isActive, true))
      .orderBy(desc(items.avgRating))
      .limit(10);

    const topRatedItems = topRatedItemsData.map((item: any) => ({
      name: item.name,
      avgRating: parseFloat(item.avgRating ?? '0'),
      totalReviews: item.totalReviews ?? 0,
    }));

    // Get recent activity with JOINs to avoid N+1 queries
    const recentActivityData = await db
      .select({
        type: sql<string>`'review'`,
        itemName: items.name,
        userName: users.name,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .innerJoin(items, eq(reviews.itemId, items.id))
      .innerJoin(users, eq(reviews.userId, users.id))
      .orderBy(desc(reviews.createdAt))
      .limit(20);

    const recentActivity = recentActivityData.map((activity: any) => ({
      type: 'review',
      description: `${activity.userName || 'Unknown'} reviewed ${activity.itemName || 'Unknown'}`,
      timestamp: activity.createdAt,
    }));

    return success({
      overview: {
        totalItems,
        totalReviews,
        totalUsers,
        totalCategories,
        pendingReviews,
        activeItems,
      },
      trends,
      topCategories,
      ratingDistribution,
      reviewsByDay,
      itemsByCategory,
      topRatedItems,
      recentActivity,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[GET /api/admin/stats] Error:', errorMsg, err);
    return error('Internal server error', 500);
  }
}
