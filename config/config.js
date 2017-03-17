module.exports.envirement = require('./envirement');

module.exports.setup = function (_platform) {
    module.exports.platform = _platform;
    module.exports.server = require('./server');
    module.exports.log = require('./log');
    module.exports.db = require('./db')(_platform);
    module.exports.builder = require(`./buildConfigs/${_platform}`);
};

module.exports.binSender = {
    url: {
        dev: 'https://api.rodin.space/api/hooks/build',
        prod: 'https://api.rodinapp.com/api/hooks/build'
    },
    token: 'K7rd6FzEZwzcc6dQr3cv9kz4tTTZzAc9hdXYJpukvEnxmbdB42V4b6HePs5ZDTYLW_4000dram'
};

module.exports.rodin_key = 'dBBgcwyTwNgmTh9zjgZSxqAENYhvyD2gDsBoIZYC5StgAFcY9Fg7JTOJxZmxgJvBZ1IfYmRypgDVUthgoBAxlu0p4BBgBABDR9zussBI0FUggg0yC3YU9DB95QNZQiBkwWY3wxNwBkI1DsjK9nDsggcgtlBwVsygCshmmFJDNBXmJgwhlmgoxgV0gyfQankoFAUFBDDDIJhiCnCgNg2YpjhBYxRUZICmgLNMxB0xLg7h97g5JxcCBrhsJwgVIfZvCHLsFgy2KIgIgIBDyLIx5ZZIgRUEMLnByxgzNABugJwyDyyB8lDxhYgpYBADVghmAwFConxj3s9dygviZghDmxDBVwlpeD34JTw5NiB2UgxQo3zm1Dx/yDQ4wLkvXB2Ag1gDUYBDBBB0rBgYggBoBMcJLHZIgLyMMgsDQwiZgIgIUIeQuhQDMCzVIl5n18T5hxIBI8s9BsBkyEMIgm9Cg6nFXBljgBUBZ21Y5v3Cww0lmJRVYsYCIgxgchA3VIhYxf5IyDHdYDDBThgXNAhNBBkeQ9sUMwInCZZ4UA2YgzIuwyy3h8A0AGVDglUTLuvYgBwIIhhgWA19jEliX3hQYNlnBCIL3gIsAZy2ZlUs9BAgFjZeYzZntlsxIEhYdB/NlyIjJ1Ixgi9N9VvEIeDwgmTlwuFA0wYg3TWLOxvwViJwy1hAABJCKceBBDIyIIggBR9gXI2lgMFmUsUg5ShhXvwLmuzg0zZI2I1shDy51HFlLsSc5ZuIhBYgjBsICD7wnwwgIiNYiY202ghNBINjg62YMgIzBzZ7Ds3ZmpDicR3BcMY0JLxyY6wBwBRwmxBDAhxgvgyFz5e5T2VFUFBAuZImxwvAg3I+tW3Wsp3IUhAovIARCvcPg0gCYADZrlfB2pgxVMRhgBkx95LNlLUxZeKk5FIyMVAZYVlBAgDI2wCHZNDslYAyw1zfKgG9hgnxBgelyzmmwCwY2M0shL3gMiBx0coIRjAgIBYmIypJpvQI0wcLIDMzxgBBD2hMZV3go402IzCcghc6EZm2z3HBtw3vvkgD0BoljLCID78BEIBCB9JvZBgkneyBBkyAIpcDABZ9BgxBlhtJgZDUN5o9xDlLexzYQ5nAv3XM7ByywcjBDBVBCNiJzYVg3INucktMtBLBggyDHhUVBgnBg0sBgggUNsTVFYgImLzyIghU9ZDZ9gumBgnwjdQXY9Yneg9wwyUVEJIBvg9gigFOCOxlDughVg2zvClgnBgIg2CV0H1ggBwNBEIKMqlJm';
