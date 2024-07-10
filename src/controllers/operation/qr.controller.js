const qrcode = require('qrcode');
const { checkValidURL } = require('../../services/validURL');

function handleQrCode (req, res) {

    try {
        if(!req.body.url) {
            return res.status(400).json({error: "URL field cannot be empty"})
        }

        if(!checkValidURL(req.body.url)){
            return res.status(400).json({error: "Invalid URL passed"})
        }

        qrSVG = renderQrCode(req);
        res.setHeader('content-type', 'image/svg+xml');
        return res.send(qrSVG);
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"});
    }

}

//Create a basic outline for the SVG
function generateSVG(size, children) {
    return `<svg version="1.1"
	    width="${size}"
	    height="${size}"
	    xmlns="http://www.w3.org/2000/svg">
		    ${children.join('')}
        </svg>`;
}

//Converts the URL into QR and renders the SVG
function renderQrCode(req) {
    url = req.body.url;
    color = req.body.color || "#000000";
    blockSize = req.body.size || 10;

    encodedData = qrcode.create(url);
    codeSize = encodedData.modules.size;
    codeData = encodedData.modules.data;

    blocks = []

    for (let i = 0; i < codeSize; i++) {
        for (let j = 0; j < codeSize; j++) {
            rowOffSet = i * codeSize;
            isDark = codeData[rowOffSet + j];

            if(isDark) {
                const x = i * blockSize;
                const y = j * blockSize;

                const rect = `<rect 
                            x="${x}"
                            y="${y}"
                            width="${blockSize}"
                            height="${blockSize}"
                            fill="${color}">
                            </rect>`

                blocks.push(rect)
            }
        }  
    }
    const svgSize = codeSize * blockSize;
    //Generating the full SVG
    const responseSVG = generateSVG(svgSize, blocks);

    return responseSVG;
}

module.exports = handleQrCode;