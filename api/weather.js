export default async function handler(request, response) {
  const { OPENWEATHER_API_KEY, OPENWEATHER_LAT, OPENWEATHER_LON } = process.env;
  if (!OPENWEATHER_API_KEY || !OPENWEATHER_LAT || !OPENWEATHER_LON) {
    return response.status(500).json({ error: "Configure OPENWEATHER_API_KEY, OPENWEATHER_LAT e OPENWEATHER_LON na Vercel." });
  }
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("lat", OPENWEATHER_LAT);
  url.searchParams.set("lon", OPENWEATHER_LON);
  url.searchParams.set("appid", OPENWEATHER_API_KEY);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "pt_br");

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();
    if (!upstream.ok) return response.status(upstream.status).json({ error: data.message || "Erro no OpenWeather." });
    return response.status(200).json({
      temperature: data.main?.temp,
      feels_like: data.main?.feels_like,
      humidity: data.main?.humidity,
      description: data.weather?.[0]?.description,
      wind_speed: data.wind?.speed,
      city: data.name,
      observed_at: data.dt
    });
  } catch {
    return response.status(502).json({ error: "Não foi possível consultar o OpenWeather." });
  }
}
