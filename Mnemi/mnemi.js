const ACTION_SELECT = "Enter";

const MESSAGE_EMPTY_TEXT = "テキストは空っぽです。";
const MESSAGE_EMPTY_COVER_LINK = "表紙は空っぽです。";
const MESSAGE_ERROR_UNKNWON = "それは誤用です。";

/**
 * Bind select() to ACTION_SELECT.
 */
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case ACTION_SELECT: select()
    }
});

/**
 * Selects the main input box, if it's already
 * selected then it calls execute().
 */
function select() {
    var inputElement = document.getElementById("textInput");
    if (document.activeElement === inputElement) {
        execute();
        inputElement.blur();
    }
    else {
        inputElement.focus();
    }
}

/**
 * Main function
 */
function execute() {
    // Add an extra newline so the very last part will always be sliced
    var text = document.getElementById("textInput").value + '\n';
    var coverLink = document.getElementById("coverInput").value;

    // Handle empty text input
    if (!text.trim()) {
        setAlert(MESSAGE_EMPTY_TEXT, "danger");
        return;
    }

    // Handle empty cover link input
    if (!coverLink.trim()) {
        setAlert(MESSAGE_EMPTY_COVER_LINK, "danger");
        return;
    }

    try {
        // Slice text
        var slices = [];
        for (let checkpoint, i = 0; i < text.length; i++) {
            if (text[i] == "\n") {
                // Add 1 to checkpoint to ignore the '\n'
                slices.push(text.slice(checkpoint + 1, i))
                checkpoint = i;
            }
        }

        // Get information from 0 - 2
        let title = slices[0];
        let titleOriginal = slices[1];
        let code = slices[2].replace('#', '');

        // Get all tags grouped by section
        let sections = {};
        if (isUserMobile()) {
            sections = readSections(slices);
        } else {
            sections = groupSections(slices);
        }

        // Create and set output
        let output = createFormat(title, titleOriginal, code, coverLink, sections);
        document.getElementById("output").innerHTML = output;
        document.getElementById("embed").classList.replace("d-none", "d-block");
    }
    // Handle errors
    catch (error) {
        setAlert(MESSAGE_ERROR_UNKNWON, "danger");
        console.log(error);
    }

}

/**
 * Read the slices from Android copy function.
 * @param {Array} slices Array of Strings.
 * @returns {Object}
 */
function readSections(slices) {
    let sections = {};
    let currentSection;
    let i = 3;
    while (i < slices.length) {
        // Get section
        var index = slices[i].split(':');
        currentSection = index[0];
        // Use regex to split the tags
        if (currentSection != "Pages") {
            sections[currentSection] = index[1].split(/\d+K?/g);
            sections[currentSection].pop();
            sections[currentSection] = sections[currentSection].map(item => item.trim());

        }
        // Pages section is kinda special because all it contains is a number
        else {
            sections[currentSection] = [index[1].trim()];
        }
        // Next slice
        i++;
    }
    return sections;
}

/**
 * Read the slices from Windows copy function.
 * @param {Array} slices Array of Strings.
 * @returns {Object}
 */
function groupSections(slices) {
    let sections = {};
    let currentSection;
    let i = 3;
    while (i < slices.length) {
        let index = slices[i];
        // Create a new array for this section
        if (index.includes(':')) {
            currentSection = index.trim().replace(':', '');
            sections[currentSection] = [];
        }
        // Add tag to its section
        else if (!isNumberK(index) || currentSection == "Pages") {
            sections[currentSection].push(index);
        }
        // Next slice
        i++;
    }
    return sections;
}

/**
 * Creates the output's format.
 * @param {String} title
 * @param {String} titleOriginal
 * @param {String} code
 * @param {String} coverLink
 * @param {Object} sections An object with array of Strings.
 * @returns {String}
 */
function createFormat(title, titleOriginal, code, coverLink, sections) {
    // Set initial information
    let string =
`**${title}**\n
${titleOriginal}
### [#${code}](${mahou('8h33oa3oaB3dcG3283fuGfuGrrb8h3Gdsrrb3oaHiKG4hDh2rrbGds3oafuG55hfuG') + code})
`;

    // Set all tags and sections
    for (let section of Object.keys(sections)) {
        string += `> **${section}:** ${sections[section].join(", ")}\n`
    }

    string += `[。](${coverLink})`;

    return string;
}

/**
 * Closes any alert on the page.
 */
function closeAlert() {
    let alertCloseButton = document.getElementById("alertClose");
    if (alertCloseButton) {
        alertCloseButton.click();
    }
}

/**
 * Creates a bootstrap alert.
 * @param {String} message Content of the alert.
 * @param {String} type Bootstrap type of the alert.
 */
function setAlert(message, type) {
    const alertPlaceholder = document.getElementById('messageOutput');
    alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show text-start" role="alert">
        <div>${message}</div>
        <button id="alertClose" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
}

/**
 * @param {String} s Any text.
 * @returns {String}
 */
function mahou(s) {
    let genryou = "sfhkJd3dBFHSDf4d2I1fC28hdhEhBv3bSg2og4hDh2fuG7HpbVfa217270dbcBdf3yp2wpVpHfA283bf2Fg3zx8Hr3ppPfm3N3bnub2vfsegdHHhhhgg301212hIiIbQgUjiywyoWwjheWrgBhFbFFKIunnEPQWqcolkIjdhga3gGfhcoclolLMaOXdIKIhUHiKufOkgGggTGdsGh555h8h3G4h4UbE0NN211kRrrby5tB3dcd99eBcG33oaaAxzf37g99Wn93bHn37plp3ErymsLI";
    let arufa = {};
    for (let c = 0, i = 3; i <= genryou.length; i += 3) {
        let index = i / 3 + 32;
        arufa[String.fromCharCode(index)] = genryou.slice(c, i);
        c = i;
    }

    let angou = {};
    for (let a of Object.keys(arufa)) {
        angou[arufa[a]] = a;
    }

    let dec = "";
    for (let c = 0, i = 3; i <= s.length; i += 3) {
        let chunk = s.slice(c, i);
        dec += angou[chunk];
        c = i;
    }

    return dec;
}

/**
 * Automatically copy 'text' to the user's clipboard.
 * @param {String} text
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

/**
 * Automatically paste from the user's clipboard into an input element's value.
 * @param {Node} element
 */
async function pasteFromClipboard(element) {
    try {
        let result = await navigator.clipboard.readText();
        document.getElementById(element).value = result;
    }
    catch (error) {
        console.log("Error: Failed to read clipboard.");
    }
}

/**
 * Returns true if x is a valid number with K abbreviation, false otherwise.
 * @param {String} x
 * @returns {Boolean}
 */
function isNumberK(x) {
    if (!x) {
        return false;
    }

    x = Number(x.toUpperCase().replace('K', ''));
    return !isNaN(x);
}

/**
 * Returns true if x is a valid number, false otherwise.
 * @param {String} x
 * @returns {Boolean}
 */
function isNumber(x) {
    if (!x) {
        return false;
    }

    return !isNaN(Number(x));
}

/**
 * Returns true if the user is a mobile user, false otherwise.
 * @returns {Boolean}
 */
function isUserMobile() {
    if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
       return true;
    } else {
       return false;
    }
}
