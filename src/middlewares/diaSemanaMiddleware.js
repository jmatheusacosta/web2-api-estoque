module.exports = (req, res, next) => {
  const dataAtual = new Date();
  const diaSemana = dataAtual.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  if (diaSemana === 0 || diaSemana === 6) {
    return res.status(403).json({ 
      mensagem: "Acesso negado. A API está disponível apenas de segunda à sexta-feira." 
    });
  }

  next();
};
