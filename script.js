import { publicIpv4 } from 'public-ip';
import { config } from 'dotenv';
import { dnsSettings, checkInterval } from './settings.mjs';

config();

const headers = {
    'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
    'Content-Type': 'application/json'
};

const getTime = () => {
    return new Date().toLocaleString();
};

const getMyIp = async () => {
    try {
        return await publicIpv4();
    } catch (error) {
        console.error('Unable to get IP, network error, retry in 10s...');
        await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        await getMyIp();
    }
};

const OverwriteDNS = async (record) => {
    try {
        const body = {
            type: record.type,
            content: await getMyIp(),
            name: record.name,
            proxied: record.proxied,
            comment: record.comment,
            ttl: record.ttl
        };

        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${record.zone_id}/dns_records/${record.dns_record_id}`, {
            headers,
            method: 'PUT',
            body: JSON.stringify(body)
        });

        if (response.status !== 200) {
            return console.log(`${getTime()} | ERROR, Record is not overwritten | ID: ${record.dns_record_id}`);
        }

        console.log(`${getTime()} | SUCCESS | Record is overwritten | ID: ${record.dns_record_id}`);
    } catch (error) {
        console.error(`${getTime()} | ERROR, Record is not overwritten | ID: ${record.dns_record_id}`);
    }
};

const getDnsInfo = async (record) => {
    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${record.zone_id}/dns_records/${record.dns_record_id}`, {
            headers
        });

        const data = await response.json();

        return data.result;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const compareIPs = async (beforeIp) => {
    let dnsIp = beforeIp;

    while (dnsIp === await getMyIp()) {
        console.log(`${getTime()} | Ip checked ${beforeIp ? `| ${beforeIp}` : ''}`);
        await new Promise((resolve) => setTimeout(resolve, checkInterval * 1000));
    }

    if (dnsIp && dnsIp !== await getMyIp()) {
        console.log(`${getTime()} | WARN: The IP address doesn't match, Overwrite DNS...`);
    }

    await Promise.all(
        await dnsSettings.map(async (record, index) => {
            await new Promise((resolve) => setTimeout(resolve, index * 2000));

            if (!record || !record.dns_record_id) {
                return;
            }

            const dnsInfo = await getDnsInfo(record);

            if (!dnsInfo) {
                console.log(`${getTime()} | ERROR: Record with ID:${record.dns_record_id} unreadable`);
                return;
            }

            if (dnsInfo.content !== await getMyIp()) {
                dnsIp = null;
                return await OverwriteDNS(record);
            }

            dnsIp = dnsInfo.content;
        })
    );

    compareIPs(dnsIp);
};

compareIPs();