import React from "react";
import classes from "./Media.module.scss";
import { BsChevronLeft } from "react-icons/bs";
import mediaData from "./mediaData";
function Media({ setCount, openDotsContent }) {
	return (
		<div className={classes.MainPosts}>
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
				{mediaData.map((item, index) => (
					<div key={index}>
						<img className={classes.Imgs} src={item.img1} alt="#" />
						<img className={classes.Imgs} src={item.img2} alt="#" />
						<img className={classes.Imgs} src={item.img3} alt="#" />
						<img className={classes.Imgs} src={item.img4} alt="#" />
					</div>
				))}
			</div>
		</div>
	);
}

export default Media;
