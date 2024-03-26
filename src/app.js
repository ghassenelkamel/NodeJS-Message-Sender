const readline = require('readline');
const net = require('net');

const CONFIG = {
    // Maximum distance value allowed, represented as a BigInt
    MAX_DISTANCE: BigInt(9223372036854775807),

    // Maximum magnitude value allowed (an unsigned 32-bit integer)
    MAX_MAGNITUDE: 4294967295,

    // Maximum phase value allowed (an 8-bit integer)
    MAX_PHASE: 255,

    // Minimum temperature value allowed (a signed 32-bit integer)
    MIN_TEMPERATURE: -2147483648,

    // Maximum temperature value allowed (a signed 32-bit integer)
    MAX_TEMPERATURE: 2147483647
};

// Function to construct the telegram message
function constructTelegram(identifier, distance, magnitude, phase, temperature, isEncrypted) {
    const buffers = [
        Buffer.from(identifier),
        Buffer.alloc(8),
        Buffer.alloc(4),
        Buffer.alloc(1),
        Buffer.alloc(4),
        Buffer.alloc(1) // Buffer for encryption flag
    ];

    buffers[1].writeBigInt64BE(BigInt(distance));
    buffers[2].writeUInt32BE(magnitude);
    buffers[3].writeInt8(phase);
    buffers[4].writeInt32LE(temperature);
    buffers[5].writeUInt8(isEncrypted ? 1 : 0); // Set encryption flag

    return Buffer.concat(buffers);
}

// Function to perform XOR encryption
function encryptData(data) {
    const key = 0x55; // XOR key
    const encrypted = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        encrypted[i] = data[i] ^ key;
    }
    return encrypted;
}

// Function to send the telegram message over TCP/IP
function sendTelegram(telegram) {
    const client = new net.Socket();
    client.connect(12345, '192.168.178.140', () => {
        console.log('Connected to server');
        client.write(telegram);
        client.end(); 
    });

    client.on('error', (error) => {
        console.error('Error: Failed to send or receive telegram message:', error.message);
    });

    client.on('close', () => {
        console.log('Connection closed');
    });
}

// Validate and extract command line arguments
const [identifier, distance, magnitude, phase, temperature] = process.argv.slice(2);

// Validate input values using the configuration object
const isValidIdentifier = typeof identifier === 'string' && identifier === 'MCR';
const isValidDistance = /^-?\d+$/.test(distance) && BigInt(distance) >= 0n && BigInt(distance) <= CONFIG.MAX_DISTANCE;
const isValidMagnitude = /^\d+$/.test(magnitude) && magnitude >= 0 && magnitude <= CONFIG.MAX_MAGNITUDE;
const isValidPhase = /^\d+$/.test(phase) && parseInt(phase) >= 0 && parseInt(phase) <= CONFIG.MAX_PHASE;
const isValidTemperature = /^-?\d+$/.test(temperature) && temperature >= CONFIG.MIN_TEMPERATURE && temperature <= CONFIG.MAX_TEMPERATURE;

if (![isValidIdentifier, isValidDistance, isValidMagnitude, isValidPhase, isValidTemperature].every(Boolean)) {
    console.error('Error: Invalid input values.');
    console.error('Usage: node app.js MCR <distance> <magnitude> <phase> <temperature>');
    process.exit(1);
}

// Construct the telegram message with encryption flag set to false by default
const telegram = constructTelegram(identifier, distance, magnitude, phase, temperature, false);

// Ask user if they want to encrypt the data
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Do you want to encrypt the data? (yes/no): ', (answer) => {
    rl.close();
    const isEncrypted = answer.toLowerCase() === 'yes';

    if (isEncrypted) {
        // Encrypt the telegram message
        const encryptedTelegram = encryptData(telegram);
        // Set the encryption flag
        encryptedTelegram[encryptedTelegram.length - 1] = 1;
        
        console.log('Encrypted data:', encryptedTelegram);
        
        sendTelegram(encryptedTelegram);
    } else {
        console.log('Unencrypted data:', telegram);
        
        sendTelegram(telegram);
    }
});