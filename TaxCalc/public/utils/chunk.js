function getChunk(text, fund_names) {
    let Splittext = text
    const chunks = [];
    for (const fund of fund_names) {
        let breakPoint = `<fund-card>${fund}</fund-card>`
        let newText = Splittext.split(breakPoint);
        chunks.push(newText[0]);
        Splittext = newText[1];
    }
    return chunks;
}

export default getChunk;