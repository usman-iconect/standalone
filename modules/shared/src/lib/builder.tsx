import React, { useState, FC } from 'react';
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
};

const Toolbar: FC<ToolbarProps> = ({ onInsert }) => {
    const handleInsert = (componentType: string) => {
        let htmlString = '';

        switch (componentType) {
            case 'avatar':
                htmlString = `<div class="msg-comp avatar">AB</div>`;
                break;
            case 'dateTime':
                htmlString = `<div class="date-time">Date: ${new Date().toLocaleString()}</div>`;
                break;
            case 'message':
                htmlString = `<div class="message">This is a message</div>`;
                break;
            case 'reactions':
                htmlString = `<div class="reactions">👍 ❤️ 😂</div>`;
                break;
            default:
                break;
        }

        onInsert(htmlString);
    };

    return (
        <div className="toolbar">
            <button onClick={() => handleInsert('avatar')}>Insert Avatar</button>
            <button onClick={() => handleInsert('dateTime')}>Insert DateTime</button>
            <button onClick={() => handleInsert('message')}>Insert Message</button>
            <button onClick={() => handleInsert('reactions')}>Insert Reactions</button>

            <MarginEditor />

        </div>
    );
};

const MarginEditor: React.FC = () => {
    const [marginSide, setMarginSide] = useState<string>('marginTop');
    const [marginValue, setMarginValue] = useState<number>(0);

    // Update margin of the selected element
    const updateMargin = (value: number) => {
        const selectedElement = document.querySelector('.selected') as HTMLElement;
        if (selectedElement) {
            selectedElement.style[marginSide as any] = `${value}px`;
        }
    };

    // Handle slider/input changes
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setMarginValue(value);
        updateMargin(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setMarginValue(value);
        updateMargin(value);
    };

    return (
        <div>
            <h3>Margin Editor</h3>
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
                    min="0"
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

const ComponentBuilder: React.FC = () => {
    const [htmlContent, setHtmlContent] = useState<string>(
        `
        <div id="wrapper" className="wrapper" style="border: 2px dashed black; padding: 16px; position: relative; display: flex;">
            <div style="position: relative; max-width: 300px; padding: 15px; background-color: #e0f7fa; border-radius: 15px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                <p id="msg-container" style="margin: 0; color: #333;">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
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

    React.useEffect(() => {
        document.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            if (target?.classList.contains("msg-comp")) {
                target.classList.add("selected");
            }
        });
    }, [])

    const exportHtml = () => {
        const container = document.getElementById('wrapper');
        if (!container) return;
        container.style.border = "none";
        container.style.padding = "0px"
        const exportedHtml = container.outerHTML;
        const parser = new DOMParser();
        const doc = parser.parseFromString(exportedHtml, 'text/html');
        const msgElem = doc.getElementById("msg-container")
        if (msgElem)
            msgElem.innerText = generateRandomText(2, 50)
        setSaved([...saved, doc.body.innerHTML])
        console.log(exportedHtml)
        container.style.border = "2px dashed black"
        container.style.padding = "16px"
    };


    return (
        <div className="component-builder" style={{ display: 'flex' }}>
            <Toolbar onInsert={handleInsert} />
            <div className="preview" style={{ marginLeft: '20px' }}>
                <MessageHolder htmlContent={htmlContent} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center" }}>
                <button style={{ marginTop: '16px' }} onClick={exportHtml}>Add to Thread</button>
                <div style={{ 
                    border: '1px dashed black', 
                    width: '100%', 
                    height: '500px',
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'auto'
                     }}>
                    {saved.map((html, i) => {
                        const span = <span style={{ marginTop: '16px' }} key={i} dangerouslySetInnerHTML={{ __html: html }} />
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