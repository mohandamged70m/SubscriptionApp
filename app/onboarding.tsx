import { Text } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'

const SafeAreaView = styled(RNSafeAreaView);

const onboarding = () => {
  return (
    <SafeAreaView className='flex-1 bg-background p-5'>
      <Text>onboarding</Text>
    </SafeAreaView>
  )
}

export default onboarding