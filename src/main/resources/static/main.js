"use strict";

const url = "http://localhost:8080/admin";

async function getAdminPage() {
    let page = await fetch(url + '/users');
    if (page.ok) {
        let listAllUser = await page.json();
        loadTableData(listAllUser);
    } else {
        alert(`Error, ${page.status}`)
    }
}

const pills = document.querySelectorAll('.pill');
const pillsContent = document.querySelectorAll('.pillContent');
pills.forEach((clickedPill) => {
    clickedPill.addEventListener('click', async () => {
        pills.forEach((pill) => {
            pill.classList.remove('active');
        });
        clickedPill.classList.add('active');
        let tabId = clickedPill.getAttribute('id');
        await activePillContent(tabId);
    });
});

async function activePillContent(tabId) {
    pillsContent.forEach((clickedPillContent) => {
        clickedPillContent.classList.contains(tabId) ?
            clickedPillContent.classList.add('active') :
            clickedPillContent.classList.remove('active');
    })
}

async function getMyUser() {
    let res = await fetch('/auth');
    let resUser = await res.json();
    userNavbarDetails(resUser);
}

window.addEventListener('DOMContentLoaded', getMyUser);

function userNavbarDetails(resUser) {
    let userList = document.getElementById('myUserDetails');
    let roles = ''
    for (let role of resUser.roles) {
        roles += role.name + ' '
    }
    userList.insertAdjacentHTML('beforeend', `
        <b> ${resUser.username} </b> с ролями: <a>${roles} </a>`);
}

function loadTableData(listAllUser) {
    let tableBody = document.getElementById('tableAdmin');
    let dataHtml = '';
    for (let user of listAllUser) {
        let roles = '';
        for (let role of user.roles) {
            roles += role.name + "<br>";
        }
        dataHtml +=
            `<tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>${user.email}</td>
    <td>${user.name}</td>
    <td>${user.surname}</td>
    <td>${user.yearOfBirth}</td>
    <td>${roles}</td>
    <td>
        <button class="btn btn-sm btn-primary offset-md-2" data-bs-toogle="modal"
        data-bs-target="#editModal" id="${user.id}"
        onclick="editModalData(${user.id})">Edit</button>
    </td>
        <td>
        <button class="btn btn-sm btn-danger" data-bs-toogle="modal"
        data-bs-target="#deleteModal" id="${user.id}"
        onclick="deleteModalData(${user.id})">Delete</button>
    </td>
</tr>`
    }
    tableBody.innerHTML = dataHtml;
}

getAdminPage();
window.addEventListener('DOMContentLoaded', loadUserTable);

async function loadUserTable() {
    let tableBody = document.getElementById('tableUser');
    let page = await fetch("/auth");
    let currentUser;
    if (page.ok) {
        currentUser = await page.json();
    } else {
        alert(`Error, ${page.status}`)
    }

    let dataHtml = '';
    let roles = '';
    for (let role of currentUser.roles) {
        roles += role.name + "<br>";
    }
    dataHtml +=
        `<tr>
    <td>${currentUser.id}</td>
    <td>${currentUser.username}</td>
    <td>${currentUser.email}</td>
    <td>${currentUser.name}</td>
    <td>${currentUser.surname}</td>
    <td>${currentUser.yearOfBirth}</td>
    <td>${roles}</td>
      </tr>`;

    tableBody.innerHTML = dataHtml;
}

const tabs = document.querySelectorAll('.tabs');
const tabsContent = document.querySelectorAll('.tabsContent');
tabs.forEach((clickedTab) => {
    clickedTab.addEventListener('click', async () => {
        tabs.forEach((tab) => {
            tab.classList.remove('active');
        });
        clickedTab.classList.add('active');
        let tabsId = clickedTab.getAttribute('id');
        await activeTabContent(tabsId);
    });
});

async function activeTabContent(tabsId) {
    tabsContent.forEach((clickedTabContent) => {
        clickedTabContent.classList.contains(tabsId) ?
            clickedTabContent.classList.add('active') :
            clickedTabContent.classList.remove('active');
    })
}

const form_new = document.getElementById('formForNewUser');

async function newUser() {
    form_new.addEventListener('submit', addNewUser);
}

async function getRoles() {
    let page = await fetch(url + '/roles');
    let roles;
    if (page.ok) {
        roles = await page.json();
    } else {
        alert(`Error, ${page.status}`)
    }

    return roles;
}

async function addRolesFromAddNewUser() {
    let selection = document.getElementById('rolesForAdd');

    getRoles().then(function (roles) {
        let dataHtml = '';
        for (let role of roles) {
            dataHtml += `<option value="${role.id}">${role.name}</option>`;
        }
        selection.innerHTML = dataHtml;
    });
}

const csrf_add = document.getElementById('csrf_add');

async function addNewUser(event) {
    event.preventDefault();
    let listOfRole = [];
    for (let i = 0; i < form_new.rolesForAdd.options.length; i++) {
        if (form_new.rolesForAdd.options[i].selected) {
            listOfRole.push(form_new.rolesForAdd.options[i].value);
        }
    }
    let addUrl = "http://localhost:8080/admin/user?roles=" + listOfRole;
    let method = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrf_add.value
        },
        body: JSON.stringify({
            username: form_new.username.value,
            email: form_new.email.value,
            name: form_new.name.value,
            surname: form_new.surname.value,
            yearOfBirth: form_new.yearOfBirth.value,
            password: form_new.password.value,
        })
    }

    let page = await fetch(addUrl, method)
    if (page.ok) {
        form_new.reset();
        getAdminPage();
        alert("Пользователь успешно создан")
    } else {
        alert("Это имя пользователя уже занято")
    }
}

const form_ed = document.getElementById('formForEditing');
const csrf_ed = document.getElementById('csrf_ed');
const id_ed = document.getElementById('id_ed');
const username_ed = document.getElementById('username_ed');
const email_ed = document.getElementById('email_ed');
const name_ed = document.getElementById('name_ed');
const surname_ed = document.getElementById('surname_ed');
const yearOfBirth_ed = document.getElementById('yearOfBirth_ed');
const password_ed = document.getElementById('password_ed');
const roles_ed = document.getElementById('roles_ed');

function getOptionRolesForDelAndEdit(user, roles) {
    let dataHtml;

    let indexUserRoles = [];
    for (let userRole of user.roles) {
        indexUserRoles.push(userRole.id);
    }
    for (let role of roles) {
        if (indexUserRoles.includes(role.id)) {
            dataHtml += `<option value="${role.id}" selected>${role.name}</option>`;
        } else {
            dataHtml += `<option value="${role.id}">${role.name}</option>`;
        }
    }

    return dataHtml;
}

async function editModalData(id) {
    $('#editModal').modal('show');
    const urlDataEd = 'http://localhost:8080/admin/user/' + id;
    let usersPageEd = await fetch(urlDataEd);
    if (usersPageEd.ok) {
        await usersPageEd.json().then(function (user) {
            id_ed.value = `${user.id}`;
            username_ed.value = `${user.username}`;
            email_ed.value = `${user.email}`;
            name_ed.value = `${user.name}`;
            surname_ed.value = `${user.surname}`;
            yearOfBirth_ed.value = `${user.yearOfBirth}`;
            getRoles().then(function (roles) {
                roles_ed.innerHTML = getOptionRolesForDelAndEdit(user, roles);
            });
        });
    } else {
        alert(`Error, ${usersPageEd.status}`);
    }
}

async function editUser() {
    let listOfRole = [];
    for (let i = 0; i < form_ed.roles_ed.options.length; i++) {
        if (form_ed.roles_ed.options[i].selected) {
            listOfRole.push(form_ed.roles_ed.options[i].value);
        }
    }
    let urlEdit = 'http://localhost:8080/admin/user/' + id_ed.value + '?roles='
        + listOfRole;
    let method = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrf_ed.value
        },
        body: JSON.stringify({
            id: form_ed.editedUserId.value,
            username: form_ed.username.value,
            email: form_ed.email.value,
            name: form_ed.name.value,
            surname: form_ed.surname.value,
            yearOfBirth: form_ed.yearOfBirth.value,
            password: form_ed.password.value

        })
    }

    let page = await fetch(urlEdit, method)
    if (page.ok) {
        $('#editCloseBtn').click();
        getAdminPage();
    } else {
        alert("Имя пользователя занято или неверно заполнены поля")
    }
}

const form_del = document.getElementById('formForDeleting');
const csrf_del = document.getElementById('csrf_del');
const id_del = document.getElementById('id_del');
const username_del = document.getElementById(`username_del`);
const email_del = document.getElementById('email_del');
const name_del = document.getElementById('name_del');
const surname_del = document.getElementById('surname_del');
const yearOfBirth_del = document.getElementById('yearOfBirth_del');
const password_del = document.getElementById('password_del');
const roles_del = document.getElementById('roles_del');

async function deleteModalData(id) {
    $('#deleteModal').modal('show');
    const urlForDel = 'http://localhost:8080/admin/user/' + id;
    let usersPageDel = await fetch(urlForDel);
    if (usersPageDel.ok) {
        await usersPageDel.json().then(user => {
            id_del.value = `${user.id}`;
            username_del.value = `${user.username}`;
            email_del.value = `${user.email}`;
            name_del.value = `${user.name}`;
            surname_del.value = `${user.surname}`;
            yearOfBirth_del.value = `${user.yearOfBirth}`;
            getRoles().then(function (roles) {
                roles_del.innerHTML = getOptionRolesForDelAndEdit(user, roles);
            });
        })
    } else {
        alert(`Error, ${usersPageDel.status}`)
    }
}

async function deleteUser() {
    let urlDel = 'http://localhost:8080/admin/user/' + id_del.value;

    let method = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrf_del.value
        },
        body: JSON.stringify({
            username: form_del.username.value,
            email: form_del.email.value,
            name: form_del.name.value,
            surname: form_del.surname.value,
            yearOfBirth: form_del.yearOfBirth.value,
        })
    }
    await fetch(urlDel, method).then(function () {
        $('#deleteCloseBtn').click();
        getAdminPage();
    })
}