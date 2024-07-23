function splitByTagsAndGroup(str) {
    const tagRegex = /(<\/?[^>]+>)/g;
    const parts = str.split(tagRegex).filter(part => part.trim() !== "");
    const result = [];

    let buffer = '';
    let insideTag = false;

    for (const part of parts) {
        if (part.startsWith('<') && !insideTag) {
            if (buffer.trim()) {
                result.push(buffer.trim());
            }
            buffer = part;
            insideTag = true;
        } else if (insideTag) {
            buffer += part;
            if (part.endsWith('>')) {
                result.push(buffer.trim());
                buffer = '';
                insideTag = false;
            }
        } else {
            buffer += part;
        }
    }

    if (buffer.trim()) {
        result.push(buffer.trim());
    }

    return result;
}


console.log(splitByTagsAndGroup("Hello <fund-card>World</fund-card><a>GG</a>! This is my name, <a>Hello</a>")); 