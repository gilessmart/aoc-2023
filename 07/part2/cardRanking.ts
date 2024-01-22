const cardRanking = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

export function getCardRank(card: string) {
    const rank = cardRanking.indexOf(card);
    if (rank === -1) throw new Error(`Could not find rank for card '${card}'`);
    return rank;
};
