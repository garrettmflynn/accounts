import AccountsAPI from '../src/frontend'

const accounts = new AccountsAPI("brainsatplay-tvmdj")

const sigupButton = document.getElementById('signup');
const loginButton = document.getElementById('login');
const googleButton = document.getElementById('google');
const updateButton = document.getElementById('update');
const logoutButton = document.getElementById('logout');
const deleteButton = document.getElementById('delete');

const profileImage = document.getElementById('profile-image') as HTMLImageElement
const fullName = document.getElementById('full-name');
const customUserData = document.getElementById('custom-user-data');

const testUserDetails = {
    email: 'garrettmflynn@gmail.com',
    password: 'testingThis'
}


const setProfileInfo = (res:any) => {
    if (!('err' in res.data)){
        if (profileImage) profileImage.src = res.data.image
        if (fullName) fullName.innerHTML = res.data.firstName + ' ' + res.data.lastName
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

// Set Delete Command
if (deleteButton){
    deleteButton.onclick = () => {
        accounts.delete().then(() => {
            console.log('Deleted account!')
        })
    }
}

