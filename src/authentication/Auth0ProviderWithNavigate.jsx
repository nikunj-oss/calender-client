import { Auth0Provider } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const Auth0ProviderWithNavigate = ({children}) => {
  const navigate=useNavigate();


  const onRedirectCallback=async ()=>{
    navigate("/auth/callback")
  }

  const domain=import.meta.env.VITE_AUTH0_DOMAIN
  const clientId=import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri=import.meta.env.VITE_AUTH0_CALLBACK_URI
  const audience=import.meta.env.VITE_AUTH0_AUDIENCE


  if(!domain || !clientId || !redirectUri || !audience){
    throw new Error("Error Connecting to auth0")
  }

  return (
    <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{
        redirect_uri:redirectUri,
        audience
    }}
    onRedirectCallback={onRedirectCallback}
    cacheLocation="localstorage"
    >
        {children}
    </Auth0Provider>
  )
}

export default Auth0ProviderWithNavigate