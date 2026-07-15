import { Router } from "express";
import { db } from "@db";
import {
  users,
  newsletters,
  contacts,
  programApplications,
  summitRegistrations,
  studentLeads,
  events,
  pageVisits,
} from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/api/analytics", async (req, res) => {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;
  const validKey = process.env.ANALYTICS_API_KEY;

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: "Unauthorized: invalid or missing API key" });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalMembers] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [activeMembers] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.membershipStatus, "Active"));
    const [pendingMembers] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.membershipStatus, "Pending"));
    const [freeMembers] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.membershipType, "Free"));
    const [studentMembers] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.membershipType, "Student"));
    const [fullMembers] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.membershipType, "Full"));
    const [institutionMembers] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(eq(users.membershipType, "Institution"));
    const [newMembersLast30] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(sql`created_at >= ${thirtyDaysAgo}`);
    const [newMembersLast7] = await db.select({ count: sql<number>`count(*)::int` }).from(users).where(sql`created_at >= ${sevenDaysAgo}`);

    const [totalNewsletters] = await db.select({ count: sql<number>`count(*)::int` }).from(newsletters);
    const [newslettersLast30] = await db.select({ count: sql<number>`count(*)::int` }).from(newsletters).where(sql`created_at >= ${thirtyDaysAgo}`);

    const [totalContacts] = await db.select({ count: sql<number>`count(*)::int` }).from(contacts);
    const [contactsLast30] = await db.select({ count: sql<number>`count(*)::int` }).from(contacts).where(sql`created_at >= ${thirtyDaysAgo}`);

    const [totalApplications] = await db.select({ count: sql<number>`count(*)::int` }).from(programApplications);
    const [pendingApplications] = await db.select({ count: sql<number>`count(*)::int` }).from(programApplications).where(eq(programApplications.status, "pending"));
    const [acceptedApplications] = await db.select({ count: sql<number>`count(*)::int` }).from(programApplications).where(eq(programApplications.status, "accepted"));
    const [rejectedApplications] = await db.select({ count: sql<number>`count(*)::int` }).from(programApplications).where(eq(programApplications.status, "rejected"));
    const [applicationsLast30] = await db.select({ count: sql<number>`count(*)::int` }).from(programApplications).where(sql`created_at >= ${thirtyDaysAgo}`);

    const [totalSummitRegs] = await db.select({ count: sql<number>`count(*)::int` }).from(summitRegistrations);
    const [summitRegsLast30] = await db.select({ count: sql<number>`count(*)::int` }).from(summitRegistrations).where(sql`created_at >= ${thirtyDaysAgo}`);

    const [totalStudentLeads] = await db.select({ count: sql<number>`count(*)::int` }).from(studentLeads);
    const [leadsLast30] = await db.select({ count: sql<number>`count(*)::int` }).from(studentLeads).where(sql`created_at >= ${thirtyDaysAgo}`);

    const [totalEvents] = await db.select({ count: sql<number>`count(*)::int` }).from(events);
    const [upcomingEvents] = await db.select({ count: sql<number>`count(*)::int` }).from(events).where(eq(events.status, "Upcoming"));

    // Traffic / page visits
    const [totalHits] = await db.select({ count: sql<number>`count(*)::int` }).from(pageVisits);
    const [hitsLast24h] = await db.select({ count: sql<number>`count(*)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '24 hours'`);
    const [hitsLast7d] = await db.select({ count: sql<number>`count(*)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '7 days'`);
    const [hitsLast30d] = await db.select({ count: sql<number>`count(*)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '30 days'`);

    const [uniqueIpsTotal] = await db.select({ count: sql<number>`count(distinct ip)::int` }).from(pageVisits);
    const [uniqueIpsLast7d] = await db.select({ count: sql<number>`count(distinct ip)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '7 days'`);
    const [uniqueIpsLast30d] = await db.select({ count: sql<number>`count(distinct ip)::int` }).from(pageVisits).where(sql`visited_at >= now() - interval '30 days'`);

    const topPages = await db.select({
      path: pageVisits.path,
      hits: sql<number>`count(*)::int`,
    }).from(pageVisits)
      .where(sql`visited_at >= now() - interval '30 days'`)
      .groupBy(pageVisits.path)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    const recentMembers = await db.select({
      name: users.name,
      email: users.email,
      membershipType: users.membershipType,
      membershipStatus: users.membershipStatus,
      country: users.country,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.createdAt)).limit(10);

    const recentApplicationsList = await db.select({
      referenceNumber: programApplications.referenceNumber,
      firstName: programApplications.firstName,
      lastName: programApplications.lastName,
      email: programApplications.email,
      trainingType: programApplications.trainingType,
      status: programApplications.status,
      createdAt: programApplications.createdAt,
    }).from(programApplications).orderBy(desc(programApplications.createdAt)).limit(10);

    res.json({
      generatedAt: now.toISOString(),
      members: {
        total: totalMembers?.count || 0,
        active: activeMembers?.count || 0,
        pending: pendingMembers?.count || 0,
        byType: {
          free: freeMembers?.count || 0,
          student: studentMembers?.count || 0,
          full: fullMembers?.count || 0,
          institution: institutionMembers?.count || 0,
        },
        newLast7Days: newMembersLast7?.count || 0,
        newLast30Days: newMembersLast30?.count || 0,
        recent: recentMembers,
      },
      newsletter: {
        totalSubscribers: totalNewsletters?.count || 0,
        newLast30Days: newslettersLast30?.count || 0,
      },
      contacts: {
        total: totalContacts?.count || 0,
        last30Days: contactsLast30?.count || 0,
      },
      programApplications: {
        total: totalApplications?.count || 0,
        pending: pendingApplications?.count || 0,
        accepted: acceptedApplications?.count || 0,
        rejected: rejectedApplications?.count || 0,
        last30Days: applicationsLast30?.count || 0,
        recent: recentApplicationsList,
      },
      summitRegistrations: {
        total: totalSummitRegs?.count || 0,
        last30Days: summitRegsLast30?.count || 0,
      },
      studentLeads: {
        total: totalStudentLeads?.count || 0,
        last30Days: leadsLast30?.count || 0,
      },
      events: {
        total: totalEvents?.count || 0,
        upcoming: upcomingEvents?.count || 0,
      },
      traffic: {
        totalHits: totalHits?.count || 0,
        hitsLast24Hours: hitsLast24h?.count || 0,
        hitsLast7Days: hitsLast7d?.count || 0,
        hitsLast30Days: hitsLast30d?.count || 0,
        uniqueVisitorsAllTime: uniqueIpsTotal?.count || 0,
        uniqueVisitorsLast7Days: uniqueIpsLast7d?.count || 0,
        uniqueVisitorsLast30Days: uniqueIpsLast30d?.count || 0,
        topPageslast30Days: topPages,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
