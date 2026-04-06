import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import signIn from './sign-in'

const signUp = () => {
  return (
    <View>
      <Text>sign-up</Text>
      <Link href="/(auth)/sign-in">Go to sign in</Link>
    </View>
  )
}

export default signUp