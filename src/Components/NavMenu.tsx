import React, { useState } from "react"
import { View, Text } from "react-native"
import { useTheme, makeStyles } from "@rneui/themed"

type props = { children: JSX.Element[] | JSX.Element }

const NavMenu: React.FC<props> = ({ children = [] }) => {
	const { theme } = useTheme()
	const styles = useStyles(theme)


	return <View style={styles.menu}>
			<Text style={styles.text}>Menu</Text>
		</View>
}

const useStyles = makeStyles(theme => ({
	menu: {
    backgroundColor: theme.colors?.primary,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
    
  },
	text: {
    fontSize: 18
  },
}))

export default NavMenu;