import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import { Icon } from '@rneui/themed';


export const HeaderMenu: React.FC = () => {
    const [isVisible, setVisible] = useState(false);
    const { theme } = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.view}>
            <Text style={styles.text}>Menu</Text>
            <TouchableOpacity onPress={() => {
                setVisible(true);
            }}>
                <Icon
                    name="add-to-list"
                    type='entypo'
                />
            </TouchableOpacity>
                <Modal
                animationType = {"slide"}
                transparent={true}
                visible={isVisible}
                presentationStyle="pageSheet"
                style={{maxHeight: 50}}
                onRequestClose={() => {
                alert('Modal has now been closed.');
                }}>
                    <View style={{minHeight: '80%', backgroundColor: 'white'}}>
                <Text style = { styles.text }>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Maecenas eget tempus augue, a convallis velit.</Text>
                <Text 
                    onPress={() => {
                    setVisible(!isVisible)}}>Close Modal</Text>
                    </View>
            </Modal>
        </View>
    )
}

const useStyles = makeStyles((theme) => ({
    view: {
        flex: 1,
        padding: 15,
        backgroundColor: theme.colors?.primary,
        flexDirection: 'row',
        justifyContent: 'space-between'        
    },

    text: {
        fontSize: 16
    },

    modal: {
        width: '20%',
    }
}))
