import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./components/Board";

const Wrapper = styled.div`
  /* position: relative; */
  display: flex;
  width: 100vw;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  filter: blur(50%);
`;

const Circle1 = styled.div`
  background-color: rgb(180, 214, 244);
  width: 1500px;
  height: 1500px;
  border-radius: 50%;
  z-index: -2;
  position: absolute;
  top: -500px;
  left: -100px;
`;
const Circle2 = styled.div`
  background-color: rgb(193, 196, 228);
  width: 1200px;
  height: 1200px;
  border-radius: 50%;
  z-index: -1;
  position: absolute;
  bottom: -100px;
  right: -300px;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  max-width: 1000px;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((oldToDos) => {
        const boardCopy = [...oldToDos[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...oldToDos,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        {/* <Blur></Blur> */}
        <Circle1></Circle1>
        <Circle2></Circle2>
        {/* <Circle3></Circle3> */}

        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
