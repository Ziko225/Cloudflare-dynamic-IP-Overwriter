import { config } from 'dotenv';

config();

const apiKey = process.env.API_SECRET_KEY;

const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
};

const showInConsoleAllDnsRecords = async () => {
    const getListZoneIDs = async () => {
        try {
            const response = await fetch(`https://api.cloudflare.com/client/v4/zones`, {
                headers
            });

            const data = await response.json();

            if (response.status !== 200) {
                return false;
            }

            return data.result;
        } catch (error) {
            console.error(error);
            process.exit(0);
        }
    };

    const dnsRecords = async (zoneData) => {
        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneData.id}/dns_records`, {
            headers
        });

        const data = await response.json();
        console.log(`
================ ZONE: ${zoneData.name} ID: ${zoneData.id} ================`);
        data.result.map((DNS) => {
            console.log(`
DNS NAME: ${DNS.name}
DNS RECORD ID: ${DNS.id}
DNS TYPE: ${DNS.type}`);
        });
    };

    const allZonesId = await getListZoneIDs();

    if (!allZonesId) {
        return console.log('Authorization Failed, check your API KEY');
    }

    allZonesId.map(async (zoneData) => await dnsRecords(zoneData));
};

showInConsoleAllDnsRecords();