import LOGSCH from '../schema/activity_log';

// create log
export const createLog = async (user_id, log, req) => {
    const ip_address = getIpAddr(req);
    return await LOGSCH.create({ user_id, ip_address, log });
}
const parseIps = (ips) => {
    if (Array.isArray(ips)) {
        return ips.length > 0 ? ips[ips.length - 1] : false;
    }
    if (!ips) return false;
    if (typeof ips === 'string') {
        const [ip_address] = ips.split(',');
        return ip_address;
    }
    return ips;
}
const getIpAddr = (req) => {
    const { headers, ip, hostname, ips } = req;
    return parseIps(headers['x-forwarded-for']) || parseIps(ips) || ip || hostname;
}
