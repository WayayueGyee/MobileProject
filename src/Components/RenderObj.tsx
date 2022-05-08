import React  from "react";
import { View } from "react-native";
import { useTheme, makeStyles } from '@rneui/themed';
import { FunctionBlock } from "./FunctionBlock";
import { DeclareBlock } from "./DeclareBlock";
import { NameBlock } from "./NameBlock";
import state from '../Data/blocksState';

export const RenderObj: React.FC = () => {
    const data = state;

    const { theme } = useTheme();
    const styles = useStyles(theme);
    
    return (
        <View>
            {
                Object.entries(data).map(([key, value]: [key: string | number, value: any]) => {
                    switch (value.type) {
                        case "function": 
                            return (
                                <View key={key.toString()} style={styles.obj}>
                                    <NameBlock text={value.name} keys={[key]}/>
                                    <FunctionBlock content={value.content} keys={[key]}/>
                                </View>
                            )

                        case "declare": 
                            return (
                                <View key={key.toString()} style={styles.obj}>
                                    <NameBlock text={value.name} keys={[key]}/>
                                    <DeclareBlock content={value.content} keys={[key]}/>
                                </View>
                            )
                    }

                    return;
                })
            }
        </View>
    )
}

const useStyles = makeStyles((theme) => ({
    obj: {
        backgroundColor: theme.colors?.background,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },

    input: {
        backgroundColor: theme.colors?.warning,
        color: theme.colors?.white,
        marginLeft: 10,
        marginTop: 10,
        minWidth: 50,
        borderRadius: 10
    }
}))
