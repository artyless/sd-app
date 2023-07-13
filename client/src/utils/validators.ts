export const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
}

export const validatePassword = (password: string) => {
    return password.length > 6 && /^[a-zA-Z0-9!@#$%^&*-]+$/.test(password)
}
