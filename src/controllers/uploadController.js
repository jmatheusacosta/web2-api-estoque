const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/b2');

exports.uploadImagem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensagem: 'Nenhuma imagem foi enviada.' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const bucketName = process.env.B2_BUCKET_NAME;

    // Gerando um nome único para evitar sobreposição
    const filename = `${Date.now()}-${originalname.replace(/\s+/g, '_')}`;

    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Link público padrão do S3 API / B2 API
    const publicUrl = `${process.env.B2_ENDPOINT}/${bucketName}/${filename}`;

    return res.status(201).json({
      mensagem: 'Upload realizado com sucesso!',
      url: publicUrl,
      filename: filename
    });

  } catch (error) {
    console.error('Erro no upload para o Backblaze:', error);
    res.status(500).json({ mensagem: 'Erro interno ao realizar upload.', erro: error.message });
  }
};
