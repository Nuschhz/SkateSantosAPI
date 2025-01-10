const validateItemStatus = (req, res, next) => {
  const { status } = req.body;

  // Lista de status válidos
  const validStatuses = ["broken", "intact"];

  // Validação do campo status
  if (
    typeof status !== "number" ||
    status < 0 ||
    status >= validStatuses.length
  ) {
    return res.status(400).json({
      message:
        "O status deve ser um número válido (0 para 'broken', 1 para 'intact').",
    });
  }

  req.body.statusMapped = validStatuses[status];

  next(); // Passa para o controlador
};

module.exports = validateItemStatus;
