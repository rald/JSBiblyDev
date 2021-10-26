class Citation {
	constructor(bnum,cnum,vnum) {
		this.bnum=bnum;
		this.cnum=cnum;
		this.vnum=vnum;
	}

	toString() {
		return 	`{ "bname": ${this.bname}, "scnum": ${this.scnum}, "ecnum": ${this.ecnum}, "svnum": ${this.svnum}, "evnum": ${this.evnum} }`;
	}

}


