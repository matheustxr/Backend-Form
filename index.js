const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

async function enviarEmailBackend(
  nome,
  email,
  telefone,
  mensagem,
  propostaFile,
  propostaName
) {
  try{
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: ""
      },
    });

    let info = await transporter.sendMail({
      from: "",
      to: "",
      subject: "Quero Ser Um Revendedor Zoomies",
      html: `<p>Nome: ${nome}</p>
               <p>Telefone: ${telefone}</p>
               <p>E-mail: ${email}</p>
               <p>Mensagem: ${mensagem}</p>`,
               attachments: [{
                filename: propostaName,
                content: propostaFile.buffer
               }]
    })
    console.log("email send: %s", info.messageId)
  } catch(err) {
    console.error(err)
  }
}


app.post('/send', upload.single('propostaFile'), async (req,res) => {
  const {nome, email, telefone, mensagem, propostaName} = req.body;
  const propostaFile = req.file;


  try{
    if(!propostaFile){
      throw new Error("file not found");
    }

    await enviarEmailBackend(
      nome,
      email,
      telefone,
      mensagem,
      propostaFile,
      propostaFile.originalname
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({msg: "Email send sucess"})
  } catch (error) {
    console.error("Error send the email", error)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(500).json({error: "error to send the email"})
  }
})

app.listen(3001, function() {
  console.log('Servidor rodando na porta 3001');
});