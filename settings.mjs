// INSTRUCTION: You can add as many records as you want
// Example record:
//
// {
//     zone_id: 'bzcw21asdqh76dqef9bdfaeq8c0433',
//     dns_record_id: 'bddfqea7ee2d43848bzcxdegdebxxczc',
//     type: "A",
//     name: 'exampleName.domain.com',
//     proxied: true,
//     comment: 'Note for you',
//     ttl: 1
// },

export const checkInterval = 60; // in seconds

export const dnsSettings = [
    {
        zone_id: '',
        dns_record_id: '',
        type: "",
        name: '',
        proxied: false,
        comment: '',
        ttl: 1
    },
    {
        zone_id: '',
        dns_record_id: '',
        type: "",
        name: '',
        proxied: false,
        comment: '',
        ttl: 1
    },
];