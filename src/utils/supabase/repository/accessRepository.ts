import { createClient } from "../server"

export const addAccess = async (email: string) => {
    (await createClient()).from('access').insert({ email: email })
}

export const access = async () => {
    return (await (await createClient()).from('access').select()).data
}

export const removeAccess = async (email: string) => {
    (await createClient()).from('access').delete().eq("email", email)
}