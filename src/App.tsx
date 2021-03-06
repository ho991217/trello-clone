import { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./components/Board";

const Wrapper = styled.div`
  /* position: relative; */
  display: flex;
  flex-direction: column;
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

const Area = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) =>
    props.isDraggingOver ? "rgba(0,0,0,0.05)" : "none"};
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  i {
    padding-top: 100px;
    text-align: center;
    font-size: 100px;
    color: ${(props) =>
      props.isDraggingOver ? "rgba(0,0,0,0.3)" : "transparent"};
    transition: color 0.2s ease-in-out;
  }
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;

    if (!destination) return;
    if (destination?.droppableId === "trashCan") {
      setToDos((oldToDos) => {
        const boardCopy = [...oldToDos[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...oldToDos,
          [source.droppableId]: boardCopy,
        };
      });
    }

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
  useEffect(() => {
    const td = localStorage.getItem("toDos");
    if (td) {
      setToDos(JSON.parse(td));
    }
  }, [setToDos]);
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
        <Droppable droppableId="trashCan">
          {(magic, snapshot) => (
            <Area
              isDraggingOver={snapshot.isDraggingOver}
              ref={magic.innerRef}
              {...magic.droppableProps}
            >
              <i className="fas fa-trash"></i>
              {magic.placeholder}
            </Area>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
