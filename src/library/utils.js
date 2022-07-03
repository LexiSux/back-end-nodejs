
// random string
export const CreateRandomString = (len = 8) => {
    const dict = '056789QWERTYUIOPqwertyopasdfghjklzxcvbnmASDFGHJKLZXCVBNM1234';
    let result = '';
    for (let iii = 0; iii < len; iii++) {
        const charAt = Math.floor(Math.random() * 1000) % dict.length;
        result = dict[charAt] + result;
    }
    return result;
}
