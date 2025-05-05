import bcrypt from 'bcrypt';

async function getHash() {
    const salt = await bcrypt.genSalt();
    const password = "123456";

    const pwdHash = await bcrypt.hash(password, salt);

    console.log(salt);
    console.log(pwdHash);
}

getHash();