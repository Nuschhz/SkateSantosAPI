const calculatePrice = (startDate, endDate) => {
  // Converte as datas para objetos Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calcula a diferença em milissegundos e converte para minutos
  const minutes = Math.floor((end - start) / 60000);

  let price = 5; // Preço inicial
  if (minutes > 10) {
    price += (minutes - 10) * 0.5;
  }

  return price;
};

module.exports = calculatePrice;
