// Add sidebar -->
var sidebar = document.getElementById("sidebar");

// Open or close sidebar -->
var menuState = 0;
function openClose(){
    const sidebarBtnIcon = document.getElementById("sidebarBtn");
    if(menuState === 0){
        menuState = 1;
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("closeSidebar").style.marginLeft = "0px";
        sidebarBtnIcon.src = "Images/Icons/openIcon.svg";
    } else {
        menuState = 0;
        document.getElementById("sidebar").style.width = "350px";
        document.getElementById("closeSidebar").style.marginLeft = "350px";
        sidebarBtnIcon.src = "Images/Icons/closeIcon.svg";
    }
}

// Floating button for opening sidebar -->
var button = document.createElement("Button");
button.innerHTML = "Title";
document.body.appendChild(button);



sidebar.addEventListener('click', function (event) {
    if(event.target.classList.contains('btnSidebar')) {
        const btnSidebar = sidebar.querySelectorAll('.btnSidebar');
        btnSidebar.forEach(btnSidebar => btnSidebar.classList.remove('pressed'));

        event.target.classList.add('pressed');
    }
});







/*
var memberBtn = document.getElementById("memberBtn");
/*
memberBtn.addEventListener('click', generateMemberListBtn);
*/

/*
function showForm() {
    const btnMemberList = document.getElementById("memberList");
    if (btnMemberList.style.display === "none") {
        btnMemberList.style.display = "block";
    } else {
        btnMemberList.style.display = "none";
    }
}


function generateMemberListBtn () {
    //const btnMemberList = document.getElementById("memberList");
    const btnMemberList = document.querySelector("#memberList");

    const btn = document.createElement("button");
    const label = document.createElement("label");

    btn.id = "member";
    btn.classList = "memberInfo";

    label.htmlFor = "member";
    label.textContent = "member";

    btn.appendChild(label);
    btnMemberList.before(btn);

}
generateMemberListBtn
*/