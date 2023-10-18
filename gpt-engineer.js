const {initialPrompt} = require("./logic/initialPrompt");
const {response} = require("./logic/response");
const {getMsgContext, clearMsgContext} = require("./logic/sharedInFlow");

module.exports = function (RED) {
    function gptEngineer(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.apiConfig = RED.nodes.getNode(config.config);

        const apikey = node.apiConfig.credentials.apiKey;

        node.on('input', async (msg, send, done) => {
            node.status({
                fill: "orange",
                shape: "dot",
                text: `Connecting`
            });

            try {
                const payload = msg[config.payload];

                let res = Promise.resolve();
                switch (payload.topic) {
                    case 'prompt':
                        res = await initialPrompt(RED, node, msg, payload.value);
                        break;
                    case 'response':
                        res = await response(RED, node, msg, payload.value);
                        break;
                }

                node.status({
                    fill: "green",
                    shape: "dot",
                    text: `message sent`,
                });
                node.send({
                    ...msg,
                    gptEngineerLog: getMsgContext(node, msg, 'communicationLog'),
                    payload: res,
                });
                clearMsgContext(node, msg)
                if (done) {
                    done();
                }
            } catch (error) {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: `error`,
                });
                if (done) {
                    // Node-RED 1.0 compatible
                    done(error);
                } else {
                    // Node-RED 0.x compatible
                    node.error(error, msg);
                }
            }
        });
    }

    RED.nodes.registerType("gpt-engineer", gptEngineer);
}
