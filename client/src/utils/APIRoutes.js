export const host = 'https://thae-gossip-chat.herokuapp.com'

// auth api
export const registerRoute = `${host}/user/register`
export const activationEmailRoute = `${host}/user/activation`
export const setAvatarRoute = `${host}/user/setAvatar`

export const loginRoute = `${host}/user/login`
export const forgotPasswordRoute = `${host}/user/forgot`
export const resetPasswordRoute = `${host}/user/reset`

export const getAccessToken = `${host}/user/refresh_token`

export const logoutRoute = `${host}/user/logout`

// social media login api
export const googleLoginRoute = `${host}/user/google_login`
export const facebookLoginRoute = `${host}/user/facebook_login`

// fetch user info api
export const getUserInfo = `${host}/user/info`
export const getAllContacts = `${host}/user/contacts`
export const getAllUsers = `${host}/user/all_infor`

// fetch messages api
export const sendMessageRoute = `${host}/messages/addmsg`
export const getAllMessagesRoute = `${host}/messages/getmsg`
