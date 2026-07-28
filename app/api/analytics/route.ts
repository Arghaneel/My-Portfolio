import { NextResponse } from "next/server";

export async function GET() {
  // Return simulated dashboard analytics data
  return NextResponse.json({
    pageViews: 1420,
    uniqueVisitors: 642,
    avgSessionDuration: "2m 14s",
    bounceRate: "42.5%",
    deviceBreakdown: {
      desktop: "62%",
      mobile: "33%",
      tablet: "5%",
    },
    topPages: [
      { path: "/", views: 580 },
      { path: "/projects", views: 340 },
      { path: "/dashboard", views: 270 },
      { path: "/about", views: 130 },
      { path: "/experience", views: 100 },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path } = body;
    
    // Simulate logging the page view
    console.log(`[Analytics Page View] Path: ${path} at ${new Date().toISOString()}`);
    
    return NextResponse.json({ success: true, loggedPath: path });
  } catch (error) {
    console.error("Analytics API POST error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
