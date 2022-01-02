import * as accounts from '../src/frontend'

let sigupButton = document.getElementById('signup');
let loginButton = document.getElementById('login');
let googleButton = document.getElementById('google');
let updateButton = document.getElementById('update');
let logoutButton = document.getElementById('logout');
let deleteButton = document.getElementById('delete');

let profileImage = document.getElementById('profile-image') as HTMLImageElement
let fullName = document.getElementById('full-name');
let customUserData = document.getElementById('custom-user-data');

let testUserDetails = {
    email: 'gflynn@usc.edu',
    password: 'testingThis'
}


let setProfileInfo = (res:any) => {
    if (!('err' in res.data)){
        if (profileImage) profileImage.src = res.data.pictureUrl
        if (fullName) fullName.innerHTML = res.data.fullName
        if (customUserData) customUserData.innerHTML = JSON.stringify(res.data.customUserData)
    }
}

accounts.login().then((res) => setProfileInfo(res)) // Auto-login


// Set Connection Command
if (sigupButton){
    sigupButton.onclick = () => {
        accounts.create(testUserDetails).then(() => {
            accounts.getCredentials(testUserDetails).then((credentials: Realm.Credentials) => {
                accounts.login(credentials).then((res) => setProfileInfo(res))
            })
        })
    }
}

// Set Login Command
if (loginButton){
    loginButton.onclick = () => {
        accounts.getCredentials(testUserDetails).then((credentials: Realm.Credentials) => {
            accounts.login(credentials).then((res) => setProfileInfo(res))
        })
    }
}

// Set Google Command
if (googleButton){
    googleButton.onclick = () => {
        accounts.getGoogleCredentials().then((credentials: Realm.Credentials) => {
            accounts.login(credentials).then((res) => setProfileInfo(res))
        })
    }
}

// Set Login Command
if (updateButton){
    updateButton.onclick = () => {
        let newInfo = {test: Date.now()}
        accounts.updateCustomUserData(newInfo).then((user: any) => {
            if (customUserData) customUserData.innerHTML = JSON.stringify(user.customUserData)
        })
    }
}


// Set Logout Command
if (logoutButton){
    logoutButton.onclick = () => {
        accounts.logout().then(() => {
            if (profileImage) profileImage.src = ''
            if (fullName) fullName.innerHTML = ''
            if (customUserData) customUserData.innerHTML = ''
        })
    }
}

// Set Disconnection Command
if (deleteButton){
    deleteButton.onclick = () => {
        accounts.remove().then(() => {
            console.log('Deleted account!')
        })
    }
}

