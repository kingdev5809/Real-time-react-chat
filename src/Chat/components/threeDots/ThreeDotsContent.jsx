import React from "react";
import classes from "./ThreeDotsContent.module.scss";

function ThreeDotsContent({ step2, step3, step4, setCount }) {
	return (
		<div className={step2 || step3 || step4 ? classes.hideContainer : classes.container}>
			<span className={classes.media} onClick={() => setCount(2)}>
				Media
			</span>
			<span className={classes.files} onClick={() => setCount(3)}>
				Files
			</span>
			<span className={classes.links} onClick={() => setCount(4)}>
				Links
			</span>
			<span className={classes.seeProfile}>See profile</span>
			<span className={classes.clearTheHistory}>Clean the history</span>
		</div>
	);
}

export default ThreeDotsContent;
