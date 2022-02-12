var colorPalette = document.querySelectorAll('.palette .color'),
      colorNames = document.querySelectorAll('.code .name'),
      colorCodes = document.querySelectorAll('.code .number'),
      imgPreview = document.getElementById('previewImg'),
      preview   = document.getElementsByClassName('preview')[0],
    autoGeneration = 0,
    isNumber = function (value) {
        return typeof value === 'number' && isFinite(value);
    },
    isString = function (value) {
        return typeof value === 'string' || value instanceof String;
    },
    componentToHex= function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex =function (r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },

    getHexCode = function (colorCode){
        var firstCode = colorCode[0],
              hexCode = '';

        if(isNumber(firstCode)){
            hexCode = rgbToHex(colorCode[0], colorCode[1], colorCode[2]);
        }else if (isString(firstCode)){
            hexCode = '#' + colorCode;
        }

        return hexCode.toUpperCase();
    },
    changePaletteColor = function (generatedPallets){     
        for (var i = 0; i < colorPalette.length; ++i) {
            var palette = colorPalette[i],
                  color = generatedPallets[i],
                hexCode = getHexCode(color),
              ntcObject = ntc.name(hexCode),
              colorName = ntcObject[1];
             //exactMatch = ntcObject[2];
            
            palette.style.setProperty('--color', hexCode);
            colorCodes[i].innerHTML = hexCode;
            colorNames[i].innerHTML = colorName;
        }
    },
    getHexCodeFromImage = function(img){
        const colorThief = new ColorThief();
        var generatedPallets = [];
        if (img.complete) {
            generatedPallets = colorThief.getPalette(img, 4, 1);
            changePaletteColor(generatedPallets);
        } else {
          img.addEventListener('load', function() {
            generatedPallets = colorThief.getPalette(img, 4, 1);
            changePaletteColor(generatedPallets);
          });
        }
    },
    generateRandomPaletteFromImg = function() {
        imgPreview.src = "https://picsum.photos/600/450?"+performance.now();
        getHexCodeFromImage(imgPreview);
    },
    generateRandomly = function (){
        clearInterval(autoGeneration);
        generateRandomPaletteFromImg();//initial generate after generate randomly button click
        autoGeneration = setInterval(() => generateRandomPaletteFromImg(), 3000);
    },
    addCopyAction = function(target){
        var input = document.createElement('input'),
          hexCode = target.style.getPropertyValue('--color');
        
        input.value = hexCode;
        input.name = 'color';

        target.appendChild(input);

        target.parentNode.querySelector('input[name="color"]').select();
        document.execCommand('copy');
        input.parentNode.removeChild(input);
    },
    addCopiedText = function (target){
        if(target.nodeName === 'SPAN'){
            var iTag = document.createElement('i');
            iTag.innerHTML = 'Copied!';

            target.appendChild(iTag);
        
            setTimeout(() => {
                iTag.style.opacity = '0';
                setTimeout(() => {iTag.parentNode.removeChild(iTag);}, 1000);
            }, 500); 
        }
    },
    addCopiedEventListener = function (){    
        Array.from(colorPalette).forEach(palette => {
            palette.addEventListener('click', (e) => {
                var target = e.target;

                clearInterval(autoGeneration);

                addCopyAction(target);
                addCopiedText(target);
            });
            
        });
    },
    uploadImgUrl = function(e){
        e.preventDefault()
        clearInterval(autoGeneration);
        imgPreview.classList.remove('blur');
        imgPreview.src = URL.createObjectURL(e.target.files[0]);
        
        getHexCodeFromImage(imgPreview);
    }
;

generateRandomPaletteFromImg();
addCopiedEventListener();