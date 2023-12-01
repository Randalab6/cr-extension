export const wrapText = (ctx, txt = '', x, y, maxWidth, lineHeight) => {
	const words = txt.split(' ')
	let line = '';

	for (var n = 0; n < words.length; n++) {
			const textLine = line + words[n] + ' ';
			const metrics = ctx.measureText(textLine);
			const textWidth = metrics.width;
			if (textWidth > maxWidth && n > 0) {
					ctx.fillText(line, x, y);
					line = words[n] + ' ';
					y += lineHeight;
			}
			else {
					line = textLine;
			}
	}
	ctx.fillText(line, x, y);
}

export const generateCanvas = (text, year, imageSize, factImage) => {
	let canvas = document.createElement("canvas");
	canvas.width = imageSize.width;
	canvas.height = imageSize.height;
	let context = canvas.getContext("2d");
	context.width = imageSize.width;
	context.height = imageSize.height;

	const x = context.width / 2;
	const y = context.height / 2;

	context.font = "bold 120px Arial";
	context.fillStyle = "white";
	context.fontWeight = "bolder"
	context.textAlign = 'left';
	context.textBaseline = 'top';

	const image = new Image();
	image.src = factImage;
	image.setAttribute('crossOrigin', 'anonymous');
	return image.onload = () => {
			context.drawImage(image, 0, 0, context.width, context.height);
			wrapText(context, text, 0 + x / 4, 0 + y / 4, x, 200)
			context.fillText('- ' + year, x, y + y / 2);

			const title =  "On this day Chrome Extension"
			context.fillText(title, 0, y + (y / 2 + (y / 2) / 1.3))
			return canvas
	};
}