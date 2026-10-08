import { NextResponse } from "next/server";
import { readDB, writeDB } from "../../db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nodeId, earnedXp, nextNodeId } = body;

    const state = readDB();

    
    if (earnedXp) {
      state.totalXP += earnedXp;
    }

    
    if (!state.completed_nodes.includes(nodeId)) {
      state.streak += 1; 
    }

    
    if (nodeId && !state.completed_nodes.includes(nodeId)) {
      state.completed_nodes.push(nodeId);
    }
    
    
    if (nextNodeId && !state.unlocked_nodes.includes(nextNodeId)) {
      state.unlocked_nodes.push(nextNodeId);
    }
    
    writeDB(state);

    return NextResponse.json(state);
  } catch (error) {
    console.error("Error in complete-node:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
