const $ = (id) => document.getElementById(id);
const number = (value, digits = 1) => value === null || value === undefined || value === "" ? "—" : Number(value).toLocaleString("pt-BR", { maximumFractionDigits: digits });
const dateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

function setConnection(ok, message) {
  $("connection-label").textContent = message;
  $("sensor-status").textContent = ok ? "Sensores conectados" : "Sem conexão com os dados";
  $("sensor-dot").style.background = ok ? "#58a878" : "#c77b48";
}
function renderHistory(rows) {
  const body = $("history-body");
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="5" class="empty-state">Nenhum registro encontrado.</td></tr>';
    return;
  }
  body.innerHTML = rows.map(row => {
    const rain = Number(row.chuva) === 1;
    return `<tr>
      <td>${dateTime(row.horario)}</td>
      <td>${number(row.temperatura_ar)} °C</td>
      <td>${number(row.umidade_ar, 0)}%</td>
      <td>${number(row.umidade_solo, 0)}%</td>
      <td><span class="rain-pill ${rain ? "" : "no"}">${rain ? "Detectada" : "Não detectada"}</span></td>
    </tr>`;
  }).join("");
}
async function updateSensors() {
  try {
    const rows = await QuelonSupabase.getLatest(8);
    if (!rows.length) {
      setConnection(true, "Conectado · sem registros");
      renderHistory([]);
      return;
    }
    const latest = rows[0];
    $("temperature").textContent = number(latest.temperatura_ar);
    $("air-humidity").textContent = number(latest.umidade_ar, 0);
    $("soil-humidity").textContent = number(latest.umidade_solo, 0);
    const raining = Number(latest.chuva) === 1;
    $("rain-state").textContent = raining ? "Detectada" : "Não detectada";
    $("rain-description").textContent = raining ? "Sensor identificou presença de água" : "Sem detecção no sensor local";
    $("last-reading").textContent = dateTime(latest.horario);
    setConnection(true, "Supabase conectado");
    renderHistory(rows);
  } catch (error) {
    setConnection(false, "Falha na conexão");
    $("last-reading").textContent = error.message;
    console.error(error);
  }
}
async function updateWeather() {
  try {
    const data = await QuelonWeather.getCurrent();
    $("weather-temperature").textContent = number(data.temperature);
    $("weather-description").textContent = data.description || "Condição não informada";
    $("weather-humidity").textContent = data.humidity == null ? "—" : `${number(data.humidity, 0)}%`;
    $("weather-feels").textContent = data.feels_like == null ? "—" : `${number(data.feels_like)} °C`;
    $("weather-wind").textContent = data.wind_speed == null ? "—" : `${number(data.wind_speed)} m/s`;
    $("weather-updated").textContent = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    $("weather-description").textContent = "Não foi possível consultar o clima agora.";
    console.error(error);
  }
}
$("current-date").textContent = new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
updateSensors();
updateWeather();
setInterval(updateSensors, 30000);
setInterval(updateWeather, 600000);
