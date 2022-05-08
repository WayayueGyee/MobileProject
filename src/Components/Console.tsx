import React, { useState } from "react"
import { StyleSheet, ScrollView, Text } from "react-native"
import { ButchBuilder } from "src/Butch/Butch";

const Console: React.FC<{ builder: ButchBuilder }> = ({ builder }) => {
    const [textStream, setTextStream] = useState({ id: "", value: "" });
    
    if (!textStream.id)
        textStream.id = builder.useOutStream({ write: (str: string) => {
            setTextStream(prev => { 
                return { id: prev.id, value: prev.value + str };
            });
        }});

    return (
        <ScrollView style={styles.win}>
            <Text style={styles.text}>
                {textStream.value}  
            </Text>
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    win: {
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        paddingLeft: 10
    },
    text: {
        color: "white",
        fontSize: 16,
    }
})

export default Console