
const getMsgMap = (node, msg) => {
    const context = node.context().flow;
    if (!context.get(msg._msgid)) {
        context.set(msg._msgid, new Map());
    }
    return context.get(msg._msgid);
}

module.exports.getMsgContext = (node, msg, key) => {
    const context = getMsgMap(node, msg);

    return context.get(key);
}

module.exports.setMsgContext = (node, msg, key, value) => {
    const context = getMsgMap(node, msg);

    return context.set(key, value);
}


module.exports.clearMsgContext = (node, msg) => {
    node.context().set(msg._msgid, undefined);
}
