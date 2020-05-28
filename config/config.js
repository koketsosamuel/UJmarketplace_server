module.exports = {

    adminPhrase: "John",
    imageResizeWidth: 600,
    serverPort: 3000,

    smtpCredentials: {
      service: "gmail",
      user: "koklathewebguy@gmail.com",
      pass: "K0k3t$00"
    },

    dbConnStr: "mongodb://127.0.0.1:27017/ujm",
    tokenKey: "k0k3t$005653876",
    emailTokenKey: "k0k3t$005653876@email",
    emailVerificationKey: "1234!@#$%^&3",
    uploadDirTemp: "./upload/temp",
    uploadDir: "./upload/images",
    server: "http://127.0.0.1:"+this.serverPort

  }