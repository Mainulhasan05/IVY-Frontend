export async function POST(req) {
    const { amount, from, to } = await req.json();
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Error in Frankfurter API: ${res.statusText}`);
      }
      const data = await res.json();
      return new Response(JSON.stringify({ result: data.rates[to] }), { status: 200 });
    } catch (error) {
      console.error('Error converting currency:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }