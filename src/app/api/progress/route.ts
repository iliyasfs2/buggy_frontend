import { NextResponse } from "next/server";
import { readDB } from "../db";

export async function GET() {
  const data = readDB();
  return NextResponse.json(data);
}
