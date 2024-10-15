const githubForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');


function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`)
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => console.error('Error fetching users:', error));
}


function displayUsers(users) {
    userList.innerHTML = ''; 
    reposList.innerHTML = ''; 

    if (users.length === 0) {
        userList.innerHTML = '<li>No users found.</li>';
        return;
    }

    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.classList.add('user-item');
        userItem.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="50">
            <span>${user.login}</span>
            <button class="view-repos" data-username="${user.login}">View Repos</button>
        `;
        userList.appendChild(userItem);
    });

    
    const viewRepoButtons = document.querySelectorAll('.view-repos');
    viewRepoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const username = e.target.getAttribute('data-username');
            getUserRepos(username);
        });
    });
}


function getUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(data => displayRepos(data))
        .catch(error => console.error('Error fetching repositories:', error));
}


function displayRepos(repos) {
    reposList.innerHTML = ''; 

    if (repos.length === 0) {
        reposList.innerHTML = '<li>No repositories found.</li>';
        return;
    }

    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.classList.add('repo-item');
        repoItem.innerHTML = `
            <h4>${repo.name}</h4>
            <p>${repo.description || 'No description available.'}</p>
            <a href="${repo.html_url}" target="_blank">View on GitHub</a>
        `;
        reposList.appendChild(repoItem);
    });
}


githubForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
        searchUsers(query);
    } else {
        userList.innerHTML = '<li>Please enter a search term.</li>';
    }
});


