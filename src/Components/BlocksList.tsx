import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useTheme, makeStyles, Icon, Button } from '@rneui/themed';
import blocksState from "../Data/blocksState"; 
import { RenderObj } from "./RenderObj";

export const BlocksList: React.FC = () => {
  const [isVisible, setVisible] = useState(false);

  const [blockType, setBlockType] = useState('');
  const [blockName, setBlockName] = useState('');
  const [blockValue, setBlockValue] = useState('');

  const block: any = blocksState;
  const { theme } = useTheme();
  const styles = useStyles(theme);
  
  const onPressEvent = (content: {id: number | string, type: string, name: string, value: string}) => {
    block[content.id] = {
      type: content.type,
      name: content.name,
      content: {
        1: {
          type: 'text', value: content.value
        }
      }
    }
  }

  useEffect(() => {
    setBlockName('');
    setBlockValue('');
    console.log(block);
  }, [block])

  return (
    <View style={isVisible ? styles.darkCommonView : styles.commonView}>
      <View style={styles.menu}>
        <Text style={styles.text}>Menu</Text>
        <TouchableOpacity onPress={() => {
            setVisible(true);
        }}>
          <Icon
              name="add-to-list"
              type='entypo'
          />
        </TouchableOpacity>
      </View>
      <Modal
      animationType = {"fade"}
      transparent={true}
      visible={isVisible}
      presentationStyle="pageSheet"
      onRequestClose={() => {
      alert('Modal has now been closed.');
      }}>
        <View style={{marginTop: '20%', minHeight: '60%', backgroundColor: 'white'}}>
          <View style={styles.blocksSelectView}>
            <TouchableOpacity style={styles.selectionBlock} onPress={() => setBlockType('function')}>
              <Text style={styles.selectionText}>Function</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectionBlock} onPress={() => setBlockType('declare')}>
              <Text style={styles.selectionText}>Declare</Text>
            </TouchableOpacity>
          </View>
          <TextInput placeholder="name" value={blockName} onChangeText={(text) => setBlockName(text)}/>
          <TextInput placeholder="value" value={blockValue} onChangeText={(text) => setBlockValue(text)}/>
          <Button buttonStyle={{backgroundColor: theme.colors?.success}} title="Add" onPress={() => {
            onPressEvent({id: Date.now(), type: blockType, name: blockName, value: blockValue});
          }}/>
          <Button 
            title="Close Modal" 
            onPress={() => {setBlockType(''); setVisible(!isVisible);}}  
            icon={{name: "close", type: 'antdesign'}}
            buttonStyle={styles.closeButton}
            iconRight={true}
          />
        </View>
      </Modal>
      <RenderObj/>
    </View>
  )
}

const useStyles = makeStyles((theme) => ({
  commonView: {
    backgroundColor: theme.colors?.grey0
  },

  darkCommonView: {
    opacity: 0.15,
    backgroundColor: theme.colors?.grey0
  },

  renderView: {
    width: '100%'
  },

  menu: {
    backgroundColor: theme.colors?.primary,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    backgroundColor: 'lightblue',
  },

  text: {
    fontSize: 18
  },

  blocksSelectView: {
    flexDirection: 'row',
  },

  selectionBlock: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme.colors?.grey4
  },

  selectionText: {
    textAlign: 'center',
    fontSize: 16
  },

  closeButton: {
    backgroundColor: '#FF3333'
  }
}));
