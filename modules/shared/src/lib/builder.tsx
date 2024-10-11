import React, { useState, FC } from 'react';
import classNames from 'classnames';
import { SketchPicker } from 'react-color'

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

const ChangeFlush: React.FC<{ setHtmlContent: (htmlContent: string) => void }> = ({ setHtmlContent }) => {
    const [data, setData] = React.useState("top-left")
    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <label>
                {/* top-left | top-right | bottom-right | bottom-left */}
                Flush Position:
                <select value={data} onChange={(e) => setData(e.target.value)}>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                </select>
            </label>
            <br />
            <button onClick={() => {
                const messageBox = document.querySelector('#message-box') as HTMLElement;
                if (messageBox) {
                    const currentBorderRadius = 15
                    const top = data === 'top-left' ? '0' : currentBorderRadius;
                    const right = data === 'top-right' ? '0' : currentBorderRadius;
                    const bottom = data === 'bottom-right' ? '0' : currentBorderRadius;
                    const left = data === 'bottom-left' ? '0' : currentBorderRadius;
                    messageBox.style.borderRadius = `${top}px ${right}px ${bottom}px ${left}px`;
                    setHtmlContent(document.getElementById('wrapper')?.outerHTML || '');
                }
            }}>
                Change
            </button>
        </div>
    )
}

const ChangeRadius: React.FC<{ setHtmlContent: (htmlContent: string) => void }> = ({ setHtmlContent }) => {
    const [marginValue, setMarginValue] = useState<number>(0);

    // Handle slider/input changes
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setMarginValue(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setMarginValue(value);
    };

    return (
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <label>
                Adjust Radius (px):
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
            <br />
            <button onClick={() => {
                const selected = document.querySelector('.selected') as HTMLElement;
                if (selected) {
                    selected.style.borderRadius = `${marginValue}px`;
                    setHtmlContent(document.getElementById('wrapper')?.outerHTML || '');
                }
            }}>
                Change
            </button>
        </div>
    )
}

const ComponentBuilder: React.FC = () => {
    const html = `
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
    const [htmlContent, setHtmlContent] = useState<string>(html);

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
            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', alignContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                    <div className="preview" style={{ marginLeft: '20px' }}>
                        <MessageHolder htmlContent={htmlContent} />
                    </div>
                    <Sidebar onInsert={handleInsert} setHtmlContent={setHtmlContent} />
                </div>
                <div>
                    <button style={{ marginTop: '16px' }} onClick={exportHtml}>Add to Thread</button>
                    <button style={{ marginTop: '16px', marginLeft: '16px' }} onClick={() => {
                        setHtmlContent(html)
                    }}>Reset</button>
                </div>
            </div>
            <div style={{
                border: '1px dashed black',
                width: '50%',
                height: '850px',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                gap: '16px',
                overflow: 'auto'
            }}>
                {saved.map((html, i) => {
                    const span = <span style={{ width: 'max-content' }} key={i} dangerouslySetInnerHTML={{ __html: html }} />
                    return span
                })}
            </div>
        </div>
    );
};

const ColorEditor: React.FC<{ setHtmlContent: (htmlContent: string) => void }> = ({ setHtmlContent }) => {
    const [color, setColor] = useState<string>('#000000');
    const [selectedOption, setSelectedOption] = useState<string>('color');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SketchPicker
                onChangeComplete={(color) => {
                    setColor(color.hex)
                }}
                color={color}
            />
            <div>
                <label>
                    <input
                        type="radio"
                        value="color"
                        checked={selectedOption === 'color'}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    Font Color
                </label>
                <label>
                    <input
                        type="radio"
                        value="backgroundColor"
                        checked={selectedOption === 'backgroundColor'}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    Background Color
                </label>
            </div>
            <button onClick={() => {
                const selected = document.querySelector('.selected') as HTMLElement;
                if (selected) {
                    if (selectedOption === 'color') {
                        selected.style.color = color;
                    }
                    else {
                        selected.style.backgroundColor = color;
                    }
                    setHtmlContent(document.getElementById('wrapper')?.outerHTML || '');
                }
            }}>
                Change
            </button>
        </div>
    )
}

const FontEditor: React.FC<{ setHtmlContent: (htmlContent: string) => void }> = ({ setHtmlContent }) => {
    const [fontSize, setFontSize] = useState<string>('16');
    const [fontWeight, setWeight] = useState<number>(400);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>
                Font Size (px):
                <input
                    type="range"
                    min="2"
                    max="30"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                />
            </label>
            <br />
            <label>
                Font Size Input (px):
                <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                />
            </label>
            <label>
                Font Weight:
                <input
                    type="range"
                    min="100"
                    max="1000"
                    value={fontWeight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                />
            </label>
            <br />
            <label>
                Font Weight:
                <input
                    type="number"
                    value={fontWeight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                />
            </label>
            <button onClick={() => {
                const selected = document.querySelector('.selected') as HTMLElement;
                if (selected) {
                    selected.style.fontSize = fontSize + 'px';
                    selected.style.fontWeight = fontWeight.toString();
                    setHtmlContent(document.getElementById('wrapper')?.outerHTML || '');
                }
            }}>
                Change
            </button>
        </div>
    )
}

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
    setOpened: (id: string) => void;
    id: string;
    opened: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, setOpened, id, opened }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="accordion-item">
            <div
                className="accordion-title"
                onClick={() => {
                    setOpened(isOpen ? "" : id)
                    setIsOpen(!isOpen)
                }}
                style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#f1f1f1' }}
            >
                <h3 style={{ color: 'black' }}>{title}</h3>
            </div>
            <div
                className={classNames('accordion-content', { 'open': (isOpen && opened === id) })}
                style={{
                    height: (isOpen && opened === id) ? 'auto' : '0',
                    overflow: 'hidden',
                    transition: 'height 0.3s ease',
                    padding: (isOpen && opened === id) ? '10px' : '0',
                }}
            >
                {content}
            </div>
        </div>
    );
};

const Sidebar: React.FC<ToolbarProps> = ({ onInsert, setHtmlContent }) => {
    const [opened, setOpened] = useState<string>("")
    return (
        <div style={{ width: '300px', padding: '10px' }}>
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"1"}
                title="Insert Items"
                content={<button onClick={() => {
                    const htmlString = `<div class="msg-comp avatar">AB</div>`;
                    onInsert(htmlString)
                }}>Insert Avatar</button>}
            />
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"2"}
                title="Margin Editor"
                content={<MarginEditor setHtmlContent={setHtmlContent} />}
            />
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"3"}
                title="Change Alignment"
                content={<ContainerAlign setHtmlContent={setHtmlContent} />
                }
            />
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"4"}
                title="Insert Meta Data"
                content={
                    <InsertMetaData setHtmlContent={setHtmlContent} />}
            />
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"5"}
                title="Quick Actions"
                content={
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
                    </div>}
            />
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"6"}
                title="Change Flush"
                content={<ChangeFlush setHtmlContent={setHtmlContent} />}
            />
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"7"}
                title="Change Radius"
                content={<ChangeRadius setHtmlContent={setHtmlContent} />}
            />
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"8"}
                title="Color Editor"
                content={<ColorEditor setHtmlContent={setHtmlContent} />}
            />
            <AccordionItem
                setOpened={setOpened}
                opened={opened}
                id={"9"}
                title="Font Editor"
                content={<FontEditor setHtmlContent={setHtmlContent} />}
            />
        </div>
    );
};
