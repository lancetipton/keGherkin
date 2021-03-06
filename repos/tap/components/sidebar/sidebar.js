import { View } from 'SVComponents'
import { checkCall } from '@keg-hub/jsutils'
import { Animated } from 'react-native'
import { useTheme } from '@keg-hub/re-theme'
import { SidebarToggle } from './sidebarToggle'
import { noOpObj, noOp } from 'SVUtils/helpers/noop'
import { isValidComponent } from 'SVUtils/validate/isValidComponent'
import React, { 
  useMemo,
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef
} from 'react'

// TODO - More to utility method when migrated to keg-components
/**
 * Checks if the animation should NOT run
 * @param {boolean} toggled - Current state of the Drawer toggled open
 * @param {number} current - Current height of the Drawer / animated.value
 * @param {number} heights - Ref that holds the initial and max heights of the slider
 *
 * @returns {boolean} - If the animation should NOT run
 */
const noAnimate = (toggled, current, { initial, to }) =>
  (!toggled && current === initial) || (toggled && current === to)


export const Sidebar = props => {
  const {
    children,
    initial=0,
    to=0,
    styles,
    toggled,
    type='timing',
    config=noOpObj,
    onToggled=noOp,
    ToggleComponent=SidebarToggle,
    ...childProps
  } = props

  const theme = useTheme()

   const sidebarStyles = useMemo(() => {
    return theme.get('sidebar', styles)
  }, [ theme, styles ])

  // Store the toggled state for reference later
  const [ isToggled, setIsToggled ] = useState(toggled)
  const [ originalToggled, setOriginalToggled ] = useState(toggled)

  // If the passed in toggled does not match the original toggled
  // Then update the toggled boolean to rerender
  // This allows changing the toggled prop outside the sidebar
  // And still allowing the sidebar to update
  useEffect(() => {
    if(originalToggled === toggled) return

    setOriginalToggled(toggled)
    setIsToggled(toggled)
  }, [ toggled, originalToggled ])

  // Define the animated value as a ref
  const [ animation, setAnimation ] = useState(new Animated.Value(initial))

  // Cache the initial animation values
  const xPosRef = useRef({ initial, to })

  // Wrapper to toggle the sidebar
  // Also calls the onToggled prop if it's passed in
  const onTogglePress = useCallback(event => {
    const toggleUpdate = !isToggled
    setIsToggled(toggleUpdate)
    checkCall(onToggled, toggleUpdate)
  }, [ isToggled, setIsToggled, initial, to ])

  // Use useLayoutEffect to check if the sidebar should be animated
  // Within the hook, toggled flag defines how to update the animated value
  // To Open: isToggled === true === should animate open
  // To Close: isToggled === false === should animate close
  useLayoutEffect(() => {
    if(!xPosRef.current) return

    // Check if we should animate the slider
    // If the values have not changed, no need to animate
    if (noAnimate(isToggled, animation._value, xPosRef.current)) return

    const { initial, to } = xPosRef.current

    // // Define the from and to values for the animation based on isToggled flag
    const xPosChanges = isToggled
      ? { from: initial, to: to }
      : { from: to, to: initial }

    // Update the animation value to animate from
    animation.setValue(xPosChanges.from)

    // Start the animation, from value ==> to value
    const animationConfig = config
      ? { ...config, toValue: xPosChanges.to }
      : { toValue: xPosChanges.to }
    Animated[type](animation, animationConfig).start()

    // Add isToggled as a dep, so anytime it changes, we run the hook code
  }, [isToggled, type, config])

  return (
    <>
      <Animated.View
        style={[
          sidebarStyles?.main,
          { left: animation },
        ]}
      >
        <View 
          className='sidebar-main'
          style={sidebarStyles?.content}
        >
          { children }
        </View>
        { isValidComponent(ToggleComponent) && (
          <ToggleComponent
            toggled={isToggled}
            styles={sidebarStyles?.toggle}
            onPress={onTogglePress}
          />
        )}
      </Animated.View>
    </>
  )
}

// Add the toggle component helper
Sidebar.Toggle = SidebarToggle