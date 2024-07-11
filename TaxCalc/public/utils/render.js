async function Render(fund_name) {
    const url = 'http://localhost:8080/api/v1/fund/fund-info/' + fund_name;
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json().data;

        
      } catch (error) {
        console.error(error.message);
      }
}