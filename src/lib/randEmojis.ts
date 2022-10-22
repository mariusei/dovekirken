

const emojis = [
    '😍','😋','😐',
    '🤩','😊','😀',
    '😅','😴','😛',
    '🤯','😨','🤠',
    '🥳']

export function getRandomEmojis(count: number) {
    
    let subset = [...emojis].sort(() => 0.5 - Math.random())
    // return 3 emojis to choose from
    subset = subset.slice(0,Math.ceil(count))

    return subset
}

export function getRandomEmojisAndReplaceOne(count: number, chosenEmoji: string) {

    // randomize
    let subset = [...emojis].sort(() => 0.5 - Math.random())
    // remove correct emoji to prevent duplicates
    if (subset.indexOf(chosenEmoji) > -1) {
        subset.splice(subset.indexOf(chosenEmoji), 1)
    }
    // return 3 emojis to choose from
    subset = subset.slice(0,Math.ceil(count))

    // index that we want user to verify
    const ix = Math.floor(Math.random()*3)
    subset[ix] = chosenEmoji

    return subset

}