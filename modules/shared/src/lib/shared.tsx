import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import './shared.module.scss'

// Types
interface ComponentData {
  id: string;
  width: number; // Pixel value
  height: number; // Pixel value
  borderRadius?: number; // Pixel value
  style: any;
  className?: string;
}

// Draggable Component
const DraggableComponent: React.FC<ComponentData & { onDragStop: (e: any, data: any) => void }> = ({
  id,
  width,
  height,
  style,
  className,
  onDragStop,
}) => {
  return (
    <Draggable
      onStop={onDragStop}
      bounds="parent" // Ensures the component stays within its parent
    >
      <div
        id={id}
        className={className}
        style={{
          width,
          height,
          background: 'lightblue',
          position: 'absolute',
          ...style
        }}
      >
      </div>
    </Draggable>
  );
};

// Main Component
const DndReactDraggableApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [components, setComponents] = useState<ComponentData[]>([
    { id: 'messageBox', width: 150, height: 50, className: "left-expander", style: { borderRadius: 10 } }, // in pixels
    { id: 'avatar', width: 50, height: 50, style: { borderRadius: 50 } }, // in pixels
  ]);
  const [saved, setSaved] = useState<string[]>([])

  const handleDragStop = (id: string) => (e: any, data: any) => {
    const { x, y } = data;

    setComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id
          ? { ...comp, top: Math.abs(y), left: x }
          : comp
      )
    );
  };

  type Transform = {
    x: number;
    y: number;
  };

  function adjustTransformsToTopLeft(children: HTMLElement[]): void {
    const transforms: Transform[] = children.map((child) => {
      const style = window.getComputedStyle(child);
      const transformMatrix = style.transform;

      // Extract the x and y values from the matrix (assuming a 2D transform)
      const match = transformMatrix.match(/matrix\(([^,]+),[^,]+,[^,]+,[^,]+,([^,]+),([^,]+)\)/);

      if (match) {
        const x = parseFloat(match[2]);
        const y = Math.abs(parseFloat(match[3]));
        return { x, y };
      }

      // Default to no transform if no match
      return { x: 0, y: 0 };
    });

    // Find the minimum x and y values
    const minX = Math.min(...transforms.map((t) => t.x));
    const minY = Math.min(...transforms.map((t) => t.y));

    // Adjust the transforms to move everything to top-left
    children.forEach((child, index) => {
      const currentX = transforms[index].x
      const currentY = transforms[index].y
      const newX = currentX - minX;
      const newY = currentY - minY;

      // Apply the new transform
      child.style.transform = `translate(${newX}px, ${newY}px)`;
    });
  }

  function calculateBoundingBox() {
    const box1 = document.getElementById('messageBox');
    const box2 = document.getElementById('avatar');
    const boundingBox = document.getElementById('droppable-container');

    if (!box1 || !box2 || !boundingBox) {
      console.error("Boxes or bounding box element not found");
      return { width: '0px', height: '0px' };
    }

    // Get the bounding client rectangle for each box
    const rect1 = box1.getBoundingClientRect();
    const rect2 = box2.getBoundingClientRect();

    // Calculate the outermost boundaries
    const top = Math.min(rect1.top, rect2.top);
    const left = Math.min(rect1.left, rect2.left);
    const right = Math.max(rect1.right, rect2.right);
    const bottom = Math.max(rect1.bottom, rect2.bottom);

    // Set bounding box size and position
    const width = `${right - left}px`;
    const height = `${bottom - top}px`;
    return { width, height };
  }


  const exportHtml = () => {
    const container = document.getElementById('droppable-container');
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const { width, height } = calculateBoundingBox()

    adjustTransformsToTopLeft(children);

    const childDivs = children.map((child: Element) => {
      const style = (child as HTMLElement).style.cssText; // Grab inline styles
      return `<div id="${child.id}" className="${child.className}" style="${style}">${child.innerHTML}</div>`;
    });
    const exportedHtml = `<div id="wrapper" style="height: ${height}; width: ${width};" class="container" >\n  ${childDivs.join('\n  ')}\n</div>`;
    setSaved([...saved, exportedHtml])
    console.log(exportedHtml)
  };

  return (
    <div >
      <div
        id="droppable-container"
        ref={containerRef}
        style={{
          width: 500,
          height: 200,
          border: '1px dashed black',
          position: 'relative',
        }}
      >
        {components.map((component) => (
          <DraggableComponent
            key={component.id}
            id={component.id}
            width={component.width}
            height={component.height}
            style={component.style}
            className={component.className}
            onDragStop={handleDragStop(component.id)}
          />
        ))}
      </div>
      <button onClick={exportHtml}>Add to Thread</button>
      <div style={{ border: '1px dashed black', width: '100%', height: 'auto' }}>
        {saved.map((html, i) => {
          const span = <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
          return span
        })}
      </div>
    </div>
  );
};

export default DndReactDraggableApp;
