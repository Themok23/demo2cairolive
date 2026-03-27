import { NextRequest, NextResponse } from 'next/server';
import { error, requireAdmin } from '../../helpers';
import { getDatabase } from '@/infrastructure/db/client';
import {
  items,
  reviews,
  users,
  categories,
  items as itemsTable,
} from '@/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';

function convertToCSV(data: any[]): string {
  if (data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.map((h) => `"${h}"`).join(',');

  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header];
        if (value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const db = getDatabase();

    const searchParams = request.nextUrl.searchParams;
    const exportType = searchParams.get('type') || 'items';
    const format = searchParams.get('format') || 'csv';

    if (format !== 'csv') {
      return NextResponse.json(
        { success: false, data: null, error: 'Only CSV format is supported' },
        { status: 400 }
      );
    }

    let data: any[] = [];
    let filename = '';

    switch (exportType) {
      case 'items':
        {
          const itemsData = await db
            .select({
              id: items.id,
              name: items.name,
              nameAr: items.nameAr,
              slug: items.slug,
              description: items.description,
              category: categories.name,
              governorate: items.governorate,
              area: items.area,
              isVerified: items.isVerified,
              isFeatured: items.isFeatured,
              isActive: items.isActive,
              avgRating: items.avgRating,
              totalReviews: items.totalReviews,
              createdAt: items.createdAt,
              updatedAt: items.updatedAt,
            })
            .from(items)
            .leftJoin(categories, eq(items.categoryId, categories.id))
            .orderBy(desc(items.createdAt));

          data = itemsData;
          filename = 'cairo-live-items.csv';
        }
        break;

      case 'reviews':
        {
          const reviewsData = await db
            .select({
              id: reviews.id,
              itemName: itemsTable.name,
              userName: users.name,
              rating: reviews.rating,
              title: reviews.title,
              status: reviews.status,
              createdAt: reviews.createdAt,
            })
            .from(reviews)
            .leftJoin(itemsTable, eq(reviews.itemId, itemsTable.id))
            .leftJoin(users, eq(reviews.userId, users.id))
            .orderBy(desc(reviews.createdAt));

          data = reviewsData;
          filename = 'cairo-live-reviews.csv';
        }
        break;

      case 'users':
        {
          const usersData = await db
            .select({
              id: users.id,
              name: users.name,
              email: users.email,
              role: users.role,
              reviewCount: users.reviewCount,
              createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(desc(users.createdAt));

          data = usersData;
          filename = 'cairo-live-users.csv';
        }
        break;

      default:
        return NextResponse.json(
          { success: false, data: null, error: 'Invalid export type. Must be items, reviews, or users' },
          { status: 400 }
        );
    }

    const csv = convertToCSV(data);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}
