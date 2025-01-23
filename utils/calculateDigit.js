const calculateDigit = (cpf, factor) => {
  let total = 0;
  for (let i = 0; i < factor - 1; i++) {
    total += parseInt(cpf[i], 10) * (factor - i);
  }
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

module.exports = calculateDigit;
