import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Card = styled.div<{ index: number; isDragging: boolean }>`
  min-height: 35px;
  border-radius: 15px;
  padding: 15px 30px;
  background-color: ${(props) =>
    props.isDragging ? props.theme.cardColor : "rgba(255,255,255,0.7)"};
  box-shadow: ${(props) =>
    props.isDragging ? ` 0px 2px 5px rgba(0,0,0,0.5)` : `none`};
  color: ${(props) => (props.isDragging ? "white" : "rgba(0,0,0,0.6)")};
  font-weight: 500;
  margin-bottom: 10px;
  user-select: none;
  /* transition: box-shadow 0.1s ease-in-out; */
  transition: background-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
`;

interface IDraggableProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggableProps) {
  const [toDos] = useRecoilState(toDoState);
  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  });
  return (
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          index={index}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
