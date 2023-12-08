export const wrapText = (
	ctx: CanvasRenderingContext2D, 
	txt: string = '', 
	x: number, 
	y: number, 
	maxWidth: number, 
	lineHeight: number
): void => {
	const words = txt.split(' ');
	let line = '';

	for (let n = 0; n < words.length; n++) {
			const textLine = line + words[n] + ' ';
			const metrics = ctx.measureText(textLine);
			const textWidth = metrics.width;
			if (textWidth > maxWidth && n > 0) {
					ctx.fillText(line, x, y);
					line = words[n] + ' ';
					y += lineHeight;
			} else {
					line = textLine;
			}
	}
	ctx.fillText(line, x, y);
};


interface ImageSize {
	width: number;
	height: number;
}

export const generateCanvas = (
	text: string, 
	year: string, 
	imageSize: ImageSize, 
	factImage: string
): HTMLCanvasElement | void => {
	let canvas = document.createElement("canvas");
	canvas.width = imageSize.width;
	canvas.height = imageSize.height;
	
	const context = canvas.getContext("2d");
	if (!context) {
			return; // Exits the function if context is null
	}

	// Now TypeScript knows context is not null
	const x = imageSize.width / 2;
	const y = imageSize.height / 2;

	context.font = "bold 120px Arial";
	context.fillStyle = "white";
	context.textAlign = 'left';
	context.textBaseline = 'top';

	const image = new Image();
	image.src = factImage;
	image.setAttribute('crossOrigin', 'anonymous');
	image.onload = () => {
			context.drawImage(image, 0, 0, imageSize.width, imageSize.height);
			wrapText(context, text, 0 + x / 4, 0 + y / 4, x, 200);
			context.fillText('- ' + year, x, y + y / 2);

			const title = "On this day Chrome Extension";
			context.fillText(title, 0, y + (y / 2 + (y / 2) / 1.3));
	};

	return canvas;
};
