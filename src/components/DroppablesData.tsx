import React, { useContext } from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

import { ElementData, ProgramData } from "../types/Types";
import {
  ConditionalComponent,
  FunctionComponent,
  InitComponent,
  LoopComponent,
} from "../Modules/ProgramBlocks";

const DNDElementsContext = React.createContext<ProgramData>(undefined);

export function useDNDElements() {
  return useContext(DNDElementsContext);
}

// эта хуйня не работает
// function createChildrensObject(childrens: JSX.Element[]) {
//   let DNDElements = [];

//   for (let i = 0; i < childrens.length; i++) {
//     let x, y, width, height;

//     childrens[0].measure((fx, fy, _width, _height, px, py) => {
//       x = px;
//       y = py;
//       width = _width;
//       height = _height;
//     });

//     let children = childrens[0];
//     children.DNDElements.push({ x, y, width, height });
//   }
// }

/*
Вместо обработки всех потомков, мы будем передавать в объект уже готовую информацию о блоках.
Контекстом в данном случае будет выступать информация о блоках.
Перерисовка будет происходить после обновления контекста:
если мы добавим блок на экран или изменим положение блока, контекст изменится и весь FlatList перерисуется.
Так как мы используем FlatList, то по идее всё должно быть более или менее оптимизировано.
Однако внутри Droppable-блоков не будет использоваться FlatList, так как каждому списку нужно передать данные,
которые будут отрисовываться => в каждый Droppable-блок нужно будет передать только информацию о его потомках =>
эту информацию нужно будет достать из большого объекта с информацией обо всех блоках, что в целом не сложно,
но уменьшает гибкость блока Droppable и влечёт ненужное копироване данных (но можно и подумать над этим)
*/
interface DNDElementsProviderProps {
  programData?: ProgramData;
}

const ProgramBlocks = {
  FunctionBlock: FunctionComponent,
  LoopBlock: LoopComponent,
  InitBlock: InitComponent,
  ConditionalOperator: ConditionalComponent,
};

function createElementByElementData(elementData: ElementData) {
  return React.createElement(ProgramBlocks[typeof elementData.type]);
}
// TODO: удалить всё нахуй.
function DNDElementsProvider({ programData }: DNDElementsProviderProps) {
  return (
    <DNDElementsContext.Provider value={programData}>
      <FlatList
        data={programData}
        renderItem={item => createElementByElementData(item.item)}
      />
    </DNDElementsContext.Provider>
  );
}

DNDElementsProvider.propTypes = {
  programData: PropTypes.object,
};

export { DNDElementsContext };
