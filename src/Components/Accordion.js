import { useId, useState, useRef } from "react";

function getAccordionHeaderId(accordionId, value) {
  return accordionId + "-header-" + value;
}

function getAccordionPanelId(accordionId, value) {
  return accordionId + "-panel-" + value;
}

export default function Accordion({ sections }) {
  const accordionId = useId();
  const [openSections, setOpenSections] = useState(new Set());
  const headerRefs = useRef(new Map());

  const handleKeyDown = (event, index) => {
    const total = sections.length;
    let nextIndex;

    switch (event.key) {
      case "ArrowDown":
        nextIndex = (index + 1) % total;
        break;
      case "ArrowUp":
        nextIndex = (index - 1 + total) % total;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = total - 1;
        break;
      default:
        return; // Enter and Space are handled by onClick on <button> automatically
    }

    event.preventDefault();
    const nextValue = sections[nextIndex].value;
    headerRefs.current.get(nextValue)?.focus();
  };

  return (
    <div className="accordion">
      {sections.map(({ value, title, contents }, index) => {
        const isExpanded = openSections.has(value);
        const headerId = getAccordionHeaderId(accordionId, value);
        const panelId = getAccordionPanelId(accordionId, value);

        return (
          <div className="accordion-item" key={value}>
            <button
              ref={(node) => {
                if (node) headerRefs.current.set(value, node);
                else headerRefs.current.delete(value);
              }}
              id={headerId}
              aria-controls={panelId}
              aria-expanded={isExpanded}
              className="accordion-item-title"
              type="button"
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => {
                const newOpenSections = new Set(openSections);
                newOpenSections.has(value)
                  ? newOpenSections.delete(value)
                  : newOpenSections.add(value);
                setOpenSections(newOpenSections);
              }}
            >
              {title}{" "}
              <span
                aria-hidden={true}
                className={[
                  "accordion-icon",
                  isExpanded && "accordion-icon--rotated",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="accordion-item-contents"
              hidden={!isExpanded}
            >
              {contents}
            </div>
          </div>
        );
      })}
    </div>
  );
}
