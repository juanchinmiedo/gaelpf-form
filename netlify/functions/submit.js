exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (_) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, msg: 'JSON inválido' }) };
  }

  // Token y URL vienen de las variables de entorno de Netlify — nunca del HTML
  data.token = process.env.TOKEN_FORM;
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  try {
    await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, msg: 'Error de conexión' })
    };
  }
};
