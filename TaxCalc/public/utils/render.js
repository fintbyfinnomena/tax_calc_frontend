async function Render(fund_name) {
  const url = 'https://nest-langchain-tax-ai-mk27cugt3a-as.a.run.app/api/v1/fund/fund-info/' + fund_name;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    const data = json.data;
    console.log(data);
    const Holdings = []
    data.topHoldings.elements.forEach(element => {
      Holdings.push({
        Name: element.name,
        ShortCode: element.short_code,
        Weight: element.percent,
      })
    });
    const FundData = {
      ShortCode: data.info.shortCode,
      FundName: data.info.nameTh,
      RiskLevel: data.info.riskSpectrum,
      Link: data.info.fundFactSheetUrl,
      FeeFrontEnd: data.fee.frontEnd,
      FeeBackEnd: data.fee.backEnd,
      FeeManagement: data.fee.management,
      Performance: [
        data.performance.return3m,
        data.performance.return6m,
        data.performance.return1y,
        data.performance.return5y
      ],
      TopHoldings: Holdings
    }

    let TableTemplate = '';

    FundData.TopHoldings.forEach(element => {
      TableTemplate += `<tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${element.Name}
            </th>
            <td class="px-6 py-4">
                ${element.ShortCode}
            </td>
            <td class="px-6 py-4">
                ${element.Weight}
            </td>
        </tr>`
    });

    let performance = ``;
    let timeArray = ["3m","6m","1y","5y"]
    FundData.Performance.forEach(function (element, i) {
      if (element > 0) {
        performance += `<div class="p-2 mr-2 lg:mr-5 md:mr-5 mb-3 bg-primary-green w-full md:w-1/4">
          <h3>${timeArray[i]} return</h3>
          <p class="md:text-2xl font-bold">${element}%</p>
        </div>`
      } else if (element == null) {
        performance += `<div class="p-2 mr-5 bg-primary-grey mb-3 w-full md:w-1/4">
          <h3>${timeArray[i]} return</h3>
          <p class="md:text-2xl font-bold">-%</p>
        </div>`
      } else {
        performance += `<div class="p-2 mr-5 bg-primary-red w-1/4">
          <h3>${timeArray[i]} return</h3>
          <p class="md:text-2xl font-bold">${element}%</p>
        </div>`
      }
    });


    const template = `
          <div class="mx-auto p-10 border border-gray-300 bg-white w-full lg:w-2/3 md:w-4/5 rounded-lg">
        <div>
            <h2 class="text-3xl font-extrabold">${FundData.ShortCode}</h2>
            <br>
            <h3 class="text-2xl font-bold">${FundData.FundName}</h3>
            <br>
            <p><b>ความเสี่ยง: </b>${FundData.RiskLevel}</p>
            <p><b>ค่าธรรมเนียม:</b></p>
                <p>ค่าธรรมเนียมเมื่อนักลงทุนซื้อหน่วยลงทุน ${FundData.FeeFrontEnd}%</p>
                <p>ค่าธรรมเนียมการรับซื้อคืนหน่วยลงทุน ${FundData.FeeBackEnd}%</p>
                <p>ค่าธรรมเนียมการจัดการ ${FundData.FeeManagement}%</p>
        </div>
        <div class="h-12 my-5 text-center">
            <a href="${FundData.Link}" class="bg-black p-2 text-white block w-full lg:w-1/4">Fund Fact Sheet</a>
        </div>
        <div class="md:flex">`
      + performance +
      `</div>
        <br>
        <h3 class="text-2xl font-bold">Top Holdings</h3>
        <br>
        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Asset
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Short Code
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Allocation
                        </th>
                    </tr>
                </thead>
                <tbody>` + TableTemplate +
      `</tbody>
            </table>
        </div>

    </div>`
    return template;
  } catch (error) {
    console.error(error.message);
  }
}

export default Render;