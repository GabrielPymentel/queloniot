# QuelônIoT

Dashboard científico minimalista para monitoramento ambiental de uma chocadeira de quelônios.

## Tecnologias
- HTML, CSS e JavaScript puro
- Supabase REST API para leituras locais
- OpenWeather Current Weather API via Vercel Function

## 1. Configurar Supabase
Edite `js/config.js`:
- `SUPABASE_URL`: URL do projeto Supabase
- `SUPABASE_ANON_KEY`: chave pública `sb_publishable` ou `anon` legada

Não use a chave `service_role` no frontend.

Na tabela `dados`, habilite RLS e crie uma política de SELECT para `anon` caso os dados devam ser públicos. Não habilite INSERT/UPDATE/DELETE para o público.

## 2. Configurar OpenWeather na Vercel
Em Project Settings → Environment Variables, adicione:
- `OPENWEATHER_API_KEY`: sua chave do OpenWeather
- `OPENWEATHER_LAT`: `-2.680990`
- `OPENWEATHER_LON`: `-56.777107`

A chave não deve ser colocada no JavaScript do navegador.

## 3. Executar localmente
Como o projeto usa uma função `/api/weather`, rode com a CLI da Vercel:
```bash
npm i -g vercel
vercel dev
```
Abra o endereço local informado pela CLI.

Abrir `index.html` diretamente pode permitir testar o layout, mas a consulta `/api/weather` não funcionará fora de um servidor que execute a função.

## 4. Publicar
1. Envie os arquivos para um repositório GitHub.
2. Importe o repositório na Vercel.
3. Configure as três variáveis de ambiente do OpenWeather.
4. Configure `js/config.js` com as credenciais públicas do Supabase.
5. Faça deploy.

## Notas
- O dashboard consulta o Supabase a cada 30 segundos.
- O OpenWeather é consultado a cada 10 minutos.
- A tabela esperada é `dados`, com `id`, `temperatura_ar`, `umidade_ar`, `umidade_solo`, `chuva` e `horario`.
- O campo `chuva` é interpretado como `1 = detectada` e `0 = não detectada`. Ajuste essa regra em `js/dashboard.js` se seu ESP32 enviar outro padrão.
- Os valores de umidade do solo são exibidos conforme gravados no banco; confirme se já estão normalizados em porcentagem.
