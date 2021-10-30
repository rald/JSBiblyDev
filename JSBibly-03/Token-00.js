class Token  {

	const Type = 	{
				NONE:"none",
				INTEGER:"integer",
				STRING:"string",
				SYMBOL:"symbol",
				WHITESPACE:"whitespace",
				EOF:"eof"
			}

	constructor(type,text) {
		this.type=type;
		this.text=text;
	}

	toString() {
		return `{ "Type": "${this.type}", "Text": "${this.text}" }`;
	}

}
