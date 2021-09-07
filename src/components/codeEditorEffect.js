import { nextTick } from 'vue';

const addWhitespaceTextNodeIfNoNodes = (container) => {
  if (!container.childNodes.length) {
    const initText = document.createTextNode('');
    container.appendChild(initText);
  }
};

// https://www.javascripttutorial.net/javascript-dom/javascript-insertafter/
const insertAfter = (newNode, oldNode) => {
  oldNode.parentNode.insertBefore(newNode, oldNode.nextSibling);
};

const isSingleLine = (text) => !text.includes('\r\n');

const notLessThanZero = (number) => {
  if (number >= 0) return number;
  return 0;
};

const generateTextAndWrapNodes = (text) => {
  const generateWrapNode = () => document.createTextNode('\n');

  let lineSplits;
  if (text.includes('\r')) {
    lineSplits = text.split('\r\n');
  } else {
    lineSplits = text.split('\n');
  }

  const newFragment = document.createDocumentFragment();

  const lastIndex = lineSplits.length - 1;

  for (let i = 0; i < lineSplits.length; i += 1) {
    const textNode = document.createTextNode(lineSplits[i]);
    newFragment.appendChild(textNode);

    if (i < lastIndex) newFragment.appendChild(generateWrapNode());
  }

  return newFragment;
};

const codeEditorEffect = () => {
  const handleIndent = (e) => {
    if (e.key !== 'Tab') return;

    e.preventDefault();

    const inputContainer = e.currentTarget;
    addWhitespaceTextNodeIfNoNodes(inputContainer);

    const INDENT = '  ';

    const sel = window.getSelection();
    const range = sel.getRangeAt(0).cloneRange();
    const {
      startContainer,
      startOffset,
      endContainer,
      endOffset,
    } = range;

    const filterSelectedPlainTextNodes = () => {
      const getIndex = (node) => Array.prototype.indexOf.call(inputContainer.childNodes, node);
      const startIndex = getIndex(startContainer);
      const endIndex = getIndex(endContainer);

      const isNodeInSelection = (index) => index >= startIndex && index <= endIndex;
      const isPlainTextNode = (node) => node.textContent !== '\n';

      const shouldFilter = (node, index) => isPlainTextNode(node) && isNodeInSelection(index);

      return Array.prototype.filter.call(inputContainer.childNodes, shouldFilter);
    };

    const getWhitespaceLengthFromBeginnning = (text) => {
      let tmpText = text;
      let whitespaceLength = 0;
      while (tmpText.startsWith(' ')) {
        whitespaceLength += 1;
        tmpText = tmpText.substring(1);
      }
      return whitespaceLength;
    };

    const moveBackwardDistance = (node) => {
      const text = node.textContent;
      const whitespaceLength = getWhitespaceLengthFromBeginnning(text);

      if (whitespaceLength >= INDENT.length) return INDENT.length;
      return whitespaceLength;
    };

    const generateMoveForwardNodes = (nodes) => Array.prototype.map.call(nodes,
      (node) => document.createTextNode(INDENT + node.textContent));

    const generateMoveBackwardNodes = (nodes) => Array.prototype.map.call(nodes, (node) => {
      const whitespaceLength = moveBackwardDistance(node);
      return document.createTextNode(node.textContent.substring(whitespaceLength));
    });

    const increaseIndent = () => {
      const text = startContainer.textContent;
      const newText = text.substring(0, startOffset) + INDENT + text.substring(startOffset);
      const newTextNode = document.createTextNode(newText);

      inputContainer.replaceChild(newTextNode, startContainer);

      sel.setBaseAndExtent(newTextNode, startOffset + INDENT.length,
        newTextNode, startOffset + INDENT.length);
    };

    const decreaseIndent = () => {
      const whitespaceLength = moveBackwardDistance(startContainer);

      const text = startContainer.textContent;
      const newTextNode = document.createTextNode(text.substring(whitespaceLength));

      inputContainer.replaceChild(newTextNode, startContainer);

      const offset = notLessThanZero(startOffset - whitespaceLength);
      sel.setBaseAndExtent(newTextNode, offset, newTextNode, offset);
    };

    const increaseIndentInSelection = () => {
      const selectedPlainTextNodes = filterSelectedPlainTextNodes();
      const newNodes = generateMoveForwardNodes(selectedPlainTextNodes);

      const newStartOffset = startOffset + INDENT.length;
      const newEndOffset = endOffset + INDENT.length;

      selectedPlainTextNodes.forEach((node, index) => {
        inputContainer.replaceChild(newNodes[index], node);
      });

      sel.setBaseAndExtent(newNodes[0], newStartOffset,
        newNodes[newNodes.length - 1], newEndOffset);
    };

    const decreaseIndentInSelection = () => {
      const filterNodes = filterSelectedPlainTextNodes();

      const newNodes = generateMoveBackwardNodes(filterNodes);

      const newStartOffset = notLessThanZero(startOffset
        - moveBackwardDistance(filterNodes[0]));
      const newEndOffset = notLessThanZero(endOffset
        - moveBackwardDistance(filterNodes[filterNodes.length - 1]));

      filterNodes.forEach((node, index) => inputContainer.replaceChild(newNodes[index], node));

      sel.setBaseAndExtent(newNodes[0], newStartOffset,
        newNodes[newNodes.length - 1], newEndOffset);
    };

    const execute = () => {
      const actions = new Map([
        [{ isCollapse: true, hasShiftKey: true }, decreaseIndent],
        [{ isCollapse: true, hasShiftKey: false }, increaseIndent],
        [{ isCollapse: false, hasShiftKey: true }, decreaseIndentInSelection],
        [{ isCollapse: false, hasShiftKey: false }, increaseIndentInSelection],
      ]);

      const selectAction = [...actions].find(([key]) => key.isCollapse === range.collapsed
        && key.hasShiftKey === e.shiftKey);
      selectAction[1]();
    };

    execute();
  };

  const handlePaste = (e) => {
    addWhitespaceTextNodeIfNoNodes(e.currentTarget);

    const text = e.clipboardData.getData('Text');
    if (!text) return;
    if (isSingleLine(text)) return;

    e.preventDefault();

    nextTick(() => {
      const { focusNode } = window.getSelection();
      const newNodes = generateTextAndWrapNodes(text);

      if (focusNode === e.currentTarget) {
        e.currentTarget.appendChild(newNodes);
        return;
      }

      if (focusNode.textContent === '\n') {
        insertAfter(newNodes, focusNode);
      } else {
        const wrapNode = document.createTextNode('\n');
        insertAfter(wrapNode, focusNode);
        insertAfter(newNodes, wrapNode);
      }
    });
  };

  return {
    handleIndent,
    handlePaste,
    generateTextAndWrapNodes,
  };
};

export default codeEditorEffect;
