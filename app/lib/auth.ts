export function isAuthenticated(){

if(typeof window === "undefined") return false

const token = localStorage.getItem("token")

return !!token

}

export function login(){

localStorage.setItem("token","logado")

}

export function logout(){

localStorage.removeItem("token")

}