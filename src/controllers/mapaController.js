exports.calcularDistancia = (req, res) => {
  const { pontoA, pontoB } = req.body;

  if (!pontoA || !pontoB || pontoA.lat === undefined || pontoA.lon === undefined || pontoB.lat === undefined || pontoB.lon === undefined) {
    return res.status(400).json({ mensagem: 'Formato inválido. Envie pontoA e pontoB contendo lat e lon numéricos.' });
  }

  // Função auxiliar para converter graus em radianos
  const toRad = (valor) => (valor * Math.PI) / 180;

  const lat1 = pontoA.lat;
  const lon1 = pontoA.lon;
  const lat2 = pontoB.lat;
  const lon2 = pontoB.lon;

  const R = 6371; // Raio volumétrico médio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;

  return res.json({
    mensagem: 'Cálculo realizado com sucesso',
    distanciaKm: parseFloat(distancia.toFixed(2)),
    pontos: { pontoA, pontoB }
  });
};
