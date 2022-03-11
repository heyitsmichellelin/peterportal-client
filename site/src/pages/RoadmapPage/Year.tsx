import React, { FC, useState, useRef } from "react";
import "./Year.scss";
import { Button, Form, Popover, Overlay, Dropdown, DropdownButton } from "react-bootstrap";
import {
  CaretRightFill,
  CaretDownFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { Droppable } from "react-beautiful-dnd";
import Quarter from "./Quarter";
import { useAppDispatch } from '../../store/hooks';
import { addQuarter, deleteYear } from '../../store/slices/roadmapSlice';

import { PlannerYearData } from '../../types/types';

interface YearProps {
  yearIndex: number;
  data: PlannerYearData;
}

const Year: FC<YearProps> = ({ yearIndex, data }) => {
  const dispatch = useAppDispatch();
  const [showContent, setShowContent] = useState(true);
  const [show, setShow] = useState(false);
  const [showAddQuarter, setShowAddQuarter] = useState(false);
  const [target, setTarget] = useState<any>(null!);
  const [addQuarterTarget, setAddQuarterTarget] = useState<any>(null!);

  const handleEditClick = (event: React.MouseEvent) => {
    if (showAddQuarter) {
      /* hide both overlays */
      setShowAddQuarter(!showAddQuarter);
      setShow(!show);
    } else {
      setShow(!show);
      setTarget(event.target);
    }
  };

  const handleShowAddQuarterClick = (event: React.MouseEvent) => {
    setShowAddQuarter(!showAddQuarter);
    setAddQuarterTarget(event.target);
  }

  const handleAddQuarterClick = (year: number, quarter: string) => {
    dispatch(addQuarter({ startYear: year, quarterData: { name: quarter, courses: [] } }));
  }

  const calculateYearStats = () => {
    let unitCount = 0;
    let courseCount = 0;
    data.quarters.forEach(quarter => {
      quarter.courses.forEach(course => {
        unitCount += course.units[0];
        courseCount += 1;
      })
    })
    return { unitCount, courseCount };
  };

  let { unitCount, courseCount } = calculateYearStats();

  return (
    <div className="year">
      <div className="yearTitleBar">
        <Button
          variant="link"
          className="year-accordion"
          onClick={() => {
            setShowContent(!showContent);
          }}
        >
          <span className="year-accordion-title">
            <span id="year-title">
              {showContent ? (
                <CaretDownFill className="caret-icon" />
              ) : (
                <CaretRightFill className="caret-icon" />
              )}
              <span id="year-number">Year {yearIndex + 1} </span>
              <span id="year-range">
                ({data.startYear} - {data.startYear + 1})
              </span>
            </span>
            <span id="year-stats">
              <span id="course-count">{courseCount}</span>{" "}
              {courseCount === 1 ? "course" : "courses"},{" "}
              <span id="unit-count">{unitCount}</span>{" "}
              {unitCount === 1 ? "unit" : "units"}
            </span>
          </span>
        </Button>
        <ThreeDots onClick={handleEditClick} className="edit-btn" />
        <Overlay show={show} target={target} placement="bottom">
          <Popover id={`year-menu-${yearIndex}`}>
            <Popover.Content className="year-settings-popup">
              <div>
                <Button onClick={handleShowAddQuarterClick} variant="light" className="year-settings-btn">
                  Add Quarter
                </Button>
                <Button variant="light" className="year-settings-btn">
                  Edit Year
                </Button>
                <Button
                  variant="light"
                  className="year-settings-btn"
                  id="remove-btn"
                  onClick={() => {
                    dispatch(deleteYear({
                      yearIndex: yearIndex
                    }));
                  }}
                >
                  Remove
                </Button>
              </div>
            </Popover.Content>
          </Popover>
        </Overlay>
        <Overlay show={showAddQuarter} target={addQuarterTarget} placement="right">
          <Popover id={`add-quarter-menu-${yearIndex}`}>
            <Popover.Content>
              <div>
                <Button disabled={data.quarters.map(quarter => quarter.name).includes("summer I")} onClick={() => handleAddQuarterClick(data.startYear, "summer I")} variant="light" className="year-settings-btn">Summer I</Button>
                <Button disabled={data.quarters.map(quarter => quarter.name).includes("summer II")} onClick={() => handleAddQuarterClick(data.startYear, "summer II")} variant="light" className="year-settings-btn">Summer II</Button>
                <Button disabled={data.quarters.map(quarter => quarter.name).includes("summer 10 Week")} onClick={() => handleAddQuarterClick(data.startYear, "summer 10 Week")} variant="light" className="year-settings-btn">Summer 10 Week</Button>
              </div>
            </Popover.Content>
          </Popover>
        </Overlay>
      </div>
      {showContent && (
        <div className="year-accordion-content">
          {
            data.quarters.map((quarter, quarterIndex) => {
              return <Quarter
                key={`year-quarter-${quarterIndex}`}
                year={data.startYear + (quarterIndex == 0 ? 0 : 1)}
                yearIndex={yearIndex}
                quarterIndex={quarterIndex}
                data={quarter}
              />
            })
          }
        </div>
      )}
    </div>
  );
};

export default Year;
