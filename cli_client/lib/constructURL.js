module.exports = function (scope, param1) {
    let base = 'https://localhost:9876/ntuaflix_api';

    // create url with scope
    base = base + scope;

    if (scope === '/admin/' && param1 === 'healthcheck'){
        base = base + 'healthcheck';
    }

    // create url for healthcheck

    else if (scope === '/admin/' && param1 === 'resetall'){
        base = base + 'resetall';
    }

    // create url for resetall

    else if (scope === '/title/'){
        // create url for title
        if (param1 !== undefined) {
            base = base + param1;
        }


    }
    else if(scope === '/name/') {
        // create url for name
        if (param1 !== undefined) {
            base = base + param1;
        }
    }
    else if(scope === '/searchtitle') {
        // create url for searchtitle
    }
    else if(scope === '/searchname'){

    }
    else if(scope === '/bygenre'){
        // create url for bygenre 
    }
    else if (scope === '/admin/' && param1 === 'upload/titlebasics') {
        base = base + 'upload/titlebasics';
    }
    else if(scope === '/admin/' && param1 === 'upload/namebasics') {
        base = base + 'upload/namebasics';
    }
    else if(scope === '/admin/' && param1 === 'upload/titleepisode') {
        base = base + 'upload/titleepisode';
    }
    else if(scope === '/admin/' && param1 === 'upload/titleakas') {
        base = base + 'upload/titleakas';
    }
    else if(scope === '/admin/' && param1 === 'upload/titlecrew') {
        base = base + 'upload/titlecrew';
    }
    else if(scope === '/admin/' && param1 === 'upload/titleprincipals') {
        base = base + 'upload/titleprincipals';
    }
    else if(scope === '/admin/' && param1 === 'upload/titleratings') {
        base = base + 'upload/titleratings';
    }
    else if(scope === '/bygenre') {
        // create url for bygenre
    }
    else {
        console.log('Error: Invalid scope');
    }
    return base;
}