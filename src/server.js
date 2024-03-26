const net = require('net');

// Function to decrypt the data using XOR
function decryptData(encryptedData) {
    const key = 0x55; // XOR key
    const decrypted = Buffer.alloc(encryptedData.length - 1); // Exclude the encryption flag byte
    for (let i = 0; i < decrypted.length; i++) {
        decrypted[i] = encryptedData[i] ^ key;
    }
    return decrypted;
}

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        console.log('Received telegram:', data);

        // Decode the received telegram
        const identifier = data.toString('utf8', 0, 3);
        const distance = BigInt(data.slice(3, 11).readBigInt64BE());
        const magnitude = data.readUInt32BE(11);
        const phase = data.readInt8(15);
        const temperature = data.readInt32LE(16);
        const isEncrypted = Boolean(data[data.length - 1]); // Last byte indicates encryption flag

        // Print decoded values to the console
        if(!isEncrypted){
            console.log('Identifier:', identifier);
            console.log('Distance:', distance.toString());
            console.log('Magnitude:', magnitude);
            console.log('Phase:', phase);
            console.log('Temperature:', temperature);
        }
        console.log('Is Encrypted:', isEncrypted);

        if (isEncrypted) {
            // Prompt user for decryption decision
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question('Do you want to decrypt the data? (yes/no): ', (answer) => {
                readline.close();
                if (answer.toLowerCase() === 'yes') {
                    // Decrypt the telegram data
                    const decryptedData = decryptData(data);
                    console.log('Decrypted telegram:', decryptedData);

                    // Decode the decrypted telegram
                    const identifier = decryptedData.toString('utf8', 0, 3);
                    const distance = BigInt(decryptedData.slice(3, 11).readBigInt64BE());
                    const magnitude = parseInt(decryptedData.readUInt32BE(11));
                    const phase = parseInt(decryptedData.readInt8(15));
                    const temperature = parseInt(decryptedData.readInt32LE(16));

                    // Print decoded values to the console
                    console.log('Identifier:', identifier);
                    console.log('Distance:', distance.toString());
                    console.log('Magnitude:', magnitude);
                    console.log('Phase:', phase);
                    console.log('Temperature:', temperature);
                } else {
                    // Treat the encrypted data as is
                    console.log('Encrypted telegram treated as is:', data);
                    // Now you can process the encrypted data as needed
                }
            });
        } else {
            // Treat the unencrypted data as is
            console.log('Unencrypted telegram:', data);
            // Now you can process the unencrypted data as needed
        }
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

const PORT = 12345;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
