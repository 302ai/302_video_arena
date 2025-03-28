import { History } from "@/db/types";

// 为History添加winner属性的扩展接口
interface PkHistory extends History {
  winner?: number;
}

export interface ModelStats {
  modelId: string;
  winRate: number;
  totalScore: number;
  pkCount: number;
}

export interface PKResult {
  modelA: string;
  modelB: string;
  winner: string;
}

export function updateLeaderboard(
  currentStats: ModelStats[],
  newPKResult: PKResult
): ModelStats[] {
  // Convert current stats array to map for easier manipulation
  const statsMap = new Map<string, ModelStats>(
    currentStats.map((stat) => [stat.modelId, { ...stat }])
  );

  // Helper function to initialize new model stats
  const initializeModelStats = (modelId: string): ModelStats => ({
    modelId,
    winRate: 0,
    totalScore: 0,
    pkCount: 0,
  });

  // Update stats for model A
  if (!statsMap.has(newPKResult.modelA)) {
    statsMap.set(newPKResult.modelA, initializeModelStats(newPKResult.modelA));
  }
  const statsA = statsMap.get(newPKResult.modelA)!;
  statsA.pkCount++;
  if (newPKResult.winner === newPKResult.modelA) {
    statsA.totalScore++;
  }

  // Update stats for model B
  if (!statsMap.has(newPKResult.modelB)) {
    statsMap.set(newPKResult.modelB, initializeModelStats(newPKResult.modelB));
  }
  const statsB = statsMap.get(newPKResult.modelB)!;
  statsB.pkCount++;
  if (newPKResult.winner === newPKResult.modelB) {
    statsB.totalScore++;
  }

  // Recalculate win rates
  statsMap.forEach((stats) => {
    stats.winRate = (stats.totalScore / stats.pkCount) * 100;
  });

  // Convert back to array and sort
  return Array.from(statsMap.values()).sort((a, b) => {
    if (a.winRate === b.winRate) {
      return b.totalScore - a.totalScore;
    }
    return b.winRate - a.winRate;
  });
}

export function calculateInitialLeaderboard(
  pkHistory: PkHistory[]
): ModelStats[] {
  const statsMap = new Map<string, ModelStats>();

  // Calculate stats for each PK history entry
  pkHistory.forEach((history) => {
    const modelA = history.videos[0]?.model;
    const modelB = history.videos[1]?.model;
    // Only count if user has voted
    if (!modelA || !modelB || history.winner === undefined) return;

    const winnerModel = history.videos[history.winner]?.model;
    if (!winnerModel) return;

    // Initialize or update model A stats
    if (!statsMap.has(modelA)) {
      statsMap.set(modelA, {
        modelId: modelA,
        winRate: 0,
        totalScore: 0,
        pkCount: 0,
      });
    }
    const statsA = statsMap.get(modelA)!;
    statsA.pkCount++;
    if (winnerModel === modelA) {
      statsA.totalScore++;
    }

    // Initialize or update model B stats
    if (!statsMap.has(modelB)) {
      statsMap.set(modelB, {
        modelId: modelB,
        winRate: 0,
        totalScore: 0,
        pkCount: 0,
      });
    }
    const statsB = statsMap.get(modelB)!;
    statsB.pkCount++;
    if (winnerModel === modelB) {
      statsB.totalScore++;
    }
  });

  // Calculate win rates
  statsMap.forEach((stats) => {
    stats.winRate = (stats.totalScore / stats.pkCount) * 100;
  });

  // Convert to array and sort
  return Array.from(statsMap.values()).sort((a, b) => {
    if (a.winRate === b.winRate) {
      return b.totalScore - a.totalScore;
    }
    return b.winRate - a.winRate;
  });
}
