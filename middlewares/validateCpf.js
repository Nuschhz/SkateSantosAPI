const calculateDigit = require("../utils/calculateDigit");

const validateCPF = (req, res, next) => {
  const { cpf } = req.body;

  // Remove caracteres não numéricos do CPF
  const cleanedCPF = cpf.replace(/[^\d]/g, "");

  // Verifica se o CPF tem 11 dígitos
  if (cleanedCPF.length !== 11) {
    return res
      .status(400)
      .json({ message: "CPF inválido. Deve conter 11 dígitos." });
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanedCPF)) {
    return res.status(400).json({
      message: "CPF inválido. Não pode conter todos os dígitos iguais.",
    });
  }

  // Calcula os dois dígitos verificadores
  const digit1 = calculateDigit(cleanedCPF, 10);
  const digit2 = calculateDigit(cleanedCPF, 11);

  // Verifica se os dígitos calculados coincidem com os fornecidos
  if (
    parseInt(cleanedCPF[9], 10) !== digit1 ||
    parseInt(cleanedCPF[10], 10) !== digit2
  ) {
    return res.status(400).json({ message: "CPF inválido." });
  }

  next();
};

module.exports = validateCPF;
