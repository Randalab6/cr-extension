
export const getMonthDayFormat = () => {
	const today = new Date();
	const month = today.getMonth() + 1;
	const day = today.getDate();

	return `${month}/${day}`;
};

export const getMonthNameDayFormat = () => {
	const monthNames = ["January", "February", "March", "April", "May", "June",
											"July", "August", "September", "October", "November", "December"];

	const today = new Date();
	const monthName = monthNames[today.getMonth()];
	const day = today.getDate();

	return `${monthName}_${day}`;
};

export const monthDayFormatted = getMonthDayFormat();
export const todayFormatted = getMonthNameDayFormat();
