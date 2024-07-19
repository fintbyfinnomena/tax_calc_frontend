function extractFundName(text) {
    const fundNameMatch = text.match(/<fund-card>\s*(.*?)\s*<\/fund-card>/);
    return fundNameMatch ? fundNameMatch[1].trim() : null;
}

export default extractFundName;