const {setMsgContext} = require("./sharedInFlow");
const {executeACommand} = require("./utils");


module.exports.initialPrompt = async (node, msg, payload, apikey) => {
    const send = (word) => {
        node.send({
            ...msg,
            payload: word,
        });
    }
    node.gpt_requestsQueue = node.gpt_requestsQueue.then(async (conn) => {
        try {
            const forceCloseRef = {current: null};
            node.status({
                fill: "orange",
                shape: "dot",
                text: `GPT-engineer running..`
            });
            const stream = await createShellStream(conn);
            setMsgContext(node, msg, payload.uniqueID, 'stream', stream);

            const dumpConnectionMessage = await executeACommand(stream, undefined, send, forceCloseRef);
            let command = `mkdir /projects/${payload.projectName}`;
            send(`\n[node-red:] executing ${command}`);
            const mkdirResponse = await executeACommand(stream, command, send, forceCloseRef);
            send('\n' + mkdirResponse);

            command = `echo ${payload.value} > /projects/${payload.projectName}/prompt`;
            // send(`\n[node-red:] executing ${command}`);
            const fillPromptResponse = await executeACommand(stream, command, send, forceCloseRef);
            send('\n' + fillPromptResponse);

            command = `OPENAI_API_KEY="${apikey}" gpt-engineer /projects/${payload.projectName}`;
            send(`\n[node-red:] executing ${command}`);

            executeACommand(stream, command, send, forceCloseRef);
            setMsgContext(node, msg, payload.uniqueID, 'forceCloseRef', forceCloseRef);

            return conn;
        } catch (error) {
            console.log('error', error);
            reject(error);
            return conn;
        }
    });
}

const createShellStream = (conn) => {
    return new Promise((resolve, reject) => {
        conn.shell((err, stream) => {
            if (err) {
                console.error(`Error creating shell: ${err}`);
                reject(err);
            }
            resolve(stream);
        });
    });
}
