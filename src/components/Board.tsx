import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  position: relative;
  /* padding: 20px 0px; */
  padding-top: 30px;
  background-color: rgba(240, 240, 240, 0.7);
  border-radius: 15px;
  box-shadow: 10px 10px 30px 5px rgba(0, 0, 0, 0.07);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Blur = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: inherit;
  z-index: -1;
  backdrop-filter: blur(15px);
  width: 100%;
  height: 100%;
`;

const Title = styled.h1`
  color: black;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  user-select: none;
  cursor: default;
`;

const Area = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) =>
    props.isDraggingOver ? "rgba(0,0,0,0.05)" : "none"};
  /* border-radius: 15px; */
  padding: 10px 15px;
  flex-grow: 1;
  transition: background-color 0.1s ease-in-out;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  input {
    all: unset;
    background-color: rgba(255, 255, 255, 0.75);
    border-radius: 10px;
    padding: 5px 10px;
    font-size: 14px;
    width: 200px;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  return (
    <Wrapper>
      <Blur></Blur>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder="add task"
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
