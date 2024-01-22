const handTypeRanking = ['HighCard', 'OnePair', 'TwoPair', 'ThreeOfAKind', 'FullHouse', 'FourOfAKind', 'FiveOfAKind'];

export function getHandTypeRank(handType: string) {
    const rank = handTypeRanking.indexOf(handType);
    if (rank === -1) throw new Error(`Could not find rank for hand type '${handType}'`);
    return rank;
};
