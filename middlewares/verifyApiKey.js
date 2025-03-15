function verifyApiKey(req, res, next) {
  const clientKey = req.headers["x-api-key"];

  const serverKey = process.env.API_KEY;

  if (!clientKey) {
    return res.status(403).json({ error: "Falta API Key" });
  }

  if (clientKey !== serverKey) {
    return res.status(401).json({ error: "API Key inválida" });
  }

  next();
}

module.exports = verifyApiKey;
