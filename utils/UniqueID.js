module.exports = class UniqueID extends String {
    constructor() {
        super(UniqueID.generate());
    }

    /**
     * @returns {string} 4 digit random number
     */
    static v4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    /**
     * @returns {string} 8 digit random number
     */
    static v8() {
        return `${UniqueID.v4() + UniqueID.v4()}`;
    }

    /**
     * @returns {string} 16 digit random number
     */
    static v16() {
        return `${UniqueID.v8() + UniqueID.v8()}`;
    }

    /**
     * @returns {string} random string in format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX
     */
    static generate() {
        return `${UniqueID.v8()}-${UniqueID.v4()}-${UniqueID.v4()}-${UniqueID.v4()}-${UniqueID.v8()}`;
    }
};