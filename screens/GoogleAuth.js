import { supabase } from '../lib/supabase'

const AuthPage = async () => {
        console.log("Test is in")
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        })
        // navigation.navigate("Account")

  return <></>
}
export default AuthPage