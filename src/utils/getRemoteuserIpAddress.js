function getRemoteRequesterIpAddress(req){
    let ip = null;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else if(req.socket && req.socket.remoteAddress){
        ip = req.socket.remoteAddress;
    } else if( req.connection?.socket?.remoteAddress){
        ip = req.connection.socket.remoteAddress;
    } else {
        ip = req.ip;
    }
    return ip;
}

module.exports = {
    getRemoteRequesterIpAddress
}
