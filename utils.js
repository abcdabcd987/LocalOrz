exports.getNextFilename = function(str) {
    var num_st = -1;
    var num_ed = -1;
    for (var i = str.length-1; i >= 0; --i) {
        if ('0' <= str[i] && str[i] <= '9') {
            if (num_ed === -1) num_ed = i;
            num_st = i;
        } else {
            if (num_ed !== -1) break;
        }
    }
    if (num_ed === -1) return null;
    var num = Number(str.substr(num_st, num_ed-num_st+1));
    return str.substr(0, num_st) + (num+1).toString() + str.substring(num_ed+1, str.length);
}
