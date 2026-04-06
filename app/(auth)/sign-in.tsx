import { View, Text } from 'react-native'
import { Link } from 'expo-router'

const signIn = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link href="/(auth)/sign-up">Go to sign up</Link>
    </View>
  )
}

export default signIn