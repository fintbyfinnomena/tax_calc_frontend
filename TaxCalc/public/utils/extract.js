function Extract(respond) {
    const regex = /<fund-card>[\s\S]*?<\/fund-card>/g;
    const fund_name = respond.match(regex);
    const extracted_fund_names = fund_name.map(tag => tag.replace(/<\/?fund-card>/g, ''));
    return extracted_fund_names;
}

export default Extract;