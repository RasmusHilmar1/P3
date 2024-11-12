
async function fetchMember() {
    try {
        const response = await fetch('/members/getName/')
    }
}




/*
const url = "https://localhost:8080/members/"

function getInfo (endpoint) {
    return fetch(url + endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-fejl! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(url + endpoint);
            return data;
        })
        .catch(error => {console.error(url + endpoint + ':' + error)});
}


function fetchMemberName(memberId) {
    console.log("fetch memberName:" + memberId)
    return getInfo("getName/" + memberId);
}

function fetchMemberAddress(memberId) {
    console.log("fetch memberAddress:" + memberId)
    return getInfo("getAddress/" + memberId);
}
fetchMemberName(11);
fetchMemberAddress(11);
*/
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

/*
function updatePhoneNumber() {
    const newPhoneNumber = document.getElementById("newPhoneNumber").value;
    const memberId = 10;

    fetch(`/members/updatePhoneNumber/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPhoneNumber),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("Phone Number updated successfully.")
            } else {
                alert("Error: Member not found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error updatig member email")
        });
}
*/
