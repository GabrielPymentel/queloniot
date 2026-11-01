window.QuelonSupabase = (() => {
  const config = window.QUELONIOT_CONFIG || {};
  const ready = config.SUPABASE_URL?.startsWith("https://") &&
    !config.SUPABASE_URL.includes("SEU-PROJETO") &&
    config.SUPABASE_ANON_KEY && !config.SUPABASE_ANON_KEY.includes("SUA_CHAVE");

  async function getLatest(limit = 8) {
    if (!ready) throw new Error("Configure SUPABASE_URL e SUPABASE_ANON_KEY em js/config.js.");
    const url = new URL("/rest/v1/dados", config.SUPABASE_URL);
    url.searchParams.set("select", "id,temperatura_ar,umidade_ar,umidade_solo,chuva,horario");
    url.searchParams.set("order", "horario.desc");
    url.searchParams.set("limit", String(limit));
    const response = await fetch(url, {
      headers: { apikey: config.SUPABASE_ANON_KEY, Authorization: `Bearer ${config.SUPABASE_ANON_KEY}` }
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Supabase (${response.status}): ${detail.slice(0, 180)}`);
    }
    return response.json();
  }
  return { getLatest, isConfigured: () => ready };
})();
