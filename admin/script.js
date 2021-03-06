"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const spotlight = {
    element: document.querySelector("[data-comma='spotlight']"),
    show: (option) => {
        switch (option) {
            case 'on':
                spotlight.element.style = 'display: block';
                break;
            case 'off':
                spotlight.element.style = 'display: none';
                break;
        }
    }
};
const search = {
    element: document.querySelector("[data-search='element']"),
    input: document.querySelector("[data-search='input']"),
    results: document.querySelector("[data-search='results']"),
    show: () => {
        if (search.element.style.display === 'none') {
            search.element.style = 'display: block';
            search.input.value = "";
            spotlight.show('on');
            search.input.focus();
        }
        else {
            search.element.style = 'display: none';
            spotlight.show('off');
        }
        ;
    },
    filter: () => {
        var a, i, txtValue;
        a = search.results.getElementsByTagName('a');
        for (i = 0; i < a.length; i++) {
            p = a[i].getElementsByTagName("p")[0];
            txtValue = p.textContent || p.innerText;
            if (txtValue.toUpperCase().indexOf(search.input.value.toUpperCase()) > -1) {
                a[i].style.display = "";
            }
            else {
                a[i].style.display = "none";
            }
        }
    }
};
const editor = {
    format: (type) => {
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);
        var range0 = range.cloneRange();
        range.collapse(true);
        document.execCommand('insertText', false, type);
        sel.removeAllRanges();
        sel.addRange(range0);
        range0.collapse(false);
        document.execCommand('insertText', false, type);
    },
    syntax: (text) => {
        var html = text
            .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>") // bold
            .replace(/\*(.*)\*/gim, "<i>$1</i>") // italic
            .replace(/\_(.*)\_/gim, "<u>$1</u>") // underline
            .replace(/\-(.*)\-/gim, "<s>$1</s>") // strikethrough
            .replace(/^# (.*$)/gim, "<h1>$1</h1>") // h1
            .replace(/^## (.*$)/gim, "<h2>$1</h2>") // h2
            .replace(/^### (.*$)/gim, "<h3>$1</h3>") // h3
            .replace(/^#### (.*$)/gim, "<h4>$1</h4>") // h4
            .replace(/^##### (.*$)/gim, "<h5>$1</h5>") // h5
            .replace(/^###### (.*$)/gim, "<h6>$1</h6>") // h6
            .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>") // blockquote
            .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />") // image
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>") // link
            .replace(/\n$/gim, "<br>"); // linebreak
        return html.trim();
    },
    output: () => {
        var input = document.getElementById("editor").innerHTML;
        document.getElementById("text").innerHTML = editor.syntax(input);
    },
    save: () => {
        var textFileAsBlob = new Blob([document.getElementById("editor").innerHTML], { type: "text/plain" });
        var downloadLink = document.createElement("a");
        downloadLink.download = 'download.md';
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null) {
            // Chrome
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else {
            // Firefox
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }
};
onkeydown = function (e) {
    if (e.ctrlKey) {
        switch (e.keyCode) {
            case 75:
                e.preventDefault();
                search.show();
                break;
            case 66:
                e.preventDefault();
                editor.format('**');
                break;
            case 73:
                e.preventDefault();
                editor.format('*');
                break;
        }
    }
};
search.input.addEventListener('keyup', search.filter);
spotlight.element.addEventListener('click', search.show);
document.getElementById('bold').addEventListener('click', () => editor.format('**'));
const properties = [
    'direction',
    'boxSizing',
    'width',
    'height',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize',
];
const isFirefox = typeof window !== 'undefined' && window['mozInnerScreenX'] != null;
/**
 * @param {HTMLTextAreaElement} element
 * @param {number} position
 */
function getCaretCoordinates(element, position) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const style = div.style;
    const computed = getComputedStyle(element);
    style.whiteSpace = 'pre-wrap';
    style.wordWrap = 'break-word';
    style.position = 'absolute';
    style.visibility = 'hidden';
    properties.forEach(prop => {
        style[prop] = computed[prop];
    });
    if (isFirefox) {
        if (element.scrollHeight > parseInt(computed.height))
            style.overflowY = 'scroll';
    }
    else {
        style.overflow = 'hidden';
    }
    div.textContent = element.value.substring(0, position);
    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);
    const coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
        // height: parseInt(computed['lineHeight'])
        height: span.offsetHeight
    };
    div.remove();
    return coordinates;
}
class Mentionify {
    constructor(ref, menuRef, resolveFn, replaceFn, menuItemFn) {
        this.ref = ref;
        this.menuRef = menuRef;
        this.resolveFn = resolveFn;
        this.replaceFn = replaceFn;
        this.menuItemFn = menuItemFn;
        this.options = [];
        this.makeOptions = this.makeOptions.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.ref.addEventListener('input', this.onInput);
        this.ref.addEventListener('keydown', this.onKeyDown);
    }
    makeOptions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.resolveFn(query);
            if (options.lenght !== 0) {
                this.options = options;
                this.renderMenu();
            }
            else {
                this.closeMenu();
            }
        });
    }
    closeMenu() {
        setTimeout(() => {
            this.options = [];
            this.left = undefined;
            this.top = undefined;
            this.triggerIdx = undefined;
            this.renderMenu();
        }, 0);
    }
    selectItem(active) {
        return () => {
            const preMention = this.ref.value.substr(0, this.triggerIdx);
            const option = this.options[active];
            const mention = this.replaceFn(option, this.ref.value[this.triggerIdx]);
            const postMention = this.ref.value.substr(this.ref.selectionStart);
            const newValue = `${preMention}${mention}${postMention}`;
            this.ref.value = newValue;
            const caretPosition = this.ref.value.length - postMention.length;
            this.ref.setSelectionRange(caretPosition, caretPosition);
            this.closeMenu();
            this.ref.focus();
        };
    }
    onInput(ev) {
        const positionIndex = this.ref.selectionStart;
        const textBeforeCaret = this.ref.value.slice(0, positionIndex);
        const tokens = textBeforeCaret.split(/\s/);
        const lastToken = tokens[tokens.length - 1];
        const triggerIdx = textBeforeCaret.endsWith(lastToken)
            ? textBeforeCaret.length - lastToken.length
            : -1;
        const maybeTrigger = textBeforeCaret[triggerIdx];
        const keystrokeTriggered = maybeTrigger === '@';
        if (!keystrokeTriggered) {
            this.closeMenu();
            return;
        }
        const query = textBeforeCaret.slice(triggerIdx + 1);
        this.makeOptions(query);
        const coords = getCaretCoordinates(this.ref, positionIndex);
        const { top, left } = this.ref.getBoundingClientRect();
        setTimeout(() => {
            this.active = 0;
            this.left = window.scrollX + coords.left + left + this.ref.scrollLeft;
            this.top = window.scrollY + coords.top + top + coords.height - this.ref.scrollTop;
            this.triggerIdx = triggerIdx;
            this.renderMenu();
        }, 0);
    }
    onKeyDown(ev) {
        let keyCaught = false;
        if (this.triggerIdx !== undefined) {
            switch (ev.key) {
                case 'ArrowDown':
                    this.active = Math.min(this.active + 1, this.options.length - 1);
                    this.renderMenu();
                    keyCaught = true;
                    break;
                case 'ArrowUp':
                    this.active = Math.max(this.active - 1, 0);
                    this.renderMenu();
                    keyCaught = true;
                    break;
                case 'Enter':
                case 'Tab':
                    this.selectItem(this.active)();
                    keyCaught = true;
                    break;
            }
        }
        if (keyCaught) {
            ev.preventDefault();
        }
    }
    renderMenu() {
        if (this.top === undefined) {
            this.menuRef.hidden = true;
            return;
        }
        this.menuRef.style.left = this.left + 'px';
        this.menuRef.style.top = this.top + 'px';
        this.menuRef.innerHTML = '';
        this.options.forEach((option, idx) => {
            this.menuRef.appendChild(this.menuItemFn(option, this.selectItem(idx), this.active === idx));
        });
        this.menuRef.hidden = false;
    }
}
const users = [
    { username: 'davidbrzy' },
    { username: 'jakubklapka' },
    { username: 'johndoe' },
];
const resolveFn = prefix => prefix === ''
    ? users
    : users.filter(user => user.username.startsWith(prefix));
const replaceFn = (user, trigger) => `${trigger}${user.username} `;
const menuItemFn = (user, setItem, selected) => {
    const div = document.createElement('div');
    div.setAttribute('role', 'option');
    div.className = 'menu-item';
    if (selected) {
        div.classList.add('selected');
        div.setAttribute('aria-selected', '');
    }
    div.textContent = user.username;
    div.onclick = setItem;
    return div;
};
new Mentionify(document.getElementById('textarea'), document.getElementById('menu'), resolveFn, replaceFn, menuItemFn);
