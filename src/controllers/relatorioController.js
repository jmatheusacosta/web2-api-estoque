const PDFDocument = require('pdfkit');
const { db } = require('../config/firebase');

exports.gerarRelatorioPDF = async (req, res) => {
  try {
    const snapshot = await db.collection('estoque').get();
    const estoque = snapshot.docs.map(doc => doc.data());

    const doc = new PDFDocument();
    const filename = `relatorio-estoque-${Date.now()}.pdf`;

    // Configura os headers para download
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Título do PDF
    doc.fontSize(20).text('Relatório de Estoque - Loja de Tecnologia', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'right' });
    doc.moveDown();

    // Tabela/Lista de Itens
    doc.fontSize(14).text('Itens em Estoque:', { underline: true });
    doc.moveDown(0.5);

    estoque.forEach(item => {
      doc.fontSize(12).text(`- [${item.codigo}] ${item.nome}`);
      doc.fontSize(10).text(`  Preço: R$ ${item.preco.toFixed(2)} | Qtd: ${item.quantidade}`, { indent: 20 });
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao gerar relatório', erro: error.message });
  }
};
