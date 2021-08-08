

const setToken = (authData) => {
    localStorage.setItem('authData', JSON.stringify({
        token: authData.userToken,
        userProfile: authData.userProfile

    }))
}

const getToken = () => localStorage.getItem('authData');
const removeToken = () => localStorage.removeItem("authData");


const getActionPermission = (actionName, actionsList) => {
    if (actionsList.length) {
        actionsList.foreEach(data => {
            if (data.name === actionName && data.value) {
                return true
            }
        })
    }
    return false
}


export {
    setToken,
    getToken,
    removeToken,
    getActionPermission
}
