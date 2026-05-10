import { NextResponse } from "next/server";
import { listWaitlistEntries } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const entries = await listWaitlistEntries();

    // Create CSV header
    const headers = ["ID", "Name", "Email", "Joined"];
    
    // Create CSV rows
    const rows = entries.map((entry) => [
      entry.id.toString(),
      `"${entry.name.replace(/"/g, '""')}"`, // Escape quotes
      `"${entry.email.replace(/"/g, '""')}"`, // Escape quotes
      new Date(entry.createdAt).toISOString(),
    ]);

    // Combine headers and rows
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("/api/waitlist/export GET failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to export waitlist entries.",
      },
      { status: 500 }
    );
  }
}
