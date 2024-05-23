import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDuoaehmuP5N8afocolPIDq6hsitMMT2Vw',
  authDomain: 'bookshop-oauth.firebaseapp.com',
  projectId: 'bookshop-oauth',
  storageBucket: 'bookshop-oauth.appspot.com',
  messagingSenderId: '352027425060',
  appId: '1:352027425060:web:8354c2be552b242f87dbb1',
  measurementId: 'G-2ZE401FHDZ'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

function getProvider(providerName: string) {
  switch (providerName) {
    case 'Google':
      return new GoogleAuthProvider().addScope('email')
    case 'Facebook':
      return new FacebookAuthProvider().addScope('email')
    case 'Github':
      return new GithubAuthProvider().addScope('email')
    default:
      throw new Error(`Invalid provider name: ${providerName}`)
  }
}

async function signInWithProvider(provider: any) {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    return user
  } catch (error: any) {
    throw new Error(error)
  }
}

async function startSignIn(providerName: string) {
  const provider = getProvider(providerName)
  return await signInWithProvider(provider)
}

export { startSignIn }
