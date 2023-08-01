import React from "react";
import classes from "./Links.module.scss";
import { BsChevronLeft } from "react-icons/bs";
import linksData from "./linksData";

function Links({ setCount, openDotsContent }) {
	var uploadDate =
		new Date().getFullYear() +
		" | " +
		new Date().toLocaleDateString("en-us", { month: "long" }) +
		" " +
		new Date().getMonth() +
		new Date().getDay() +
		" " +
		" | " +
		new Date().getHours() +
		":" +
		new Date().getMinutes();

	return (
		<div className={classes.linksContainer}>
			<button
				className={classes.backBtn}
				onClick={() => {
					setCount(1);
					openDotsContent();
				}}>
				<BsChevronLeft />
				Back
			</button>
			<div className={classes.box}>
				{linksData.map((item, index) => (
					<div key={index} className={classes.linksBlock}>
						<div className={classes.imgBlock}>
							<img src={item.img} alt="File" />
						</div>
						<div className={classes.txtBlock}>
							<span className={classes.fileName}>{item.fileName}</span>

							<span className={classes.uploadedDate}>{uploadDate}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Links;
