import React, { useState } from "react";

import Modal from "./Modal";
function ChatForCompany(props) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div>
			{isOpen && <Modal setIsOpen={setIsOpen} />}
		</div>
	);
}

export default ChatForCompany;
