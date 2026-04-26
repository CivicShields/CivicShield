const now = new Date();

const date = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(':', '-');
// Result example: "04-23-26", "10-01 AM"

export { date, time };