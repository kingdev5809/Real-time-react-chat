import React from "react";
import classes from "./Files.module.scss";
import filesData from "./filesData";
import { BsChevronLeft } from "react-icons/bs";
function Files({ setCount, openDotsContent }) {
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
		<div className={classes.filesContainer}>
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
				{filesData.map((item, index) => (
					<div key={index} className={classes.filesBlock}>
						<div className={classes.imgBlock}>
							<img src={item.img} alt="File" />
						</div>
						<div className={classes.txtBlock}>
							<span className={classes.fileName}>{item.fileName}</span>
							<span className={classes.filesize}>{item.size} MB</span>
							<span className={classes.uploadedDate}>{uploadDate}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Files;
