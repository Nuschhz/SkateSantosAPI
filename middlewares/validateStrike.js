const validateStrike = (req, res, next) => {
  const { strikes } = req.body;

  const validStatuses = ["banned", "standard", "great"];

  // Validação do campo strikes
  if (
    typeof strikes !== "number" || // Verifica se é um número
    strikes < 0 || // Deve ser maior ou igual a 0
    strikes >= validStatuses.length // Não pode exceder o índice dos statuses válidos
  ) {
    return res.status(400).json({
      message:
        "O strikes deve ser um número válido (0 para 'banned', 1 para 'standard', e 2 para 'great').",
    });
  }

  // Mapeia o número para o status correspondente
  req.body.strikesMapped = validStatuses[strikes];

  next(); // Passa para o próximo middleware ou controlador
};

module.exports = validateStrike;
