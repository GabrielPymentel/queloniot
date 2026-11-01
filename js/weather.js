window.QuelonWeather = (() => {
  async function getCurrent() {
    // A chave do OpenWeather fica no servidor (Vercel), nunca no navegador.
    const response = await fetch("/api/weather");
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenWeather (${response.status}): ${detail.slice(0, 180)}`);
    }
    return response.json();
  }
  return { getCurrent };
})();
