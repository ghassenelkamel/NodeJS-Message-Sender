# NodeJS Telegram Message Sender

This Node.js application facilitates the construction and transmission of telegram messages over TCP/IP. It consists of two main files: `app.js` and `server.js`.

## Overview

The `server.js` file acts as a receiver for telegram messages over TCP/IP. It can decode received messages. On the other hand, the `app.js` file constructs telegram messages according to a specified format. Users can choose to encrypt/decrypt these messages using XOR encryption . 

Encryption and decryption are optional features that users can enable as needed.


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ghassenelkamel/NodeJS-Message-Sender.git
    ```

2. Navigate to the project directory:

    ```bash
    cd NodeJS-Message-Sender
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Run the server:

    ```bash
    node server.js
    ```

   The server will start listening for incoming telegram messages.

2. Send a message:

    ```bash
    node app.js MCR 123456789012345 12345 100 25 100
    ```

   Replace the arguments with the desired telegram data. The format is as follows:
   
    node app.js <Identifier> <Distance> <Magnitude> <Phase> <Temperature>


- `<Identifier>`: Fixed to "MCR"
- `<Distance>`: 64-bit integer in millimeters
- `<Magnitude>`: 32-bit unsigned integer
- `<Phase>`: 8-bit integer
- `<Temperature>`: 32-bit integer in Celsius

## Demonstration Video

[![Demo Video]](video.mp4)

## Contributors

- [Ghassen EL KAMEL](https://github.com/ghassenelkamel) 

## License

This project is licensed under the [MIT License](LICENSE).
