import React, { useCallback, useReducer } from "react";
import "./SearchSidebar.scss";
import { InputGroup, FormControl } from "react-bootstrap";
import { Search, PlusCircle } from "react-bootstrap-icons";
import { Droppable, Draggable } from "react-beautiful-dnd";

function SearchSidebar({ state }) {
  return (
    <div className="search-sidebar">
      <h1 className="title">Add a course</h1>
      <PlusCircle /> Custom
      <InputGroup className="search">
        <Search />
        <FormControl
          placeholder="Search"
          aria-label="Search"
          className="search-bar"
        />
      </InputGroup>
      <Droppable droppableId="search" type="COURSE">
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="quarter"
            >
              {state["search"]?.map((course, index) => {
                return (
                  <Draggable
                    key={course.id}
                    draggableId={course.id}
                    index={index}
                  >
                    {(provided) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="course">
                            <div className="name">{course.name}</div>
                            <div className="title">{course.title}</div>
                            <div className="units">{course.units} units</div>
                          </div>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default SearchSidebar;
