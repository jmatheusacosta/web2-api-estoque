const { db } = require('../config/firebase');

exports.listarLogsPorData = async (req, res) => {
  const { data } = req.query; // Espera formato YYYY-MM-DD (ex: 2026-03-18)
  
  try {
    let logsRef = db.collection('logs');
    
    if (data) {
      const dataInicio = `${data}T00:00:00.000Z`;
      const dataFim = `${data}T23:59:59.999Z`;
      
      const snapshot = await logsRef
        .where('horario', '>=', dataInicio)
        .where('horario', '<=', dataFim)
        .orderBy('horario', 'asc')
        .get();
        
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json(logs);
    } else {
      const snapshot = await logsRef.orderBy('horario', 'desc').get();
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json(logs);
    }
  } catch (error) {
    if (error.code === 9) {
       // Index error for orderBy
       console.error("Alerta: Necessita criar index no Firestore se for ordenar + filtrar", error.message);
    }
    res.status(500).json({ mensagem: 'Erro ao listar logs', erro: error.message });
  }
};
