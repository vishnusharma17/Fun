/**
 * Custom Elo Rating Algorithm for 1v1 VibeClash Battles
 *
 * @param winnerRating - Current Elo rating of the winner
 * @param loserRating - Current Elo rating of the loser
 * @param kFactor - Sensitivity factor (default = 32)
 * @returns { newWinnerRating, newLoserRating }
 */
export function calculateElo(
  winnerRating: number,
  loserRating: number,
  kFactor: number = 32
): { newWinnerRating: number; newLoserRating: number } {
  // Calculate expected scores using logistic formula
  const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

  // Actual outcomes: winner = 1, loser = 0
  const newWinnerRating = Math.round(winnerRating + kFactor * (1 - expectedWinner));
  const newLoserRating = Math.round(loserRating + kFactor * (0 - expectedLoser));

  return {
    newWinnerRating,
    newLoserRating,
  };
}
