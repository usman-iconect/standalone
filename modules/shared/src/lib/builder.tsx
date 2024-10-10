import React, { useState, FC } from 'react';
import classNames from 'classnames';

type MessageHolderProps = {
    htmlContent: string;
};

const MessageHolder: FC<MessageHolderProps> = ({ htmlContent }) => {
    return (
        <div
            className="message-holder"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

type ToolbarProps = {
    onInsert: (htmlString: string) => void;
    setHtmlContent: (htmlContent: string) => void;
};

const Toolbar: FC<ToolbarProps> = ({ onInsert, setHtmlContent }) => {

    return (
        <>
            <div className="toolbar">
                <button onClick={() => {
                    const htmlString = `<div class="msg-comp avatar">AB</div>`;
                    onInsert(htmlString)
                }}>Insert Avatar</button>
                <MarginEditor setHtmlContent={setHtmlContent} />
                <ContainerAlign setHtmlContent={setHtmlContent} />
                <InsertMetaData setHtmlContent={setHtmlContent} />

            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => {
                    const selectedElement = document.querySelector('.selected') as HTMLElement;
                    if (selectedElement)
                        selectedElement.remove();
                }}>Delete selected</button>
                <button onClick={() => {
                    const selectedElement = document.querySelector('.selected') as HTMLElement;
                    if (selectedElement) {
                        const children = selectedElement.children;
                        for (let i = children.length; i > 0; i--) {
                            selectedElement.appendChild(children[i - 1]);
                        }
                    }
                }}>Flip Items</button>
            </div>
        </>
    );
};

const MarginEditor: React.FC<{ setHtmlContent: (htmlContent: string) => void }> = ({ setHtmlContent }) => {
    const [marginSide, setMarginSide] = useState<string>('marginTop');
    const [marginValue, setMarginValue] = useState<number>(0);

    // Update margin of the selected element
    const updateMargin = (value: number) => {
        const selectedElement = document.querySelector('.selected') as HTMLElement;
        if (selectedElement) {
            selectedElement.style[marginSide as any] = `${value}px`;
        }
        setHtmlContent(document.getElementById('wrapper')?.outerHTML || '');
    };

    // Handle slider/input changes
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setMarginValue(value);
        updateMargin(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setMarginValue(value);
        updateMargin(value);
    };

    return (
        <div>
            <h4>Margin Editor</h4>
            <label>
                Select Margin Side:
                <select value={marginSide} onChange={(e) => setMarginSide(e.target.value)}>
                    <option value="marginTop">Top</option>
                    <option value="marginRight">Right</option>
                    <option value="marginBottom">Bottom</option>
                    <option value="marginLeft">Left</option>
                </select>
            </label>
            <br />

            <label>
                Adjust Margin (px):
                <input
                    type="range"
                    max="100"
                    value={marginValue}
                    onChange={handleSliderChange}
                />
            </label>
            <br />

            <label>
                Manual Input (px):
                <input
                    type="number"
                    value={marginValue}
                    onChange={handleInputChange}
                />
            </label>
        </div>
    );
};

const ContainerAlign: React.FC<{ setHtmlContent: (htmlContent: string) => void }> = ({ setHtmlContent }) => {
    const [vAlign, setVAlign] = useState<string>('flex-start');
    const [hAlign, setHAlign] = useState<string>('flex-start');
    const [direction, setDirection] = useState<string>('row');

    return (
        <div>
            <h3>Change Alignment</h3>
            <label>
                Select Justify Content:
                <select value={vAlign} onChange={(e) => setVAlign(e.target.value)}>
                    <option value="flex-start">Start</option>
                    <option value="flex-end">End</option>
                    <option value="center">Center</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-evenly">Space Evenly</option>
                </select>
            </label>
            <br />
            <label>
                Select Align Items:
                <select value={hAlign} onChange={(e) => setHAlign(e.target.value)}>
                    <option value="flex-start">Start</option>
                    <option value="flex-end">End</option>
                    <option value="center">Center</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-evenly">Space Evenly</option>
                </select>
            </label>
            <br />
            <label>
                Direction:
                <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                </select>
            </label>
            <br />
            <button onClick={() => {
                const selectedElement = document.querySelector('.selected') as HTMLElement;
                if (selectedElement) {
                    selectedElement.style.justifyContent = hAlign;
                    selectedElement.style.alignItems = vAlign;
                    selectedElement.style.flexDirection = direction;
                    setHtmlContent(document.getElementById('wrapper')?.outerHTML || '');
                }
            }}>Change</button>
        </div>
    );
};

const InsertMetaData: React.FC<{ setHtmlContent: (htmlContent: string) => void }> = ({ setHtmlContent }) => {
    const [data, setData] = useState<string>('time');
    const [location, setLocation] = useState<string>('top');

    function getTextBasedOnDataType() {
        if (data === 'date') {
            return new Date().toLocaleDateString();
        } else if (data === 'time') {
            return new Date().toLocaleTimeString();
        } else {
            return 'John Doe';
        }
    }

    return (
        <div>
            <h3>Insert Meta Data</h3>
            <label>
                Data Type:
                <select value={data} onChange={(e) => setData(e.target.value)}>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="name">Name</option>
                </select>
            </label>
            <br />
            <label>
                Location:
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="right-corner">Right Corner</option>
                    <option value="outer-top">Outer Top</option>
                    <option value="outer-bottom">Outer Bottom</option>
                </select>
            </label>
            <br />
            <button onClick={() => {
                const wrapper = document.querySelector('#message-box-outer') as HTMLElement;
                if (wrapper) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(wrapper.innerHTML, 'text/html');
                    const newElement = document.createElement('span');
                    newElement.innerText = getTextBasedOnDataType();
                    newElement.style.width = 'max-content';
                    const locationContainer = doc.getElementById(`container-${location}`);
                    if (locationContainer) {
                        locationContainer.appendChild(newElement);
                        if (location.includes('corner')) {
                            const adjuster = doc.getElementById(`container-${location}-adjuster`);
                            if (adjuster) {
                                adjuster.innerHTML = locationContainer.innerHTML;
                            }
                        }
                    }
                    wrapper.innerHTML = doc.body.innerHTML;
                    setHtmlContent(document.getElementById('wrapper')?.outerHTML || '');
                }
            }}>Insert</button>
        </div>
    );
};

const ComponentBuilder: React.FC = () => {
    const [htmlContent, setHtmlContent] = useState<string>(
        `
        <div id="wrapper" class="wrapper" style="border: 1px solid #ccc; padding: 16px; position: relative; display: flex;">
            <div id="message-box-outer">
                <div id="container-outer-top" class="placeholder" style="display: flex"></div>
                <div id="message-box" style="position: relative; max-width: 300px; padding: 8px; background-color: #e0f7fa; border-radius: 15px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                    <div id="container-top" class="placeholder" style="display: flex"></div>
                    <p id="msg-container" style="margin: 0; color: #333;">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s<span id="container-right-corner-adjuster" style="visibility: hidden; padding-left:8px;"></span></p>
                    <div id="container-bottom" class="placeholder" style="display: flex"></div>
                    <div id="container-right-corner" style="position: absolute; bottom: 8px; right: 8px;"></div>
                </div>
                <div id="container-outer-bottom" class="placeholder" style="display: flex"></div>
            </div>
        </div>
        `
    );

    const [saved, setSaved] = useState<string[]>([])

    const handleInsert = (htmlString: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const parent = doc.querySelector("#wrapper")
        const newElement = parser.parseFromString(htmlString, 'text/html').body.firstChild;
        if (newElement && parent) {
            parent.appendChild(newElement);
        }
        setHtmlContent(doc.body.innerHTML);
    };

    function removeAllPreviousSelections() {
        const selectedList = document.getElementsByClassName('selected');
        if (selectedList.length > 0) {
            for (let i = 0; i < selectedList.length; i++) {
                selectedList[i].classList.remove('selected');
            }
        }
    }

    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const wrapper = document.getElementById("wrapper");
            const target = e.target as HTMLElement;

            if (wrapper && wrapper.contains(target)) {
                removeAllPreviousSelections();
                target.classList.add("selected");
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    const exportHtml = () => {
        removeAllPreviousSelections()
        const container = document.getElementById('wrapper');
        if (!container) return;
        container.style.border = "none";
        container.style.padding = "0px"
        const exportedHtml = container.outerHTML;
        const parser = new DOMParser();
        const doc = parser.parseFromString(exportedHtml, 'text/html');
        const msgElem = doc.getElementById("msg-container")
        if (msgElem) {
            const spanElement = msgElem.querySelector('span');
            msgElem.innerHTML = generateRandomText(2, 20) + spanElement?.outerHTML
        }
        setSaved([...saved, doc.body.innerHTML])
        container.style.border = "1px solid #ccc"
        container.style.padding = "16px"
    };

    return (
        <div className="component-builder" style={{ display: 'flex' }}>
            <Toolbar onInsert={handleInsert} setHtmlContent={setHtmlContent} />
            <div className="preview" style={{ marginLeft: '20px' }}>
                <MessageHolder htmlContent={htmlContent} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center" }}>
                <button style={{ marginTop: '16px' }} onClick={exportHtml}>Add to Thread</button>
                <div style={{
                    border: '1px dashed black',
                    width: '100%',
                    height: '345px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 0',
                    gap: '16px',
                    overflow: 'auto'
                }}>
                    {saved.map((html, i) => {
                        const span = <span style={{ width: 'max-content' }} key={i} dangerouslySetInnerHTML={{ __html: html }} />
                        return span
                    })}
                </div>
            </div>
        </div>
    );
};

export default ComponentBuilder;


const loremIpsumWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
    "est", "laborum"
];

const generateRandomText = (minWords: number, maxWords: number): string => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const randomWords = Array.from({ length: wordCount }, () => {
        return loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)];
    });
    return randomWords.join(' ');
};


interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div
        className="accordion-title"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#f1f1f1' }}
      >
        <h3>{title}</h3>
      </div>
      <div
        className={classNames('accordion-content', { 'open': isOpen })}
        style={{
          height: isOpen ? 'auto' : '0',
          overflow: 'hidden',
          transition: 'height 0.3s ease',
          padding: isOpen ? '10px' : '0',
        }}
      >
        {content}
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div style={{ width: '250px', backgroundColor: '#333', color: '#fff', padding: '10px' }}>
      <AccordionItem
        title="Section 1"
        content={<p>This is the content for section 1.</p>}
      />
      <AccordionItem
        title="Section 2"
        content={<p>This is the content for section 2.</p>}
      />
      <AccordionItem
        title="Section 3"
        content={<p>This is the content for section 3.</p>}
      />
    </div>
  );
};
