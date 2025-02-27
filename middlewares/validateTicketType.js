const validateTicketType = (req, res, next) => {
  const { type } = req.body;
  const validTypes = ["strike", "skate", "station"]; // Valores válidos para o status

  // Verifica se o status é fornecido e do tipo "number"
  if (typeof type !== "number" || type < 0 || type >= validTypes.length) {
    return res.status(400).json({
      message:
        "O status deve ser um número válido (0 para 'strike', 1 para 'skate' e 2 para 'station').",
    });
  }

  // Adiciona o status mapeado no objeto da requisição para uso no controlador
  req.body.typeMapped = validTypes[type];

  next(); // Passa para o próximo middleware ou controlador
};

module.exports = validateTicketType;
