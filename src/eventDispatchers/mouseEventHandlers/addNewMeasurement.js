import external from './../../externalModules.js';
import { mutations } from './../../store/index.js';
import { addToolState } from './../../stateManagement/toolState.js';
import moveHandle from './../../manipulators/moveHandle.js';
import moveNewHandle from './../../manipulators/moveNewHandle.js';

const cornerstone = external.cornerstone;

export default function (evt, tool) {
  //
  evt.preventDefault();
  evt.stopPropagation();
  const mouseEventData = evt.detail;
  const element = mouseEventData.element;
  const measurementData = tool.createNewMeasurement(mouseEventData);

  if (!measurementData) {
    return;
  }

  // Associate this data with this imageId so we can render it and manipulate it
  addToolState(element, tool.name, measurementData);

  mutations.SET_IS_TOOL_LOCKED(true);
  cornerstone.updateImage(element);

  let handleMover;

  if (Object.keys(measurementData.handles).length === 1) {
    handleMover = moveHandle;
  } else {
    handleMover = moveNewHandle;
  }

  let preventHandleOutsideImage;

  if (tool.options && tool.options.preventHandleOutsideImage !== undefined) {
    preventHandleOutsideImage = tool.options.preventHandleOutsideImage;
  } else {
    preventHandleOutsideImage = false;
  }

  handleMover(
    mouseEventData,
    tool.name,
    measurementData,
    measurementData.handles.end,
    // On mouse up
    function () {
      console.log('addNewMeasurement: mouseUp');
      measurementData.active = false;
      measurementData.invalidated = true;
      //   If (anyHandlesOutsideImage(mouseEventData, measurementData.handles)) {
      //     // Delete the measurement
      //     RemoveToolState(element, toolType, measurementData);
      //   }

      mutations.SET_IS_TOOL_LOCKED(false);
      cornerstone.updateImage(element);
    },
    preventHandleOutsideImage
  );
}