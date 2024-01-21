module.exports = function (scope, param1, param2, param3, format, apikey) {
    let base = 'http://localhost:9876/ntuaflix_api';

    // create url with scope
    base = base + scope;

    // create url for healthcheck
    if (scope === '/admin/'){
        base = base + 'healthcheck';
    }
    else if (scope === '/title/:'){
        // create url for title
        if (param1 !== undefined) {
            base = base + param1;
        }
    }
    else {
        console.log('Error: Invalid scope');
    }
    return base;
}