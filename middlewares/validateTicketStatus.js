const validateTicketStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ["open", "done"]; // Valores válidos para o status

  // Verifica se o status é fornecido e do tipo "number"
  if (
    typeof status !== "number" ||
    status < 0 ||
    status >= validStatuses.length
  ) {
    return res.status(400).json({
      message:
        "O status deve ser um número válido (0 para 'open', 1 para 'done').",
    });
  }

  // Adiciona o status mapeado no objeto da requisição para uso no controlador
  req.body.statusMapped = validStatuses[status];

  next(); // Passa para o próximo middleware ou controlador
};

module.exports = validateTicketStatus;
