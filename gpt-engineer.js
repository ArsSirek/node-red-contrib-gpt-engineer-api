const {initialPrompt} = require("./logic/initialPrompt");
const {response} = require("./logic/response");
const {getMsgContext, clearMsgContext} = require("./logic/sharedInFlow");

const {Client} = require('ssh2');

module.exports = function (RED) {
    function gptEngineer(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.apiConfig = RED.nodes.getNode(config.config);

        const apikey = node.apiConfig.credentials.apiKey;
        const sshUser = node.apiConfig.sshUser;
        const sshHost = node.apiConfig.sshHost;
        const sshPassword = node.apiConfig.credentials.sshPassword;
        const sshPort = node.apiConfig.sshPort;

        const Client = require('ssh2').Client;

        const conn = new Client();

        const sshConfig = {
            host: sshHost,
            port: sshPort,
            username: sshUser,
            password: sshPassword, // Replace with your actual password
        };
        console.log('sshConfig', sshConfig);

        node.gpt_requestsQueue = new Promise((resolve, reject) => {
            conn.on('ready', () => {
                node.status({
                    fill: "green",
                    shape: "dot",
                    text: `GPT-engineer connection ready`
                });
                resolve(conn);
            });
        })

        conn.on('error', (err) => {
            node.status({
                fill: "red",
                shape: "dot",
                text: `error`
            });
            node.error(`SSH error: ${err}`);
        });

        conn.connect(sshConfig);

        node.on('input', async (msg, send, done) => {
            try {
                const payload = msg[config.payload];

                switch (payload.topic) {
                    case 'prompt':
                        await initialPrompt(node, msg, payload, apikey);
                        break;
                    case 'response':
                        await response(node, msg, payload);
                        break;
                    case 'finish':
                        clearMsgContext(node, msg)
                        break;
                }

                if (done) {
                    done();
                }
            } catch (error) {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: `error`,
                });
                console.log(getMsgContext(node, msg, 'communicationLog').join('\n'));
                clearMsgContext(node, msg);

                if (done) {
                    // Node-RED 1.0 compatible
                    done(error, msg);
                } else {
                    // Node-RED 0.x compatible
                    node.error(error, msg);
                }
            }
        });
    }

    RED.nodes.registerType("gpt-engineer", gptEngineer);
}
