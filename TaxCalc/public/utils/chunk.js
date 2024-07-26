function getChunk(inputText) {
    // const inputText = text.replace(/\n/g, '');
    const fundCardPattern = /<fund-card>(.*?)<\/fund-card>/g;
    
    // Array to hold the split text and fund cards
    let result = [];
    
    // Variable to hold the position of the last match
    let lastIndex = 0;

    // Match all occurrences of the pattern in the input text
    let match;
    while ((match = fundCardPattern.exec(inputText)) !== null) {
        // Add the text before the current match to the result array
        if (match.index > lastIndex) {
            result.push(inputText.substring(lastIndex, match.index));
        }
        // Add the current fund card to the result array
        result.push(`<fund-card>${match[1]}</fund-card>`);
        // Update the last index to the end of the current match
        lastIndex = fundCardPattern.lastIndex;
    }

    // Add any remaining text after the last match to the result array
    if (lastIndex < inputText.length) {
        result.push(inputText.substring(lastIndex));
    }

    // resultArray = result.filter(element => element !== '');
    // console.log(resultArray);
    return result;

}


// getChunk(`กองทุน MEGA10-SSF ชื่อเต็มคือ กองทุนเปิด MEGA 10 ชนิดเพื่อการออม ลงทุนในตราสารทุนของบริษัทต่าง ๆ ที่จดทะเบียนซื้อขายใน NYSE และ NASDAQ ซึ่งเป็นบริษัทที่เน้นความเป็นผู้นำในด้านตราสินค้า (Brand) และมูลค่าตลาด (Market Capitalization) มีความเสี่ยงระดับ 6 - กองทุนรวมตราสารทุน ความสามารถในการทำกำไรในช่วง 3 เดือน 11.25%, 6 เดือน 23.05%, 1 ปี 35.23% ทรัพย์สินสุทธิอยู่ที่ 143,800,321.34 บาท\n\n<fund-card>\nMEGA10-SSF\n</fund-card>\n\nกองทุน SCBFP ชื่อเต็มคือ กองทุนเปิดไทยพาณิชย์ตราสารหนี้ พลัส (ชนิดสะสมมูลค่า) เน้นการลงทุนในตราสารหนี้ที่มีคุณภาพและให้ผลตอบแทนดี ทั้งในประเทศและต่างประเทศ มีความเสี่ยงระดับ 4 - กองทุนรวมตราสารหนี้ ความสามารถในการทำกำไรในช่วง 3 เดือน 1.20%, 6 เดือน 1.44%, 1 ปี 2.55%, 3 ปี 1.12%, 5 ปี 1.45% ทรัพย์สินสุทธิอยู่ที่ 12,165,297,804.18 บาท\n\n<fund-card>\nSCBFP\n</fund-card>`)
export default getChunk;