function liveDrawing(inputId) {
    'use sctrict'
    const input = document.getElementById(`${inputId}`);
    const modal = document.getElementById("drawing-app");
    // const modal = document.createElement("div");
    // modal.innerHTML = `<div class="modal-dialog modal-full" role="document"><div class="modal-content"><div class="modal-header"><a id="downloadlink" download="test">Download</a><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"></div></div></div>`;
    const modalInst = new Modal(modal);
    const mBody = modal.querySelector(".modal-body");
    const toolBar = document.getElementById("da-toolbar");
    const canvasFullSize = document.createElement("canvas");
    const ctxFullSize = canvasFullSize.getContext("2d");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const clickDrag = new Array();
    const colors = new Array();
    const lineWidth = new Array();
    let curColor = "#ffffff";
    let curLineWidth = 5;
    let imgHD;
    let imgDraw;
    let clickX = new Array();
    let clickY = new Array();
    let timer;
    let imgData;
    ////
    modal.classList.add("modal", "fade");
    modal.id = "drawing-app";
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

            for (var i = 0; i < clickX.length; i++) {

                ctxFullSize.beginPath();

                if (clickDrag[i] && i) ctxFullSize.moveTo(clickX[i - 1] * mainRatio, clickY[i - 1] * mainRatio);
                else ctxFullSize.moveTo((clickX[i] - 1) * mainRatio, clickY[i] * mainRatio);

                ctxFullSize.lineTo(clickX[i] * mainRatio, clickY[i] * mainRatio);
                ctxFullSize.closePath();
                ctxFullSize.strokeStyle = colors[i];
                ctxFullSize.lineWidth = lineWidth[i] * mainRatio;
                ctxFullSize.stroke();

            }

            resolve(canvasFullSize.toDataURL("image/jpeg"));

        });

    }

    function resizeCanvas(img, canvas) {

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

        if (clickX.length && clickY.length) {
            clickX = clickX.map((el) => (el * renderableWidth) / oldCanvasW);
            clickY = clickY.map((el) => (el * renderableHeight) / oldCanvasH);
        }

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
                EXIF.getData(src[1], function() {
                    imgData = EXIF.getAllTags(this);
                    imgHD.src = fixImgRotate(imgHD, imgData);
                    imgHD.onload = () => {
                        imgDraw = imgHD;
                        resolve();
                    }
                });
        });

    }

    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        colors.push(curColor);
        lineWidth.push(curLineWidth);
    }

    function redraw() {

        imgDraw.width = canvas.width;
        imgDraw.height = canvas.height;

        ctx.drawImage(imgDraw, 0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.lineJoin = "round";

        for (var i = 0; i < clickX.length; i++) {

            ctx.beginPath();

            if (clickDrag[i] && i) ctx.moveTo(clickX[i - 1], clickY[i - 1]);
            else ctx.moveTo(clickX[i] - 1, clickY[i]);

            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.strokeStyle = colors[i];
            ctx.lineWidth = lineWidth[i];
            ctx.stroke();

        }

    }

    // EVENTS

    input.addEventListener("change", () => {uploadPhoto(input).then(src => createImages(src).then(() => modalInst.show()), bad => alert(bad))});

    window.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            resizeCanvas(imgHD, canvas);
            redraw();
        }, 50);
    }

    $(modal).on("shown.bs.modal", () => {

        resizeCanvas(imgHD, canvas);

        redraw();

        mBody.appendChild(canvas);

        document.getElementById("downloadlink").addEventListener("touchstart", e => {
            convertToFullSize(canvas, ctx, imgDraw, canvasFullSize, ctxFullSize, imgHD).then(a => {e.target.setAttribute("href", a)});
        });

    });

    toolBar.addEventListener("change", e => {
        let target = e.target;
        if (target.name == "color") curColor = target.value;
        if (target.name == "lineWidth") curLineWidth = target.value;
    });

    canvas.addEventListener("touchstart", function (e) {

        let mouseX = e.touches[0].pageX - this.offsetLeft;
        let mouseY = e.touches[0].pageY - this.offsetTop;

        paint = true;

        addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);

        redraw();

    });

    canvas.addEventListener("touchmove", function (e) {

        if (paint) {
            addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop, true);
            redraw();
        }

    });

    canvas.addEventListener("touchend", () => paint = false);

    canvas.addEventListener("touchleave", () => paint = false);

}

liveDrawing("takePhoto");

