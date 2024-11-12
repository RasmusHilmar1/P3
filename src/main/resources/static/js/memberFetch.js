
//const url = https://localhost8080/members/

function getInfo (url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-fejl! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(url);
            return data;
        })
        .catch(error => {console.error(url + ':' + error)});
}


function fetchMemberNames(memberId) {
    console.log("fetch memberName:" + memberId)
    return getInfo("/members/getName/" + memberId);
}

function fetchMemberAddress(memberId) {
    console.log("fetch memberAddress:" + memberId)
    return getInfo("/members/getAddress/" + memberId);
}


/*
function fetchAllMemberInfo(memberId) {
    return Promise.all([
        fetchMemberNames(memberId),
        fetchMemberAddress(memberId)
    ]).then(([name, address]) => {
        return {name, address};
    }).catch(error => {
        console.error("Fejl", error);
    });
}
*/

