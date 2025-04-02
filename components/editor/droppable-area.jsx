"use client";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import ElementRenderer from "./element-renderer";

export default function DroppableArea({
  elements,
  onElementSelect,
  onElementDelete,
  onMoveUp,
  onMoveDown,
  selectedElementId,
}) {
  const { setNodeRef } = useDroppable({
    id: "droppable-area",
  });

  return (
    <div ref={setNodeRef} className="min-h-[600px]">
      {elements.map((element) => (
        <SortableElement
          key={element.id}
          element={element}
          onElementSelect={onElementSelect}
          onElementDelete={onElementDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          isSelected={element.id === selectedElementId}
          isFirst={elements.indexOf(element) === 0}
          isLast={elements.indexOf(element) === elements.length - 1}
        />
      ))}
    </div>
  );
}

function SortableElement({
  element,
  onElementSelect,
  onElementDelete,
  onMoveUp,
  onMoveDown,
  isSelected,
  isFirst,
  isLast,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? "outline outline-2 outline-blue-500" : ""}`}
      onClick={() => onElementSelect(element)}
      {...attributes}
      {...listeners}
    >
      <ElementRenderer element={element} />

      {isSelected && (
        <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 bg-white rounded-md shadow-sm p-1 z-10">
          <button
            className="text-gray-600 hover:bg-gray-100 rounded-md p-1 disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(element.id);
            }}
            disabled={isFirst}
            title="Move Up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>

          <button
            className="text-gray-600 hover:bg-gray-100 rounded-md p-1 disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(element.id);
            }}
            disabled={isLast}
            title="Move Down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>

          <button
            className="text-red-500 hover:bg-red-50 rounded-md p-1"
            onClick={(e) => {
              e.stopPropagation();
              onElementDelete(element.id);
            }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
