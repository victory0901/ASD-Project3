function (doc) {
	if (doc._id.substr(0,4) === "gift") {
		emit(doc._id, {
			"group": doc.group,
			"fname": doc.fname,
			"lname": doc.lname,
			"gift": doc.gift,
			"quantity": doc.quantity,
			"purchase": doc.purchase,
			"buydate": doc.buydate,
			"notes": doc.notes
		});
	}
};