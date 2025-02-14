// DOM Elements
const homeSection = document.getElementById('home');
const loginSection = document.getElementById('login');
const dashboardSection = document.getElementById('dashboard');
const groupsSection = document.getElementById('groups');
const investmentsSection = document.getElementById('investments');
const profileSection = document.getElementById('profile');
const homeBtn = document.getElementById('homeBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const groupsBtn = document.getElementById('groupsBtn');
const investmentsBtn = document.getElementById('investmentsBtn');
const profileBtn = document.getElementById('profileBtn');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const contributionForm = document.getElementById('contributionForm');
const createGroupForm = document.getElementById('createGroupForm');
const addInvestmentForm = document.getElementById('addInvestmentForm');
const loginLink = document.getElementById('loginLink');
const signupLink = document.getElementById('signupLink');
const totalBalance = document.getElementById('totalBalance');
const contributionList = document.getElementById('contributionList');
const notificationList = document.getElementById('notificationList');
const groupsList = document.getElementById('groupsList');
const investmentsList = document.getElementById('investmentsList');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const achievementsList = document.getElementById('achievementsList');

// Data Storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let contributions = JSON.parse(localStorage.getItem('contributions')) || [];
let groups = JSON.parse(localStorage.getItem('groups')) || [];
let investments = JSON.parse(localStorage.getItem('investments')) || [];
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
let achievements = JSON.parse(localStorage.getItem('achievements')) || [];

// Helper Functions
const showSection = (section) => {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  section.classList.add('active');
};

const updateDashboard = () => {
  if (currentUser) {
    const userContributions = contributions.filter(contribution => contribution.userId === currentUser.id);
    const total = userContributions.reduce((sum, contribution) => sum + contribution.amount, 0);
    totalBalance.textContent = `$${total}`;
    contributionList.innerHTML = userContributions.map(contribution => `
      <li>$${contribution.amount} on ${new Date(contribution.date).toLocaleDateString()}</li>
    `).join('');
    notificationList.innerHTML = notifications.map(notification => `
      <li>${notification.message} on ${new Date(notification.date).toLocaleDateString()}</li>
    `).join('');
  }
};

const updateGroups = () => {
  if (currentUser) {
    const userGroups = groups.filter(group => group.members.includes(currentUser.id));
    groupsList.innerHTML = userGroups.map(group => `
      <li>${group.name} (Members: ${group.members.length})</li>
    `).join('');
  }
};

const updateInvestments = () => {
  if (currentUser) {
    const userInvestments = investments.filter(investment => investment.userId === currentUser.id);
    investmentsList.innerHTML = userInvestments.map(investment => `
      <li>${investment.name}: $${investment.amount}</li>
    `).join('');
  }
};

const updateProfile = () => {
  if (currentUser) {
    profileName.textContent = currentUser.name;
    profileEmail.textContent = currentUser.email;
    achievementsList.innerHTML = achievements.map(achievement => `
      <li>${achievement}</li>
    `).join('');
  }
};

// Event Listeners
homeBtn.addEventListener('click', () => showSection(homeSection));
dashboardBtn.addEventListener('click', () => {
  if (currentUser) {
    showSection(dashboardSection);
    updateDashboard();
  } else {
    alert('Please login first.');
  }
});
groupsBtn.addEventListener('click', () => {
  if (currentUser) {
    showSection(groupsSection);
    updateGroups();
  } else {
    alert('Please login first.');
  }
});
investmentsBtn.addEventListener('click', () => {
  if (currentUser) {
    showSection(investmentsSection);
    updateInvestments();
  } else {
    alert('Please login first.');
  }
});
profileBtn.addEventListener('click', () => {
  if (currentUser) {
    showSection(profileSection);
    updateProfile();
  } else {
    alert('Please login first.');
  }
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Signup successful! Please login.');
  showSection(loginSection);
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Login successful!');
    showSection(dashboardSection);
    updateDashboard();
  } else {
    alert('Invalid credentials.');
  }
});

contributionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('contributionAmount').value);
  if (amount > 0 && currentUser) {
    const newContribution = { userId: currentUser.id, amount, date: new Date().toISOString() };
    contributions.push(newContribution);
    localStorage.setItem('contributions', JSON.stringify(contributions));
    const newNotification = { message: `You contributed $${amount}`, date: new Date().toISOString() };
    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateDashboard();
    document.getElementById('contributionAmount').value = '';
  } else {
    alert('Please enter a valid amount.');
  }
});

createGroupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const groupName = document.getElementById('groupName').value;
  if (groupName && currentUser) {
    const newGroup = { id: groups.length + 1, name: groupName, members: [currentUser.id] };
    groups.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groups));
    updateGroups();
    document.getElementById('groupName').value = '';
  } else {
    alert('Please enter a group name.');
  }
});

addInvestmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const investmentName = document.getElementById('investmentName').value;
  const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
  if (investmentName && investmentAmount > 0 && currentUser) {
    const newInvestment = { userId: currentUser.id, name: investmentName, amount: investmentAmount, date: new Date().toISOString() };
    investments.push(newInvestment);
    localStorage.setItem('investments', JSON.stringify(investments));
    updateInvestments();
    document.getElementById('investmentName').value = '';
    document.getElementById('investmentAmount').value = '';
  } else {
    alert('Please enter valid investment details.');
  }
});

loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(loginSection);
});

signupLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(homeSection);
});

// Initialize
if (currentUser) {
  showSection(dashboardSection);
  updateDashboard();
} else {
  showSection(homeSection);
}
