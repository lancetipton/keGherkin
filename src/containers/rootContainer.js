import React, { useEffect } from 'react'
import { useTheme } from '@keg-hub/re-theme'
import {
  View,
  Sidebar,
  FeatureList,
  withAppHeader
} from 'SVComponents'

import { init } from 'SVActions'
import { Screen } from './screens/screen'

export const RootContainer = withAppHeader('KeGherkin Editor', props => {
  const theme = useTheme()
  const containerStyles =  theme.containers.root
  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <View
        className={`sidebar-back`}
        style={theme?.sideBar?.back} 
      />
      <View className={`tap-main`} style={containerStyles.main}>
        <Sidebar styles={theme?.sideBar} >
          <FeatureList />
        </Sidebar>
        <Screen />
      </View>
    </>
  )
})
