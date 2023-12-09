export function sum(nums: Iterable<number>): number {
    let result: number = 0;
    for (const num of nums)
        result += num;
    return result;
}
