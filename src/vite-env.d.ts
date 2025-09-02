/// <reference types="vite/client" />

interface Post {
    id: string
    creationDate: any
    title: string
    content: string
    tags: string[]
    comments: PostComment[]
    username: string
}

interface Profile {
    "Child Age": string
    "Child Name": string
    "Current Therapies": string
    "Diagnosis Date": string
    Email: string
    Name: string
    Password: string
    "Preferred Calming Techniques": string
    "Primary Method of Communication": string
    "Sensory Sensitivities": string
    creationDate: {
        nanoseconds: number
        seconds: number
    }
}

interface PostComment {
    username: string
    content: string
    id: string
}

interface CreateCommentArgs {
    id: string
    username: string
    content: string
    commentId: string
}

interface ChatMessage {
    role: 'user' | 'model'
    text: string
}

interface CreatePostArgs {
    username: string,
    title: string,
    tags: string[],
    content: string
}

interface EditPostArgs {
    title: string,
    tags: string[]
    content: string,
    id: string
}

interface EditCommentArgs {
    username: string
    content: string
    postId: string
    commentId: string
}

interface EditProfileArgs {
    data: Profile,
    userId: string
}

interface DeleteCommentArgs {
    username: string
    content: string
    id: string,
    postId: string
}

interface DeletePostArgs {
    id: string
}

interface getProfileArgs {
    userId: string
}

interface RegisterArgs {
    'Name': string
    'Email': string
    'Password': string
    'Child Name': string
    'Child Age': string
    'Diagnosis Date': string
    'Sensory Sensitivities': string
    'Current Therapies': string
    'Preferred Calming Techniques': string
    'Primary Method of Communication': string
}