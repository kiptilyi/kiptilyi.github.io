function liveDrawing(inputId) {
    'use sctrict'
    const input = document.getElementById(`${inputId}`);
    // const modal = document.getElementById("drawing-app");
    const modal = document.createElement("div");
    modal.innerHTML = `<div class="modal-dialog modal-full" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div id="da-toolbar"><div class="toolbar-inner"><div class="tool tool-color"><label class="tc-white"><input value="#ffffff" type="radio" name="color" checked><span class="color-indicator"></span></label><label class="tc-black"><input value="#000000" type="radio" name="color"><span class="color-indicator"></span></label><label class="tc-red"><input value="#ff0000" type="radio" name="color"><span class="color-indicator"></span></label><label class="tc-green"><input value="#00ff00" type="radio" name="color"><span class="color-indicator"></span></label><label class="tc-blue"><input value="#0000ff" type="radio" name="color"><span class="color-indicator"></span></label></div><div class="tool tool-line_width"><label class="tlw-10"><input value="10" type="radio" name="lineWidth"><span class="width-indicator"></span></label><label class="tlw-7"><input value="7" type="radio" name="lineWidth"><span class="width-indicator"></span></label><label class="tlw-5"><input value="5" type="radio" name="lineWidth" checked><span class="width-indicator"></span></label><label class="tlw-3"><input value="3" type="radio" name="lineWidth"><span class="width-indicator"></span></label><label class="tlw-1"><input value="1" type="radio" name="lineWidth"><span class="width-indicator"></span></label></div><div class="tool tool-line"><label><input class="tool-control" id="da-line" type="checkbox"><span class="tool-indicator"><span class="line"></span></span></label></div><div class="tool tool-clean"><button id="da-clean"><svg enable-background="new 0 0 753.23 753.23" version="1.1" viewBox="0 0 753.23 753.23" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m635.54 94.154h-141.23v-47.077c0-26.01-21.068-47.077-47.078-47.077h-141.23c-26.01 0-47.077 21.067-47.077 47.077v47.077h-141.23c-26.01 0-47.077 21.067-47.077 47.077v47.077c0 25.986 21.067 47.053 47.03 47.077h517.92c25.986-0.024 47.054-21.091 47.054-47.077v-47.078c-2e-3 -26.009-21.069-47.076-47.079-47.076zm-188.31 0h-141.23v-23.539c0-12.993 10.545-23.539 23.538-23.539h94.154c12.993 0 23.538 10.545 23.538 23.539v23.539zm-329.54 564.92c0 51.996 42.157 94.153 94.154 94.153h329.54c51.996 0 94.153-42.157 94.153-94.153v-376.62h-517.85v376.62zm353.08-306c0-12.993 10.545-23.539 23.538-23.539s23.538 10.545 23.538 23.539v282.46c0 12.993-10.545 23.539-23.538 23.539s-23.538-10.546-23.538-23.539v-282.46zm-117.69 0c0-12.993 10.545-23.539 23.539-23.539s23.538 10.545 23.538 23.539v282.46c0 12.993-10.545 23.539-23.538 23.539s-23.539-10.546-23.539-23.539v-282.46zm-117.69 0c0-12.993 10.545-23.539 23.539-23.539s23.539 10.545 23.539 23.539v282.46c0 12.993-10.545 23.539-23.539 23.539s-23.539-10.546-23.539-23.539v-282.46z"/></svg></button></div><div class="tool tool-complete"><a id="da-accept"><svg enable-background="new 0 0 611.99 611.99" version="1.1" viewBox="0 0 611.99 611.99" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m589.1 80.63c-30.513-31.125-79.965-31.125-110.48 0l-276.2 281.71-69.061-70.438c-30.513-31.125-79.965-31.125-110.48 0s-30.513 81.572 0 112.68l124.29 126.78c30.513 31.125 79.965 31.125 110.48 0l331.45-338.03c30.515-31.125 30.515-81.572 1e-3 -112.7z"/></svg></a></div></div></div></div></div></div>`;
    const modalInst = new Modal(modal);
    const mBody = modal.querySelector(".modal-body");
    const toolBar = modal.querySelector("#da-toolbar");
    const canvasFullSize = document.createElement("canvas");
    const ctxFullSize = canvasFullSize.getContext("2d");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const clickX = new Array();
    const clickY = new Array();
    const clickDrag = new Array();
    const colors = new Array();
    const lineWidth = new Array();
    const fullClickDrag = new Array();
    const fullColors = new Array();
    const fullLineWidth = new Array();
    let fullX = new Array();
    let fullY = new Array();
    let curColor = "#ffffff";
    let curLineWidth = 5;
    let imgHD;
    let imgDraw;
    let timer;
    let switcher;
    let imgData;
    ////
    modal.classList.add("modal", "fade");
    modal.id = `da-modal-${inputId}`;
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "exampleModalLabel");
    modal.setAttribute("aria-hidden", "true");
    ////
    input.setAttribute("accept", "image/*;capture=camera");
    input.setAttribute("type", "file");
    ////

    // METHODS

    function convertToFullSize(canvasDraw, ctxDraw, ImgDraw, canvasFullSize, ctxFullSize, imgHD) {

        return new Promise(function (resolve) {

            const mainRatio = (canvasFullSize.width * canvasFullSize.height) / (canvasDraw.width * canvasDraw.height);

            canvasFullSize.width = canvasDraw.width * mainRatio;
            canvasFullSize.height = canvasDraw.height * mainRatio;

            ctxFullSize.drawImage(imgHD, 0, 0, canvasFullSize.width, canvasFullSize.height);

            ctxFullSize.lineJoin = ctx.lineJoin;

            imgDraw.width = canvas.width;
            imgDraw.height = canvas.height;

            for (var i = 0; i < fullX.length; i++) {

                ctxFullSize.beginPath();

                if (fullClickDrag[i] && i) ctxFullSize.moveTo(fullX[i - 1] * mainRatio, fullY[i - 1] * mainRatio);
                else ctxFullSize.moveTo((fullX[i] - 1) * mainRatio, fullY[i] * mainRatio);

                ctxFullSize.lineTo(fullX[i] * mainRatio, fullY[i] * mainRatio);
                ctxFullSize.closePath();
                ctxFullSize.strokeStyle = fullColors[i];
                ctxFullSize.lineWidth = fullLineWidth[i] * mainRatio;
                ctxFullSize.stroke();

            }

            resolve(canvasFullSize.toDataURL("image/jpeg"));

        });

    }

    function resizeCanvas(img, canvas) {

        return new Promise(function (resolve) {
            const oldCanvasW = canvas.width;
            const oldCanvasH = canvas.height;
            const imageAspectRatio = img.width / img.height;
            const mBodyAspectRatio = mBody.clientWidth / mBody.clientHeight;
            let renderableHeight, renderableWidth;

            if (imageAspectRatio < mBodyAspectRatio) {
                renderableHeight = mBody.clientHeight;
                renderableWidth = img.width * (renderableHeight / img.height);
            } else if (imageAspectRatio > mBodyAspectRatio) {
                renderableWidth = mBody.clientWidth;
                renderableHeight = img.height * (renderableWidth / img.width);
            } else {
                renderableHeight = mBody.clientHeight;
                renderableWidth = mBody.clientWidth;
            }

            canvas.width = renderableWidth;
            canvas.height = renderableHeight;

            if (fullX.length && fullY.length) {
                fullX = fullX.map((el) => (el * renderableWidth) / oldCanvasW);
                fullY = fullY.map((el) => (el * renderableHeight) / oldCanvasH);
            }

            resolve([fullX, fullY, fullColors, fullLineWidth, fullClickDrag]);
        });

    }

    function fixImgRotate(img, data) {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const orientationArr = [5, 6, 7, 8];
        const imgOrientation = data.Orientation;
        const fullHDSide = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height && width > fullHDSide) {
            height = height / (width / fullHDSide);
            width = fullHDSide;
        } else if (height > width && height > fullHDSide) {
            width = width / (height / fullHDSide);
            height = fullHDSide;
        }

        canvasFullSize.width = width;
        canvasFullSize.height = height;

        if (orientationArr.indexOf(imgOrientation) != -1) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        switch (imgOrientation) {
            case 2:
                ctx.transform(-1, 0, 0, 1, width, 0);
                break;
            case 3:
                ctx.transform(-1, 0, 0, -1, width, height);
                break;
            case 4:
                ctx.transform(1, 0, 0, -1, 0, height);
                break;
            case 5:
                ctx.transform(0, 1, 1, 0, 0, 0);
                break;
            case 6:
                ctx.transform(0, 1, -1, 0, height, 0);
                break;
            case 7:
                ctx.transform(0, -1, -1, 0, height, width);
                break;
            case 8:
                ctx.transform(0, -1, 1, 0, 0, width);
                break;
            default:
                return img.src;
        }

        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL("image/jpeg");

    }

    function uploadPhoto(input) {

        return new Promise(function (resolve, reject) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                reader.onload = e => {
                    resolve([e.target.result, input.files[0]]);
                }
            } else {
                reject("Что-то пошло не так...");
            }
        });

    }

    function createImages(src) {

        return new Promise(function (resolve) {
            imgHD = new Image();
            imgDraw = new Image();
            imgHD.src = src[0];
            EXIF.getData(src[1], function () {
                imgData = EXIF.getAllTags(this);
                if (!navigator.userAgent.match(/iPhone|iPad|iPod/i)) imgHD.src = fixImgRotate(imgHD, imgData);
                else imgHD.src = src[0];
                imgHD.onload = () => {
                    imgDraw = imgHD;
                    resolve();
                }
            });
        });

    }

    function addClick(x, y, dragging) {

        const callerName = arguments.callee.caller.name;

        if (document.getElementById("da-line").checked) {
            if (callerName == "touchStart") {
                addData();
                switcher = true;
            } else if (callerName == "touchMove") {
                if (switcher) {
                    addData();
                    switcher = false;
                }
                clickX[clickX.length - 1] = x;
                clickY[clickY.length - 1] = y;
                fullX[fullX.length - 1] = x;
                fullY[fullY.length - 1] = y;
            }
        } else {
            addData();
        }

        function addData() {
            clickX.push(x);
            clickY.push(y);
            fullX.push(x);
            fullY.push(y);
            clickDrag.push(dragging);
            colors.push(curColor);
            lineWidth.push(curLineWidth);
            fullClickDrag.push(dragging);
            fullColors.push(curColor);
            fullLineWidth.push(curLineWidth);
        }
    }

    function redraw(x = clickX, y = clickY, color = colors, line = lineWidth, drag = clickDrag) {

        if (document.getElementById("da-line").checked) {
            x = fullX;
            y = fullY;
            color = fullColors;
            line = fullLineWidth;
            drag = fullClickDrag;
            ctx.drawImage(imgDraw, 0, 0, ctx.canvas.width, ctx.canvas.height);
        } else if (clickX.length != 0) {
            ctx.drawImage(canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            ctx.drawImage(imgDraw, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        ctx.lineJoin = "round";

        for (let i = 0; i < x.length; i++) {

            ctx.beginPath();

            if (drag[i] && i) ctx.moveTo(x[i - 1], y[i - 1]);
            else ctx.moveTo(x[i] - 1, y[i]);

            ctx.lineTo(x[i], y[i]);
            ctx.closePath();
            ctx.strokeStyle = color[i];
            ctx.lineWidth = line[i];
            ctx.stroke();

        }

    }

    function softReset(all) {
        if (all != undefined) {
            fullX.length = 0;
            fullY.length = 0;
            fullColors.length = 0;
            fullLineWidth.length = 0;
            fullClickDrag.length = 0;
        }
        clickX.length = 0;
        clickY.length = 0;
        colors.length = 0;
        lineWidth.length = 0;
        clickDrag.length = 0;
    }

    function hardReset() {
        imgHD = new Image();
        imgDraw = new Image();
        softReset();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // EVENTS

    input.addEventListener("change", () => {
        hardReset();
        uploadPhoto(input).then(src => createImages(src).then(() => modalInst.show()), bad => alert(bad))
    });

    window.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            resizeCanvas(imgHD, canvas).then((x) => redraw(...x));
        }, 50);
    }

    $(modal).on("shown.bs.modal", () => {

        resizeCanvas(imgHD, canvas).then((x) => redraw(...x));

        mBody.appendChild(canvas);

        toolBar.addEventListener("change", e => {
                    let target = e.target;
                    if (target.name == "color") curColor = target.value;
                    if (target.name == "lineWidth") curLineWidth = target.value;
                });

                document.getElementById("da-clean").addEventListener("click", () => {softReset(true); ctx.drawImage(imgDraw, 0, 0, ctx.canvas.width, ctx.canvas.height)});

                document.getElementById("da-accept").addEventListener("click", () => {
                    // console.log("test");
                    convertToFullSize(canvas, ctx, imgDraw, canvasFullSize, ctxFullSize, imgHD).then(a => {
                        console.log(a);
                        input.removeAttribute("value");
                        input.setAttribute("value", a);
                        modalInst.hide();
                        modal.remove();
                    });
                });

    });

    canvas.addEventListener("touchstart", function touchStart(e) {

        paint = true;

        addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);

        imgDraw.width = canvas.width;
        imgDraw.height = canvas.height;

        redraw();

    });

    canvas.addEventListener("touchmove", function touchMove(e) {

        if (paint) {
            addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop, true);
            redraw();
        }

    });

    canvas.addEventListener("touchend", () => {paint = false; softReset()});

    canvas.addEventListener("touchleave", () => {paint = false; softReset()});

}


const daInputs = document.getElementsByClassName('da');

for(var i = 0; i < daInputs.length; i++) {
    (function(index) {
        daInputs[index].addEventListener("focus", e => {
            liveDrawing(e.target.id);
        });
    })(i);
}
//
// function drawSign(inputName, canvasW, canvasH) {
//     const canvas = document.createElement("canvas");
//     const btnClear = `<svg style="width: auto; height: ${canvasH / 2}" enable-background="new 0 0 753.23 753.23" version="1.1" viewBox="0 0 753.23 753.23" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m635.54 94.154h-141.23v-47.077c0-26.01-21.068-47.077-47.078-47.077h-141.23c-26.01 0-47.077 21.067-47.077 47.077v47.077h-141.23c-26.01 0-47.077 21.067-47.077 47.077v47.077c0 25.986 21.067 47.053 47.03 47.077h517.92c25.986-0.024 47.054-21.091 47.054-47.077v-47.078c-2e-3 -26.009-21.069-47.076-47.079-47.076zm-188.31 0h-141.23v-23.539c0-12.993 10.545-23.539 23.538-23.539h94.154c12.993 0 23.538 10.545 23.538 23.539v23.539zm-329.54 564.92c0 51.996 42.157 94.153 94.154 94.153h329.54c51.996 0 94.153-42.157 94.153-94.153v-376.62h-517.85v376.62zm353.08-306c0-12.993 10.545-23.539 23.538-23.539s23.538 10.545 23.538 23.539v282.46c0 12.993-10.545 23.539-23.538 23.539s-23.538-10.546-23.538-23.539v-282.46zm-117.69 0c0-12.993 10.545-23.539 23.539-23.539s23.538 10.545 23.538 23.539v282.46c0 12.993-10.545 23.539-23.538 23.539s-23.539-10.546-23.539-23.539v-282.46zm-117.69 0c0-12.993 10.545-23.539 23.539-23.539s23.539 10.545 23.539 23.539v282.46c0 12.993-10.545 23.539-23.539 23.539s-23.539-10.546-23.539-23.539v-282.46z"/></svg>`;
//     const ctx = canvas.getContext("2d");
//     const input = document.getElementsByName(inputName);
//     const clickX = new Array();
//     const clickY = new Array();
//     const clickDrag = new Array();
//     let paint;
//     canvas.width = canvasW;
//     canvas.height = canvasH;
//     input[0].insertAdjacentElement("afterEnd", canvas);
//     // canvas.insertAdjacentHTML("afterEnd", btnClear);
//
//
//     canvas.addEventListener("touchstart", function touchStart(e) {
//
//         let mouseX = e.pageX - this.offsetLeft;
//         let mouseY = e.pageY - this.offsetTop;
//
//         paint = true;
//
//         addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);
//         redraw();
//
//     });
//
//     canvas.addEventListener("touchmove", function touchMove(e) {
//
//         if (paint) {
//             addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop, true);
//             redraw();
//         }
//
//     });
//
//     canvas.addEventListener("touchend", () => {paint = false; setInputValue()});
//
//     canvas.addEventListener("touchleave", () => {paint = false; setInputValue()});
//
//     function addClick(x, y, dragging) {
//         clickX.push(x);
//         clickY.push(y);
//         clickDrag.push(dragging);
//     }
//
//     function setInputValue () {
//         input[0].value = canvas.toDataURL("image/jpeg");
//     }
//
//     function redraw(){
//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//
//         ctx.strokeStyle = "#000000";
//         ctx.lineJoin = "round";
//         ctx.lineWidth = 1;
//
//         for(var i=0; i < clickX.length; i++) {
//             ctx.beginPath();
//             if(clickDrag[i] && i){
//                 ctx.moveTo(clickX[i-1], clickY[i-1]);
//             }else{
//                 ctx.moveTo(clickX[i]-1, clickY[i]);
//             }
//             ctx.lineTo(clickX[i], clickY[i]);
//             ctx.closePath();
//             ctx.stroke();
//         }
//     }
// }
//
// drawSign("test2", 150, 80);