class Section {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }
}

class Builder {
    constructor(sections) {
        this.sections = sections;
    }

    async build() {
        const beforeHtmlRequest = await fetch("parts/before.html");
        const beforeHtml = await beforeHtmlRequest.text();

        const afterHtmlRequest = await fetch("parts/after.html");
        const afterHtml = await afterHtmlRequest.text();

        const sectionHtmlRequest = await fetch("parts/section.html");
        const sectionHtml = await sectionHtmlRequest.text();

        var result = beforeHtml;
        
        this.sections.forEach(section => {
            result += sectionHtml
                .replace("%%TITLE%%", section.title)
                .replace("%%BODY%%", section.body);
        });

        result += afterHtml;

        return result;
    }
}

class Parser {
    constructor(text) {
        this.text = text;
    }

    parse() {
        const sections = [];
        const lines = this.text.split("\n");

        var currentTitle = null;
        var currentBody = "";

        lines.forEach(line => {
            if (line === "---") {
                if (currentTitle === null) throw new Error("Empty section");
                
                sections.push(new Section(currentTitle, currentBody));
                currentTitle = null;
                currentBody = "";
            } else if (currentTitle === null) {
                currentTitle = line;
            } else {
                currentBody += line + "\n";
            }
        });

        // Deal with any unfinished section
        if (currentTitle !== null) {
            sections.push(new Section(currentTitle, currentBody));
        }

        return sections;
    }
}