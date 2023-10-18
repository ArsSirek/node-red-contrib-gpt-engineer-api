

module.exports.executeACommand = (stream, command, send, forceCloseRef) => {
    return new Promise((resolve, reject) => {
        const onData = (data) => {
            const dataString = data.toString();
            console.log('onData',dataString);
            send(dataString);

            if (isShellReady(dataString)) {
                console.log('dataString', dataString);
                stream.removeListener('data', onData); // Remove the event listener
                resolve();
            }
        }

        stream.on('data', onData);

        if (command) {
            stream.write(command + '\n');
        }

        if (forceCloseRef) {
            forceCloseRef.current = () => {
                stream.removeListener('data', onData); // Remove the event listener
                resolve();
            }
        }
    });
}


function isShellReady(dataString) {
    // Replace this condition with the actual prompt or pattern you expect
    // For example, if your shell prompt ends with "$ ", you can check for that:
    return dataString.endsWith("$ ");
}
