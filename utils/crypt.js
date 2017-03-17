module.exports = (data, key) => {
    let res = '';
    if (key.length < data.length) {
        return '';
    }

    for (let i  = 0; i < key.length; i++)
    {
        if (i >= data.length)
            break;
        else
            res += String.fromCharCode(key.charCodeAt(i) ^ data.charCodeAt(i));
    }

    return res;
};